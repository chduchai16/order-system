import argparse
import json
import mimetypes
import sys
import subprocess
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests


IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
IMAGES_PER_PRODUCT = 5
PRODUCTS_PER_FOLDER = 20

# Thread-safe print lock to avoid interleaved output
_print_lock = threading.Lock()


def tprint(*args, **kwargs):
    """Thread-safe print."""
    with _print_lock:
        print(*args, **kwargs)


def is_image_file(path: Path) -> bool:
    return path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS


def upload_media(media_base_url: str, file_path: Path, user_agent: str) -> dict:
    url = f"{media_base_url.rstrip('/')}/api/media/upload"
    with file_path.open("rb") as file_handle:
        response = requests.post(
            url,
            files={
                "file": (
                    file_path.name,
                    file_handle,
                    mimetypes.guess_type(file_path.name)[0] or "application/octet-stream",
                )
            },
            headers={"User-Agent": user_agent},
            timeout=180,
        )
    response.raise_for_status()
    return response.json()


def get_products(product_base_url: str, user_agent: str) -> list[dict]:
    url = f"{product_base_url.rstrip('/')}/api/products"
    response = requests.get(url, headers={"User-Agent": user_agent}, timeout=180)
    response.raise_for_status()
    return response.json()


def delete_media(media_base_url: str, media_id: int, user_agent: str) -> None:
    url = f"{media_base_url.rstrip('/')}/api/media/{media_id}"
    response = requests.delete(url, headers={"User-Agent": user_agent}, timeout=180)
    response.raise_for_status()


def clear_existing_product_images(media_base_url: str, product_id: int, user_agent: str, dry_run: bool) -> None:
    query_command = [
        "docker",
        "exec",
        "order-system-postgres",
        "psql",
        "-U",
        "postgres",
        "-d",
        "product_db",
        "-t",
        "-A",
        "-c",
        f"SELECT media_id FROM product_images WHERE product_id = {product_id} ORDER BY display_order;",
    ]
    result = subprocess.run(query_command, capture_output=True, text=True)
    if result.returncode != 0:
        # If DB is not available or query fails, skip checking
        tprint(f"  warning: could not read existing images for product {product_id}")
        return

    media_ids = [line.strip() for line in result.stdout.splitlines() if line.strip()]
    if not media_ids:
        tprint("  no existing images to clear")
        return

    tprint(f"  clearing {len(media_ids)} existing images")
    for media_id in media_ids:
        if dry_run:
            tprint(f"  dry-run delete mediaId={media_id}")
            continue
        try:
            delete_media(media_base_url, int(media_id), user_agent)
            tprint(f"  deleted old mediaId={media_id}")
        except Exception as exc:
            tprint(f"  warning: failed to delete old mediaId={media_id}: {exc}")


def replace_product_images_in_db(product_id: int, media_ids: list[int]) -> None:
    delete_command = [
        "docker",
        "exec",
        "order-system-postgres",
        "psql",
        "-U",
        "postgres",
        "-d",
        "product_db",
        "-c",
        f"DELETE FROM product_images WHERE product_id = {product_id};",
    ]
    result = subprocess.run(delete_command, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"Failed to clear product images for product {product_id}: {result.stderr.strip() or result.stdout.strip()}")

    if not media_ids:
        return

    values = ", ".join(
        f"({media_id}, {product_id}, {index}, {'TRUE' if index == 0 else 'FALSE'})"
        for index, media_id in enumerate(media_ids)
    )
    insert_command = [
        "docker",
        "exec",
        "order-system-postgres",
        "psql",
        "-U",
        "postgres",
        "-d",
        "product_db",
        "-c",
        f"INSERT INTO product_images (media_id, product_id, display_order, is_primary) VALUES {values};",
    ]
    result = subprocess.run(insert_command, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"Failed to insert product images for product {product_id}: {result.stderr.strip() or result.stdout.strip()}")


def read_subfolders(images_dir: Path) -> list[Path]:
    digit_folders = sorted([path for path in images_dir.iterdir() if path.is_dir() and path.name.isdigit()])
    if digit_folders:
        return digit_folders

    named_folders = sorted([path for path in images_dir.iterdir() if path.is_dir()])
    if named_folders:
        return named_folders

    return []


def read_images(folder: Path) -> list[Path]:
    return sorted([path for path in folder.iterdir() if is_image_file(path)])


def chunk_images(images: list[Path], chunk_size: int) -> list[list[Path]]:
    return [images[i:i + chunk_size] for i in range(0, len(images), chunk_size)]


def build_folder_map(folders: list[Path]) -> list[Path]:
    if all(folder.name.isdigit() for folder in folders):
        return folders

    preferred_order = ["foods", "crafts"]
    ordered = []
    for name in preferred_order:
        for folder in folders:
            if folder.name.lower() == name:
                ordered.append(folder)
    for folder in folders:
        if folder not in ordered:
            ordered.append(folder)
    return ordered


def get_categories_from_db() -> dict[str, int]:
    try:
        cmd = [
            "docker",
            "exec",
            "order-system-postgres",
            "psql",
            "-U",
            "postgres",
            "-d",
            "product_db",
            "-t",
            "-A",
            "-c",
            "SELECT id, name FROM categories;",
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            cat_map = {}
            for line in result.stdout.splitlines():
                if line.strip() and "|" in line:
                    cat_id, cat_name = line.split("|", 1)
                    cat_map[cat_name.lower().strip()] = int(cat_id)
            if cat_map:
                return cat_map
    except Exception:
        pass
    
    # Fallback to static IDs matching standard initialization
    return {"foods": 1, "crafts": 2, "bags": 3, "pants": 4, "shirts": 5, "shoes": 6}


def get_products_by_category_from_db(category_id: int) -> list[dict]:
    try:
        cmd = [
            "docker",
            "exec",
            "order-system-postgres",
            "psql",
            "-U",
            "postgres",
            "-d",
            "product_db",
            "-t",
            "-A",
            "-c",
            f"SELECT id, name FROM products WHERE category_id = {category_id} ORDER BY id;",
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            products = []
            for line in result.stdout.splitlines():
                if line.strip() and "|" in line:
                    p_id, p_name = line.split("|", 1)
                    products.append({"id": int(p_id), "name": p_name.strip()})
            return products
    except Exception:
        pass
    return []


def normalize_folder_name(name: str) -> str:
    name = name.lower().strip()
    synonyms = {
        "clothes": "shirts",
        "clothing": "shirts",
        "food": "foods",
        "craft": "crafts",
        "bag": "bags",
        "pant": "pants",
        "shirt": "shirts",
        "shoe": "shoes",
    }
    return synonyms.get(name, name)


def clear_db_tables(dry_run: bool) -> None:
    print("clearing db tables: product_images, medias")
    if dry_run:
        print("  dry-run: skip database truncation")
        return
    commands = [
        [
            "docker",
            "exec",
            "order-system-postgres",
            "psql",
            "-U",
            "postgres",
            "-d",
            "product_db",
            "-c",
            "TRUNCATE TABLE product_images RESTART IDENTITY CASCADE;",
        ],
        [
            "docker",
            "exec",
            "order-system-postgres",
            "psql",
            "-U",
            "postgres",
            "-d",
            "media_db",
            "-c",
            "TRUNCATE TABLE medias RESTART IDENTITY CASCADE;",
        ],
    ]
    for command in commands:
        result = subprocess.run(command, capture_output=True, text=True)
        if result.returncode != 0:
            raise RuntimeError(f"Failed to clear db tables: {result.stderr.strip() or result.stdout.strip()}")
    print("  success: database tables cleared")


def upload_image_with_index(
    index: int,
    image_path: Path,
    media_base_url: str,
    user_agent: str,
    dry_run: bool,
) -> tuple[int, int, dict]:
    """Upload a single image and return (original_index, media_id, metadata).
    Returns original_index so callers can reassemble results in order."""
    if dry_run:
        fake_id = index + 1
        tprint(f"    success: dry-run mediaId={fake_id} file={image_path.name}")
        return index, fake_id, {"file": image_path.name, "id": fake_id, "dry_run": True}
    else:
        tprint(f"    uploading: {image_path.name}")
        media = upload_media(media_base_url, image_path, user_agent)
        media_id = int(media["id"])
        tprint(f"    success: uploaded file={image_path.name} mediaId={media_id}")
        return index, media_id, {"file": image_path.name, "media": media}


def process_product(
    product: dict,
    image_group: list[Path],
    folder_name: str,
    media_base_url: str,
    user_agent: str,
    dry_run: bool,
    image_workers: int,
) -> dict | None:
    """Process a single product: clear old images, upload new ones in parallel, update DB.
    Returns a result dict on success, or None on failure."""
    product_id = product["id"]
    product_name = product["name"]

    tprint(f"  product id={product_id} name='{product_name}' ({len(image_group)} images)")
    if len(image_group) < IMAGES_PER_PRODUCT:
        tprint(f"    warning: expected {IMAGES_PER_PRODUCT} images, found {len(image_group)}")

    try:
        clear_existing_product_images(media_base_url, product_id, user_agent, dry_run)

        # Upload all images concurrently, then sort by original index to preserve display_order
        results_by_index: list[tuple[int, int, dict]] = []
        with ThreadPoolExecutor(max_workers=image_workers) as img_pool:
            futures = {
                img_pool.submit(
                    upload_image_with_index,
                    idx, image_path, media_base_url, user_agent, dry_run,
                ): idx
                for idx, image_path in enumerate(image_group)
            }
            for future in as_completed(futures):
                results_by_index.append(future.result())  # raises on exception

        # Sort by original index so display_order is deterministic
        results_by_index.sort(key=lambda t: t[0])
        media_ids = [t[1] for t in results_by_index]
        uploaded_media = [t[2] for t in results_by_index]

        if dry_run:
            updated_product = {"dry_run": True, "product_id": product_id, "product_name": product_name, "media_ids": media_ids}
            tprint(f"    success: dry-run update product id={product_id}")
        else:
            replace_product_images_in_db(product_id, media_ids)
            tprint(f"    success: updated product id={product_id}")

        return {
            "folder": folder_name,
            "product_id": product_id,
            "product_name": product_name,
            "uploaded_media": uploaded_media,
            "product": updated_product if dry_run else {"product_id": product_id, "media_ids": media_ids},
        }

    except Exception as exc:
        tprint(f"    failed: folder={folder_name} product_id={product_id} error={exc}", file=sys.stderr)
        return None


def main() -> None:
    parser = argparse.ArgumentParser(description="Upload 5 images per folder and assign them to existing products.")
    parser.add_argument("--images-dir", required=True, help="Root directory containing numeric folders like 001, 002...")
    parser.add_argument("--media-base-url", default="http://localhost:8080", help="Base URL of gateway/media route")
    parser.add_argument("--user-agent", default="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36")
    parser.add_argument("--dry-run", action="store_true", help="Do not call APIs, only print what would happen")
    parser.add_argument("--clear-db-data", action="store_true", help="Truncate product_images and medias before importing")
    parser.add_argument(
        "--workers",
        type=int,
        default=4,
        help="Number of products to process in parallel (default: 4). Images within each product are uploaded with up to IMAGES_PER_PRODUCT concurrent threads.",
    )
    args = parser.parse_args()

    images_dir = Path(args.images_dir)
    if not images_dir.exists() or not images_dir.is_dir():
        raise SystemExit(f"Images directory not found: {images_dir}")

    folders = build_folder_map(read_subfolders(images_dir))
    if not folders:
        raise SystemExit(f"No numeric folders found in: {images_dir}")

    print(f"start: images_dir={images_dir}")
    print(f"config: media_base_url={args.media_base_url}, dry_run={args.dry_run}, clear_db_data={args.clear_db_data}, workers={args.workers}")

    if args.clear_db_data:
        clear_db_tables(args.dry_run)

    categories_map = get_categories_from_db()
    print(f"Loaded category map from database: {categories_map}")

    # Build a flat list of (product, image_group, folder_name) tasks across all folders
    tasks: list[tuple[dict, list[Path], str]] = []
    for folder in folders:
        images = read_images(folder)
        image_groups = chunk_images(images, IMAGES_PER_PRODUCT)

        normalized_name = normalize_folder_name(folder.name)
        category_id = categories_map.get(normalized_name)
        if not category_id:
            print(f"[{folder.name}] -> warning: no matching category found in database (normalized: {normalized_name})")
            continue

        products = get_products_by_category_from_db(category_id)
        if not products:
            print(f"[{folder.name}] -> warning: no products found in DB for category {category_id}, using fallback generation")
            products = [
                {
                    "id": (category_id - 1) * PRODUCTS_PER_FOLDER + i + 1,
                    "name": f"{folder.name.capitalize()} Product {i + 1}"
                }
                for i in range(len(image_groups))
            ]

        print(f"\n[{folder.name}] (category_id={category_id}) -> {len(images)} images, {len(products)} products mapped")
        for local_index, image_group in enumerate(image_groups):
            if local_index >= len(products):
                print(f"  warning: more image groups ({len(image_groups)}) than products ({len(products)}), stopping.")
                break
            tasks.append((products[local_index], image_group, folder.name))

    print(f"\nProcessing {len(tasks)} products with {args.workers} parallel workers ...\n")

    results: list[dict] = []
    results_lock = threading.Lock()

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {
            pool.submit(
                process_product,
                product, image_group, folder_name,
                args.media_base_url, args.user_agent, args.dry_run,
                IMAGES_PER_PRODUCT,  # image_workers: up to 5 concurrent uploads per product
            ): (product["id"], folder_name)
            for product, image_group, folder_name in tasks
        }
        for future in as_completed(futures):
            result = future.result()
            if result is not None:
                with results_lock:
                    results.append(result)

    print(f"\ndone: processed={len(results)}")
    print(json.dumps(results, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

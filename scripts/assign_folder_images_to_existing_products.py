import argparse
import json
import mimetypes
import sys
import subprocess
from pathlib import Path

import requests


IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
IMAGES_PER_PRODUCT = 5
PRODUCTS_PER_FOLDER = 20


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


def get_product(product_base_url: str, product_id: int, user_agent: str) -> dict:
    url = f"{product_base_url.rstrip('/')}/api/products/{product_id}"
    response = requests.get(url, headers={"User-Agent": user_agent}, timeout=180)
    response.raise_for_status()
    return response.json()


def delete_media(media_base_url: str, media_id: int, user_agent: str) -> None:
    url = f"{media_base_url.rstrip('/')}/api/media/{media_id}"
    response = requests.delete(url, headers={"User-Agent": user_agent}, timeout=180)
    response.raise_for_status()


def clear_existing_product_images(media_base_url: str, product: dict, user_agent: str, dry_run: bool) -> None:
    existing_images = product.get("images") or []
    if not existing_images:
        print("  no existing images to clear")
        return

    print(f"  clearing {len(existing_images)} existing images")
    for image in existing_images:
        media_id = image.get("mediaId") or image.get("media_id")
        if media_id is None:
            print("  skip: existing image without mediaId")
            continue
        if dry_run:
            print(f"  dry-run delete mediaId={media_id}")
            continue
        delete_media(media_base_url, int(media_id), user_agent)
        print(f"  deleted old mediaId={media_id}")


def update_product_images(
    product_base_url: str,
    product_id: int,
    media_ids: list[int],
    user_agent: str,
) -> dict:
    url = f"{product_base_url.rstrip('/')}/api/products/{product_id}"
    response = requests.get(
        url,
        headers={"User-Agent": user_agent},
        timeout=180,
    )
    response.raise_for_status()
    return response.json()


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


def main() -> None:
    parser = argparse.ArgumentParser(description="Upload 5 images per folder and assign them to existing products.")
    parser.add_argument("--images-dir", required=True, help="Root directory containing numeric folders like 001, 002...")
    parser.add_argument("--media-base-url", default="http://localhost:8080", help="Base URL of gateway/media route")
    parser.add_argument("--product-base-url", default="http://localhost:8080", help="Base URL of gateway/product route")
    parser.add_argument("--user-agent", default="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36")
    parser.add_argument("--dry-run", action="store_true", help="Do not call APIs, only print what would happen")
    parser.add_argument("--clear-db-data", action="store_true", help="Truncate product_images and medias before importing")
    args = parser.parse_args()

    images_dir = Path(args.images_dir)
    if not images_dir.exists() or not images_dir.is_dir():
        raise SystemExit(f"Images directory not found: {images_dir}")

    folders = build_folder_map(read_subfolders(images_dir))
    if not folders:
        raise SystemExit(f"No numeric folders found in: {images_dir}")

    print(f"start: images_dir={images_dir}")
    print(f"config: media_base_url={args.media_base_url}, product_base_url={args.product_base_url}, dry_run={args.dry_run}, clear_db_data={args.clear_db_data}")

    if args.clear_db_data:
        clear_db_tables(args.dry_run)

    products = get_products(args.product_base_url, args.user_agent)
    products = sorted(products, key=lambda p: p.get("id", 0))
    print(f"loaded products: {len(products)}")

    if len(products) < len(folders) * PRODUCTS_PER_FOLDER:
        print(f"warning: only {len(products)} products found, but {len(folders) * PRODUCTS_PER_FOLDER} are needed")

    results = []
    for folder_index, folder in enumerate(folders):
        start_index = folder_index * PRODUCTS_PER_FOLDER
        end_index = start_index + PRODUCTS_PER_FOLDER
        folder_products = products[start_index:end_index]
        images = read_images(folder)
        image_groups = chunk_images(images, IMAGES_PER_PRODUCT)

        print(f"[{folder.name}] -> {len(folder_products)} products, {len(images)} images, {len(image_groups)} groups")
        if len(image_groups) < len(folder_products):
            print(f"  warning: not enough images for all products in {folder.name}")

        for local_index, product in enumerate(folder_products):
            if local_index >= len(image_groups):
                break

            product_id = int(product["id"])
            product_name = product.get("name") or folder.name
            full_product = get_product(args.product_base_url, product_id, args.user_agent)
            image_group = image_groups[local_index]

            print(f"  product id={product_id} name={product_name} ({len(image_group)} images)")
            if len(image_group) < IMAGES_PER_PRODUCT:
                print(f"    warning: expected {IMAGES_PER_PRODUCT} images, found {len(image_group)}")

            media_ids = []
            uploaded_media = []
            try:
                clear_existing_product_images(args.media_base_url, product, args.user_agent, args.dry_run)
                for image_path in image_group:
                    print(f"    uploading: {image_path.name}")
                    if args.dry_run:
                        fake_id = len(media_ids) + 1
                        media_ids.append(fake_id)
                        uploaded_media.append({"file": image_path.name, "id": fake_id, "dry_run": True})
                        print(f"    success: dry-run mediaId={fake_id} file={image_path.name}")
                    else:
                        media = upload_media(args.media_base_url, image_path, args.user_agent)
                        media_id = int(media["id"])
                        media_ids.append(media_id)
                        uploaded_media.append({"file": image_path.name, "media": media})
                        print(f"    success: uploaded file={image_path.name} mediaId={media_id}")

                if args.dry_run:
                    updated_product = {
                        "dry_run": True,
                        "product_id": product_id,
                        "product_name": product_name,
                        "media_ids": media_ids,
                    }
                    print(f"    success: dry-run update product id={product_id}")
                else:
                    updated_product = update_product_images(
                        args.product_base_url,
                        product_id,
                        media_ids,
                        args.user_agent,
                    )
                    replace_product_images_in_db(product_id, media_ids)
                    print(f"    success: updated product id={product_id}")

                results.append(
                    {
                        "folder": folder.name,
                        "product_id": product_id,
                        "product_name": product_name,
                        "uploaded_media": uploaded_media,
                        "product": updated_product,
                    }
                )
            except Exception as exc:
                print(f"    failed: folder={folder.name} product_id={product_id} error={exc}", file=sys.stderr)
                if not args.dry_run:
                    continue

    print(f"done: processed={len(results)}")
    print(json.dumps(results, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

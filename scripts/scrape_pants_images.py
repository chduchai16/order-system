"""
Script cao anh quan tu Pexels (https://www.pexels.com/search/pants/)
- Playwright + stealth JS de bypass bot detection
- Intercept network request -> bat URL anh truc tiep
- Luu vao: D:/Java/order-system/images/product/pants

Cai dat:
    pip install playwright requests
    playwright install chromium
"""

import asyncio
import re
import time
import random
import requests
from pathlib import Path
from urllib.parse import urlparse, urlencode

from playwright.async_api import async_playwright

# ─────────────────────────────────────────────
# CAU HINH
# ─────────────────────────────────────────────
SAVE_DIR     = Path(r"D:\Java\order-system\images\product\pants")
TARGET_COUNT = 100
TARGET_URL   = "https://www.pexels.com/search/pants/"
MIN_SIZE_KB  = 20
HEADLESS     = False

DOWNLOAD_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Referer": "https://www.pexels.com/",
}

STEALTH_JS = """
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    window.chrome = { runtime: {}, loadTimes: function(){}, csi: function(){} };
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    const origQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (params) =>
        params.name === 'notifications'
            ? Promise.resolve({ state: Notification.permission })
            : origQuery(params);
"""


def normalize_pexels_url(url: str) -> str | None:
    if "images.pexels.com/photos/" not in url:
        return None
    parsed  = urlparse(url)
    w_match = re.search(r"[?&]w=(\d+)", parsed.query)
    if w_match and int(w_match.group(1)) < 300:
        return None
    base   = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
    params = urlencode({"auto": "compress", "cs": "tinysrgb", "w": 800, "h": 800, "fit": "crop", "q": 85})
    return f"{base}?{params}"


def get_pexels_photo_id(url: str) -> str | None:
    match = re.search(r"/photos/(\d+)/", url)
    return match.group(1) if match else None


def download_image(url: str, save_path: Path) -> bool:
    try:
        resp = requests.get(url, headers=DOWNLOAD_HEADERS, timeout=25, stream=True)
        resp.raise_for_status()
        ct = resp.headers.get("Content-Type", "")
        if "image" not in ct and "octet" not in ct:
            return False
        with open(save_path, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                f.write(chunk)
        if save_path.stat().st_size / 1024 < MIN_SIZE_KB:
            save_path.unlink()
            return False
        return True
    except Exception:
        if save_path.exists():
            save_path.unlink()
        return False


async def smooth_scroll(page, distance: int = 700):
    steps = random.randint(6, 12)
    step  = distance // steps
    for _ in range(steps):
        await page.mouse.wheel(0, step)
        await asyncio.sleep(random.uniform(0.04, 0.12))


async def random_mouse_move(page):
    await page.mouse.move(random.randint(150, 1100), random.randint(100, 650))
    await asyncio.sleep(random.uniform(0.1, 0.25))


async def collect_urls() -> list:
    collected = []
    seen_ids  = set()

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(
            headless=HEADLESS,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-infobars",
            ],
        )
        context = await browser.new_context(
            viewport={"width": 1366, "height": 768},
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            locale="en-US",
            timezone_id="America/New_York",
        )

        page = await context.new_page()
        await page.add_init_script(STEALTH_JS)

        async def on_response(response):
            url   = response.url
            clean = normalize_pexels_url(url)
            if not clean:
                return
            pid = get_pexels_photo_id(clean)
            if pid and pid not in seen_ids:
                seen_ids.add(pid)
                collected.append(clean)

        page.on("response", on_response)

        print(f"[Browser] Mo trang: {TARGET_URL}")
        await page.goto(TARGET_URL, wait_until="domcontentloaded", timeout=45000)
        await asyncio.sleep(random.uniform(3.0, 5.0))
        await random_mouse_move(page)

        need          = TARGET_COUNT + 30
        scroll_no     = 0
        no_new_streak = 0

        while len(collected) < need:
            prev      = len(collected)
            scroll_no += 1

            await smooth_scroll(page, distance=random.randint(600, 1000))
            await asyncio.sleep(random.uniform(1.8, 2.8))

            if scroll_no % 4 == 0:
                await random_mouse_move(page)

            gained = len(collected) - prev
            print(f"  [Scroll {scroll_no:>2}] +{gained:>3} anh moi  |  Tong: {len(collected)}")

            if gained == 0:
                no_new_streak += 1
                if no_new_streak >= 5:
                    print("  [!] Khong co anh moi sau 5 lan scroll. Dung.")
                    break
                await asyncio.sleep(2.5)
            else:
                no_new_streak = 0

        await browser.close()

    return collected


async def main():
    SAVE_DIR.mkdir(parents=True, exist_ok=True)
    print(f"[OK] Thu muc luu  : {SAVE_DIR}")
    print(f"[OK] Nguon        : {TARGET_URL}")
    print(f"[OK] So luong can : {TARGET_COUNT} anh\n")

    all_urls = await collect_urls()
    print(f"\n[OK] Thu thap duoc {len(all_urls)} URL anh unique")

    if not all_urls:
        print("[!!] Khong lay duoc URL nao.")
        return

    print(f"[>>] Bat dau tai {TARGET_COUNT} anh...\n")

    downloaded = 0
    failed     = 0

    for url in all_urls:
        if downloaded >= TARGET_COUNT:
            break

        file_name = f"pants_{downloaded + 1:03d}.jpg"
        save_path = SAVE_DIR / file_name

        if save_path.exists():
            print(f"  [=] Da ton tai: {file_name}")
            downloaded += 1
            continue

        print(f"  [v] ({downloaded + 1:>3}/{TARGET_COUNT})  {file_name}", end="  ")
        ok = download_image(url, save_path)

        if ok:
            size_kb = save_path.stat().st_size / 1024
            print(f"OK  {size_kb:.0f} KB")
            downloaded += 1
        else:
            print("FAIL  bo qua")
            failed += 1

        time.sleep(random.uniform(0.15, 0.4))

    print("\n" + "=" * 55)
    print(f"  Tai thanh cong : {downloaded} anh")
    print(f"  That bai / bo  : {failed} lan")
    print(f"  Thu muc        : {SAVE_DIR}")
    print("=" * 55)


if __name__ == "__main__":
    asyncio.run(main())

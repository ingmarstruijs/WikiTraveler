"""Compose Chrome Web Store listing images from existing product screenshots.

Sizes follow https://developer.chrome.com/docs/webstore/images :
  screenshots  1280 x 800 (24-bit PNG, no alpha)
  small promo  440 x 280
  marquee      1400 x 560

Run from the repo root:

  python scripts/compose-cws-assets.py
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "docs" / "assets" / "screenshots"
ICON = ROOT / "apps" / "lens" / "icons" / "icon-128.png"
OUT = ROOT / "docs" / "assets" / "chrome-web-store"

NAVY = (30, 64, 175)  # #1e40af
NAVY_DARK = (15, 23, 42)  # #0f172a
WHITE = (255, 255, 255)
MUTED = (191, 219, 254)  # #bfdbfe


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    names = (
        ("segoeuib.ttf", "segoeui.ttf")
        if bold
        else ("segoeui.ttf", "arial.ttf")
    )
    for name in names:
        path = Path(r"C:\Windows\Fonts") / name
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def flatten(im: Image.Image, background: tuple[int, int, int] = NAVY_DARK) -> Image.Image:
    if im.mode == "RGBA":
        canvas = Image.new("RGB", im.size, background)
        canvas.paste(im, mask=im.split()[3])
        return canvas
    return im.convert("RGB")


def fit_contain(im: Image.Image, box: tuple[int, int]) -> Image.Image:
    im = im.convert("RGBA")
    im.thumbnail(box, Image.Resampling.LANCZOS)
    return im


def rounded(im: Image.Image, radius: int = 24) -> Image.Image:
    im = im.convert("RGBA")
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, im.width, im.height), radius, fill=255)
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(im, mask=mask)
    return out


def drop_shadow(im: Image.Image, offset: int = 18, blur: int = 24) -> Image.Image:
    shadow = Image.new("RGBA", (im.width + offset * 2, im.height + offset * 2), (0, 0, 0, 0))
    blob = Image.new("RGBA", im.size, (0, 0, 0, 140))
    shadow.paste(blob, (offset, offset), blob)
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    shadow.paste(im, (offset // 2, offset // 2), im)
    return shadow


def screenshot(path: Path, title: str, subtitle: str, out_name: str) -> None:
    canvas = Image.new("RGB", (1280, 800), NAVY_DARK)
    draw = ImageDraw.Draw(canvas)
    draw.rectangle((0, 0, 1280, 88), fill=NAVY)
    icon = flatten(Image.open(ICON), NAVY).resize((48, 48), Image.Resampling.LANCZOS)
    canvas.paste(icon, (36, 20))
    draw.text((96, 18), title, font=font(28, bold=True), fill=WHITE)
    draw.text((96, 52), subtitle, font=font(16), fill=MUTED)

    src = flatten(Image.open(path), WHITE)
    fitted = fit_contain(src, (1080, 620))
    card = rounded(fitted, 20)
    stacked = drop_shadow(card)
    x = (1280 - stacked.width) // 2
    y = 88 + (712 - stacked.height) // 2
    canvas.paste(stacked, (x, y), stacked)
    canvas.save(OUT / out_name, "PNG")
    print(f"wrote {out_name} {canvas.size}")


def small_promo() -> None:
    canvas = Image.new("RGB", (440, 280), NAVY)
    draw = ImageDraw.Draw(canvas)
    icon = flatten(Image.open(ICON), NAVY).resize((72, 72), Image.Resampling.LANCZOS)
    canvas.paste(icon, (32, 40))
    draw.text((32, 132), "WikiTraveler Lens", font=font(28, bold=True), fill=WHITE)
    draw.text((32, 176), "Accessibility facts on", font=font(16), fill=MUTED)
    draw.text((32, 200), "booking sites", font=font(16), fill=MUTED)
    canvas.save(OUT / "small-promo-440x280.png", "PNG")
    print("wrote small-promo-440x280.png")


def marquee() -> None:
    canvas = Image.new("RGB", (1400, 560), NAVY_DARK)
    draw = ImageDraw.Draw(canvas)
    draw.rectangle((0, 0, 1400, 560), fill=NAVY_DARK)
    draw.rectangle((0, 0, 560, 560), fill=NAVY)
    icon = flatten(Image.open(ICON), NAVY).resize((96, 96), Image.Resampling.LANCZOS)
    canvas.paste(icon, (64, 120))
    draw.text((64, 240), "WikiTraveler", font=font(40, bold=True), fill=WHITE)
    draw.text((64, 292), "Lens", font=font(40, bold=True), fill=WHITE)
    draw.text((64, 360), "Community-verified stay", font=font(20), fill=MUTED)
    draw.text((64, 392), "accessibility on Booking,", font=font(20), fill=MUTED)
    draw.text((64, 424), "Expedia, and Hotels.com.", font=font(20), fill=MUTED)

    src = flatten(Image.open(SRC / "lens.png"), WHITE)
    fitted = fit_contain(src, (720, 480))
    card = rounded(fitted, 20)
    stacked = drop_shadow(card)
    canvas.paste(stacked, (620, (560 - stacked.height) // 2), stacked)
    canvas.save(OUT / "marquee-1400x560.png", "PNG")
    print("wrote marquee-1400x560.png")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    screenshot(
        SRC / "lens.png",
        "WikiTraveler Lens",
        "Popup: scores, features, and audit photos on the listing.",
        "screenshot-01-lens-popup.png",
    )
    screenshot(
        SRC / "access-mobile.png",
        "WikiTraveler Access",
        "Map + verified facts — the same data Lens shows in the browser.",
        "screenshot-02-access-map.png",
    )
    screenshot(
        SRC / "access-desktop.jpg",
        "WikiTraveler Access",
        "Desktop discovery: coverage map, list, and property preview.",
        "screenshot-03-access-desktop.png",
    )
    small_promo()
    marquee()


if __name__ == "__main__":
    main()

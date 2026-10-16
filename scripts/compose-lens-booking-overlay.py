"""Compose Lens popup over a blurred Booking.com listing for www /story.

Run from the repo root:

  python scripts/compose-lens-booking-overlay.py
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "docs" / "assets" / "screenshots"
COMPOSE = ROOT / "docs" / "assets" / "compose"
OUT = SRC / "lens-on-booking.png"

# Prefer a freshly captured backdrop; fall back to the checked-in copy.
BACKDROP_CANDIDATES = (
    Path(r"c:\Users\Ingmar\AppData\Local\Temp\cursor\screenshots\booking-the-match-backdrop.png"),
    COMPOSE / "booking-the-match-backdrop.jpg",
    COMPOSE / "booking-the-match-backdrop.png",
)

OUT_W, OUT_H = 1440, 900
# Soft blur so Booking stays recognizable but Lens reads clearly.
BACKDROP_BLUR = 6
BACKDROP_DIM = 0.88  # slight dim after blur for contrast


def cover_crop(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    tw, th = size
    bw, bh = im.size
    scale = max(tw / bw, th / bh)
    nw, nh = int(bw * scale), int(bh * scale)
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - tw) // 2
    top = (nh - th) // 2
    return im.crop((left, top, left + tw, top + th))


def prepare_backdrop(im: Image.Image) -> Image.Image:
    """Light-page backdrop: blur + slight dim so the Lens panel pops."""
    canvas = cover_crop(im.convert("RGB"), (OUT_W, OUT_H))
    # Upscale blur radius feel a bit by blurring then mild re-sharpen is not needed.
    blurred = canvas.filter(ImageFilter.GaussianBlur(BACKDROP_BLUR))
    dimmed = ImageEnhance.Brightness(blurred).enhance(BACKDROP_DIM)
    return dimmed.convert("RGBA")


def rounded(im: Image.Image, radius: int = 16) -> Image.Image:
    im = im.convert("RGBA")
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, im.width, im.height), radius, fill=255)
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(im, mask=mask)
    return out


def drop_shadow(im: Image.Image, offset: int = 16, blur: int = 28) -> Image.Image:
    shadow = Image.new("RGBA", (im.width + offset * 2, im.height + offset * 2), (0, 0, 0, 0))
    blob = Image.new("RGBA", im.size, (0, 0, 0, 170))
    shadow.paste(blob, (offset, offset), blob)
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    shadow.paste(im, (offset // 2, offset // 2), im)
    return shadow


def main() -> None:
    backdrop_path = next((p for p in BACKDROP_CANDIDATES if p.exists()), None)
    if backdrop_path is None:
        raise SystemExit("No booking backdrop found. Capture booking-the-match-backdrop.png first.")

    canvas = prepare_backdrop(Image.open(backdrop_path))

    lens = Image.open(SRC / "lens.png").convert("RGBA")
    lens.thumbnail((int(OUT_W * 0.30), int(OUT_H * 0.82)), Image.Resampling.LANCZOS)
    panel = drop_shadow(rounded(lens, 16))

    x = OUT_W - panel.width - 36
    y = max(48, min((OUT_H - panel.height) // 2 + 20, OUT_H - panel.height - 24))
    canvas.paste(panel, (x, y), panel)

    out_rgb = Image.new("RGB", canvas.size, (245, 245, 245))
    out_rgb.paste(canvas, mask=canvas.split()[3])
    out_rgb.save(OUT, "PNG", optimize=True)
    print(f"wrote {OUT.relative_to(ROOT)} {out_rgb.size} lens_panel={lens.size} blur={BACKDROP_BLUR}")

    # Keep a reproducible (unblurred) backdrop for re-composes (not copied to www public).
    checked_in = COMPOSE / "booking-the-match-backdrop.jpg"
    COMPOSE.mkdir(parents=True, exist_ok=True)
    if backdrop_path.resolve() != checked_in.resolve():
        Image.open(backdrop_path).convert("RGB").save(checked_in, "JPEG", quality=85, optimize=True)
        print(f"wrote {checked_in.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

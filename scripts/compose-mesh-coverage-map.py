"""Draw a simplified mesh-coverage diagram on the world-map base.

  python scripts/compose-mesh-coverage-map.py
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "docs" / "assets" / "screenshots"
BASE = SRC / "world-map-base.jpg"
OUT = SRC / "mesh-coverage-geo.png"
OUT_W, OUT_H = 1200, 675

BLUE = (37, 99, 235)
BLUE_FILL = (96, 165, 250, 110)
BLUE_DARK = (30, 64, 175)
GREEN = (22, 163, 74)
GREEN_FILL = (74, 222, 128, 100)
GREEN_DARK = (22, 101, 52)
NAVY = (30, 58, 138)
SLATE = (51, 65, 85)
INK = (15, 23, 42)
WHITE = (255, 255, 255)
MUTED = (71, 85, 105)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    names = ("segoeuib.ttf", "segoeui.ttf") if bold else ("segoeui.ttf", "arial.ttf")
    for name in names:
        path = Path(r"C:\Windows\Fonts") / name
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def ellipse(draw: ImageDraw.ImageDraw, cx: int, cy: int, rx: int, ry: int, fill, outline, width: int = 3) -> None:
    draw.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=fill, outline=outline, width=width)


def server_icon(draw: ImageDraw.ImageDraw, cx: int, cy: int, body, bar) -> None:
    draw.rounded_rectangle((cx - 16, cy - 18, cx + 16, cy + 18), 4, fill=body)
    for i, y in enumerate((-10, -1, 8)):
        draw.rounded_rectangle((cx - 11, cy + y, cx + 11, cy + y + 5), 1, fill=bar)


def arrow_line(draw: ImageDraw.ImageDraw, pts: list[tuple[int, int]], color=BLUE, width: int = 3) -> None:
    draw.line(pts, fill=color, width=width)
    x0, y0 = pts[-2]
    x1, y1 = pts[-1]
    import math

    ang = math.atan2(y1 - y0, x1 - x0)
    size = 10
    left = (x1 - size * math.cos(ang - 0.45), y1 - size * math.sin(ang - 0.45))
    right = (x1 - size * math.cos(ang + 0.45), y1 - size * math.sin(ang + 0.45))
    draw.polygon([pts[-1], left, right], fill=color)


def pill(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int, text: str, f) -> None:
    # Radius must stay strictly below half-height (Pillow rounded_rectangle edge case).
    radius = max(1, min(h, w) // 2 - 1)
    draw.rounded_rectangle((x, y, x + w, y + h), radius, fill=WHITE, outline=BLUE, width=2)
    bbox = draw.textbbox((0, 0), text, font=f)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text((x + (w - tw) / 2, y + (h - th) / 2 - 1), text, font=f, fill=BLUE)


def main() -> None:
    base = Image.open(BASE).convert("RGBA").resize((OUT_W, OUT_H), Image.Resampling.LANCZOS)
    overlay = Image.new("RGBA", (OUT_W, OUT_H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)

    title_f = font(26, bold=True)
    sub_f = font(14)
    label_f = font(13, bold=True)
    small_f = font(12)
    legend_f = font(12)

    # Title strip
    d.rectangle((0, 0, OUT_W, 72), fill=(248, 250, 252, 235))
    d.text((32, 14), "Coverage is geographic. Identity is not.", font=title_f, fill=INK)
    d.text((32, 46), "Home node routes you to the data node for the place you search.", font=sub_f, fill=MUTED)

    # Tuned for world-map-base.jpg framing (equirectangular, continents centered).
    # US peer (no overlap), EU data node, European peer with overlap — no “no coverage”.
    us = (270, 230, 118, 88)
    eu = (640, 195, 100, 78)
    peer = (730, 185, 86, 70)

    for (cx, cy, rx, ry, fill, outline) in (
        (*us, GREEN_FILL, GREEN),
        (*eu, BLUE_FILL, BLUE),
        (*peer, GREEN_FILL, GREEN),
    ):
        ellipse(d, cx, cy, rx, ry, fill, outline, 3)

    server_icon(d, us[0] - 8, us[1] - 12, GREEN_DARK, (187, 247, 208))
    server_icon(d, eu[0] - 8, eu[1] - 12, BLUE_DARK, (191, 219, 254))
    server_icon(d, peer[0] - 4, peer[1] - 12, GREEN_DARK, (187, 247, 208))

    for (x, y, text, color) in (
        (us[0], us[1] + us[3] - 8, "Peer (US)", GREEN_DARK),
        (eu[0], eu[1] + eu[3] - 4, "EU data node", NAVY),
        (peer[0] + 24, peer[1] + peer[3] - 8, "Peer (overlap)", GREEN_DARK),
    ):
        bbox = d.textbbox((0, 0), text, font=label_f)
        tw = bbox[2] - bbox[0]
        d.text((x - tw / 2, y), text, font=label_f, fill=color)

    # Traveler near southern EU coverage
    tx, ty = 600, 250
    d.ellipse((tx - 18, ty - 18, tx + 18, ty + 18), fill=NAVY)
    d.ellipse((tx - 5, ty - 10, tx + 5, ty), fill=WHITE)
    d.polygon([(tx - 8, ty + 4), (tx + 8, ty + 4), (tx + 8, ty + 14), (tx - 8, ty + 14)], fill=WHITE)
    tlabel = "Traveler (EU)"
    bbox = d.textbbox((0, 0), tlabel, font=small_f)
    d.text((tx - (bbox[2] - bbox[0]) / 2, ty + 22), tlabel, font=small_f, fill=INK)

    # Home node card
    hx, hy = 640, 238
    d.rounded_rectangle((hx, hy, hx + 128, hy + 42), 8, fill=WHITE, outline=INK, width=2)
    d.text((hx + 28, hy + 6), "Home node", font=label_f, fill=INK)
    d.text((hx + 40, hy + 24), "identity", font=small_f, fill=MUTED)
    arrow_line(d, [(tx + 18, ty), (hx, ty)], BLUE, 2)
    arrow_line(d, [(tx, ty - 18), (eu[0] - 8, eu[1] + 6)], BLUE, 3)

    # Resolve arc to US peer
    arrow_line(d, [(tx, ty - 22), (480, 140), (360, 150), (us[0] + 20, us[1] - 20)], BLUE, 4)
    pill(d, 400, 118, 210, 32, "resolves → peer (US)", label_f)

    # Legend
    ly = OUT_H - 52
    d.rounded_rectangle((20, ly, OUT_W - 20, OUT_H - 12), 10, fill=(255, 255, 255, 242), outline=(226, 232, 240))
    items_x = 40
    # EU
    d.ellipse((items_x, ly + 12, items_x + 16, ly + 28), fill=(96, 165, 250), outline=BLUE)
    d.text((items_x + 22, ly + 12), "EU data node", font=legend_f, fill=SLATE)
    items_x += 140
    # Peer
    d.ellipse((items_x, ly + 12, items_x + 16, ly + 28), fill=(74, 222, 128), outline=GREEN)
    d.text((items_x + 22, ly + 12), "Peer node", font=legend_f, fill=SLATE)
    items_x += 120
    # Overlap
    d.ellipse((items_x, ly + 12, items_x + 16, ly + 28), fill=(96, 165, 250, 160), outline=BLUE)
    d.ellipse((items_x + 10, ly + 12, items_x + 26, ly + 28), fill=(74, 222, 128, 160), outline=GREEN)
    d.text((items_x + 34, ly + 12), "Overlap", font=legend_f, fill=SLATE)
    items_x += 120
    # Traveler
    d.ellipse((items_x, ly + 13, items_x + 14, ly + 27), fill=NAVY)
    d.text((items_x + 20, ly + 12), "Traveler", font=legend_f, fill=SLATE)
    items_x += 110
    # Routing
    arrow_line(d, [(items_x, ly + 20), (items_x + 40, ly + 20)], BLUE, 3)
    d.text((items_x + 48, ly + 12), "Routing", font=legend_f, fill=SLATE)

    out = Image.alpha_composite(base, overlay).convert("RGB")
    out.save(OUT, "PNG", optimize=True)
    # Keep a jpg sibling for lighter embeds if useful
    out.save(SRC / "mesh-coverage-geo.jpg", "JPEG", quality=88, optimize=True)
    print(f"wrote {OUT.relative_to(ROOT)} {out.size}")


if __name__ == "__main__":
    main()

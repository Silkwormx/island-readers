#!/usr/bin/env python3
"""Three distinct Island Readers Trail Map options. Previews only; does not change the app."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

OUT_DIR = Path("/workspace/reading-program/reading_path")
FONT_DIR = Path("/usr/share/fonts/truetype/sand-box/google/Andika")

DPI = 300
PAGE_W_IN, PAGE_H_IN = 8.5, 11.0
W, H = int(PAGE_W_IN * DPI), int(PAGE_H_IN * DPI)

CREAM = (255, 248, 231)
INK = (43, 37, 64)
WHITE = (255, 255, 255)
TEAL_DEEP = (20, 70, 68)
ORANGE = (242, 140, 0)
ORANGE_D = (196, 108, 0)
WOOD = (140, 92, 48)
WOOD_DK = (96, 60, 28)
WOOD_LT = (196, 150, 96)
PARCHMENT = (248, 232, 196)
PARCHMENT_DK = (214, 186, 130)
STONE_FACE = (236, 226, 204)
STONE_EDGE = (150, 136, 110)

STAGES = [
    {"n": 1, "units": "Units 1-2", "skills": "Short vowels, floss, blends", "color": (196, 92, 42)},
    {"n": 2, "units": "Unit 3", "skills": "Digraphs", "color": (226, 91, 106)},
    {"n": 3, "units": "Unit 4", "skills": "Glued sounds", "color": (240, 138, 34)},
    {"n": 4, "units": "Unit 5", "skills": "Silent e", "color": (214, 168, 16)},
    {"n": 5, "units": "Unit 6", "skills": "Endings", "color": (46, 158, 91)},
    {"n": 6, "units": "Units 7-8", "skills": "Syllables and tricky sounds", "color": (58, 126, 202)},
    {"n": 7, "units": "Units 9-10", "skills": "Bossy R", "color": (123, 78, 194)},
    {"n": 8, "units": "Units 11-12", "skills": "Vowel teams", "color": (26, 154, 150)},
    {"n": 9, "units": "Units 13-16", "skills": "Other vowel sounds", "color": (196, 62, 126)},
    {"n": 10, "units": "Units 17-22", "skills": "Word parts and patterns", "color": (201, 150, 20)},
]
HERE = 3  # live app is Unit 4 Glued Sounds = Stage 3

# Image-fraction path points (Stage 1 at the top, Stage 10 at the golden bell).
# Keep-outs are (x0, y0, x1, y1) in image fractions: Zip, Frill, and the bell.
OPTIONS = {
    1: {
        "bg": OUT_DIR / "trail_option1_bg.jpg",
        "style": "wood",
        "path": [
            (0.500, 0.322),
            (0.540, 0.385),
            (0.490, 0.450),
            (0.488, 0.515),
            (0.492, 0.575),
            (0.505, 0.625),
            (0.580, 0.665),
            (0.515, 0.715),
            (0.395, 0.758),
            (0.360, 0.848),
        ],
        "sides": ["R", "L", "R", "L", "R", "L", "L", "L", "L", "L"],
        "header": "banner",
        "keepouts": [
            (0.32, 0.12, 0.70, 0.305),  # Zip
            (0.52, 0.68, 0.90, 0.995),  # Frill
            (0.42, 0.70, 0.60, 0.88),   # bell
        ],
    },
    2: {
        "bg": OUT_DIR / "trail_option2_bg.jpg",
        "style": "scroll",
        "path": [
            (0.535, 0.275),
            (0.560, 0.328),
            (0.625, 0.375),
            (0.615, 0.425),
            (0.490, 0.478),
            (0.350, 0.528),
            (0.400, 0.568),
            (0.490, 0.632),
            (0.255, 0.860),
            (0.375, 0.900),
        ],
        "sides": ["R", "L", "L", "R", "L", "R", "L", "L", "A", "L"],
        "header": "corners",
        "keepouts": [
            (0.30, 0.08, 0.68, 0.22),   # Zip body, not the path at his feet
            (0.50, 0.70, 0.86, 0.995),  # Frill
            (0.38, 0.64, 0.62, 0.86),   # hanging bell
        ],
    },
    3: {
        "bg": OUT_DIR / "trail_option3_bg.jpg",
        "style": "stone",
        "path": [
            (0.560, 0.268),
            (0.530, 0.330),
            (0.505, 0.395),
            (0.482, 0.455),
            (0.460, 0.515),
            (0.445, 0.575),
            (0.435, 0.625),
            (0.432, 0.665),
            (0.328, 0.738),
            (0.305, 0.800),
        ],
        "sides": ["L", "L", "R", "L", "R", "L", "L", "L", "L", "L"],
        "header": "banner",
        "force_sides": {7: "L", 8: "L", 9: "L", 10: "L"},
        "keepouts": [
            (0.40, 0.08, 0.75, 0.255),  # Zip
            (0.50, 0.70, 0.86, 0.995),  # Frill
            (0.36, 0.63, 0.64, 0.90),   # bell (includes the cap)
        ],
    },
}


def px(inches: float) -> int:
    return int(round(inches * DPI))


def font(pt: float, bold: bool = False) -> ImageFont.FreeTypeFont:
    name = "Andika-Bold.ttf" if bold else "Andika-Regular.ttf"
    return ImageFont.truetype(str(FONT_DIR / name), int(round(pt * DPI / 72)))


def img_to_page(ix: float, iy: float) -> tuple[float, float]:
    art_w = PAGE_H_IN * (864 / 1152)  # 8.25
    left = (PAGE_W_IN - art_w) / 2
    return left + ix * art_w, iy * PAGE_H_IN


def keepout_to_page(box):
    x0, y0 = img_to_page(box[0], box[1])
    x1, y1 = img_to_page(box[2], box[3])
    return [x0, y0, x1, y1]


def luminance(c):
    return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]


def ink_bbox(draw, text, fnt):
    return draw.textbbox((0, 0), text, font=fnt)


def draw_ink(draw, x, y, text, fnt, fill):
    b = ink_bbox(draw, text, fnt)
    draw.text((x - b[0], y - b[1]), text, font=fnt, fill=fill)
    return b[2] - b[0], b[3] - b[1]


def wrap_words(text, fnt, max_w, draw):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=fnt) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def draw_star(d, cx, cy, r, fill):
    pts = []
    for i in range(10):
        ang = -math.pi / 2 + i * math.pi / 5
        rad = r if i % 2 == 0 else r * 0.42
        pts.append((cx + rad * math.cos(ang), cy + rad * math.sin(ang)))
    d.polygon(pts, fill=fill)


def place_background(page: Image.Image, bg_path: Path) -> None:
    bg = Image.open(bg_path).convert("RGB")
    art_w = px(PAGE_H_IN * (bg.width / bg.height))
    bg = bg.resize((art_w, H), Image.Resampling.LANCZOS)
    left = (W - art_w) // 2
    page.paste(bg, (left, 0))
    if left > 0:
        d = ImageDraw.Draw(page)
        d.rectangle((0, 0, left, H), fill=CREAM)
        d.rectangle((left + art_w, 0, W, H), fill=CREAM)


def draw_marker(draw, cx, cy, r, color, number, fnt, state):
    draw.ellipse((cx - r + 3, cy - r + 5, cx + r + 3, cy + r + 5), fill=(60, 40, 20, 85))
    if state == "here":
        draw.ellipse((cx - r - 8, cy - r - 8, cx + r + 8, cy + r + 8), outline=(*ORANGE, 230), width=7)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=WHITE)
    inset = max(3, int(r * 0.16))
    draw.ellipse((cx - r + inset, cy - r + inset, cx + r - inset, cy + r - inset), fill=color)
    ink = WHITE if luminance(color) < 155 else INK
    label = str(number)
    b = draw.textbbox((0, 0), label, font=fnt)
    tw, th = b[2] - b[0], b[3] - b[1]
    draw.text((cx - tw / 2 - b[0], cy - th / 2 - b[1]), label, font=fnt, fill=ink)
    if state == "done":
        sr = max(10, int(r * 0.38))
        sx, sy = cx + r - 2, cy + r - 2
        draw.ellipse((sx - sr, sy - sr, sx + sr, sy + sr), fill=(255, 214, 70), outline=WHITE, width=3)
        draw_star(draw, sx, sy, int(sr * 0.62), (176, 96, 8))


def make_here_pill(fonts):
    text = "You are here"
    fnt = fonts["pill"]
    probe = ImageDraw.Draw(Image.new("RGB", (8, 8)))
    b = ink_bbox(probe, text, fnt)
    tw, th = b[2] - b[0], b[3] - b[1]
    pad_x, pad_y = px(0.09), px(0.045)
    w, h = int(tw + pad_x * 2), int(th + pad_y * 2)
    im = Image.new("RGBA", (w + 8, h + 8), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((3, 4, 3 + w, 4 + h), radius=px(0.11), fill=(120, 70, 0, 50))
    d.rounded_rectangle((0, 0, w, h), radius=px(0.11), fill=ORANGE)
    draw_ink(d, pad_x, pad_y - 1, text, fnt, WHITE)
    return im, w, h


def measure_copy(stage, fonts, max_name_in):
    probe = ImageDraw.Draw(Image.new("RGB", (8, 8)))
    line1 = f"Stage {stage['n']}: {stage['units']}"
    names = wrap_words(stage["skills"], fonts["skills"], px(max_name_in), probe)
    b1 = ink_bbox(probe, line1, fonts["kicker"])
    widths = [b1[2] - b1[0]]
    heights = [b1[3] - b1[1]]
    name_hs = []
    for ln in names:
        b = ink_bbox(probe, ln, fonts["skills"])
        widths.append(b[2] - b[0])
        name_hs.append(b[3] - b[1])
    return line1, names, max(widths), heights[0], name_hs


def make_wood_sign(stage, fonts) -> tuple[Image.Image, int, int]:
    """Wooden frame and post, cream painted face for clear type."""
    line1, names, inner, h1, name_hs = measure_copy(stage, fonts, 1.70)
    pad_x, pad_y = px(0.10), px(0.06)
    frame = px(0.045)
    w = frame + pad_x + inner + pad_x + frame
    h = frame + pad_y + h1 + px(0.03) + sum(name_hs) + px(0.016) * (len(names) - 1) + pad_y + frame
    post = px(0.08)
    im = Image.new("RGBA", (w + 8, h + post + 8), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    px0 = (w - px(0.12)) // 2
    d.rectangle((px0 + 3, h - 2, px0 + px(0.12) + 3, h + post + 3), fill=(40, 25, 10, 60))
    d.rectangle((px0, h - 6, px0 + px(0.12), h + post), fill=WOOD)
    d.rectangle((px0 + 2, h - 6, px0 + 5, h + post), fill=WOOD_LT)
    rad = px(0.06)
    d.rounded_rectangle((3, 4, 3 + w, 4 + h), radius=rad, fill=(40, 25, 10, 50))
    d.rounded_rectangle((0, 0, w, h), radius=rad, fill=WOOD, outline=WOOD_DK, width=max(3, px(0.014)))
    d.rounded_rectangle((frame, frame, w - frame, h - frame), radius=px(0.04),
                        fill=(255, 248, 231, 250), outline=WOOD_DK, width=1)
    d.rectangle((frame, frame, frame + px(0.055), h - frame), fill=(*stage["color"], 255))
    for nx in (px(0.10), w - px(0.10)):
        d.ellipse((nx - 3, px(0.025), nx + 3, px(0.025) + 6), fill=WOOD_DK)
    x, y = frame + pad_x, frame + pad_y
    _, hh = draw_ink(d, x, y, line1, fonts["kicker"], stage["color"])
    y += hh + px(0.03)
    for i, ln in enumerate(names):
        _, nh = draw_ink(d, x, y, ln, fonts["skills"], INK)
        y += nh + (px(0.016) if i < len(names) - 1 else 0)
    return im.crop((0, 0, w, h + post)), w, h


def make_scroll(stage, fonts) -> tuple[Image.Image, int, int]:
    line1, names, inner, h1, name_hs = measure_copy(stage, fonts, 1.70)
    pad_x, pad_y = px(0.11), px(0.06)
    roll = px(0.10)
    w = roll + pad_x + inner + pad_x + roll
    h = pad_y + h1 + px(0.03) + sum(name_hs) + px(0.016) * (len(names) - 1) + pad_y
    im = Image.new("RGBA", (w + 8, h + 10), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((5, 6, 5 + w, 6 + h), radius=px(0.08), fill=(40, 25, 10, 45))
    d.rounded_rectangle((roll // 2, 0, w - roll // 2, h), radius=px(0.04), fill=PARCHMENT, outline=PARCHMENT_DK, width=2)
    for x0 in (0, w - roll):
        d.rounded_rectangle((x0, -px(0.02), x0 + roll, h + px(0.02)), radius=px(0.05),
                            fill=PARCHMENT_DK, outline=WOOD_DK, width=2)
        d.ellipse((x0 + 2, h // 2 - 6, x0 + roll - 2, h // 2 + 6), fill=stage["color"])
    d.rectangle((roll, 0, w - roll, px(0.045)), fill=(*stage["color"], 220))
    x, y = roll + pad_x - px(0.02), pad_y
    _, hh = draw_ink(d, x, y, line1, fonts["kicker"], stage["color"])
    y += hh + px(0.03)
    for i, ln in enumerate(names):
        _, nh = draw_ink(d, x, y, ln, fonts["skills"], INK)
        y += nh + (px(0.016) if i < len(names) - 1 else 0)
    return im.crop((0, 0, w, h)), w, h


def make_stone_tablet(stage, fonts) -> tuple[Image.Image, int, int]:
    line1, names, inner, h1, name_hs = measure_copy(stage, fonts, 1.55)
    pad_x, pad_y = px(0.10), px(0.07)
    w = pad_x * 2 + inner
    h = pad_y + h1 + px(0.03) + sum(name_hs) + px(0.016) * (len(names) - 1) + pad_y
    im = Image.new("RGBA", (w + 10, h + 10), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    rad = px(0.11)
    d.rounded_rectangle((4, 5, 4 + w, 5 + h), radius=rad, fill=(40, 30, 18, 55))
    d.rounded_rectangle((0, 0, w, h), radius=rad, fill=STONE_FACE, outline=STONE_EDGE, width=max(3, px(0.016)))
    d.rounded_rectangle((px(0.04), px(0.04), w - px(0.04), h - px(0.04)), radius=px(0.08),
                        outline=(*STONE_EDGE, 140), width=2)
    d.rounded_rectangle((0, 0, w, px(0.08)), radius=rad, fill=(*stage["color"], 255))
    d.rectangle((2, px(0.06), w - 2, px(0.08)), fill=STONE_FACE)
    x, y = pad_x, pad_y + px(0.015)
    _, hh = draw_ink(d, x, y, line1, fonts["kicker"], stage["color"])
    y += hh + px(0.03)
    for i, ln in enumerate(names):
        _, nh = draw_ink(d, x, y, ln, fonts["skills"], INK)
        y += nh + (px(0.016) if i < len(names) - 1 else 0)
    return im.crop((0, 0, w, h)), w, h


MAKERS = {"wood": make_wood_sign, "scroll": make_scroll, "stone": make_stone_tablet}


def place_label(cx_in, cy_in, bw_in, bh_in, side, r_in, header_bottom):
    gap = 0.08
    if side == "R":
        x = cx_in + r_in + gap
        y = cy_in - bh_in / 2
    elif side == "L":
        x = cx_in - r_in - gap - bw_in
        y = cy_in - bh_in / 2
    elif side == "A":
        x = cx_in - bw_in / 2
        y = cy_in - r_in - gap - bh_in
    else:  # B below
        x = cx_in - bw_in / 2
        y = cy_in + r_in + gap
    x = max(0.16, min(x, PAGE_W_IN - bw_in - 0.16))
    y = max(header_bottom + 0.04, min(y, PAGE_H_IN - bh_in - 0.14))
    return x, y


def boxes_overlap(a, b, pad=0.04):
    return a[0] < b[2] + pad and a[2] > b[0] - pad and a[1] < b[3] + pad and a[3] > b[1] - pad


def marker_box(sx, sy, r_in, pad=0.04):
    return [sx - r_in - pad, sy - r_in - pad, sx + r_in + pad, sy + r_in + pad]


def dist_to_marker(rect, sx, sy):
    cx = (rect[0] + rect[2]) / 2
    cy = (rect[1] + rect[3]) / 2
    return math.hypot(cx - sx, cy - sy)


def clamp_rect(rect, header_bottom):
    w = rect[2] - rect[0]
    h = rect[3] - rect[1]
    x = max(0.16, min(rect[0], PAGE_W_IN - w - 0.16))
    y = max(header_bottom + 0.04, min(rect[1], PAGE_H_IN - h - 0.14))
    return [x, y, x + w, y + h]


def rect_ok(rect, idx, made, keepouts, header_bottom, r_in):
    rect = clamp_rect(rect, header_bottom)
    if rect[0] < 0.14 or rect[2] > PAGE_W_IN - 0.14:
        return False
    if rect[1] < header_bottom + 0.02 or rect[3] > PAGE_H_IN - 0.12:
        return False
    # stay close to own marker (beside, not far away)
    if dist_to_marker(rect, made[idx]["sx"], made[idx]["sy"]) > 1.85:
        return False
    for k in keepouts:
        if boxes_overlap(rect, k, pad=0.02):
            return False
    for j, m in enumerate(made):
        if j == idx:
            continue
        if m.get("rect") and boxes_overlap(rect, m["rect"], pad=0.045):
            return False
        if boxes_overlap(rect, marker_box(m["sx"], m["sy"], r_in), pad=0.02):
            return False
    # don't cover own marker
    if boxes_overlap(rect, marker_box(made[idx]["sx"], made[idx]["sy"], r_in), pad=0.01):
        return False
    return True


def resolve_labels(made, header_bottom, r_in, keepouts):
    """Try preferred side, then alternate sides, then small nudges. Keep labels beside markers."""
    order = ["L", "R", "A", "B"]
    for i, m in enumerate(made):
        bw_in, bh_in = m["bw"] / DPI, m["bh"] / DPI
        candidates = []
        if m.get("force_side"):
            sides = [m["force_side"]]
        else:
            sides = [m["side"]] + [s for s in order if s != m["side"]]
        for side in sides:
            x, y = place_label(m["sx"], m["sy"], bw_in, bh_in, side, r_in, header_bottom)
            candidates.append((side, [x, y, x + bw_in, y + bh_in]))
            # small vertical nudges for L/R so stacked neighbors can clear
            if side in ("L", "R"):
                for dy in (-0.10, 0.10, -0.18, 0.18, -0.26, 0.26):
                    yy = y + dy
                    candidates.append((side, [x, yy, x + bw_in, yy + bh_in]))
            if side in ("A", "B"):
                for dx in (-0.20, 0.20, -0.40, 0.40):
                    xx = x + dx
                    candidates.append((side, [xx, y, xx + bw_in, y + bh_in]))

        chosen = None
        for side, rect in candidates:
            rect = clamp_rect(rect, header_bottom)
            if rect_ok(rect, i, made, keepouts, header_bottom, r_in):
                chosen = (side, rect)
                break
        if chosen is None:
            # pick the candidate that least-overlaps and stays closest to the marker
            best, best_score = None, 1e9
            for side, rect in candidates:
                rect = clamp_rect(rect, header_bottom)
                score = dist_to_marker(rect, m["sx"], m["sy"])
                for k in keepouts:
                    if boxes_overlap(rect, k, pad=0.02):
                        score += 3
                for j, other in enumerate(made):
                    if j == i:
                        continue
                    if other.get("rect") and boxes_overlap(rect, other["rect"], pad=0.045):
                        score += 2
                    if boxes_overlap(rect, marker_box(other["sx"], other["sy"], r_in), pad=0.02):
                        score += 2
                if boxes_overlap(rect, marker_box(m["sx"], m["sy"], r_in), pad=0.01):
                    score += 4
                if score < best_score:
                    best_score = score
                    best = (side, rect)
            chosen = best
        m["side"], m["rect"] = chosen


def draw_header_banner(page, fonts):
    """Full-width compact cream banner with title + button. Returns bottom y in inches."""
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    hx, hy, hw, hh = 0.28, 0.10, 7.94, 0.92
    bx, by, bw, bh = px(hx), px(hy), px(hw), px(hh)
    d.rounded_rectangle((bx, by, bx + bw, by + bh), radius=px(0.12),
                        fill=(255, 248, 231, 230), outline=(28, 90, 86, 70), width=2)
    title = "Trail Map"
    tw = d.textlength(title, font=fonts["title"])
    draw_ink(d, (W - tw) / 2, by + px(0.07), title, fonts["title"], TEAL_DEEP)
    btn_w, btn_h = px(4.35), px(0.36)
    btn_x = (W - btn_w) // 2
    btn_y = by + bh - btn_h - px(0.08)
    d.rounded_rectangle((btn_x, btn_y + 3, btn_x + btn_w, btn_y + btn_h + 3),
                        radius=px(0.14), fill=ORANGE_D)
    d.rounded_rectangle((btn_x, btn_y, btn_x + btn_w, btn_y + btn_h),
                        radius=px(0.14), fill=ORANGE)
    lab = "Take the Placement Test"
    lb = ink_bbox(d, lab, fonts["btn"])
    lw, lh = lb[2] - lb[0], lb[3] - lb[1]
    draw_ink(d, btn_x + (btn_w - lw) / 2, btn_y + (btn_h - lh) / 2 - 1, lab, fonts["btn"], WHITE)
    page.alpha_composite(layer)
    return hy + hh


def draw_header_corners(page, fonts):
    """Compact title + button as two chips, to keep a high Zip visible."""
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    title = "Trail Map"
    fnt = fonts["title"]
    tb = ink_bbox(d, title, fnt)
    tw, th = tb[2] - tb[0], tb[3] - tb[1]
    pad_x, pad_y = px(0.16), px(0.05)
    cw, ch = tw + pad_x * 2, th + pad_y * 2
    cx, cy = px(0.28), px(0.10)
    d.rounded_rectangle((cx + 3, cy + 3, cx + cw + 3, cy + ch + 3), radius=px(0.12), fill=(40, 25, 10, 40))
    d.rounded_rectangle((cx, cy, cx + cw, cy + ch), radius=px(0.12),
                        fill=(255, 248, 231, 235), outline=(28, 90, 86, 80), width=2)
    draw_ink(d, cx + pad_x, cy + pad_y, title, fnt, TEAL_DEEP)
    lab = "Take the Placement Test"
    lb = ink_bbox(d, lab, fonts["btn"])
    lw, lh = lb[2] - lb[0], lb[3] - lb[1]
    bw, bh = lw + px(0.22), lh + px(0.10)
    bx = W - px(0.28) - bw
    by = px(0.12)
    d.rounded_rectangle((bx, by + 3, bx + bw, by + bh + 3), radius=px(0.14), fill=ORANGE_D)
    d.rounded_rectangle((bx, by, bx + bw, by + bh), radius=px(0.14), fill=ORANGE)
    draw_ink(d, bx + px(0.11), by + px(0.05) - 1, lab, fonts["btn"], WHITE)
    page.alpha_composite(layer)
    return 0.10 + max(ch / DPI, 0.42) + 0.06


def build_option(n: int) -> Image.Image:
    cfg = OPTIONS[n]
    page = Image.new("RGBA", (W, H), (*CREAM, 255))
    place_background(page, cfg["bg"])
    fonts = {
        "title": font(22, True),
        "btn": font(12, True),
        "kicker": font(8, True),
        "skills": font(9, True),
        "stone": font(11, True),
        "pill": font(9.5, True),
    }
    if cfg["header"] == "banner":
        header_bottom = draw_header_banner(page, fonts)
    else:
        header_bottom = draw_header_corners(page, fonts)

    maker = MAKERS[cfg["style"]]
    stones = [img_to_page(*p) for p in cfg["path"]]
    r_in = 0.185
    keepouts = [keepout_to_page(k) for k in cfg.get("keepouts", [])]

    made = []
    for stage, (sx, sy), side in zip(STAGES, stones, cfg["sides"]):
        card, bw, bh = maker(stage, fonts)
        forced = cfg.get("force_sides", {}).get(stage["n"])
        made.append({
            "stage": stage, "card": card, "bw": bw, "bh": bh,
            "sx": sx, "sy": sy, "side": forced or side,
            "force_side": forced, "rect": None,
        })

    resolve_labels(made, header_bottom, r_in, keepouts)

    # second pass now that all rects exist, to catch later-vs-earlier leftovers
    resolve_labels(made, header_bottom, r_in, keepouts)

    labels = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    for m in made:
        x0, y0, x1, y1 = m["rect"]
        labels.alpha_composite(m["card"], (px(x0), px(y0)))
    page.alpha_composite(labels)

    stone_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(stone_layer)
    for stage, (sx, sy) in zip(STAGES, stones):
        if stage["n"] < HERE:
            state = "done"
        elif stage["n"] == HERE:
            state = "here"
        else:
            state = "later"
        r = px(0.20) if state == "here" else px(r_in)
        draw_marker(sd, px(sx), px(sy), r, stage["color"], stage["n"], fonts["stone"], state)
    page.alpha_composite(stone_layer)

    here_m = next(m for m in made if m["stage"]["n"] == HERE)
    pill, pw, ph = make_here_pill(fonts)
    sx, sy = here_m["sx"], here_m["sy"]
    hx0, hy0, hx1, hy1 = here_m["rect"]
    r_here = 0.20
    pw_in, ph_in = pw / DPI, ph / DPI

    def pill_rect(x, y):
        return [x, y, x + pw_in, y + ph_in]

    def pill_ok(pr):
        if pr[0] < 0.16 or pr[2] > PAGE_W_IN - 0.16:
            return False
        if pr[1] < header_bottom + 0.02 or pr[3] > PAGE_H_IN - 0.14:
            return False
        for m in made:
            if boxes_overlap(pr, m["rect"], pad=0.03):
                return False
            mx, my = m["sx"], m["sy"]
            if (pr[0] < mx + 0.22 and pr[2] > mx - 0.22 and
                    pr[1] < my + 0.22 and pr[3] > my + 0.22):
                return False
        for k in keepouts:
            if boxes_overlap(pr, k, pad=0.02):
                return False
        return True

    candidates = []
    if here_m["side"] == "R":
        candidates.append((sx - r_here - 0.06 - pw_in, sy - ph_in / 2))
    else:
        candidates.append((sx + r_here + 0.06, sy - ph_in / 2))
    candidates.append((sx - pw_in / 2, sy - r_here - 0.06 - ph_in))
    candidates.append((sx - pw_in / 2, sy + r_here + 0.06))
    candidates.append(((hx0 + hx1) / 2 - pw_in / 2, hy0 - ph_in - 0.05))
    if here_m["side"] == "R":
        candidates.append((hx1 + 0.04, hy0))
    else:
        candidates.append((hx0 - 0.04 - pw_in, hy0))
    # extra offsets around the marker
    for dx, dy in ((0.08, -0.28), (-0.08, -0.28), (0.30, 0.0), (-0.30, 0.0), (0.08, 0.22)):
        candidates.append((sx - pw_in / 2 + dx, sy + dy))

    chosen = None
    for c in candidates:
        pr = pill_rect(*c)
        if pill_ok(pr):
            chosen = pr
            break
    if chosen is None:
        chosen = pill_rect(max(0.16, sx - r_here - 0.08 - pw_in), sy - ph_in / 2)
    page.alpha_composite(pill, (px(chosen[0]), px(chosen[1])))

    # debug print
    print(f"Option {n} header_bottom={header_bottom:.2f}")
    for m in made:
        r = m["rect"]
        print(f"  Stage {m['stage']['n']} side={m['side']} marker=({m['sx']:.2f},{m['sy']:.2f}) "
              f"box=({r[0]:.2f},{r[1]:.2f})-({r[2]:.2f},{r[3]:.2f}) "
              f"dist={dist_to_marker(r, m['sx'], m['sy']):.2f}")
    return page.convert("RGB")


def save_pair(img, stem):
    full = OUT_DIR / f"{stem}.png"
    prev = OUT_DIR / f"{stem}_preview.png"
    img.save(full, "PNG", dpi=(DPI, DPI), optimize=True)
    pw = 1020
    ph = int(img.height * pw / img.width)
    img.resize((pw, ph), Image.Resampling.LANCZOS).save(prev, "PNG", optimize=True)
    print("WROTE", full, img.size, full.stat().st_size)


if __name__ == "__main__":
    for n in (1, 2, 3):
        img = build_option(n)
        save_pair(img, f"Island_Readers_Trail_Map_option{n}")

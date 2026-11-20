#!/usr/bin/env python3
"""Build Team 3, 4, and 5 teacher slide decks in the Team 1 layout."""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf"
FONT_R = "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf"
CREAM = (255, 246, 232)
INK = (43, 37, 64)
ORANGE = (242, 140, 0)
TEAL = (20, 140, 140)
W, H = 1600, 900

ART = {
    "o": "foundation/img/letters/o_ollie_octopus.jpg",
    "d": "foundation/img/letters/d_dai_dog.jpg",
    "c": "foundation/img/letters/c_coco_crab.jpg",
    "u": "foundation/img/letters/u_umbrella.jpg",
    "g": "foundation/img/letters/g_gogo_goat.jpg",
    "b": "foundation/img/letters/b_bani_ball.jpg",
    "e": "foundation/img/letters/e_egg.jpg",
    "k": "foundation/img/letters/k_kiko_kite.jpg",
    "h": "foundation/img/letters/h_hana_hat.jpg",
    "r": "foundation/img/letters/r_ruri_robin.jpg",
    "l": "foundation/img/letters/l_lili_lily.jpg",
    "w": "foundation/img/letters/w_wawa_wave.jpg",
}
NAME = {
    "o": "octopus", "d": "dog", "c": "crab", "u": "umbrella",
    "g": "goat", "b": "ball", "e": "egg", "k": "kite",
    "h": "hat", "r": "robin", "l": "lily", "w": "wave",
}

TEAMS = {
    "g3": {
        "n": 3, "title": "Team 3: o d c u", "letters": ["o", "d", "c", "u"],
        "days": [
            ("Day 1", "Meet o and d", [
                ("title", "Day 1", "Meet o and d"),
                ("meet", ["o", "d"]),
                ("buddy", "o"),
                ("sound", "o"),
                ("word", "on"),
                ("line", "Dad sat on the mat."),
            ]),
            ("Day 2", "Read o words", [
                ("title", "Day 2", "Read o words"),
                ("blend", ("o", "n", "on")),
                ("words", ["dot", "pot", "top", "mop"]),
                ("line", "The pot is on top."),
                ("line", "Dad naps."),
                ("heart", "I"),
            ]),
            ("Day 3", "Meet c and u", [
                ("title", "Day 3", "Meet c and u"),
                ("meet", ["c", "u"]),
                ("buddy", "c"),
                ("buddy", "u"),
                ("words", ["cat", "can", "cup", "cut"]),
                ("line", "The cat is in the sun."),
            ]),
            ("Day 4", "Read more words", [
                ("title", "Day 4", "Read more words"),
                ("words", ["mud", "sun", "pup", "mom"]),
                ("line", "A pup is in the mud."),
                ("line", "I sat in the sun."),
                ("blend", ("c", "up", "cup")),
                ("words", ["Tom", "Dad", "sad", "did"]),
            ]),
            ("Day 5", "Story and heart word", [
                ("title", "Day 5", "Story and heart word"),
                ("line", "Dad sat on the mat."),
                ("line", "The cat is on the mat."),
                ("line", "Mom can cut the cod."),
                ("heart", "I"),
                ("celebrate", "Look what I can read."),
            ]),
        ],
    },
    "g4": {
        "n": 4, "title": "Team 4: g b e k", "letters": ["g", "b", "e", "k"],
        "days": [
            ("Day 1", "Meet g and b", [
                ("title", "Day 1", "Meet g and b"),
                ("meet", ["g", "b"]),
                ("buddy", "g"),
                ("sound", "g"),
                ("word", "bag"),
                ("line", "The dog digs."),
            ]),
            ("Day 2", "Meet e and k", [
                ("title", "Day 2", "Meet e and k"),
                ("meet", ["e", "k"]),
                ("buddy", "e"),
                ("buddy", "k"),
                ("words", ["bed", "pet", "kid", "kit"]),
                ("line", "Ken gets a pet."),
            ]),
            ("Day 3", "Read the new words", [
                ("title", "Day 3", "Read the new words"),
                ("words", ["bug", "bus", "bun", "bit"]),
                ("blend", ("b", "ed", "bed")),
                ("line", "The bug is on the bed."),
                ("line", "Ken can get to the bus."),
                ("heart", "to"),
            ]),
            ("Day 4", "Practice", [
                ("title", "Day 4", "Practice"),
                ("words", ["dog", "pig", "dig", "get"]),
                ("line", "Gus is a big dog."),
                ("line", "Get up, Gus!"),
                ("words", ["ten", "pen", "men", "net"]),
                ("line", "Meg and Ken dig."),
            ]),
            ("Day 5", "Story and heart word", [
                ("title", "Day 5", "Story and heart word"),
                ("line", "A big pig is in the mud."),
                ("line", "Ben and Ken get on the bus."),
                ("heart", "to"),
                ("line", "Meg and Ben get ten pens."),
                ("celebrate", "Look what I can read."),
            ]),
        ],
    },
    "g5": {
        "n": 5, "title": "Team 5: h r l w", "letters": ["h", "r", "l", "w"],
        "days": [
            ("Day 1", "Meet h and r", [
                ("title", "Day 1", "Meet h and r"),
                ("meet", ["h", "r"]),
                ("buddy", "h"),
                ("sound", "h"),
                ("word", "hat"),
                ("line", "The red hen hops."),
            ]),
            ("Day 2", "Meet l and w", [
                ("title", "Day 2", "Meet l and w"),
                ("meet", ["l", "w"]),
                ("buddy", "l"),
                ("buddy", "w"),
                ("words", ["log", "lap", "wet", "web"]),
                ("line", "A bug is on a log."),
            ]),
            ("Day 3", "Read h and r words", [
                ("title", "Day 3", "Read h and r words"),
                ("words", ["hen", "hug", "rat", "red"]),
                ("blend", ("h", "at", "hat")),
                ("line", "Run, rat, run!"),
                ("line", "His hat is wet."),
                ("heart", "his"),
            ]),
            ("Day 4", "Practice", [
                ("title", "Day 4", "Practice"),
                ("words", ["hot", "hut", "ran", "rip"]),
                ("line", "A rat ran up the log."),
                ("line", "Ken has a big red rug."),
                ("heart", "has"),
                ("heart", "of"),
            ]),
            ("Day 5", "Story", [
                ("title", "Day 5", "Story"),
                ("line", "The red hen hid in the hut."),
                ("line", "The dog has a red rag."),
                ("line", "Pam ran to the log."),
                ("words", ["win", "wag", "let", "lot"]),
                ("celebrate", "Look what I can read."),
            ]),
        ],
    },
}


def font(size, bold=True):
    return ImageFont.truetype(FONT if bold else FONT_R, size)


def canvas():
    im = Image.new("RGB", (W, H), CREAM)
    d = ImageDraw.Draw(im)
    d.rectangle((0, H - 36, W, H), fill=ORANGE)
    d.rectangle((0, H - 36, 220, H), fill=(232, 96, 70))
    d.rectangle((220, H - 36, 340, H), fill=(80, 170, 150))
    d.text((48, H - 30), "Island Readers", font=font(18), fill=(255, 255, 255))
    return im, d


def pill(d, text, x, y):
    f = font(28)
    box = d.textbbox((0, 0), text, font=f)
    tw, th = box[2] - box[0], box[3] - box[1]
    d.rounded_rectangle((x, y, x + tw + 48, y + th + 22), radius=24, fill=ORANGE)
    d.text((x + 24, y + 8), text, font=f, fill=(255, 255, 255))


def center_text(d, text, y, size, fill=INK, bold=True):
    f = font(size, bold)
    box = d.textbbox((0, 0), text, font=f)
    tw = box[2] - box[0]
    d.text(((W - tw) / 2, y), text, font=f, fill=fill)


def paste_letter(im, letter, cx, cy, size):
    pic = Image.open(os.path.join(ROOT, ART[letter])).convert("RGB")
    pic.thumbnail((size, size))
    x = int(cx - pic.width / 2)
    y = int(cy - pic.height / 2)
    im.paste(pic, (x, y))
    return x, y, pic.width, pic.height


def draw_slide(team, kind, payload):
    im, d = canvas()
    pill(d, "Team " + str(team["n"]), 48, 36)
    if kind == "title":
        day, subtitle = payload
        center_text(d, day, 280, 92)
        center_text(d, subtitle, 420, 48, fill=(90, 80, 70), bold=False)
        center_text(d, team["title"], 540, 36, fill=ORANGE)
    elif kind == "meet":
        letters = payload
        center_text(d, "Meet the letters", 70, 54)
        gap = W / (len(letters) + 1)
        for i, letter in enumerate(letters):
            cx = gap * (i + 1)
            paste_letter(im, letter, cx, 390, 280)
            center_at(d, NAME[letter], cx, 620, 36)
            center_at(d, letter, cx, 680, 42, ORANGE)
    elif kind == "buddy":
        letter = payload
        center_text(d, "Sound buddy", 60, 48)
        paste_letter(im, letter, 480, 460, 520)
        d.text((860, 280), letter, font=font(140), fill=INK)
        d.text((860, 460), NAME[letter], font=font(54), fill=ORANGE)
        d.text((860, 560), "Say the sound.", font=font(36, False), fill=INK)
    elif kind == "sound":
        letter = payload
        center_text(d, "Pure sound", 80, 42, fill=TEAL)
        center_text(d, letter, 240, 220)
        center_text(d, "Say the sound. The recording is coming soon.", 620, 36, bold=False)
    elif kind == "word":
        word = payload
        center_text(d, "Read the word", 80, 42)
        center_text(d, word, 340, 140)
    elif kind == "words":
        center_text(d, "Read", 70, 48)
        words = payload
        gap = W / (len(words) + 1)
        for i, word in enumerate(words):
            center_at(d, word, gap * (i + 1), 420, 64)
    elif kind == "blend":
        a, b, word = payload
        center_text(d, "Blend it", 90, 48)
        center_text(d, a + "  +  " + b + "  =  " + word, 380, 84)
    elif kind == "line":
        center_text(d, "Read the line", 120, 42, fill=TEAL)
        center_text(d, payload, 380, 64)
    elif kind == "heart":
        center_text(d, "Heart word", 90, 48, fill=(196, 40, 50))
        center_text(d, payload, 300, 140)
        center_text(d, "♥", 520, 120, fill=(214, 40, 50))
        center_text(d, "Learn it by heart.", 680, 36, bold=False)
    elif kind == "celebrate":
        center_text(d, payload, 340, 64)
        center_text(d, "You did it.", 460, 42, fill=ORANGE)
    return im


def center_at(d, text, cx, y, size, fill=INK):
    f = font(size)
    box = d.textbbox((0, 0), text, font=f)
    tw = box[2] - box[0]
    d.text((cx - tw / 2, y), text, font=f, fill=fill)


def build(team_id, team):
    out = os.path.join(ROOT, "materials", "team" + str(team["n"]), "slides")
    os.makedirs(out, exist_ok=True)
    n = 0
    days = []
    start = 1
    for label, _sub, slides in team["days"]:
        day_start = n + 1
        for spec in slides:
            kind = spec[0]
            payload = spec[1] if len(spec) == 2 else spec[1:]
            n += 1
            im = draw_slide(team, kind, payload)
            im.save(os.path.join(out, "slide-%03d.jpg" % n), quality=90)
        days.append({"day": len(days) + 1, "label": label, "start": day_start, "end": n, "page": day_start})
    import json
    manifest = {"title": team["title"], "count": n, "days": days}
    json.dump(manifest, open(os.path.join(out, "manifest.json"), "w"), indent=2)
    print(team_id, n, "slides", [(d["label"], d["page"]) for d in days])
    # together card
    card = Image.new("RGB", (1200, 700), CREAM)
    gap = 1200 / 5
    for i, letter in enumerate(team["letters"]):
        paste_letter(card, letter, gap * (i + 1), 340, 240)
    card.save(os.path.join(ROOT, "foundation/img/letters", "team%d_together.jpg" % team["n"]), quality=90)
    # one-page quick sounds sheet
    sheet, sd = canvas()
    # canvas is 1600x900; reuse
    pill(sd, team["title"], 48, 48)
    sd.text((48, 140), "Quick sounds", font=font(54), fill=INK)
    x = 80
    for letter in team["letters"]:
        paste_letter(sheet, letter, x + 120, 420, 220)
        center_at(sd, letter + "  " + NAME[letter], x + 120, 620, 28)
        x += 360
    pdf = os.path.join(ROOT, "foundation/printables", "Team%d_Quick_Sounds.pdf" % team["n"])
    os.makedirs(os.path.dirname(pdf), exist_ok=True)
    sheet.save(pdf, "PDF", resolution=100)
    print("pdf", pdf)


if __name__ == "__main__":
    for key, team in TEAMS.items():
        build(key, team)

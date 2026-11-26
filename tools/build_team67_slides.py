#!/usr/bin/env python3
"""Five-day Foundations decks for Team 6 (j y x q) and Team 7 (v z).

Same pacing as the unified Team 1-5 decks: mouth intro, alliteration,
a Write It page, sound fluency, a few words, a sentence with no picture
then with a picture. Day 2 reviews, then a small new set, families,
contrasts, plural -s, and a full mix. Day 3 is big and little partners.
Day 5 is review and a team check. No Sound Jumps pages.
"""
import json
import os
from io import BytesIO

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LETTERS = os.path.join(ROOT, "foundation/img/letters")
STORY = os.path.join(ROOT, "foundation/img/story")
OBJ = os.path.join(ROOT, "foundation/img/objects")
MOUTH = os.path.join(ROOT, "foundation/img/mouths")
W, H = 1600, 900
CREAM = (255, 246, 232)
INK = (43, 37, 64)
MUTED = (90, 74, 58)
ORANGE = (242, 140, 0)
ORANGE_D = (201, 90, 16)
TEAL = (14, 124, 124)
WHITE = (255, 255, 255)


def hookless(src_name, dest):
    font = TTFont(os.path.join(ROOT, "fonts", src_name))
    gsub = font["GSUB"].table
    target = None
    for feat in gsub.FeatureList.FeatureRecord:
        if feat.FeatureTag == "cv56":
            for li in feat.Feature.LookupListIndex:
                for sub in gsub.LookupList.Lookup[li].SubTable:
                    target = sub.mapping.get("t")
    if target:
        font["glyf"]["t"] = font["glyf"][target]
        font["hmtx"]["t"] = font["hmtx"][target]
    font.save(dest)
    return dest


REG = hookless("Andika-Regular.woff2", "/tmp/andika-notail-reg.ttf")
BOLD = hookless("Andika-Bold.woff2", "/tmp/andika-notail-bold.ttf")


def font(size, bold=False):
    return ImageFont.truetype(BOLD if bold else REG, size)


def text_width(draw, text, f):
    box = draw.textbbox((0, 0), text, font=f)
    return box[2] - box[0]


def canvas():
    im = Image.new("RGB", (W, H), CREAM)
    d = ImageDraw.Draw(im)
    d.rectangle((0, H - 64, W, H), fill=ORANGE)
    d.rectangle((0, H - 64, 280, H), fill=(232, 120, 40))
    d.text((28, H - 48), "Island Readers", font=font(26, True), fill=WHITE)
    return im, d


def pill(d, text, x, y, fill=ORANGE):
    f = font(26, True)
    tw = text_width(d, text, f)
    d.rounded_rectangle((x, y, x + tw + 36, y + 48), radius=24, fill=fill)
    d.text((x + 18, y + 8), text, font=f, fill=WHITE)


def day_label(d, text):
    f = font(26, True)
    tw = text_width(d, text, f)
    d.text((W - 48 - tw, 36), text, font=f, fill=MUTED)


def heading(d, text, y=118, size=56):
    d.text((64, y), text, font=font(size, True), fill=INK)


def wrap(draw, text, f, max_w):
    lines, cur = [], ""
    for word in text.split():
        trial = (cur + " " + word).strip()
        if text_width(draw, trial, f) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def rounded_paste(im, path, box, bg=WHITE):
    x, y, w, h = box
    frame = Image.new("RGB", (w, h), bg)
    try:
        pic = Image.open(path).convert("RGB")
    except OSError:
        pic = Image.new("RGB", (w, h), (255, 230, 200))
    pic.thumbnail((w - 24, h - 24))
    frame.paste(pic, ((w - pic.width) // 2, (h - pic.height) // 2))
    mask = Image.new("L", (w, h), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle((0, 0, w - 1, h - 1), radius=28, fill=255)
    im.paste(frame, (x, y), mask)
    ImageDraw.Draw(im).rounded_rectangle((x, y, x + w, y + h), radius=28, outline=(230, 214, 180), width=4)


def row_cards(d, items, y, h, fill=INK):
    gap = (W - 80) / max(1, len(items))
    size = 72 if len(items) > 6 else 88
    if len(items) > 8:
        size = 56
    f = font(size, True)
    for i, word in enumerate(items):
        x = 40 + i * gap
        d.rounded_rectangle((x, y, x + gap - 16, y + h), radius=28, fill=WHITE, outline=(230, 214, 180), width=4)
        tw = text_width(d, word, f)
        d.text((x + (gap - 16 - tw) / 2, y + h / 2 - size * 0.65), word, font=f, fill=fill)


def same_object(path):
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()
    corners = [px[4, 4], px[w - 5, 4], px[4, h - 5], px[w - 5, h - 5]]
    bg = tuple(sum(c[i] for c in corners) // 4 for i in range(3))
    mask = Image.new("L", (w, h), 0)
    mp = mask.load()
    for yy in range(h):
        for xx in range(w):
            r, g, b, a = px[xx, yy]
            dist = abs(r - bg[0]) + abs(g - bg[1]) + abs(b - bg[2])
            if dist > 18:
                mp[xx, yy] = min(255, (dist - 18) * 8)
    mask = mask.filter(ImageFilter.GaussianBlur(1.2))
    im.putalpha(mask)
    box = mask.point(lambda v: 255 if v > 16 else 0).getbbox() or (0, 0, w, h)
    pad = 8
    box = (max(0, box[0] - pad), max(0, box[1] - pad), min(w, box[2] + pad), min(h, box[3] + pad))
    return im.crop(box), bg


def copies_of(path, count, size):
    sprite, bg = same_object(path)
    board = Image.new("RGB", size, bg)
    sw, sh = sprite.size
    max_h = int(size[1] * 0.78)
    max_w = int(size[0] * 0.88 / count)
    scale = min(max_h / sh, max_w / sw)
    nw, nh = max(1, int(sw * scale)), max(1, int(sh * scale))
    sprite = sprite.resize((nw, nh), Image.Resampling.LANCZOS)
    gap = max(8, int(nw * 0.08))
    total = count * nw + (count - 1) * gap
    x = (size[0] - total) // 2
    y = (size[1] - nh) // 2
    for i in range(count):
        board.paste(sprite, (x + i * (nw + gap), y), sprite)
    return board


def save_slide(im, team, n):
    folder = os.path.join(ROOT, "materials", team, "slides")
    os.makedirs(folder, exist_ok=True)
    im.save(os.path.join(folder, "slide-%03d.jpg" % n), quality=88)


def draw(spec, team_id):
    kind = spec["kind"]
    day = spec.get("day", "")
    im, d = canvas()
    if kind == "title":
        pill(d, spec["kicker"], 48, 36)
        heading(d, spec["title"], 150, 64)
        d.text((64, 250), spec["sub"], font=font(36), fill=MUTED)
        letters = spec["letters"]
        gap = (W - 120) / len(letters)
        for i, (letter, art) in enumerate(letters):
            x = 60 + i * gap
            rounded_paste(im, art, (int(x), 340, int(gap - 24), 420))
    elif kind == "plan":
        pill(d, day, 48, 28)
        day_label(d, day)
        heading(d, spec["title"], 110, 52)
        for i, (num, head, sub) in enumerate(spec["steps"]):
            x = 64 + (i % 2) * 760
            y = 230 + (i // 2) * 250
            d.rounded_rectangle((x, y, x + 720, y + 220), radius=28, fill=WHITE, outline=(230, 214, 180), width=4)
            d.ellipse((x + 24, y + 36, x + 100, y + 112), fill=ORANGE)
            d.text((x + 48, y + 50), num, font=font(36, True), fill=WHITE)
            d.text((x + 124, y + 48), head, font=font(32, True), fill=INK)
            d.text((x + 124, y + 120), sub, font=font(26), fill=MUTED)
    elif kind == "meet":
        pill(d, "New sound", 48, 28)
        day_label(d, day)
        heading(d, "Meet " + spec["letter"], 110, 52)
        rounded_paste(im, spec["art"], (48, 210, 460, 560))
        rounded_paste(im, spec["mouth"], (1080, 210, 460, 560))
        d.text((560, 230), spec["letter"], font=font(120, True), fill=INK)
        d.text((560, 520), spec["keyword"], font=font(40, True), fill=MUTED)
        d.text((560, 590), spec["cue"], font=font(30), fill=TEAL)
        d.text((560, 660), "Say it 3 times.", font=font(28), fill=MUTED)
    elif kind == "allit":
        pill(d, "Silly sound", 48, 28)
        day_label(d, day)
        rounded_paste(im, spec["image"], (48, 140, 780, 680))
        d.text((880, 180), spec["letter"], font=font(120, True), fill=ORANGE)
        y = 360
        for line in wrap(d, spec["sentence"], font(36, True), 620):
            d.text((880, y), line, font=font(36, True), fill=INK)
            y += 52
        d.text((880, y + 20), "Say it fast 3 times.", font=font(26), fill=MUTED)
    elif kind == "write":
        pill(d, "Write it", 48, 28)
        day_label(d, day)
        heading(d, "Write " + spec["letter"], 140, 56)
        d.text((64, 250), "Watch the pencil. Top line, middle line, bottom line.", font=font(32), fill=MUTED)
        d.text((64, 340), spec["letter"], font=font(200, True), fill=INK)
    elif kind == "sounds":
        pill(d, "Sound fluency", 48, 28, TEAL)
        day_label(d, day)
        heading(d, spec["title"], 110, 48)
        d.text((64, 200), spec["note"], font=font(28), fill=MUTED)
        row_cards(d, spec["items"], 280, 420)
    elif kind == "words":
        pill(d, spec.get("kicker", "A few words"), 48, 28)
        day_label(d, day)
        heading(d, spec["title"], 110, 48)
        d.text((64, 200), spec["note"], font=font(28), fill=MUTED)
        row_cards(d, spec["items"], 280, 420)
    elif kind == "sentence":
        pill(d, "Read it", 48, 28)
        day_label(d, day)
        heading(d, spec["caption"], 110, 44)
        if spec.get("image"):
            rounded_paste(im, spec["image"], (64, 220, 700, 560))
            lines = wrap(d, spec["text"], font(54, True), 700)
            y = 400
            for line in lines:
                d.text((820, y), line, font=font(54, True), fill=INK)
                y += 70
        else:
            tw = text_width(d, spec["text"], font(72, True))
            d.text(((W - tw) / 2, 380), spec["text"], font=font(72, True), fill=INK)
            d.text((64, 720), "No picture yet. Read it first.", font=font(28), fill=MUTED)
    elif kind == "review":
        pill(d, "Quick review", 48, 28, TEAL)
        day_label(d, day)
        heading(d, "Quick review", 110, 52)
        d.text((64, 190), "Sounds we know. Then a few words.", font=font(28), fill=MUTED)
        row_cards(d, spec["sounds"], 250, 240)
        d.text((64, 560), "Words:  " + "   ".join(spec["words"]), font=font(36, True), fill=INK)
    elif kind == "families":
        pill(d, "Word families", 48, 28)
        day_label(d, day)
        heading(d, "Same ending. New start.", 110, 46)
        y = 210
        for label, words_ in spec["groups"]:
            d.text((64, y), label, font=font(30, True), fill=ORANGE_D)
            x = 240
            for word in words_:
                d.rounded_rectangle((x, y - 8, x + 240, y + 78), radius=18, fill=WHITE, outline=(230, 214, 180), width=3)
                f = font(36, True)
                tw = text_width(d, word, f)
                d.text((x + (240 - tw) / 2, y + 14), word, font=f, fill=INK)
                x += 260
            y += 130
    elif kind == "contrast":
        pill(d, "Look and say", 48, 28, TEAL)
        day_label(d, day)
        heading(d, spec["left"] + "  or  " + spec["right"], 110, 48)
        d.rounded_rectangle((160, 210, 620, 500), radius=28, fill=WHITE, outline=(230, 214, 180), width=4)
        d.rounded_rectangle((980, 210, 1440, 500), radius=28, fill=WHITE, outline=(230, 214, 180), width=4)
        for x, letter in ((160, spec["left"]), (980, spec["right"])):
            f = font(110, True)
            tw = text_width(d, letter, f)
            d.text((x + (460 - tw) / 2, 280), letter, font=f, fill=INK)
        d.text((700, 330), "then", font=font(28, True), fill=MUTED)
        row_cards(d, spec["row"], 540, 220)
    elif kind == "plural":
        one = copies_of(spec["sprite"], 1, (900, 700))
        many = copies_of(spec["sprite"], 3, (900, 700))
        one_path = os.path.join(STORY, "single-" + spec["left"] + ".jpg")
        many_path = os.path.join(STORY, "three-" + spec["left"] + ".jpg")
        one.save(one_path, quality=90)
        many.save(many_path, quality=90)
        pill(d, "Add -s", 48, 28)
        day_label(d, day)
        heading(d, "One, then more", 110, 48)
        d.text((64, 190), "Watch the ending. " + spec["left"] + " becomes " + spec["right"] + ".", font=font(28), fill=MUTED)
        rounded_paste(im, one_path, (70, 250, 640, 430))
        rounded_paste(im, many_path, (890, 250, 640, 430))
        f = font(52, True)
        for x, word, fill in ((70, spec["left"], INK), (890, spec["right"], ORANGE_D)):
            tw = text_width(d, word, f)
            d.text((x + (640 - tw) / 2, 710), word, font=f, fill=fill)
    elif kind == "capitals":
        pill(d, "Big and little", 48, 28)
        day_label(d, day)
        heading(d, "Big and little partners", 110, 48)
        d.text((64, 190), "Same letter. Same sound. Just this team.", font=font(28), fill=MUTED)
        letters = spec["letters"]
        gap = (W - 80) / len(letters)
        for i, letter in enumerate(letters):
            x = 40 + i * gap
            d.rounded_rectangle((x, 260, x + gap - 20, 720), radius=28, fill=WHITE, outline=(230, 214, 180), width=4)
            big = letter.upper()
            little = letter
            fb = font(120, True)
            fs = font(90, True)
            d.text((x + (gap - 20 - text_width(d, big, fb)) / 2, 300), big, font=fb, fill=INK)
            d.text((x + (gap - 20 - text_width(d, little, fs)) / 2, 500), little, font=fs, fill=ORANGE_D)
    elif kind == "check":
        pill(d, "Team check", 48, 28, TEAL)
        day_label(d, day)
        heading(d, spec["title"], 110, 48)
        d.text((64, 200), spec["note"], font=font(28), fill=MUTED)
        row_cards(d, spec["items"], 300, 380)
    elif kind == "celebrate":
        pill(d, "You did it", 48, 28)
        day_label(d, day)
        heading(d, "Look what I can read!", 160, 56)
        y = 300
        for line in spec["lines"]:
            f = font(48, True)
            tw = text_width(d, line, f)
            d.text(((W - tw) / 2, y), line, font=f, fill=INK)
            y += 80
    elif kind == "note":
        pill(d, spec.get("kicker", day), 48, 28)
        day_label(d, day)
        heading(d, spec["title"], 180, 52)
        y = 320
        for line in spec["lines"]:
            d.text((64, y), line, font=font(32), fill=MUTED)
            y += 56
    return im


def art(name):
    return os.path.join(LETTERS, name)


def build(team_id, title, letters, slides, days):
    folder = os.path.join(ROOT, "materials", team_id, "slides")
    os.makedirs(folder, exist_ok=True)
    write_pages = {}
    for n, spec in enumerate(slides, start=1):
        im = draw(spec, team_id)
        save_slide(im, team_id, n)
        if spec["kind"] == "write":
            write_pages[n] = spec["letter"]
    manifest = {
        "title": title,
        "count": len(slides),
        "days": [{"day": i + 1, "start": start, "end": end} for i, (start, end) in enumerate(days)],
        "slides": ["slide-%03d.jpg" % (n + 1) for n in range(len(slides))],
        "writePages": write_pages,
    }
    with open(os.path.join(folder, "manifest.json"), "w") as fh:
        json.dump(manifest, fh, indent=2)
        fh.write("\n")
    # together card for the lesson
    card = Image.new("RGB", (1200, 800), CREAM)
    gap = 1200 / (len(letters) + 0.4)
    for i, (letter, path) in enumerate(letters):
        rounded_paste(card, path, (int(40 + i * gap), 80, int(gap - 30), 640))
    card.save(os.path.join(LETTERS, team_id + "_together.jpg"), quality=90)
    # one-page quick sounds sheet
    sheet, sd = canvas()
    pill(sd, title, 48, 36)
    sd.text((64, 140), "Quick sounds", font=font(48, True), fill=INK)
    gap = (W - 80) / len(letters)
    for i, (letter, path) in enumerate(letters):
        x = 40 + i * gap
        rounded_paste(sheet, path, (int(x), 240, int(gap - 24), 420))
        f = font(42, True)
        label = letter
        sd.text((x + (gap - 24 - text_width(sd, label, f)) / 2, 690), label, font=f, fill=INK)
    pdf = os.path.join(ROOT, "foundation/printables", title.split(":")[0].replace(" ", "") + "_Quick_Sounds.pdf")
    # Team 6 / Team 7 names
    n = 6 if team_id == "team6" else 7
    pdf = os.path.join(ROOT, "foundation/printables", "Team%d_Quick_Sounds.pdf" % n)
    sheet.save(pdf, "PDF", resolution=110)
    print(team_id, "slides", len(slides), "days", days, "write", write_pages, "pdf", pdf)


def team6():
    L = LETTERS
    j = art("j_jojo_jellyfish.jpg")
    y = art("y_yumi_purple_yam.jpg")
    x = art("x_box.jpg")
    q = art("q_quinn_quail.jpg")
    fox = os.path.join(OBJ, "fox.jpg")
    jam_box = os.path.join(STORY, "jam-in-box.jpg")
    jam = os.path.join(OBJ, "jam.jpg")
    yam = y
    jet = os.path.join(OBJ, "jet.jpg")
    slides = []

    def add(day, kind, **kw):
        kw["kind"] = kind
        kw["day"] = day
        slides.append(kw)

    add("Day 1", "title", kicker="Team 6", title="Team 6: j y x q", sub="New sounds. Slow and silly.", letters=[("j", j), ("y", y), ("x", x), ("q", q)])
    add("Day 1", "note", kicker="This week", title="Four new sounds", lines=["j as in jam.", "y as in yam.", "x at the end, /ks/ as in box.", "q with u, /kw/ as in quail."])
    add("Day 1", "sounds", title="Sounds this week", note="Point and say.", items=["j", "y", "x", "q"])
    add("Day 1", "plan", title="How the week goes", steps=[("1", "Meet each sound", "mouth, silly line, write"), ("2", "Read a few words", "jam  yam  box  fox"), ("3", "Word families", "then a full mix"), ("4", "Team check", "on day 5")])
    add("Day 1", "plan", title="Today is a slow, silly day", steps=[("1", "Meet each sound", "j  y  x  q"), ("2", "Say just these sounds", "then mix in sounds we know"), ("3", "Blend a few words", "jam  yam  box  fox"), ("4", "Read two sentences", "plain, then with a picture")])
    add("Day 1", "meet", letter="j", art=j, mouth=os.path.join(MOUTH, "mouth_j.jpg"), keyword="jam", cue="/j/ as in jam")
    add("Day 1", "allit", letter="j", image=os.path.join(STORY, "allit-j-jam.jpg"), sentence="jellyfish jiggle in the jam!")
    add("Day 1", "write", letter="j")
    add("Day 1", "meet", letter="y", art=y, mouth=os.path.join(MOUTH, "mouth_y.jpg"), keyword="yam", cue="/y/ as in yam")
    add("Day 1", "allit", letter="y", image=os.path.join(STORY, "allit-y-yams.jpg"), sentence="yaks yank yummy yams!")
    add("Day 1", "write", letter="y")
    add("Day 1", "meet", letter="x", art=x, mouth=os.path.join(MOUTH, "mouth_x.jpg"), keyword="box", cue="/ks/ at the end of box")
    add("Day 1", "allit", letter="x", image=os.path.join(STORY, "allit-x-fox.jpg"), sentence="a fox packs six boxes!")
    add("Day 1", "write", letter="x")
    add("Day 1", "meet", letter="q", art=q, mouth=os.path.join(MOUTH, "mouth_q.jpg"), keyword="quail", cue="qu says /kw/")
    add("Day 1", "allit", letter="q", image=os.path.join(STORY, "allit-q-quail.jpg"), sentence="a quail quits the quilt!")
    add("Day 1", "write", letter="q")
    add("Day 1", "sounds", title="Just these sounds", note="Point and say. Only this team.", items=["j", "y", "x", "q"])
    add("Day 1", "sounds", title="Say them in a mix", note="Still only this team.", items=["x", "j", "q", "y", "j", "x", "y", "q"])
    add("Day 1", "sounds", title="Sounds we know", note="From the teams before.", items=["a", "e", "i", "o", "m", "s", "t", "p"])
    add("Day 1", "sounds", title="Mix the sounds", note="Point and say each sound.", items=["j", "a", "y", "i", "x", "o", "q", "e"])
    add("Day 1", "words", title="A few words", note="Blend it. No extra ending.", items=["jam", "yam", "box", "fox"])
    add("Day 1", "sentence", text="a fox sat.", image=None, caption="Read it. No picture.")
    add("Day 1", "sentence", text="jam in a box.", image=None, caption="Read it. No picture.")
    add("Day 1", "sentence", text="a fox sat.", image=fox, caption="Now see it.")
    add("Day 1", "sentence", text="jam in a box.", image=jam_box, caption="Now see it.")
    add("Day 1", "sounds", title="One more mix", note="Fast and fun. Sounds only.", items=["q", "y", "j", "x", "y", "q", "x", "j"])
    add("Day 1", "note", kicker="Day 1", title="You met j y x q", lines=["jam, yam, box, fox.", "a fox sat.", "jam in a box."])

    add("Day 2", "review", sounds=["j", "y", "x", "q", "a", "i", "o", "e"], words=["jam", "yam", "fox", "sat"])
    add("Day 2", "words", kicker="New words", title="New words", note="A small new group.", items=["jet", "jug", "six", "quit"])
    add("Day 2", "words", kicker="Mixed review", title="Only these words", note="Mix just this little group.", items=["jet", "jug", "six", "quit", "jug", "jet", "quit", "six"])
    add("Day 2", "families", groups=[("-am", ["jam", "yam", "ham", "sam"]), ("-et", ["jet", "pet", "wet", "yet"])])
    add("Day 2", "families", groups=[("-ox", ["box", "fox"])])
    add("Day 2", "families", groups=[("-ix", ["six", "mix", "fix"])])
    add("Day 2", "families", groups=[("-it", ["quit", "sit", "pit", "fit"])])
    add("Day 2", "contrast", left="j", right="g", row=["j", "g", "j", "g", "g", "j"])
    add("Day 2", "contrast", left="w", right="y", row=["w", "y", "w", "y", "y", "w"])
    add("Day 2", "contrast", left="x", right="ks", row=["box", "fox", "six", "mix"])
    add("Day 2", "contrast", left="i", right="e", row=["i", "e", "i", "e", "e", "i"])
    add("Day 2", "plural", left="jam", right="jams", sprite=jam)
    add("Day 2", "plural", left="yam", right="yams", sprite=yam)
    add("Day 2", "plural", left="jet", right="jets", sprite=jet)
    add("Day 2", "words", kicker="Full mix", title="All the words", note="Now mix endings and earlier words.", items=["jam", "jet", "yam", "box", "fox", "six", "jug", "sat"])
    add("Day 2", "words", kicker="Full mix", title="Read them again", note="Point and read.", items=["quit", "fix", "wet", "ham", "box", "pet", "yam", "mix"])
    add("Day 2", "sentence", text="a fox can fix a box.", image=fox, caption="Read it.")
    add("Day 2", "note", kicker="Day 2", title="Day 2 is done", lines=["New words, families, and a full mix.", "j or g. w or y. x or ks. i or e."])

    add("Day 3", "plan", title="Today we will", steps=[("1", "Quick review", "sounds and words"), ("2", "Big and little", "j y x q"), ("3", "Read more words", "jam to quit"), ("4", "A sentence", "sam can fix a jet")])
    add("Day 3", "capitals", letters=["j", "y", "x", "q"])
    add("Day 3", "words", kicker="Partners", title="Match the partners", note="Big letter, little letter. Same sound.", items=["J j", "Y y", "X x", "Q q"])
    add("Day 3", "words", kicker="Read", title="Read the words", note="Still only letters we know.", items=["jam", "yam", "box", "fox"])
    add("Day 3", "words", kicker="Read", title="Read more", note="Point and read.", items=["jet", "jug", "six", "quit"])
    add("Day 3", "sentence", text="sam can fix a jet.", image=None, caption="Read it. No picture.")
    add("Day 3", "sentence", text="sam can fix a jet.", image=jet, caption="Now see it.")
    add("Day 3", "sounds", title="Mix the sounds", note="This team and sounds we know.", items=["j", "g", "y", "w", "x", "k", "q", "p"])
    add("Day 3", "note", kicker="Day 3", title="Partners for this team", lines=["J j, Y y, X x, Q q.", "Same letter. Same sound."])

    add("Day 4", "plan", title="Read a little more", steps=[("1", "Families again", "am, et, ox, ix"), ("2", "A full mix", "old words and new"), ("3", "A sentence", "a yam sat in a box"), ("4", "Look and say", "j g, w y, i e")])
    add("Day 4", "families", groups=[("-am", ["jam", "yam", "ham", "sam"]), ("-ix", ["six", "fix", "mix"])])
    add("Day 4", "words", kicker="Full mix", title="All the words", note="Teams 1 to 6.", items=["sat", "pet", "jam", "fox", "quit", "log", "box", "wet"])
    add("Day 4", "sentence", text="a yam sat in a box.", image=None, caption="Read it. No picture.")
    add("Day 4", "sentence", text="a yam sat in a box.", image=jam_box, caption="Now see it.")
    add("Day 4", "contrast", left="j", right="g", row=["j", "g", "j", "j", "g", "j"])
    add("Day 4", "contrast", left="i", right="e", row=["i", "e", "i", "i", "e", "i"])
    add("Day 4", "words", kicker="Full mix", title="Read them again", note="Point and read.", items=["jam", "six", "quit", "fox", "jet", "yam", "box", "fix"])
    add("Day 4", "note", kicker="Day 4", title="Day 4 is done", lines=["Families, a sentence, and a full mix."])

    add("Day 5", "plan", title="Review and team check", steps=[("1", "Sounds", "j y x q"), ("2", "Words", "jam to quit"), ("3", "The story", "a fox sat"), ("4", "Team check", "show what you know")])
    add("Day 5", "sounds", title="Quick sound review", note="Only this team.", items=["j", "y", "x", "q", "x", "j", "q", "y"])
    add("Day 5", "words", kicker="Review", title="Quick word review", note="Read each one.", items=["jam", "yam", "box", "fox", "jet", "six", "quit", "jug"])
    add("Day 5", "sentence", text="a fox sat. jam in a box.", image=None, caption="Read the story.")
    add("Day 5", "sentence", text="a fox sat. jam in a box.", image=fox, caption="Now see it.")
    add("Day 5", "check", title="Which sound?", note="Team check. Say the sound.", items=["j", "y", "x", "q"])
    add("Day 5", "check", title="Which word?", note="Team check. Read the word.", items=["jam", "fox", "box", "quit"])
    add("Day 5", "celebrate", lines=["jam   yam   box   fox", "jet   six   quit"])
    add("Day 5", "note", kicker="Day 5", title="Team 6 is done", lines=["j y x q.", "Look what I can read!"])

    days = []
    start = 1
    current = slides[0]["day"]
    for i, spec in enumerate(slides, start=1):
        if spec["day"] != current:
            days.append((start, i - 1))
            start = i
            current = spec["day"]
    days.append((start, len(slides)))
    build("team6", "Team 6: j y x q", [("j", j), ("y", y), ("x", x), ("q", q)], slides, days)


def team7():
    v = art("v_vida_vine.jpg")
    z = art("z_zuzu_zigzag_cloud.jpg")
    vet = os.path.join(STORY, "vet-sat.jpg")
    van = os.path.join(STORY, "zip-van.jpg")
    slides = []

    def add(day, kind, **kw):
        kw["kind"] = kind
        kw["day"] = day
        slides.append(kw)

    add("Day 1", "title", kicker="Team 7", title="Team 7: v z", sub="Two new sounds. Slow and silly.", letters=[("v", v), ("z", z)])
    add("Day 1", "note", kicker="This week", title="Two new sounds", lines=["v as in van.", "z as in zip."])
    add("Day 1", "sounds", title="Sounds this week", note="Point and say.", items=["v", "z"])
    add("Day 1", "plan", title="How the week goes", steps=[("1", "Meet each sound", "mouth, silly line, write"), ("2", "Read a few words", "van  zip  vet  zap"), ("3", "Word families", "then a full mix"), ("4", "Team check", "on day 5")])
    add("Day 1", "plan", title="Today is a slow, silly day", steps=[("1", "Meet each sound", "v  z"), ("2", "Say just these sounds", "then mix in sounds we know"), ("3", "Blend a few words", "van  zip  vet  zap"), ("4", "Read two sentences", "plain, then with a picture")])
    add("Day 1", "meet", letter="v", art=v, mouth=os.path.join(MOUTH, "mouth_v.jpg"), keyword="van", cue="/v/ as in van")
    add("Day 1", "allit", letter="v", image=os.path.join(STORY, "allit-v-van.jpg"), sentence="vines cover a van at the vet!")
    add("Day 1", "write", letter="v")
    add("Day 1", "meet", letter="z", art=z, mouth=os.path.join(MOUTH, "mouth_z.jpg"), keyword="zip", cue="/z/ as in zip")
    add("Day 1", "allit", letter="z", image=os.path.join(STORY, "allit-z-zigzag.jpg"), sentence="a bee zips and zaps in a zigzag!")
    add("Day 1", "write", letter="z")
    add("Day 1", "sounds", title="Just these sounds", note="Point and say. Only this team.", items=["v", "z", "v", "z"])
    add("Day 1", "sounds", title="Say them in a mix", note="Still only this team.", items=["z", "v", "v", "z", "v", "z"])
    add("Day 1", "sounds", title="Sounds we know", note="From the teams before.", items=["a", "i", "o", "e", "j", "y", "s", "f"])
    add("Day 1", "sounds", title="Mix the sounds", note="Point and say each sound.", items=["v", "f", "z", "s", "v", "a", "z", "i"])
    add("Day 1", "words", title="A few words", note="Blend it. No extra ending.", items=["van", "zip", "vet", "zap"])
    add("Day 1", "sentence", text="a vet sat.", image=None, caption="Read it. No picture.")
    add("Day 1", "sentence", text="zip sat in a van.", image=None, caption="Read it. No picture.")
    add("Day 1", "sentence", text="a vet sat.", image=vet, caption="Now see it.")
    add("Day 1", "sentence", text="zip sat in a van.", image=van, caption="Now see it.")
    add("Day 1", "sounds", title="One more mix", note="Fast and fun. Sounds only.", items=["v", "z", "z", "v", "v", "z"])
    add("Day 1", "note", kicker="Day 1", title="You met v and z", lines=["van, zip, vet, zap.", "a vet sat.", "zip sat in a van."])

    add("Day 2", "review", sounds=["v", "z", "a", "i", "f", "s"], words=["van", "zip", "jam", "fox"])
    add("Day 2", "words", kicker="New words", title="New words", note="A small new group.", items=["vet", "zap", "van"])
    add("Day 2", "words", kicker="Mixed review", title="Only these words", note="Mix just this little group.", items=["vet", "zap", "van", "zap", "vet", "van"])
    add("Day 2", "families", groups=[("-an", ["van", "man", "can", "pan"]), ("-ip", ["zip", "sip", "tip", "rip"])])
    add("Day 2", "families", groups=[("-ap", ["zap", "map", "nap", "tap"])])
    add("Day 2", "families", groups=[("-et", ["vet", "pet", "jet", "wet"])])
    add("Day 2", "contrast", left="v", right="f", row=["v", "f", "v", "f", "f", "v"])
    add("Day 2", "contrast", left="z", right="s", row=["z", "s", "z", "s", "s", "z"])
    add("Day 2", "contrast", left="i", right="e", row=["i", "e", "i", "e", "e", "i"])
    add("Day 2", "plural", left="van", right="vans", sprite=os.path.join(STORY, "allit-v-van.jpg"))
    add("Day 2", "words", kicker="Full mix", title="All the words", note="Now mix endings and earlier words.", items=["van", "vet", "zip", "zap", "jam", "fox", "sat", "pet"])
    add("Day 2", "words", kicker="Full mix", title="Read them again", note="Point and read.", items=["zip", "van", "vet", "zap", "six", "quit", "wet", "map"])
    add("Day 2", "sentence", text="a vet sat in a van.", image=van, caption="Read it.")
    add("Day 2", "note", kicker="Day 2", title="Day 2 is done", lines=["New words, families, and a full mix.", "v or f. z or s. i or e."])

    add("Day 3", "plan", title="Today we will", steps=[("1", "Quick review", "sounds and words"), ("2", "Big and little", "v z"), ("3", "Read more words", "van to zap"), ("4", "A sentence", "zip sat in a van")])
    add("Day 3", "capitals", letters=["v", "z"])
    add("Day 3", "words", kicker="Partners", title="Match the partners", note="Big letter, little letter. Same sound.", items=["V v", "Z z"])
    add("Day 3", "words", kicker="Read", title="Read the words", note="Still only letters we know.", items=["van", "zip", "vet", "zap"])
    add("Day 3", "sentence", text="zip sat in a van.", image=None, caption="Read it. No picture.")
    add("Day 3", "sentence", text="zip sat in a van.", image=van, caption="Now see it.")
    add("Day 3", "sounds", title="Mix the sounds", note="This team and sounds we know.", items=["v", "f", "z", "s", "v", "j", "z", "y"])
    add("Day 3", "note", kicker="Day 3", title="Partners for this team", lines=["V v and Z z.", "Same letter. Same sound."])

    add("Day 4", "plan", title="Read a little more", steps=[("1", "Families again", "an, ip, ap, et"), ("2", "A full mix", "old words and new"), ("3", "A sentence", "a vet sat"), ("4", "Look and say", "v f and z s")])
    add("Day 4", "families", groups=[("-an", ["van", "can", "man", "pan"]), ("-ap", ["zap", "map", "nap", "tap"])])
    add("Day 4", "words", kicker="Full mix", title="All the words", note="Teams 1 to 7.", items=["van", "zip", "jam", "fox", "vet", "sat", "box", "quit"])
    add("Day 4", "sentence", text="a vet sat.", image=None, caption="Read it. No picture.")
    add("Day 4", "sentence", text="a vet sat.", image=vet, caption="Now see it.")
    add("Day 4", "contrast", left="v", right="f", row=["v", "f", "v", "v", "f", "v"])
    add("Day 4", "contrast", left="z", right="s", row=["z", "s", "z", "z", "s", "z"])
    add("Day 4", "words", kicker="Full mix", title="Read them again", note="Point and read.", items=["zap", "vet", "zip", "van", "jet", "fox", "six", "pet"])
    add("Day 4", "note", kicker="Day 4", title="Day 4 is done", lines=["Families, a sentence, and a full mix."])

    add("Day 5", "plan", title="Review and team check", steps=[("1", "Sounds", "v z"), ("2", "Words", "van to zap"), ("3", "The story", "zip sat in a van"), ("4", "Team check", "show what you know")])
    add("Day 5", "sounds", title="Quick sound review", note="This team, then a few we know.", items=["v", "z", "f", "s", "v", "a", "z", "i"])
    add("Day 5", "words", kicker="Review", title="Quick word review", note="Read each one.", items=["van", "zip", "vet", "zap", "jam", "fox"])
    add("Day 5", "sentence", text="zip sat. zip sat in a van.", image=None, caption="Read the story.")
    add("Day 5", "sentence", text="zip sat. zip sat in a van.", image=van, caption="Now see it.")
    add("Day 5", "check", title="Which sound?", note="Team check. Say the sound.", items=["v", "z", "f", "s"])
    add("Day 5", "check", title="Which word?", note="Team check. Read the word.", items=["van", "zip", "vet", "zap"])
    add("Day 5", "celebrate", lines=["van   zip   vet   zap"])
    add("Day 5", "note", kicker="Day 5", title="Team 7 is done", lines=["v z.", "Look what I can read!"])

    days = []
    start = 1
    current = slides[0]["day"]
    for i, spec in enumerate(slides, start=1):
        if spec["day"] != current:
            days.append((start, i - 1))
            start = i
            current = spec["day"]
    days.append((start, len(slides)))
    build("team7", "Team 7: v z", [("v", v), ("z", z)], slides, days)


if __name__ == "__main__":
    team6()
    team7()
    print("team 6 and 7 slides done")

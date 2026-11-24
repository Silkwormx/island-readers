#!/usr/bin/env python3
"""Preview slides for the Foundations review. Draws Team 2 Day 1, the Day 2
plural -s lesson, fresh alliterations, and the Team 1 read-it / ending cards
with a straight-tail Andika t."""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = "/tmp"
FONT = "/tmp/Andika-NoTail-Regular.ttf"
FONTB = "/tmp/Andika-NoTail-Bold.ttf"
STORY = os.path.join(ROOT, "foundation/img/story")
LETTERS = os.path.join(ROOT, "foundation/img/letters")
W, H = 1600, 900
CREAM = (255, 246, 232)
INK = (43, 37, 64)
MUTED = (90, 74, 58)
ORANGE = (242, 140, 0)
ORANGE_D = (201, 90, 16)
TEAL = (14, 124, 124)
WHITE = (255, 255, 255)
CARD = (255, 252, 246)


def font(size, bold=False):
    return ImageFont.truetype(FONTB if bold else FONT, size)


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


def heading(d, text, y=118, size=64):
    f = font(size, True)
    d.text((64, y), text, font=f, fill=INK)


def wrap(draw, text, f, max_w):
    words = text.split()
    lines, cur = [], ""
    for word in words:
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


def save(im, team, n):
    folder = os.path.join(ROOT, "materials", team, "slides")
    path = os.path.join(folder, "slide-%03d.jpg" % n)
    im.save(path, quality=90)
    print(team, n)


def meet(n, letter, art, sound, cue):
    im, d = canvas()
    pill(d, "New sound", 48, 28)
    day_label(d, "Day 1")
    heading(d, "Meet " + letter)
    rounded_paste(im, art, (64, 230, 620, 560))
    d.rounded_rectangle((740, 250, 1520, 430), radius=28, fill=WHITE, outline=(244, 180, 170), width=4)
    d.text((780, 280), "My name is:", font=font(36, True), fill=MUTED)
    d.text((1180, 250), letter, font=font(120, True), fill=INK)
    d.rounded_rectangle((740, 470, 1520, 700), radius=28, fill=(214, 240, 236), outline=TEAL, width=4)
    d.text((780, 500), "My sound is  " + sound, font=font(42, True), fill=TEAL)
    d.text((780, 580), cue, font=font(36, True), fill=INK)
    d.text((780, 640), "Say it 3 times.", font=font(32), fill=MUTED)
    save(im, "team2", n)


def practice(n, letter, sound):
    im, d = canvas()
    pill(d, "Say the sound", 48, 28, TEAL)
    day_label(d, "Day 1")
    heading(d, "Say " + sound + "  " + sound + "  " + sound)
    d.text((64, 230), "Only this sound. Tap a finger for each one.", font=font(36), fill=MUTED)
    for i in range(3):
        x = 180 + i * 460
        d.ellipse((x, 360, x + 280, 640), fill=TEAL)
        tw = text_width(d, letter, font(140, True))
        d.text((x + (280 - tw) / 2, 430), letter, font=font(140, True), fill=WHITE)
    save(im, "team2", n)


def alliteration(n, letter, sentence, image, day="Day 1"):
    im, d = canvas()
    pill(d, "Silly sound", 48, 28)
    day_label(d, day)
    rounded_paste(im, image, (48, 140, 860, 680))
    d.text((960, 220), letter, font=font(160, True), fill=ORANGE)
    lines = wrap(d, sentence, font(48, True), 560)
    y = 430
    for line in lines:
        d.text((960, y), line, font=font(48, True), fill=INK)
        y += 64
    d.text((960, y + 20), "Say it fast 3 times.", font=font(32), fill=MUTED)
    save(im, "team2", n)


def sound_row(n, title, letters, note, day="Day 1"):
    im, d = canvas()
    pill(d, "Sound fluency", 48, 28, TEAL)
    day_label(d, day)
    heading(d, title, size=54)
    d.text((64, 220), note, font=font(32), fill=MUTED)
    gap = (W - 120) / max(1, len(letters))
    for i, letter in enumerate(letters):
        x = 80 + i * gap
        d.rounded_rectangle((x, 340, x + gap - 28, 640), radius=32, fill=WHITE, outline=(230, 214, 180), width=4)
        f = font(120, True)
        tw = text_width(d, letter, f)
        d.text((x + (gap - 28 - tw) / 2, 420), letter, font=f, fill=INK)
    save(im, "team2", n)


def words(n, title, items):
    im, d = canvas()
    pill(d, "A few words", 48, 28)
    day_label(d, "Day 1")
    heading(d, title, size=54)
    d.text((64, 220), "Blend it. No extra ending.", font=font(32), fill=MUTED)
    gap = (W - 120) / max(1, len(items))
    for i, word in enumerate(items):
        x = 70 + i * gap
        d.rounded_rectangle((x, 320, x + gap - 24, 700), radius=32, fill=WHITE, outline=(230, 214, 180), width=4)
        f = font(92 if len(word) < 4 else 78, True)
        tw = text_width(d, word, f)
        d.text((x + (gap - 24 - tw) / 2, 450), word, font=f, fill=INK)
    save(im, "team2", n)


def sentence(n, text, image, caption):
    im, d = canvas()
    pill(d, "Read it", 48, 28)
    day_label(d, "Day 1")
    heading(d, caption, size=48)
    if image:
        rounded_paste(im, image, (64, 240, 760, 560))
        f = font(72, True)
        lines = wrap(d, text, f, 640)
        y = 400
        for line in lines:
            d.text((880, y), line, font=f, fill=INK)
            y += 90
    else:
        f = font(92, True)
        lines = wrap(d, text, f, 1400)
        y = 380
        for line in lines:
            tw = text_width(d, line, f)
            d.text(((W - tw) / 2, y), line, font=f, fill=INK)
            y += 110
        d.text((64, 720), "No picture yet. Read it first.", font=font(32), fill=MUTED)
    save(im, "team2", n)


def celebrate(n, words_line):
    im, d = canvas()
    pill(d, "Yay!", 48, 28, (232, 140, 170))
    day_label(d, "Day 1")
    heading(d, "I can read")
    d.text((64, 230), "Just these words today.", font=font(34), fill=MUTED)
    for i, word in enumerate(words_line):
        x = 80 + (i % 4) * 380
        y = 340 + (i // 4) * 220
        d.rounded_rectangle((x, y, x + 340, y + 180), radius=28, fill=WHITE, outline=(230, 214, 180), width=4)
        f = font(72, True)
        tw = text_width(d, word, f)
        d.text((x + (340 - tw) / 2, y + 48), word, font=f, fill=INK)
    save(im, "team2", n)


def yay():
    im, d = canvas()
    pill(d, "Yay!", 48, 28, (232, 140, 170))
    day_label(d, "Day 1")
    heading(d, "Day 1 done!", y=200, size=84)
    d.text((64, 360), "Sounds, a few words, and two tiny sentences.", font=font(40), fill=INK)
    d.text((64, 450), "More words, and -s, come on Day 2.", font=font(40), fill=MUTED)
    save(im, "team2", 30)


def plan():
    im, d = canvas()
    pill(d, "Day 1", 48, 28)
    day_label(d, "Team 2")
    heading(d, "Today is a slow, silly day")
    steps = [
        ("1", "Meet each sound", "p  f  i  n"),
        ("2", "Say just these sounds", "then mix in m s a t"),
        ("3", "Blend a few words", "pat  pin  fin  nap"),
        ("4", "Read two sentences", "plain, then with a picture"),
    ]
    for i, (num, title, sub) in enumerate(steps):
        x = 64 + (i % 2) * 760
        y = 280 + (i // 2) * 250
        d.rounded_rectangle((x, y, x + 720, y + 220), radius=28, fill=WHITE, outline=(230, 214, 180), width=4)
        d.ellipse((x + 24, y + 36, x + 100, y + 112), fill=ORANGE)
        d.text((x + 48, y + 50), num, font=font(36, True), fill=WHITE)
        d.text((x + 124, y + 48), title, font=font(36, True), fill=INK)
        d.text((x + 124, y + 120), sub, font=font(32), fill=MUTED)
    save(im, "team2", 3)


def plural(n, left, right, img_a, img_b):
    im, d = canvas()
    pill(d, "Add -s", 48, 28)
    day_label(d, "Day 2")
    heading(d, left + "  →  " + right, size=56)
    d.text((64, 210), "One. Then more than one. The ending says /s/.", font=font(32), fill=MUTED)
    rounded_paste(im, img_a, (80, 280, 560, 480))
    rounded_paste(im, img_b, (960, 280, 560, 480))
    f = font(64, True)
    tw = text_width(d, left, f)
    d.text((80 + (560 - tw) / 2, 780), left, font=f, fill=INK)
    tw = text_width(d, right, f)
    d.text((960 + (560 - tw) / 2, 780), right, font=f, fill=ORANGE_D)
    # footer covers y 780. Move labels up.
    save(im, "team2", n)


def plural_fixed(n, left, right, img_a, img_b):
    im, d = canvas()
    pill(d, "Add -s", 48, 28)
    day_label(d, "Day 2")
    heading(d, "One, then more", size=54)
    d.text((64, 200), "Watch the ending. " + left + " becomes " + right + ".", font=font(32), fill=MUTED)
    rounded_paste(im, img_a, (70, 270, 640, 430))
    rounded_paste(im, img_b, (890, 270, 640, 430))
    f = font(64, True)
    for x, word, fill in ((70, left, INK), (890, right, ORANGE_D)):
        tw = text_width(d, word, f)
        d.text((x + (640 - tw) / 2, 720), word, font=f, fill=fill)
    save(im, "team2", n)


def day2_plan():
    im, d = canvas()
    pill(d, "Day 2", 48, 28)
    day_label(d, "Team 2")
    heading(d, "Now we add -s")
    d.text((64, 240), "Yesterday we read pat, pin, fin, and nap.", font=font(40), fill=INK)
    d.text((64, 330), "Today, look at one, then more than one.", font=font(40), fill=INK)
    d.text((64, 450), "mat → mats      pin → pins", font=font(48, True), fill=ORANGE_D)
    d.text((64, 540), "fin → fins      pan → pans", font=font(48, True), fill=ORANGE_D)
    d.text((64, 680), "Then we read more words.", font=font(36), fill=MUTED)
    save(im, "team2", 31)


def team1_story(n, lines, image, note):
    im, d = canvas()
    pill(d, "Read it", 48, 28)
    day_label(d, "Day 5")
    heading(d, note, size=48)
    if image:
        rounded_paste(im, image, (64, 230, 700, 560))
        y = 320
        for line in lines:
            d.text((820, y), line, font=font(54, True), fill=INK)
            y += 90
    else:
        y = 340
        for line in lines:
            f = font(72, True)
            tw = text_width(d, line, f)
            d.text(((W - tw) / 2, y), line, font=f, fill=INK)
            y += 110
        d.text((64, 720), "No picture yet. Read it first.", font=font(32), fill=MUTED)
    save(im, "team1", n)


def team1_bank():
    im, d = canvas()
    pill(d, "Yay!", 48, 28, (232, 140, 170))
    day_label(d, "Day 5")
    heading(d, "I can read")
    d.text((64, 220), "Team 1 words. Only m, s, a, t.", font=font(34), fill=MUTED)
    words = ["sam", "sat", "mat", "am", "at"]
    for i, word in enumerate(words):
        x = 70 + i * 300
        d.rounded_rectangle((x, 360, x + 270, 620), radius=28, fill=WHITE, outline=(230, 214, 180), width=4)
        f = font(64, True)
        tw = text_width(d, word, f)
        d.text((x + (270 - tw) / 2, 450), word, font=f, fill=INK)
    save(im, "team1", 163)


def team1_t():
    im, d = canvas()
    pill(d, "Say /t/", 48, 28, TEAL)
    day_label(d, "Day 2")
    heading(d, "Say /t/.")
    d.text((64, 230), "Teeth close. Tap your tongue.", font=font(36), fill=MUTED)
    d.rounded_rectangle((180, 300, 760, 780), radius=36, fill=WHITE, outline=(230, 214, 180), width=4)
    f = font(320, True)
    tw = text_width(d, "t", f)
    d.text((180 + (580 - tw) / 2, 360), "t", font=f, fill=INK)
    d.text((860, 420), "sat", font=font(100, True), fill=INK)
    d.text((860, 560), "mat", font=font(100, True), fill=INK)
    d.text((860, 700), "at", font=font(100, True), fill=INK)
    save(im, "team1", 56)


def meet_team():
    im, d = canvas()
    pill(d, "Team 2", 48, 28)
    f = font(64, True)
    title = "Meet the letters"
    tw = text_width(d, title, f)
    d.text(((W - tw) / 2, 100), title, font=f, fill=INK)
    sub = "p    f    i    n"
    sf = font(36, True)
    tw = text_width(d, sub, sf)
    d.text(((W - tw) / 2, 180), sub, font=sf, fill=MUTED)
    arts = [
        ("p", os.path.join(LETTERS, "p_puku_pufferfish.jpg")),
        ("f", os.path.join(LETTERS, "f_fumi_fish.jpg")),
        ("i", os.path.join(LETTERS, "i_iggy_insect.jpg")),
        ("n", os.path.join(LETTERS, "n_nobu_noodle.jpg")),
    ]
    for i, (letter, path) in enumerate(arts):
        x = 50 + i * 390
        rounded_paste(im, path, (x, 260, 350, 420))
        lf = font(72, True)
        tw = text_width(d, letter, lf)
        d.text((x + (350 - tw) / 2, 700), letter, font=lf, fill=INK)
    save(im, "team2", 2)


def main():
    p_art = os.path.join(LETTERS, "p_puku_pufferfish.jpg")
    f_art = os.path.join(LETTERS, "f_fumi_fish.jpg")
    i_art = os.path.join(LETTERS, "i_iggy_insect.jpg")
    n_art = os.path.join(LETTERS, "n_nobu_noodle.jpg")
    meet_team()
    plan()
    meet(4, "p", p_art, "/p/", "Lips pop.")
    practice(5, "p", "/p/")
    alliteration(6, "p", "Pink pigs pop purple pies!", os.path.join(STORY, "allit-p-pigs.jpg"))
    meet(7, "f", f_art, "/f/", "Bite your lip and blow.")
    practice(8, "f", "/f/")
    alliteration(9, "f", "Five funny fish flip fast fins!", os.path.join(STORY, "allit-f-fish.jpg"))
    meet(10, "i", i_art, "/i/", "Smile a little.")
    practice(11, "i", "/i/")
    alliteration(12, "i", "Itchy insects itch in igloos!", os.path.join(STORY, "allit-i-insects.jpg"))
    meet(13, "n", n_art, "/n/", "Tongue up. Hum.")
    practice(14, "n", "/n/")
    alliteration(15, "n", "Nine neat newts nap near nests!", os.path.join(STORY, "allit-n-newts.jpg"))
    sound_row(16, "Just these sounds", ["p", "f", "i", "n"], "Point and say. Only Team 2.")
    sound_row(17, "Say them in a mix", ["p", "i", "f", "n", "f", "p"], "Still only p, f, i, n.")
    sound_row(18, "Now mix in Team 1", ["m", "s", "a", "t"], "Sounds we already know.")
    sound_row(19, "Team 1 and Team 2", ["s", "p", "a", "f", "t", "i", "m", "n"], "Point and say each sound.")
    words(22, "Blend pat", ["pat"])
    words(23, "Blend pin", ["pin"])
    words(24, "Blend fin and nap", ["fin", "nap"])
    # slides 20-21 are the mixed fluency already used 18-19. Fill 20 and 21.
    sound_row(20, "Your turn", ["p", "a", "t", "i", "n", "m"], "Say the sound. No words yet.")
    sound_row(21, "One more mix", ["f", "a", "n", "s", "i", "t"], "Fast and fun. Sounds only.")
    sentence(25, "pat sat.", None, "Read it. No picture.")
    sentence(26, "a pin.", None, "Read it. No picture.")
    sentence(27, "pat sat.", os.path.join(STORY, "pat-sat.jpg"), "Now see it.")
    sentence(28, "a pin.", os.path.join(STORY, "a-pin-scene.jpg"), "Now see it.")
    celebrate(29, ["pat", "pin", "fin", "nap"])
    yay()
    day2_plan()
    plural_fixed(32, "mat", "mats", os.path.join(STORY, "one-mat.jpg"), os.path.join(STORY, "many-mats.jpg"))
    plural_fixed(33, "pin", "pins", os.path.join(STORY, "one-pin.jpg"), os.path.join(STORY, "many-pins.jpg"))
    plural_fixed(34, "fin", "fins", os.path.join(STORY, "one-fin.jpg"), os.path.join(STORY, "many-fins.jpg"))
    plural_fixed(35, "pan", "pans", os.path.join(STORY, "one-pan.jpg"), os.path.join(STORY, "many-pans.jpg"))
    words_day2 = canvas_words_day2()
    save(words_day2, "team2", 36)
    alliteration(37, "i", "Itchy insects itch in igloos!", os.path.join(STORY, "allit-i-insects.jpg"), "Day 2")
    alliteration(41, "n", "Nine neat newts nap near nests!", os.path.join(STORY, "allit-n-newts.jpg"), "Day 2")
    alliteration(60, "p", "Pink pigs pop purple pies!", os.path.join(STORY, "allit-p-pigs.jpg"), "Day 3")
    team1_story(146, ["sam sat.", "sam sat at a mat."], None, "Read it. No picture.")
    team1_story(159, ["sam sat.", "sam sat at a mat."], os.path.join(ROOT, "foundation/img/scenes/mat.jpg"), "Now see it.")
    team1_bank()
    team1_t()
    print("done")


def canvas_words_day2():
    im, d = canvas()
    pill(d, "Read more", 48, 28)
    day_label(d, "Day 2")
    heading(d, "Read the pair", size=54)
    d.text((64, 210), "Say the first word. Then add /s/.", font=font(32), fill=MUTED)
    pairs = [("mat", "mats"), ("pin", "pins"), ("fin", "fins"), ("pan", "pans")]
    for i, (a, b) in enumerate(pairs):
        x = 50 + i * 390
        d.rounded_rectangle((x, 320, x + 360, 700), radius=28, fill=WHITE, outline=(230, 214, 180), width=4)
        d.text((x + 40, 380), a, font=font(54, True), fill=INK)
        d.text((x + 40, 480), "→", font=font(48, True), fill=ORANGE)
        d.text((x + 40, 560), b, font=font(54, True), fill=ORANGE_D)
    return im


if __name__ == "__main__":
    main()

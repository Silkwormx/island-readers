#!/usr/bin/env python3
"""Unified Foundations slideshow pages for Teams 1-5.

Day 1: mouth intro, alliteration, write slot, sound fluency, a few words,
sentences with no picture then with a picture.
Day 2: quick review, a small word group, exclusive mix, word families,
contrasts, plural -s, then a full mix.
"""
import importlib.util
import os
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = importlib.util.spec_from_file_location(
    "preview_slides", os.path.join(ROOT, "tools", "build_preview_slides.py"))
b = importlib.util.module_from_spec(spec)
spec.loader.exec_module(b)

LETTERS = b.LETTERS
STORY = b.STORY
OBJ = os.path.join(ROOT, "foundation/img/objects")
MOUTH = os.path.join(ROOT, "foundation/img/mouths")
W, H = b.W, b.H
INK, MUTED, ORANGE, ORANGE_D, TEAL, WHITE, CREAM = (
    b.INK, b.MUTED, b.ORANGE, b.ORANGE_D, b.TEAL, b.WHITE, b.CREAM)


def save(im, team, n):
    folder = os.path.join(ROOT, "materials", team, "slides")
    im.save(os.path.join(folder, "slide-%03d.jpg" % n), quality=90)


def center_text(d, text, y, f, fill=INK):
    tw = b.text_width(d, text, f)
    d.text(((W - tw) / 2, y), text, font=f, fill=fill)


def row_cards(d, items, y, h, fill=INK):
    gap = (W - 80) / max(1, len(items))
    f = b.font(78 if len(items) > 6 else 96, True)
    for i, word in enumerate(items):
        x = 40 + i * gap
        d.rounded_rectangle((x, y, x + gap - 18, y + h), radius=28, fill=WHITE, outline=(230, 214, 180), width=4)
        tw = b.text_width(d, word, f)
        d.text((x + (gap - 18 - tw) / 2, y + h / 2 - 50), word, font=f, fill=fill)


def meet(team, n, letter, art, keyword, cue, day="Day 1"):
    im, d = b.canvas()
    b.pill(d, "New sound", 48, 28)
    b.day_label(d, day)
    b.heading(d, "Meet " + letter, size=56)
    b.rounded_paste(im, art, (48, 220, 460, 500))
    b.rounded_paste(im, os.path.join(MOUTH, "mouth_%s.jpg" % letter), (1040, 220, 500, 500))
    d.text((540, 280), letter, font=b.font(160, True), fill=INK)
    d.text((540, 470), keyword, font=b.font(42, True), fill=MUTED)
    d.text((540, 560), cue, font=b.font(32), fill=TEAL)
    d.text((540, 630), "Say it 3 times.", font=b.font(32), fill=MUTED)
    save(im, team, n)


def alliteration(team, n, letter, sentence, image, day="Day 1"):
    im, d = b.canvas()
    b.pill(d, "Silly sound", 48, 28)
    b.day_label(d, day)
    b.rounded_paste(im, image, (48, 150, 780, 640))
    d.text((880, 200), letter, font=b.font(140, True), fill=ORANGE)
    y = 400
    for line in b.wrap(d, sentence, b.font(40, True), 640):
        d.text((880, y), line, font=b.font(40, True), fill=INK)
        y += 56
    d.text((880, y + 16), "Say it fast 3 times.", font=b.font(28), fill=MUTED)
    save(im, team, n)


def sound_row(team, n, title, letters, note, day):
    im, d = b.canvas()
    b.pill(d, "Sound fluency", 48, 28, TEAL)
    b.day_label(d, day)
    b.heading(d, title, size=52)
    d.text((64, 210), note, font=b.font(30), fill=MUTED)
    row_cards(d, letters, 300, 360)
    save(im, team, n)


def words(team, n, title, items, note, day, kicker="A few words"):
    im, d = b.canvas()
    b.pill(d, kicker, 48, 28)
    b.day_label(d, day)
    b.heading(d, title, size=52)
    d.text((64, 210), note, font=b.font(30), fill=MUTED)
    row_cards(d, items, 300, 380)
    save(im, team, n)


def sentence(team, n, text, image, caption, day="Day 1"):
    im, d = b.canvas()
    b.pill(d, "Read it", 48, 28)
    b.day_label(d, day)
    b.heading(d, caption, size=46)
    if image:
        b.rounded_paste(im, image, (64, 230, 700, 540))
        d.text((820, 420), text, font=b.font(64, True), fill=INK)
    else:
        center_text(d, text, 400, b.font(84, True))
        d.text((64, 720), "No picture yet. Read it first.", font=b.font(30), fill=MUTED)
    save(im, team, n)


def review(team, n, sounds, known):
    im, d = b.canvas()
    b.pill(d, "Quick review", 48, 28, TEAL)
    b.day_label(d, "Day 2")
    b.heading(d, "Quick review", size=56)
    d.text((64, 200), "Sounds we know. Then a few words.", font=b.font(30), fill=MUTED)
    row_cards(d, sounds, 270, 220)
    d.text((64, 540), "Words:  " + "   ".join(known), font=b.font(40, True), fill=INK)
    save(im, team, n)


def families(team, n, groups):
    im, d = b.canvas()
    b.pill(d, "Word families", 48, 28)
    b.day_label(d, "Day 2")
    b.heading(d, "Same ending. New start.", size=48)
    y = 220
    for label, words_ in groups:
        d.text((64, y), label, font=b.font(32, True), fill=ORANGE_D)
        x = 220
        for word in words_:
            d.rounded_rectangle((x, y - 8, x + 200, y + 78), radius=18, fill=WHITE, outline=(230, 214, 180), width=3)
            tw = b.text_width(d, word, b.font(40, True))
            d.text((x + (200 - tw) / 2, y + 14), word, font=b.font(40, True), fill=INK)
            x += 220
        y += 120
    save(im, team, n)


def contrast(team, n, left, right, row):
    im, d = b.canvas()
    b.pill(d, "Look and say", 48, 28, TEAL)
    b.day_label(d, "Day 2")
    b.heading(d, left + "  or  " + right, size=48)
    d.rounded_rectangle((180, 230, 620, 520), radius=28, fill=WHITE, outline=(230, 214, 180), width=4)
    d.rounded_rectangle((980, 230, 1420, 520), radius=28, fill=WHITE, outline=(230, 214, 180), width=4)
    for x, letter in ((180, left), (980, right)):
        f = b.font(140, True)
        tw = b.text_width(d, letter, f)
        d.text((x + (440 - tw) / 2, 300), letter, font=f, fill=INK)
    d.text((700, 340), "then", font=b.font(32, True), fill=MUTED)
    row_cards(d, row, 560, 200)
    save(im, team, n)


def plural(team, n, left, right, sprite):
    one = b.copies_of(sprite, 1, (900, 700))
    many = b.copies_of(sprite, 3, (900, 700))
    one_path = os.path.join(STORY, "single-" + left + ".jpg")
    many_path = os.path.join(STORY, "three-" + left + ".jpg")
    one.save(one_path, quality=90)
    many.save(many_path, quality=90)
    im, d = b.canvas()
    b.pill(d, "Add -s", 48, 28)
    b.day_label(d, "Day 2")
    b.heading(d, "One, then more", size=52)
    d.text((64, 200), "Watch the ending. " + left + " becomes " + right + ".", font=b.font(30), fill=MUTED)
    b.rounded_paste(im, one_path, (70, 270, 640, 420))
    b.rounded_paste(im, many_path, (890, 270, 640, 420))
    f = b.font(56, True)
    for x, word, fill in ((70, left, INK), (890, right, ORANGE_D)):
        tw = b.text_width(d, word, f)
        d.text((x + (640 - tw) / 2, 710), word, font=f, fill=fill)
    save(im, team, n)


def plan(team, n, title, steps, day):
    im, d = b.canvas()
    b.pill(d, day, 48, 28)
    b.day_label(d, day)
    b.heading(d, title, size=48)
    for i, (num, head, sub) in enumerate(steps):
        x = 64 + (i % 2) * 760
        y = 250 + (i // 2) * 250
        d.rounded_rectangle((x, y, x + 720, y + 220), radius=28, fill=WHITE, outline=(230, 214, 180), width=4)
        d.ellipse((x + 24, y + 36, x + 100, y + 112), fill=ORANGE)
        d.text((x + 48, y + 50), num, font=b.font(36, True), fill=WHITE)
        d.text((x + 124, y + 48), head, font=b.font(34, True), fill=INK)
        d.text((x + 124, y + 120), sub, font=b.font(28), fill=MUTED)
    save(im, team, n)


def sprite(path, draw_fn):
    im = Image.new("RGB", (700, 700), CREAM)
    draw_fn(ImageDraw.Draw(im))
    im.save(path, quality=90)


def icons():
    os.makedirs(OBJ, exist_ok=True)
    sprite(os.path.join(OBJ, "sun.jpg"), lambda d: (
        d.ellipse((180, 180, 520, 520), fill=(246, 196, 69), outline=INK, width=8),
        [d.line((350, 80, 350, 150), fill=ORANGE_D, width=14) for _ in (0,)],
        d.line((350, 550, 350, 620), fill=ORANGE_D, width=14),
        d.line((80, 350, 150, 350), fill=ORANGE_D, width=14),
        d.line((550, 350, 620, 350), fill=ORANGE_D, width=14)))
    sprite(os.path.join(OBJ, "top.jpg"), lambda d: (
        d.polygon([(350, 80), (520, 420), (180, 420)], fill=(226, 91, 74), outline=INK),
        d.ellipse((250, 400, 450, 520), fill=(242, 140, 0), outline=INK, width=6)))
    sprite(os.path.join(OBJ, "pot.jpg"), lambda d: (
        d.rounded_rectangle((160, 220, 540, 520), radius=40, fill=(196, 122, 74), outline=INK, width=8),
        d.arc((470, 250, 620, 400), 300, 60, fill=INK, width=14)))
    sprite(os.path.join(OBJ, "dot.jpg"), lambda d: d.ellipse((220, 220, 480, 480), fill=(43, 37, 64)))
    sprite(os.path.join(OBJ, "cup.jpg"), lambda d: (
        d.polygon([(180, 180), (500, 180), (450, 520), (230, 520)], fill=(126, 182, 224), outline=INK),
        d.arc((470, 240, 640, 420), 280, 80, fill=INK, width=14)))
    sprite(os.path.join(OBJ, "pup.jpg"), lambda d: (
        d.ellipse((160, 220, 540, 540), fill=(196, 138, 74), outline=INK, width=8),
        d.ellipse((180, 140, 300, 280), fill=(196, 138, 74), outline=INK, width=8),
        d.ellipse((400, 140, 520, 280), fill=(196, 138, 74), outline=INK, width=8),
        d.ellipse((280, 340, 330, 390), fill=INK),
        d.ellipse((380, 340, 430, 390), fill=INK)))
    sprite(os.path.join(OBJ, "bag.jpg"), lambda d: (
        d.rounded_rectangle((170, 220, 530, 560), radius=30, fill=(194, 64, 106), outline=INK, width=8),
        d.arc((250, 120, 450, 280), 200, 340, fill=INK, width=14)))
    sprite(os.path.join(OBJ, "bed.jpg"), lambda d: (
        d.rounded_rectangle((120, 340, 580, 500), radius=20, fill=(91, 155, 196), outline=INK, width=8),
        d.rounded_rectangle((140, 220, 280, 360), radius=40, fill=WHITE, outline=INK, width=6)))
    sprite(os.path.join(OBJ, "key.jpg"), lambda d: (
        d.ellipse((160, 160, 400, 400), outline=INK, width=16),
        d.rectangle((380, 250, 560, 290), fill=(246, 196, 69), outline=INK)))
    sprite(os.path.join(OBJ, "hen.jpg"), lambda d: (
        d.ellipse((160, 240, 540, 540), fill=(246, 196, 69), outline=INK, width=8),
        d.polygon([(500, 340), (620, 380), (500, 420)], fill=ORANGE, outline=INK),
        d.ellipse((200, 300, 260, 360), fill=INK)))
    sprite(os.path.join(OBJ, "rat.jpg"), lambda d: (
        d.ellipse((140, 260, 500, 480), fill=(196, 168, 160), outline=INK, width=8),
        d.ellipse((420, 200, 560, 340), fill=(196, 168, 160), outline=INK, width=8),
        d.arc((60, 300, 180, 420), 200, 20, fill=INK, width=10)))
    sprite(os.path.join(OBJ, "leaf.jpg"), lambda d: (
        d.ellipse((180, 140, 520, 560), fill=(90, 160, 90), outline=INK, width=8),
        d.line((350, 180, 350, 520), fill=INK, width=8)))
    sprite(os.path.join(OBJ, "pen.jpg"), lambda d: (
        d.polygon([(160, 360), (520, 200), (560, 250), (200, 410)], fill=(61, 126, 166), outline=INK),
        d.polygon([(520, 200), (620, 160), (600, 240), (520, 250)], fill=ORANGE, outline=INK)))
    sprite(os.path.join(OBJ, "web.jpg"), lambda d: (
        d.ellipse((140, 140, 560, 560), outline=INK, width=8),
        d.ellipse((220, 220, 480, 480), outline=INK, width=6),
        d.line((350, 140, 350, 560), fill=INK, width=6),
        d.line((140, 350, 560, 350), fill=INK, width=6)))


TEAMS = [
    {
        "id": "team2", "day1": 3, "day1_end": 30, "day2": 31, "day2_end": 58,
        "letters": [
            ("p", "pufferfish", "Lips pop.", "Pink pigs pop purple pies!", os.path.join(STORY, "allit-p-pigs.jpg"), "p_puku_pufferfish.jpg"),
            ("f", "fish", "Bite your lip and blow.", "Five funny fish flip fast fins!", os.path.join(STORY, "allit-f-fish.jpg"), "f_fumi_fish.jpg"),
            ("i", "insect", "Smile a little.", "Itchy insects itch in igloos!", os.path.join(STORY, "allit-i-insects.jpg"), "i_iggy_insect.jpg"),
            ("n", "noodle", "Tongue up. Hum.", "Nine neat newts nap near nests!", os.path.join(STORY, "allit-n-newts.jpg"), "n_nobu_noodle.jpg"),
        ],
        "mine": ["p", "f", "i", "n"],
        "earlier": ["m", "s", "a", "t"],
        "base": ["in", "if", "it", "pat"],
        "sentences": [
            ("pat sat.", None, "Read it. No picture."),
            ("a pin.", None, "Read it. No picture."),
            ("pat sat.", os.path.join(STORY, "pat-sat.jpg"), "Now see it."),
            ("a pin.", os.path.join(STORY, "a-pin-scene.jpg"), "Now see it."),
        ],
        "review_words": ["pat", "pin", "in", "it"],
        "new": ["in", "if", "it"],
        "exclusive": ["it", "in", "if", "in", "it", "if"],
        "families": [("-in", ["in", "pin", "fin", "tin"]), ("-it", ["it", "pit", "fit", "sit"]), ("-at", ["at", "mat", "sat", "pat"]), ("-an", ["an", "man", "pan", "fan"]), ("-ap", ["map", "nap", "tap", "sap"])],
        "contrasts": [("a", "i", ["a", "i", "a", "a", "i", "a", "i"]), ("m", "n", ["m", "n", "m", "n", "n", "m"]), ("f", "t", ["f", "t", "f", "f", "t", "f"]), ("p", "t", ["p", "t", "p", "t", "t", "p"])],
        "plurals": [("mat", "mats", os.path.join(STORY, "one-mat.jpg")), ("pin", "pins", os.path.join(STORY, "one-pin.jpg")), ("fin", "fins", os.path.join(STORY, "one-fin.jpg")), ("pan", "pans", os.path.join(STORY, "one-pan.jpg"))],
        "mixed": ["in", "pat", "it", "fin", "at", "nap", "if", "sit"],
    },
    {
        "id": "team3", "day1": 5, "day1_end": 39, "day2": 40, "day2_end": 73,
        "letters": [
            ("o", "octopus", "Lips in a circle.", "Octopuses open orange oysters!", os.path.join(LETTERS, "o_ollie_octopus.jpg"), "o_ollie_octopus.jpg"),
            ("d", "dog", "Tongue taps.", "Dogs dig deep damp dirt!", os.path.join(LETTERS, "d_dai_dog.jpg"), "d_dai_dog.jpg"),
            ("c", "crab", "Back of the tongue.", "Crabs clap cute colorful claws!", os.path.join(LETTERS, "c_coco_crab.jpg"), "c_coco_crab.jpg"),
            ("u", "umbrella", "Mouth open a little.", "Umbrellas pop up, up, up!", os.path.join(LETTERS, "u_umbrella.jpg"), "u_umbrella.jpg"),
        ],
        "mine": ["o", "d", "c", "u"],
        "earlier": ["a", "m", "s", "t", "p", "f", "i", "n"],
        "base": ["on", "up", "cot", "pot"],
        "sentences": [
            ("sam sat on a cot.", None, "Read it. No picture."),
            ("a pup sat up.", None, "Read it. No picture."),
            ("sam sat on a cot.", os.path.join(LETTERS, "o_ollie_octopus.jpg"), "Now see it."),
            ("a pup sat up.", os.path.join(LETTERS, "d_dai_dog.jpg"), "Now see it."),
        ],
        "review_words": ["on", "up", "pat", "in"],
        "new": ["on", "up", "cot"],
        "exclusive": ["on", "cot", "up", "on", "up", "cot"],
        "families": [("-ot", ["cot", "dot", "pot", "tot"]), ("-op", ["top", "mop", "cop", "pop"]), ("-un", ["sun", "fun", "nun"]), ("-up", ["up", "cup", "pup"])],
        "contrasts": [("a", "o", ["a", "o", "a", "a", "o", "a"]), ("i", "u", ["i", "u", "i", "i", "u", "i"]), ("o", "u", ["o", "u", "o", "u", "u", "o"]), ("d", "t", ["d", "t", "d", "d", "t", "d"])],
        "plurals": [("pot", "pots", os.path.join(OBJ, "pot.jpg")), ("cup", "cups", os.path.join(OBJ, "cup.jpg")), ("pup", "pups", os.path.join(OBJ, "pup.jpg"))],
        "mixed": ["on", "pot", "up", "cot", "pat", "sun", "cup", "in"],
    },
    {
        "id": "team4", "day1": 5, "day1_end": 40, "day2": 41, "day2_end": 74,
        "letters": [
            ("g", "goat", "Back of the tongue. Voice on.", "Goats gobble green grapes!", os.path.join(LETTERS, "g_gogo_goat.jpg"), "g_gogo_goat.jpg"),
            ("b", "ball", "Lips pop. Voice on.", "Bats bounce big blue balls!", os.path.join(LETTERS, "b_bani_ball.jpg"), "b_bani_ball.jpg"),
            ("e", "egg", "Smile a little.", "Eggs in every empty nest!", os.path.join(LETTERS, "e_egg.jpg"), "e_egg.jpg"),
            ("k", "kite", "Back of the tongue.", "Kids kick kites in the sky!", os.path.join(LETTERS, "k_kiko_kite.jpg"), "k_kiko_kite.jpg"),
        ],
        "mine": ["g", "b", "e", "k"],
        "earlier": ["a", "i", "o", "u"],
        "base": ["bag", "bed", "pet", "pen"],
        "sentences": [
            ("a pet sat.", None, "Read it. No picture."),
            ("a bug sat.", None, "Read it. No picture."),
            ("a pet sat.", os.path.join(LETTERS, "e_egg.jpg"), "Now see it."),
            ("a bug sat.", os.path.join(LETTERS, "b_bani_ball.jpg"), "Now see it."),
        ],
        "review_words": ["bag", "pet", "on", "pat"],
        "new": ["bed", "pet", "get"],
        "exclusive": ["pet", "bed", "get", "bed", "pet", "get"],
        "families": [("-et", ["pet", "bet", "get", "met", "net"]), ("-ag", ["bag", "tag", "nag", "sag"]), ("-en", ["pen", "ten", "men", "den"]), ("-ed", ["bed", "fed", "ned"])],
        "contrasts": [("e", "i", ["e", "i", "e", "e", "i", "e"]), ("e", "a", ["e", "a", "e", "a", "a", "e"]), ("b", "d", ["b", "d", "b", "b", "d", "b"]), ("b", "p", ["b", "p", "b", "p", "p", "b"]), ("g", "c", ["g", "c", "g", "g", "c", "g"])],
        "plurals": [("bag", "bags", os.path.join(OBJ, "bag.jpg")), ("bed", "beds", os.path.join(OBJ, "bed.jpg")), ("pen", "pens", os.path.join(OBJ, "pen.jpg"))],
        "mixed": ["bag", "pet", "bed", "on", "pen", "get", "cup", "sat"],
    },
    {
        "id": "team5", "day1": 5, "day1_end": 40, "day2": 41, "day2_end": 73,
        "letters": [
            ("h", "hat", "A little breath.", "Hats hop on happy heads!", os.path.join(LETTERS, "h_hana_hat.jpg"), "h_hana_hat.jpg"),
            ("r", "robin", "Tongue back.", "Red robins run round rocks!", os.path.join(LETTERS, "r_ruri_robin.jpg"), "r_ruri_robin.jpg"),
            ("l", "lily", "Tongue up.", "Little lilies love the light!", os.path.join(LETTERS, "l_lili_lily.jpg"), "l_lili_lily.jpg"),
            ("w", "wave", "Lips round and tight.", "Waves wash wet white whales!", os.path.join(LETTERS, "w_wawa_wave.jpg"), "w_wawa_wave.jpg"),
        ],
        "mine": ["h", "r", "l", "w"],
        "earlier": ["a", "e", "i", "o"],
        "base": ["hat", "rat", "lap", "log"],
        "sentences": [
            ("sam ran.", None, "Read it. No picture."),
            ("a red hat.", None, "Read it. No picture."),
            ("sam ran.", os.path.join(LETTERS, "r_ruri_robin.jpg"), "Now see it."),
            ("a red hat.", os.path.join(LETTERS, "h_hana_hat.jpg"), "Now see it."),
        ],
        "review_words": ["hat", "ran", "pet", "on"],
        "new": ["hat", "rat", "lap"],
        "exclusive": ["hat", "rat", "lap", "rat", "hat", "lap"],
        "families": [("-at", ["hat", "rat", "sat", "mat"]), ("-ap", ["lap", "map", "nap", "tap"]), ("-og", ["log", "dog", "hog"]), ("-ip", ["rip", "lip", "sip", "tip"])],
        "contrasts": [("l", "i", ["l", "i", "l", "l", "i", "l"]), ("l", "t", ["l", "t", "l", "t", "t", "l"]), ("h", "n", ["h", "n", "h", "h", "n", "h"])],
        "plurals": [("hat", "hats", os.path.join(OBJ, "hen.jpg")), ("log", "logs", os.path.join(OBJ, "leaf.jpg")), ("web", "webs", os.path.join(OBJ, "web.jpg"))],
        "mixed": ["hat", "rat", "lap", "log", "pet", "ran", "wet", "sip"],
    },
]


def build_team(team):
    name = team["id"]
    n = team["day1"]
    end = team["day1_end"]
    letters = "  ".join(team["mine"])
    plan(name, n, "Today is a slow, silly day", [
        ("1", "Meet each sound", letters),
        ("2", "Say just these sounds", "then mix in sounds we know"),
        ("3", "Blend a few words", "  ".join(team["base"])),
        ("4", "Read two sentences", "plain, then with a picture"),
    ], "Day 1")
    n += 1
    for letter, keyword, cue, sentence_text, image, art_name in team["letters"]:
        art = os.path.join(LETTERS, art_name)
        meet(name, n, letter, art, keyword, cue)
        n += 1
        alliteration(name, n, letter, sentence_text, image)
        n += 1
        sound_row(name, n, "Write " + letter, [letter], "Watch the pencil. Then trace it in the air.", "Day 1")
        n += 1
    sound_row(name, n, "Just these sounds", team["mine"], "Point and say. Only this team.", "Day 1")
    n += 1
    mix = team["mine"][2:] + team["mine"][:2] + team["mine"][:1]
    sound_row(name, n, "Say them in a mix", mix, "Still only this team.", "Day 1")
    n += 1
    sound_row(name, n, "Sounds we know", team["earlier"][:8], "From the teams before.", "Day 1")
    n += 1
    both = []
    for i in range(8):
        both.append(team["earlier"][i % len(team["earlier"])])
        both.append(team["mine"][i % len(team["mine"])])
    sound_row(name, n, "Mix the sounds", both[:8], "Point and say each sound.", "Day 1")
    n += 1
    words(name, n, "A few words", team["base"], "Blend it. No extra ending.", "Day 1")
    n += 1
    for text, image, caption in team["sentences"]:
        if n > end:
            break
        sentence(name, n, text, image, caption)
        n += 1
    while n <= end:
        sound_row(name, n, "One more mix", both[:8], "Fast and fun. Sounds only.", "Day 1")
        n += 1

    n = team["day2"]
    end = team["day2_end"]
    review(name, n, team["mine"] + team["earlier"][:4], team["review_words"])
    n += 1
    words(name, n, "New words", team["new"], "A small new group.", "Day 2", "New words")
    n += 1
    words(name, n, "Only these words", team["exclusive"], "Mix just this little group.", "Day 2", "Mixed review")
    n += 1
    # Two family slides so a teacher can linger, plus the rest one pair at a time.
    chunk = team["families"][:2]
    families(name, n, chunk)
    n += 1
    for group in team["families"][2:]:
        if n > end:
            break
        families(name, n, [group])
        n += 1
    for left, right, row in team["contrasts"]:
        if n > end:
            break
        contrast(name, n, left, right, row)
        n += 1
    for left, right, sprite_path in team["plurals"]:
        if n > end:
            break
        plural(name, n, left, right, sprite_path)
        n += 1
    if n <= end:
        words(name, n, "All the words", team["mixed"], "Now mix endings and earlier words.", "Day 2", "Full mix")
        n += 1
    while n <= end:
        words(name, n, "Read them again", team["mixed"], "Point and read.", "Day 2", "Full mix")
        n += 1
    print(name, "day1", team["day1"], "day2", team["day2"])


def team1_review():
    im, d = b.canvas()
    b.pill(d, "Quick review", 48, 28, TEAL)
    b.day_label(d, "Day 2")
    b.heading(d, "Quick review", size=56)
    d.text((64, 200), "Sounds we know. Then a few words.", font=b.font(30), fill=MUTED)
    row_cards(d, ["m", "s", "a", "t"], 280, 240)
    d.text((64, 580), "Words:  am   at   sat   mat", font=b.font(44, True), fill=INK)
    save(im, "team1", 33)
    print("team1 review 33")


if __name__ == "__main__":
    icons()
    for team in TEAMS:
        build_team(team)
    team1_review()
    print("unified slides done")

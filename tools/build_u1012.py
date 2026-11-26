#!/usr/bin/env python3
"""Build Units 10-12 data, story art, slideshows, and day-labeled printables."""
import importlib.util, json, os, re, sys
from fontTools.ttLib import TTFont as FTFont
from PIL import Image, ImageDraw, ImageFont
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas as pdfcanvas
from reportlab.lib.utils import ImageReader

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
spec = importlib.util.spec_from_file_location('lessons', os.path.join(ROOT, 'tools', 'u1012_lessons.py'))
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
LESSONS = mod.LESSONS

W_PAGE, H_PAGE = 612, 792
CREAM = (255, 248, 231)
INK = (43, 37, 64)
ORANGE = (242, 140, 0)
TEAL = (31, 143, 140)
RED = (214, 40, 40)
PINK = (232, 96, 154)
SLIDE_W, SLIDE_H = 1600, 900

def load_font(size, bold=False):
    name = 'Andika-Bold.woff2' if bold else 'Andika-Regular.woff2'
    ttf = '/tmp/u1012-' + name.replace('.woff2', '.ttf')
    if not os.path.exists(ttf):
        f = FTFont(os.path.join(ROOT, 'fonts', name))
        f.flavor = None
        g = f['GSUB'].table
        subs = {}
        for fr in g.FeatureList.FeatureRecord:
            if fr.FeatureTag != 'cv56':
                continue
            for li in fr.Feature.LookupListIndex:
                for st in g.LookupList.Lookup[li].SubTable:
                    m = getattr(st, 'mapping', None) or getattr(getattr(st, 'ExtSubTable', None), 'mapping', None)
                    if m:
                        subs.update(m)
        for t in f['cmap'].tables:
            for cp, gn in list(t.cmap.items()):
                if gn in subs:
                    t.cmap[cp] = subs[gn]
        f.save(ttf)
    return ImageFont.truetype(ttf, size)

FONT = {}
def F(size, bold=False):
    key = (size, bold)
    if key not in FONT:
        FONT[key] = load_font(size, bold)
    return FONT[key]

def reg_pdf_fonts():
    for bold, label in ((False, 'Andika'), (True, 'Andika-Bold')):
        F(20, bold)  # writes the cv56 ttf
        path = '/tmp/u1012-Andika-%s.ttf' % ('Bold' if bold else 'Regular')
        pdfmetrics.registerFont(TTFont(label, path))

HEARTS = {
    'the': 'e', 'a': 'a', 'is': 's', 'to': 'o', 'I': 'I', 'has': 's', 'of': 'f', 'was': 'a',
    'you': 'ou', 'they': 'ey', 'says': 'ay', 'wear': 'ear', 'bear': 'ear', 'pear': 'ear',
    'break': 'ea', 'shoe': 'oe', 'sew': 'ew', 'height': 'eigh', 'where': 'ere', 'there': 'ere',
    'their': 'eir', 'great': 'ea', 'again': 'ai', 'said': 'ai', 'do': 'o', 'does': 'oe', 'goes': 'oe',
}

def words_of(L):
    bag = []
    def add(w):
        w = re.sub(r'[^A-Za-z]', '', w)
        if len(w) >= 2 and w.lower() not in [x.lower() for x in bag]:
            bag.append(w)
    for row in L['hear']:
        add(row['word'])
    for w in L['feed'] + L['fishYes'] + L['scramble'] + L['pics'] + L.get('bellExtra', []):
        add(w)
    for ch in L['chains']:
        for w in ch:
            add(w)
    for b in L['build']:
        add(b['word'])
    for s in L['sort']:
        add(s['word'])
    for c in L['check']:
        add(c['word'])
    for d in L['dayPlan']:
        for w in d['ido'] + d['wedo'] + d['youdo'] + d['spell'] + d['review']:
            add(w)
    hearts = {h['w'].lower() for h in L['heart']}
    pattern = [w for w in bag if w.lower() not in hearts]
    bell = pattern[:22] + [w for w in L.get('bellExtra', []) if w.lower() not in hearts][:8]
    # unique keep order
    seen = set(); out = []
    for w in bell:
        if w.lower() not in seen:
            seen.add(w.lower()); out.append(w)
    return pattern, out

def runtime(L):
    pattern, bell = words_of(L)
    key = L['key']
    pics = {w: 'img/u10pics/%s.webp' % w for w in L['pics']}
    # unit folders: u10pics, u11pics, u12pics
    pics = {w: 'img/u%dpics/%s.webp' % (L['unit'], w) for w in L['pics']}
    story = []
    for i, page in enumerate(L['story']):
        story.append({'text': page['text'], 'words': page['words'], 'img': 'img/%s_p%02d.webp' % (key, i + 1)})
    heart = [{'w': h['w'], 'part': h['part']} for h in L['heart']]
    return {
        'key': key, 'n': L['n'], 'unit': L['unit'], 'name': L['name'],
        'storyTitle': L['storyTitle'], 'blurb': L['blurb'], 'focus': L['focus'],
        'focusKind': L['focusKind'], 'vowels': L['vowels'], 'label': L['label'],
        'keyword': L['keyword'], 'rec': L['rec'], 'meet': L['meet'], 'chant': L['chant'],
        'hear': L['hear'], 'bellWords': bell, 'build': L['build'], 'chains': L['chains'],
        'scramble': L['scramble'], 'feed': L['feed'], 'sentences': L['sentences'],
        'fishLabel': L['fishLabel'], 'fishYes': L['fishYes'], 'fishNo': L['fishNo'],
        'bins': L['bins'], 'whichChoices': L['whichChoices'], 'whichLabel': L['whichLabel'],
        'words': pattern, 'days': L['days'], 'rhyme': L['rhyme'], 'sort': L['sort'],
        'which': L['which'], 'check': L['check'], 'heart': heart, 'newWords': L['newWords'],
        'pics': pics, 'story': story,
    }

UNITS = {
    10: {'name': 'More Bossy R', 'sounds': 'air · are · ear'},
    11: {'name': 'Long A and E Teams', 'sounds': 'ai · ay · ee · ea · ey'},
    12: {'name': 'Long O and I Teams', 'sounds': 'oa · ow · oe · ie · igh'},
}

def write_data(rows):
    payload = {'units': {str(k): v for k, v in UNITS.items()}, 'lessons': rows}
    text = json.dumps(payload, indent=1, ensure_ascii=False)
    header = (
        '/* Units 10 to 12 lesson data (More Bossy R, Long A and E teams, Long O and I teams).\n'
        '   Original Island Readers lessons. One skill per unit, matching the 22-unit home tiles.\n'
        '   Each lesson has 3 teaching days: I do, we do, you do, blending, spelling, and review. */\n'
    )
    open(os.path.join(ROOT, 'data_u1012.js'), 'w', encoding='utf-8').write(header + 'window.IR_DATA_U1012 = ' + text + ';\n')

def paste(base, sprite, box, anchor='bottom'):
    im = Image.open(sprite).convert('RGBA')
    bw, bh = box[2], box[3]
    im.thumbnail((bw, bh), Image.Resampling.LANCZOS)
    x = box[0] + (bw - im.width) // 2
    y = box[1] if anchor == 'top' else box[1] + bh - im.height
    base.alpha_composite(im, (x, y))

SPRITES = [
    'img/zipA.webp', 'img/frill.webp', 'img/frillC.webp',
    'img/u789act/act_zip_surf.webp', 'img/u789act/act_frill_fish.webp',
    'img/u789act/act_zip_blocks.webp', 'img/u789act/act_frill_paint.webp',
    'img/u789act/act_zip_juggle.webp', 'img/u789act/act_frill_drum.webp',
    'img/u789act/act_zip_magnify.webp', 'img/u789act/act_frill_bell.webp',
    'img/u789act/act_both_dance.webp',
]

def sky(draw, w, h, top, bot):
    for y in range(h):
        t = y / max(1, h - 1)
        col = tuple(int(top[i] * (1 - t) + bot[i] * t) for i in range(3))
        draw.line([(0, y), (w, y)], fill=col)

def story_image(L, index, path, prop=None):
    w, h = 1200, 800
    im = Image.new('RGBA', (w, h), (255, 248, 231, 255))
    d = ImageDraw.Draw(im)
    themes = [
        ((255, 214, 163), (120, 186, 214), (232, 176, 122)),
        ((186, 214, 255), (90, 140, 190), (214, 186, 140)),
        ((255, 196, 214), (255, 150, 120), (210, 160, 110)),
        ((180, 220, 190), (70, 150, 140), (196, 164, 110)),
        ((40, 48, 90), (20, 24, 50), (70, 60, 50)),
        ((255, 236, 180), (120, 190, 220), (230, 190, 130)),
    ]
    top, bot, ground = themes[index % len(themes)]
    sky(d, w, h, top, bot)
    d.ellipse([w - 220, 40, w - 40, 220], fill=(255, 244, 200, 255))
    d.rectangle([0, 560, w, h], fill=ground + (255,))
    d.ellipse([-80, 500, 400, 680], fill=tuple(min(255, c + 20) for c in ground) + (255,))
    # a simple prop so each page reads as a different moment
    props = [
        lambda: d.rounded_rectangle([430, 430, 620, 560], 16, fill=(160, 96, 48, 255)),
        lambda: d.polygon([(500, 560), (560, 360), (620, 560)], fill=(70, 140, 80, 255)),
        lambda: d.ellipse([480, 470, 700, 560], fill=(70, 150, 190, 255)),
        lambda: d.rounded_rectangle([500, 400, 560, 560], 8, fill=(190, 150, 70, 255)),
        lambda: d.pieslice([470, 430, 670, 590], 200, 340, fill=(214, 150, 70, 255)),
        lambda: d.polygon([(520, 300), (470, 560), (590, 560)], fill=(200, 80, 70, 255)),
    ]
    if prop and os.path.exists(prop):
        paste(im, prop, (470, 300, 260, 260))
    else:
        props[index % 6]()
    sprites = SPRITES[index % len(SPRITES):] + SPRITES[:index % len(SPRITES)]
    paste(im, os.path.join(ROOT, sprites[0]), (40, 250, 420, 560))
    if index % 2 == 0:
        paste(im, os.path.join(ROOT, sprites[1]), (700, 280, 420, 520))
    im.convert('RGB').save(path, 'WEBP', quality=78)

def cover_image(L, path):
    im = Image.new('RGB', (900, 900), CREAM)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([40, 40, 860, 860], 36, outline=ORANGE, width=8)
    d.text((450, 150), L['n'], font=F(140, True), fill=INK, anchor='mm')
    # wrap title
    title = L['storyTitle']
    d.text((450, 300), title, font=F(54, True), fill=TEAL, anchor='mm')
    d.text((450, 380), L['name'], font=F(36, False), fill=ORANGE, anchor='mm')
    base = im.convert('RGBA')
    paste(base, os.path.join(ROOT, 'img/zipA.webp'), (80, 460, 320, 380))
    paste(base, os.path.join(ROOT, 'img/frill.webp'), (500, 470, 320, 370))
    base.convert('RGB').save(path, 'WEBP', quality=78)

def icon(word, path):
    im = Image.new('RGBA', (400, 400), (255, 248, 231, 0))
    d = ImageDraw.Draw(im)
    ink = (43, 37, 64, 255)
    def chair():
        d.rounded_rectangle([90, 70, 200, 250], 16, fill=(176, 104, 56, 255), outline=ink, width=6)
        d.rounded_rectangle([80, 230, 300, 280], 12, fill=(196, 124, 70, 255), outline=ink, width=6)
        d.rectangle([100, 270, 130, 350], fill=ink); d.rectangle([250, 270, 280, 350], fill=ink)
    def hair():
        d.ellipse([110, 80, 290, 280], fill=(90, 56, 36, 255), outline=ink, width=6)
        d.ellipse([140, 130, 260, 300], fill=(244, 206, 170, 255), outline=ink, width=6)
        d.arc([150, 160, 190, 200], 20, 200, fill=ink, width=6)
        d.arc([210, 160, 250, 200], 20, 200, fill=ink, width=6)
    def stair():
        for i, x in enumerate(range(60, 300, 50)):
            d.rectangle([x, 320 - i * 40, x + 70, 340 - i * 40], fill=(190, 150, 90, 255), outline=ink, width=5)
    def pair():
        chair(); d.ellipse([250, 90, 340, 180], fill=(232, 96, 90, 255), outline=ink, width=6)
    def share():
        d.rounded_rectangle([70, 160, 190, 250], 20, fill=(240, 180, 80, 255), outline=ink, width=6)
        d.rounded_rectangle([200, 160, 330, 250], 20, fill=(240, 180, 80, 255), outline=ink, width=6)
    def ear():
        d.arc([80, 40, 320, 360], 300, 80, fill=(244, 186, 150, 255), width=28)
        d.arc([140, 110, 260, 290], 300, 80, fill=(214, 140, 120, 255), width=16)
    def gear():
        d.regular_polygon((200, 200, 120), 8, fill=(120, 140, 156, 255), outline=ink)
        d.ellipse([150, 150, 250, 250], fill=CREAM + (255,), outline=ink, width=6)
    def beard():
        hair(); d.pieslice([145, 180, 255, 330], 20, 160, fill=(70, 46, 30, 255), outline=ink)
    def year():
        d.rounded_rectangle([80, 70, 320, 330], 16, fill=(255, 255, 255, 255), outline=ink, width=6)
        d.rectangle([80, 70, 320, 130], fill=(214, 70, 70, 255))
        for i in range(3):
            for j in range(4):
                d.rectangle([100 + j * 52, 150 + i * 52, 140 + j * 52, 190 + i * 52], outline=ink, width=3)
    def rain():
        d.ellipse([70, 70, 250, 190], fill=(170, 186, 200, 255), outline=ink, width=6)
        for x in (120, 180, 240):
            d.line([(x, 210), (x - 16, 300)], fill=(70, 140, 200, 255), width=8)
    def train():
        d.rounded_rectangle([40, 150, 300, 250], 16, fill=(70, 120, 180, 255), outline=ink, width=6)
        d.rectangle([300, 170, 360, 240], fill=(50, 90, 140, 255), outline=ink, width=6)
        d.ellipse([80, 230, 140, 290], fill=ink); d.ellipse([200, 230, 260, 290], fill=ink)
    def paint():
        d.polygon([(80, 300), (140, 80), (190, 90), (140, 310)], fill=(196, 140, 70, 255), outline=ink)
        d.ellipse([150, 60, 250, 140], fill=(230, 70, 80, 255), outline=ink, width=6)
        d.ellipse([40, 250, 140, 340], fill=(70, 140, 210, 255))
    def hay():
        d.rectangle([120, 250, 280, 340], fill=(214, 170, 50, 255), outline=ink, width=6)
        d.polygon([(110, 250), (200, 120), (290, 250)], fill=(230, 190, 60, 255), outline=ink)
    def bay():
        d.arc([20, 160, 380, 360], 200, 340, fill=(70, 160, 200, 255), width=30)
        d.polygon([(40, 300), (80, 220), (130, 300)], fill=(90, 150, 90, 255))
    def bee():
        d.ellipse([110, 140, 290, 270], fill=(240, 200, 40, 255), outline=ink, width=6)
        d.rectangle([160, 150, 190, 260], fill=ink); d.rectangle([220, 150, 250, 260], fill=ink)
        d.ellipse([250, 150, 330, 200], fill=(200, 230, 255, 180), outline=ink, width=4)
    def tree():
        d.rectangle([180, 220, 220, 350], fill=(120, 80, 40, 255))
        d.ellipse([80, 60, 320, 260], fill=(60, 150, 80, 255), outline=ink, width=6)
    def key():
        d.ellipse([70, 140, 190, 260], outline=ink, width=14)
        d.rectangle([180, 185, 330, 215], fill=(212, 170, 50, 255), outline=ink, width=6)
        d.rectangle([280, 210, 310, 260], fill=(212, 170, 50, 255), outline=ink, width=6)
    def leaf():
        d.ellipse([80, 80, 320, 300], fill=(70, 160, 80, 255), outline=ink, width=6)
        d.line([(110, 250), (290, 110)], fill=ink, width=6)
    def beach():
        d.rectangle([0, 220, 400, 400], fill=(230, 200, 140, 255))
        d.arc([0, 160, 400, 300], 200, 340, fill=(70, 160, 210, 255), width=24)
    def tea():
        d.pieslice([80, 120, 260, 320], 0, 180, fill=(240, 240, 245, 255), outline=ink)
        d.arc([240, 170, 330, 250], 300, 60, fill=ink, width=8)
        d.ellipse([140, 90, 200, 130], fill=(160, 90, 50, 255))
    def boat():
        d.polygon([(60, 220), (340, 220), (290, 300), (110, 300)], fill=(196, 120, 60, 255), outline=ink)
        d.line([(200, 220), (200, 80)], fill=ink, width=8)
        d.polygon([(200, 90), (300, 170), (200, 170)], fill=(250, 250, 250, 255), outline=ink)
    def toad():
        d.ellipse([70, 160, 330, 320], fill=(80, 160, 70, 255), outline=ink, width=6)
        d.ellipse([120, 90, 190, 170], fill=(80, 160, 70, 255), outline=ink, width=6)
        d.ellipse([210, 90, 280, 170], fill=(80, 160, 70, 255), outline=ink, width=6)
        d.ellipse([145, 120, 165, 140], fill=ink); d.ellipse([230, 120, 250, 140], fill=ink)
    def coat():
        d.polygon([(120, 70), (280, 70), (320, 340), (80, 340)], fill=(70, 110, 170, 255), outline=ink)
        d.polygon([(200, 80), (150, 200), (250, 200)], fill=(240, 220, 180, 255), outline=ink)
    def soap():
        d.rounded_rectangle([80, 140, 320, 280], 30, fill=(230, 240, 250, 255), outline=ink, width=6)
        d.ellipse([140, 80, 200, 140], outline=(160, 200, 230, 255), width=6)
    def toast():
        d.rounded_rectangle([80, 90, 320, 320], 24, fill=(214, 160, 70, 255), outline=ink, width=6)
        d.rounded_rectangle([110, 120, 290, 290], 16, fill=(186, 120, 50, 255))
    def toe():
        d.ellipse([60, 180, 300, 320], fill=(244, 206, 170, 255), outline=ink, width=6)
        d.ellipse([250, 150, 340, 240], fill=(244, 206, 170, 255), outline=ink, width=6)
    def snow():
        d.ellipse([150, 40, 250, 140], fill=(255, 255, 255, 255), outline=ink, width=6)
        d.ellipse([80, 110, 210, 250], fill=(255, 255, 255, 255), outline=ink, width=6)
        d.ellipse([180, 110, 330, 260], fill=(255, 255, 255, 255), outline=ink, width=6)
    def rowboat():
        boat(); d.line([(40, 250), (160, 120)], fill=(120, 80, 40, 255), width=10)
    def glow():
        d.ellipse([40, 40, 360, 360], fill=(255, 220, 90, 180))
        d.ellipse([120, 120, 280, 280], fill=(255, 244, 180, 255), outline=ink, width=6)
    def bowl():
        d.pieslice([70, 80, 330, 320], 0, 180, fill=(230, 90, 70, 255), outline=ink)
    def pillow():
        d.rounded_rectangle([50, 120, 350, 290], 60, fill=(240, 220, 230, 255), outline=ink, width=6)
    def pie():
        d.ellipse([60, 140, 340, 320], fill=(214, 140, 60, 255), outline=ink, width=6)
        d.polygon([(200, 150), (80, 230), (320, 230)], fill=(240, 80, 80, 255), outline=ink)
    def night():
        d.rectangle([0, 0, 400, 400], fill=(28, 36, 74, 255))
        d.ellipse([240, 40, 340, 140], fill=(255, 244, 200, 255))
        for p in ((60, 50), (100, 120), (180, 70), (40, 180)):
            d.ellipse([p[0], p[1], p[0] + 8, p[1] + 8], fill=(255, 255, 255, 255))
    def light():
        d.polygon([(200, 40), (150, 180), (250, 180)], fill=(255, 220, 80, 255), outline=ink)
        d.rectangle([185, 180, 215, 300], fill=(80, 80, 90, 255))
        d.ellipse([150, 280, 250, 340], fill=(80, 80, 90, 255))
    def tie():
        d.polygon([(200, 40), (160, 90), (240, 90)], fill=(180, 30, 50, 255), outline=ink)
        d.polygon([(170, 90), (230, 90), (200, 340)], fill=(180, 30, 50, 255), outline=ink)
    fn = {
        'chair': chair, 'hair': hair, 'stair': stair, 'pair': pair, 'share': share,
        'ear': ear, 'gear': gear, 'beard': beard, 'year': year, 'rain': rain, 'train': train,
        'paint': paint, 'hay': hay, 'bay': bay, 'bee': bee, 'tree': tree, 'key': key,
        'leaf': leaf, 'beach': beach, 'tea': tea, 'boat': boat, 'toad': toad, 'coat': coat,
        'soap': soap, 'toast': toast, 'toe': toe, 'snow': snow, 'rowboat': rowboat,
        'glow': glow, 'bowl': bowl, 'pillow': pillow, 'pie': pie, 'night': night,
        'light': light, 'tie': tie,
    }
    (fn.get(word) or chair)()
    im.save(path, 'WEBP', quality=80)

def wrap_text(draw, text, font, width):
    lines, cur = [], ''
    for word in text.split():
        trial = word if not cur else cur + ' ' + word
        if draw.textlength(trial, font=font) <= width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines or ['']

def slide_image(L, day, kind, lines, path, n, total):
    im = Image.new('RGB', (SLIDE_W, SLIDE_H), CREAM)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([48, 36, 520, 110], 28, fill=ORANGE)
    d.text((284, 73), 'Lesson %s  ·  %s' % (L['n'], day['label']), font=F(32, True), fill=(255, 255, 255), anchor='mm')
    d.text((70, 150), kind, font=F(64, True), fill=TEAL)
    y = 250
    body = F(48, True)
    for line in lines:
        for part in wrap_text(d, line, body, 980):
            d.text((70, y), part, font=body, fill=INK)
            y += 64
    d.text((70, SLIDE_H - 70), 'Island Readers', font=F(28, False), fill=TEAL)
    d.text((SLIDE_W - 70, SLIDE_H - 70), '%d of %d' % (n, total), font=F(28, True), fill=INK, anchor='ra')
    sprite = SPRITES[(n + L['unit']) % len(SPRITES)]
    base = im.convert('RGBA')
    paste(base, os.path.join(ROOT, sprite), (1120, 160, 430, 620))
    base.convert('RGB').save(path, 'JPEG', quality=82)

def slides_for(L):
    slides = []
    for day in L['dayPlan']:
        fam = []
        for name, words in day['families']:
            fam.append(name + ': ' + ', '.join(words))
        slides.append((day, 'I do', [day['teach'], 'Listen: ' + ', '.join(day['ido'])]))
        slides.append((day, 'I do · blend', ['Blend each word. Touch the team, then say it fast.', ', '.join(day['ido'])]))
        slides.append((day, 'We do · blend', ['Say it with the class.', ', '.join(day['wedo'])]))
        slides.append((day, 'We do · spell', ['Spell it together. Say each sound, then write.', ', '.join(day['spell'])]))
        slides.append((day, 'You do · read', ['Read the words on your own.', ', '.join(day['youdo'])]))
        slides.append((day, 'You do · spell', ['The teacher says the word. Students write it.', ', '.join(day['spell'])]))
        slides.append((day, 'Word families', fam or ['Read the family.']))
        slides.append((day, 'Review', ['Mix in words you already know.', ', '.join(day['review'])]))
        slides.append((day, 'Written practice', ['Day page: read, blend, spell, and sort.', 'Lesson %s  ·  %s' % (L['n'], day['label'])]))
    slides.append((L['dayPlan'][-1], 'Story', ['Read the story.', L['storyTitle'], L['story'][0]['text']]))
    slides.append((L['dayPlan'][-1], 'End check', ['Zip\'s Check. The student taps the word they hear.', '10 words. No help during the check.']))
    return slides

def write_slides(L):
    folder = os.path.join(ROOT, 'materials', 'unit%d' % L['unit'], 'slides', L['key'])
    os.makedirs(folder, exist_ok=True)
    slides = slides_for(L)
    names = []
    per = 9
    # 3 days * 9 slides, then story + check on day 3
    for i, (day, kind, lines) in enumerate(slides, start=1):
        name = 'slide-%03d.jpg' % i
        slide_image(L, day, kind, lines, os.path.join(folder, name), i, len(slides))
        names.append(name)
    days = []
    for d in range(3):
        start = d * per + 1
        end = (d + 1) * per if d < 2 else len(slides)
        days.append({'day': d + 1, 'label': L['dayPlan'][d]['label'], 'start': start, 'end': end, 'page': start})
    manifest = {'title': 'Lesson %s · %s' % (L['n'], L['name']), 'count': len(names), 'days': days, 'slides': names}
    json.dump(manifest, open(os.path.join(folder, 'manifest.json'), 'w', encoding='utf-8'), indent=2)
    # PDF of the same slides for teachers who want paper
    pdf_path = os.path.join(ROOT, 'materials', 'unit%d' % L['unit'], 'Lesson%s_Slides.pdf' % L['n'])
    c = pdfcanvas.Canvas(pdf_path, pagesize=(720, 405))
    for name in names:
        c.drawImage(os.path.join(folder, name), 0, 0, 720, 405, preserveAspectRatio=True, anchor='c')
        c.showPage()
    c.save()
    return len(names)

class Doc:
    def __init__(self, path, footer):
        self.c = pdfcanvas.Canvas(path, pagesize=(W_PAGE, H_PAGE))
        self.footer = footer
        self.c.setTitle(os.path.basename(path).replace('_', ' ').replace('.pdf', ''))
    def page(self):
        c = self.c
        c.setFillColorRGB(1, 248 / 255, 231 / 255)
        c.rect(0, 0, W_PAGE, H_PAGE, fill=1, stroke=0)
        c.setStrokeColorRGB(*tuple(x / 255 for x in ORANGE)); c.setLineWidth(2)
        c.line(46, 40, W_PAGE - 46, 40)
        c.setFillColorRGB(*tuple(x / 255 for x in INK)); c.setFont('Andika', 9)
        c.drawCentredString(W_PAGE / 2, 24, self.footer)
        return c
    def save(self):
        self.c.save()

def pdf_rgb(c, col):
    c.setFillColorRGB(*tuple(x / 255 for x in col))

def draw_bits(c, x, y, word, size, focus_part=None, heart_part=None):
    font = 'Andika-Bold'
    c.setFont(font, size)
    cx = x
    for i, ch in enumerate(word):
        col = INK
        if heart_part and heart_part in word and word.find(heart_part) <= i < word.find(heart_part) + len(heart_part):
            col = RED
        elif focus_part and focus_part in word.lower() and word.lower().find(focus_part) <= i < word.lower().find(focus_part) + len(focus_part):
            col = TEAL
        pdf_rgb(c, col)
        c.drawString(cx, y, ch)
        cx += pdfmetrics.stringWidth(ch, font, size)
    return cx - x

def day_page(doc, L, day, index):
    c = doc.page()
    pdf_rgb(c, ORANGE)
    c.roundRect(48, 724, 220, 28, 10, fill=1, stroke=0)
    c.setFillColorRGB(1, 1, 1); c.setFont('Andika-Bold', 12)
    c.drawCentredString(158, 733, 'Lesson %s  ·  %s' % (L['n'], day['label']))
    pdf_rgb(c, INK); c.setFont('Andika-Bold', 22)
    c.drawString(48, 688, day['focus'])
    c.setFont('Andika', 12)
    y = 664
    for line in [day['teach']]:
        c.drawString(48, y, line[:95]); y -= 16
    c.setFont('Andika', 12); c.drawString(48, y, 'Name:')
    c.line(96, y - 2, 340, y - 2)
    c.drawString(360, y, 'Date:'); c.line(400, y - 2, 560, y - 2)
    y -= 36
    sections = [
        ('I do  ·  read with the teacher', day['ido']),
        ('We do  ·  blend, then write', day['wedo']),
        ('You do  ·  read on your own', day['youdo']),
    ]
    focus = day['focus'].split(' ')[0].lower()
    if focus not in ('air', 'are', 'ear', 'ai', 'ay', 'ee', 'ea', 'ey', 'oa', 'oe', 'ow', 'ie', 'igh'):
        focus = L['focus'][0]
    for title, words in sections:
        pdf_rgb(c, TEAL); c.setFont('Andika-Bold', 14); c.drawString(48, y, title); y -= 28
        x = 56
        for w in words:
            if x > 460:
                x = 56; y -= 32
            draw_bits(c, x, y, w, 20, focus_part=focus)
            x += pdfmetrics.stringWidth(w, 'Andika-Bold', 20) + 28
        y -= 40
    pdf_rgb(c, TEAL); c.setFont('Andika-Bold', 14); c.drawString(48, y, 'You do  ·  spell. Your teacher says the word.'); y -= 28
    for i, w in enumerate(day['spell']):
        pdf_rgb(c, INK); c.setFont('Andika', 12); c.drawString(56, y, '%d.' % (i + 1))
        c.setStrokeColorRGB(0.9, 0.84, 0.7); c.line(80, y - 2, 280, y - 2)
        y -= 28
    y -= 6
    pdf_rgb(c, TEAL); c.setFont('Andika-Bold', 14); c.drawString(48, y, 'Review'); y -= 24
    pdf_rgb(c, INK); c.setFont('Andika', 13)
    c.drawString(56, y, 'Read: ' + ', '.join(day['review'])); y -= 22
    fam = ';  '.join(name + ' ' + ' '.join(ws) for name, ws in day['families'])
    for line in [fam[i:i + 80] for i in range(0, len(fam), 80)][:3]:
        c.drawString(56, y, line); y -= 16
    doc.c.showPage()

def check_pack(path, L):
    doc = Doc(path, 'Island Readers  ·  Unit %d  ·  Lesson %s check' % (L['unit'], L['n']))
    c = doc.page()
    pdf_rgb(c, INK); c.setFont('Andika-Bold', 20)
    c.drawString(48, 730, 'Lesson %s check' % L['n'])
    c.setFont('Andika', 12)
    c.drawString(48, 700, 'The student reads each word. Mark right or not yet. No help during the check.')
    c.drawString(48, 680, 'Name:'); c.line(96, 678, 340, 678)
    words = [x['word'] for x in L['check']]
    for i, w in enumerate(words):
        col, row = i % 2, i // 2
        x = 48 + col * 260; y = 630 - row * 36
        c.setFont('Andika', 12); pdf_rgb(c, INK); c.drawString(x, y, '%d.' % (i + 1))
        draw_bits(c, x + 28, y, w, 16, focus_part=L['focus'][0])
        c.setFont('Andika', 10); c.drawString(x + 150, y, 'right    not yet')
    c.setFont('Andika-Bold', 13); c.drawString(48, 420, 'Dictation, one day at a time')
    c.setFont('Andika', 12); y = 396
    for i, day in enumerate(L['dayPlan']):
        c.drawString(48, y, '%s: %s' % (day['label'], ', '.join(day['spell']))); y -= 18
    c.drawString(48, y - 8, 'Story: ' + L['storyTitle'])
    doc.c.showPage(); doc.save()

def wordlist(path, L):
    doc = Doc(path, 'Island Readers  ·  Unit %d  ·  Lesson %s word list' % (L['unit'], L['n']))
    c = doc.page()
    pdf_rgb(c, INK); c.setFont('Andika-Bold', 20)
    c.drawString(48, 730, 'Word list  ·  Lesson %s' % L['n'])
    y = 690
    for day in L['dayPlan']:
        pdf_rgb(c, TEAL); c.setFont('Andika-Bold', 14); c.drawString(48, y, day['label'] + '  ·  ' + day['focus']); y -= 26
        x = 56
        for w in day['youdo']:
            if x > 480:
                x = 56; y -= 28
            draw_bits(c, x, y, w, 16, focus_part=L['focus'][0]); x += 90
        y -= 36
    pdf_rgb(c, RED); c.setFont('Andika-Bold', 14); c.drawString(48, y, 'Heart words'); y -= 26
    x = 56
    for h in L['heart']:
        draw_bits(c, x, y, h['w'], 18, heart_part=h['part']); x += 140
    y -= 36
    pdf_rgb(c, TEAL); c.setFont('Andika-Bold', 14); c.drawString(48, y, 'Chant'); y -= 22
    pdf_rgb(c, INK); c.setFont('Andika', 13)
    for line in L['chant']:
        c.drawString(56, y, line); y -= 18
    doc.c.showPage(); doc.save()

def build():
    reg_pdf_fonts()
    rows = [runtime(L) for L in LESSONS]
    write_data(rows)
    for L in LESSONS:
        unit_dir = os.path.join(ROOT, 'materials', 'unit%d' % L['unit'])
        os.makedirs(unit_dir, exist_ok=True)
        pic_dir = os.path.join(ROOT, 'img', 'u%dpics' % L['unit'])
        os.makedirs(pic_dir, exist_ok=True)
        for w in L['pics']:
            icon(w, os.path.join(pic_dir, w + '.webp'))
        for i, _page in enumerate(L['story']):
            prop = os.path.join(pic_dir, L['pics'][i % len(L['pics'])] + '.webp')
            story_image(L, i, os.path.join(ROOT, 'img', '%s_p%02d.webp' % (L['key'], i + 1)), prop)
        cover_image(L, os.path.join(ROOT, 'img', 'cover_%s.webp' % L['key']))
        nslides = write_slides(L)
        for i, day in enumerate(L['dayPlan'], start=1):
            path = os.path.join(unit_dir, 'Lesson%s_Day%d_Practice.pdf' % (L['n'], i))
            doc = Doc(path, 'Island Readers  ·  Unit %d  ·  Lesson %s  ·  %s' % (L['unit'], L['n'], day['label']))
            day_page(doc, L, day, i)
            doc.save()
        check_pack(os.path.join(unit_dir, 'Lesson%s_Teacher_Led_Checks.pdf' % L['n']), L)
        wordlist(os.path.join(unit_dir, 'Lesson%s_WordList.pdf' % L['n']), L)
        print(L['key'], 'slides', nslides)
    # unit packs: student day pages together, checks together
    by = {}
    for L in LESSONS:
        by.setdefault(L['unit'], []).append(L)
    for unit, group in by.items():
        unit_dir = os.path.join(ROOT, 'materials', 'unit%d' % unit)
        name = UNITS[unit]['name']
        doc = Doc(os.path.join(unit_dir, 'Unit%d_Teacher_Led_Student_Sheets.pdf' % unit),
                  'Island Readers  ·  Unit %d  ·  %s  ·  day practice' % (unit, name))
        for L in group:
            for day in L['dayPlan']:
                day_page(doc, L, day, 0)
        doc.save()
        doc = Doc(os.path.join(unit_dir, 'Unit%d_Teacher_Led_Checks_Combined.pdf' % unit),
                  'Island Readers  ·  Unit %d  ·  %s  ·  checks' % (unit, name))
        for L in group:
            c = doc.page()
            pdf_rgb(c, INK); c.setFont('Andika-Bold', 18)
            c.drawString(48, 730, 'Lesson %s  ·  %s' % (L['n'], L['name']))
            c.setFont('Andika', 12); y = 690
            for i, item in enumerate(L['check'], start=1):
                c.drawString(56, y, '%d.  %s' % (i, item['word'])); y -= 22
            doc.c.showPage()
        doc.save()
        doc = Doc(os.path.join(unit_dir, 'Unit%d_Independent_Worksheets.pdf' % unit),
                  'Island Readers  ·  Unit %d  ·  %s  ·  independent' % (unit, name))
        for L in group:
            c = doc.page()
            pdf_rgb(c, INK); c.setFont('Andika-Bold', 18)
            c.drawString(48, 730, 'Lesson %s  ·  sort and write' % L['n'])
            c.setFont('Andika', 12); c.drawString(48, 700, 'Read the word. Write it under the family it belongs to.')
            y = 660
            x = 56
            for item in L['sort']:
                if x > 480:
                    x = 56; y -= 28
                draw_bits(c, x, y, item['word'], 16, focus_part=L['focus'][0]); x += 90
            y -= 40
            bins = L['bins']
            bw = 500 / max(1, len(bins))
            for j, b in enumerate(bins):
                pdf_rgb(c, TEAL); c.setFont('Andika-Bold', 14)
                c.drawString(48 + j * bw, y, b['label'][:18])
            doc.c.showPage()
        doc.save()
    print('data and printables written')

if __name__ == '__main__':
    build()

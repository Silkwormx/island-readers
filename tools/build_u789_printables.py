#!/usr/bin/env python3
"""Units 7-9 printables, built the same way as the Units 1-3 packs (build_u123_printables.py).

Per lesson: LessonN.N_Teacher_Led_Checks.pdf (teacher sheet with script and answers, then the student sheet)
and LessonN.N_WordList.pdf. Per unit: UnitN_Teacher_Led_Student_Sheets.pdf, UnitN_Teacher_Led_Checks_Combined.pdf
and UnitN_Independent_Worksheets.pdf (no cutting: circle, write, trace, sort by writing).
Words come from data_u789.js. Andika with the hookless t (cv56) baked into a temporary TTF, cream pages.
"""
import json, os, random, re, sys
from fontTools.ttLib import TTFont as FTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 612, 792
CREAM = (1, 248 / 255, 231 / 255); CREAM2 = (251 / 255, 239 / 255, 210 / 255)
INK = (43 / 255, 37 / 255, 64 / 255); ORANGE = (242 / 255, 140 / 255, 0); TEAL = (31 / 255, 166 / 255, 166 / 255)
CORAL = (226 / 255, 88 / 255, 74 / 255); RED = (214 / 255, 40 / 255, 40 / 255); LINE = (232 / 255, 214 / 255, 176 / 255)
GREY = (190 / 255, 182 / 255, 172 / 255)
TMP = '/tmp/u789print'; os.makedirs(TMP, exist_ok=True)


def fonts():
    for s in ('Regular', 'Bold'):
        out = '%s/Andika-%s-cv56.ttf' % (TMP, s)
        if not os.path.exists(out):
            f = FTFont(os.path.join(ROOT, 'fonts', 'Andika-%s.woff2' % s)); f.flavor = None
            g = f['GSUB'].table; subs = {}
            for fr in g.FeatureList.FeatureRecord:
                if fr.FeatureTag != 'cv56': continue
                for li in fr.Feature.LookupListIndex:
                    for st in g.LookupList.Lookup[li].SubTable:
                        m = getattr(st, 'mapping', None) or getattr(getattr(st, 'ExtSubTable', None), 'mapping', None)
                        if m: subs.update(m)
            for t in f['cmap'].tables:
                for cp, gn in list(t.cmap.items()):
                    if gn in subs: t.cmap[cp] = subs[gn]
            f.save(out)
        pdfmetrics.registerFont(TTFont('Andika' if s == 'Regular' else 'Andika-Bold', out))


HEART = {'I': 'I', 'a': 'a', 'the': 'e', 'is': 's', 'to': 'o', 'his': 's', 'has': 's', 'of': 'of', 'and': '', 'what': 'a', 'we': 'e',
         'from': 'o', 'do': 'o', 'they': 'ey', 'put': 'u', 'want': 'a', 'where': 'ere', 'who': 'who',
         'one': 'o', 'two': 'wo', 'come': 'o', 'some': 'o', 'many': 'a', 'any': 'a', 'could': 'oul', 'would': 'oul', 'should': 'oul', 'were': 'ere',
         'there': 'ere', 'their': 'eir', 'four': 'our', 'your': 'our', 'does': 'oe', 'done': 'o', 'other': 'o', 'mother': 'o', 'heard': 'ear', 'learn': 'ear'}
CHANT = {}  # filled from data_u789.js in load()
UNIT = {7: 'Syllables', 8: 'Tricky Sounds', 9: 'Bossy R'}
SYL = {}
BLUE = (31 / 255, 111 / 255, 178 / 255); SYLO = (201 / 255, 90 / 255, 16 / 255)


def load():
    raw = open(os.path.join(ROOT, 'data_u789.js'), encoding='utf-8').read()
    i = raw.index('{', raw.index('window.IR_DATA_U'))
    d = json.loads(raw[i:].rstrip().rstrip(';')); SYL.update(d['syl'])
    for L in d['lessons']: CHANT[L['key']] = L['chant']
    return d['lessons']


def wrap(text, font, size, width):
    lines, cur = [], ''
    for w in str(text).split():
        t = w if not cur else cur + ' ' + w
        if pdfmetrics.stringWidth(t, font, size) <= width: cur = t
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines or ['']


def focus_span(w, L):
    s = w.lower(); k = L['focusKind']; lst = sorted(L['focus'], key=len, reverse=True)
    if k == 'vowel':
        i = next((j for j, c in enumerate(s) if c in 'aeiou'), -1); return (i, i + 1) if i >= 0 else None
    if k == 'floss':
        m = re.search(r'(ff|ll|ss|zz)$', s); return m.span() if m else None
    if k == 'blend':
        for f in lst:
            if s.startswith(f): return (0, len(f))
        return None
    if k == 'endblend':
        for f in lst:
            if len(s) > len(f) and s.endswith(f): return (len(s) - len(f), len(s))
        return None
    if k == 'pattern':
        for f in lst:
            for m in re.finditer(f, s):
                if f.endswith('r') and m.end() < len(s) and s[m.end()] in 'aeiouy': continue
                return m.span()
        return None
    m = re.search('sh|ch|th|wh|ck', s); return m.span() if m else None


def draw_word(c, x, y, word, size, L=None, center=False, heart=False, color=INK):
    """Draws a word; focus part teal (coral for vowels in Unit 1). Heart words: red part plus a red heart."""
    font = 'Andika-Bold'
    wtot = pdfmetrics.stringWidth(word, font, size)
    if center: x -= wtot / 2
    span = None; col = TEAL
    if heart:
        part = HEART.get(word, word); i = word.find(part) if part else -1
        span = (i, i + len(part)) if i >= 0 else None; col = RED
    elif L and L['focusKind'] == 'syllable' and SYL.get(word.lower()):
        cx = x; p = 0
        for n, sy in enumerate(SYL[word.lower()]):
            seg = word[p:p + len(sy)]; p += len(sy)
            c.setFillColorRGB(*(SYLO if n % 2 == 0 else BLUE)); c.setFont(font, size); c.drawString(cx, y, seg); cx += pdfmetrics.stringWidth(seg, font, size)
        if p < len(word):
            c.setFillColorRGB(*color); c.drawString(cx, y, word[p:])
        c.setFillColorRGB(*INK)
        return wtot
    elif L:
        span = focus_span(word, L); col = CORAL if L['focusKind'] == 'vowel' else TEAL
    cx = x
    for i, ch in enumerate(word):
        c.setFillColorRGB(*(col if span and span[0] <= i < span[1] else color))
        c.setFont(font, size); c.drawString(cx, y, ch); cx += pdfmetrics.stringWidth(ch, font, size)
    if heart:
        heart_shape(c, x + wtot + 3, y + size * 0.6, size * 0.45)
    c.setFillColorRGB(*INK)
    return wtot


def heart_shape(c, x, y, s):
    c.setFillColorRGB(*RED)
    p = c.beginPath()
    p.moveTo(x + s / 2, y - s * 0.55)
    p.curveTo(x - s * 0.1, y - s * 0.05, x + s * 0.05, y + s * 0.5, x + s / 2, y + s * 0.18)
    p.curveTo(x + s * 0.95, y + s * 0.5, x + s * 1.1, y - s * 0.05, x + s / 2, y - s * 0.55)
    c.drawPath(p, fill=1, stroke=0)


class Doc:
    def __init__(self, path, footer):
        self.c = canvas.Canvas(path, pagesize=(W, H)); self.footer = footer
        self.c.setTitle(os.path.basename(path).replace('_', ' ').replace('.pdf', ''))

    def page(self, footer=None):
        c = self.c
        c.setFillColorRGB(*CREAM); c.rect(0, 0, W, H, fill=1, stroke=0)
        c.setStrokeColorRGB(*ORANGE); c.setLineWidth(2); c.line(46, 40, W - 46, 40)
        c.setFillColorRGB(*INK); c.setFont('Andika', 9); c.drawCentredString(W / 2, 24, footer or self.footer)
        return c

    def end(self): self.c.showPage()
    def save(self): self.c.save()


def png(rel):
    out = os.path.join(TMP, re.sub(r'[^a-zA-Z0-9]', '_', rel) + '.png')
    if not os.path.exists(out): Image.open(os.path.join(ROOT, rel)).convert('RGBA').save(out)
    return out


def cover(doc, kicker, title, subtitle, blurb):
    c = doc.page()
    c.drawImage(ImageReader(png('img/zipA.webp')), 64, 530, 140, 170, mask='auto', preserveAspectRatio=True, anchor='s')
    c.drawImage(ImageReader(os.path.join(ROOT, 'materials/unit6/frill-v4b.png')), 408, 515, 150, 190, mask='auto', preserveAspectRatio=True, anchor='s')
    c.setStrokeColorRGB(*ORANGE); c.setFillColorRGB(*CREAM2); c.setLineWidth(3); c.roundRect(78, 300, 456, 210, 22, fill=1, stroke=1)
    c.setFillColorRGB(*INK); c.setFont('Andika-Bold', 26); c.drawCentredString(W / 2, 440, title)
    c.setFont('Andika-Bold', 16); c.drawCentredString(W / 2, 408, kicker)
    c.setFont('Andika', 12); y = 372
    for line in wrap(subtitle, 'Andika', 12, 400): c.drawCentredString(W / 2, y, line); y -= 18
    c.setFont('Andika', 11); y = 250
    for line in wrap(blurb, 'Andika', 11, 460): c.drawCentredString(W / 2, y, line); y -= 16
    doc.end()


def name_date(c, y):
    c.setFont('Andika', 12); c.setFillColorRGB(*INK); c.drawString(48, y, 'Name:')
    c.setStrokeColorRGB(*LINE); c.setLineWidth(1); c.line(96, y - 2, 360, y - 2)
    c.drawString(380, y, 'Date:'); c.line(420, y - 2, 564, y - 2)
    return y - 30


def heading(c, L, title, note, names=True, tag=None):
    c.setFillColorRGB(*ORANGE); c.roundRect(48, 724, 170, 26, 10, fill=1, stroke=0)
    c.setFillColorRGB(1, 1, 1); c.setFont('Andika-Bold', 11); c.drawCentredString(133, 732, tag or ('Lesson ' + L['n'] + '  ·  ' + L['name']))
    c.setFillColorRGB(*INK); c.setFont('Andika-Bold', 22); c.drawString(48, 690, title)
    c.setFont('Andika', 12); y = 668
    for line in wrap(note, 'Andika', 12, 516): c.drawString(48, y, line); y -= 16
    return name_date(c, y - 8) if names else y - 10


def check_words(L):
    return [x['word'] for x in L['check']][:10]


def dictation(L):
    dd = L.get('dayDict')
    if dd: return dd
    ws = [x['word'] for x in L['check']]; ss = [s['text'] for s in L['sentences']]
    return [(ws[0:3], ss[0]), (ws[3:6], ss[1 % len(ss)]), (ws[6:9], ss[2 % len(ss)])]


def score_box(c, y, total=10):
    c.setStrokeColorRGB(*ORANGE); c.setFillColorRGB(1, 1, 1); c.roundRect(48, y - 58, 516, 58, 10, fill=1, stroke=1)
    c.setFillColorRGB(*INK); c.setFont('Andika-Bold', 12); c.drawString(60, y - 20, 'Score: ______ / %d' % total)
    c.setFont('Andika', 11)
    c.drawString(60, y - 40, '9 or 10: move on.   7 or 8: review the missed words tomorrow.   6 or fewer: re-teach the I do.')
    return y - 74


def teacher_pages(doc, L):
    c = doc.page()
    y = heading(c, L, 'Teacher sheet: read the words', 'The student reads each word on the student sheet. Mark it right or not yet. No help during the check. Use pure sounds only.', names=True)
    c.setFillColorRGB(*TEAL); c.setFont('Andika-Bold', 12); c.drawString(48, y, 'Say this first'); y -= 17
    c.setFillColorRGB(*INK); c.setFont('Andika', 11)
    for line in wrap('Read each word to me. Touch each sound, then say the word fast. If you are not sure, it is OK to try.', 'Andika', 11, 516):
        c.drawString(48, y, line); y -= 15
    y -= 8
    for i, w in enumerate(check_words(L)):
        col, row = i % 2, i // 2; x = 48 + col * 262; yy = y - row * 34
        c.setFillColorRGB(1, 1, 1); c.setStrokeColorRGB(*LINE); c.roundRect(x, yy - 26, 250, 30, 8, fill=1, stroke=1)
        c.setFillColorRGB(*INK); c.setFont('Andika', 11); c.drawString(x + 10, yy - 15, '%d.' % (i + 1))
        draw_word(c, x + 34, yy - 17, w, 16, L)
        c.setFont('Andika', 10); c.drawString(x + 150, yy - 15, 'right   not yet')
    y = y - 5 * 34 - 10
    y = score_box(c, y)
    c.setFillColorRGB(*TEAL); c.setFont('Andika-Bold', 12); c.drawString(48, y, 'Dictation (say each word two times)'); y -= 18
    c.setFillColorRGB(*INK); c.setFont('Andika', 11)
    for d, (ws, s) in enumerate(dictation(L)):
        c.drawString(48, y, 'Day %d:  %s   ·   sentence: %s' % (d + 1, ', '.join(ws), s)); y -= 16
    y -= 6
    c.setFillColorRGB(*TEAL); c.setFont('Andika-Bold', 12); c.drawString(48, y, 'If a word is missed'); y -= 16
    c.setFillColorRGB(*INK); c.setFont('Andika', 11)
    for line in wrap('"My turn. Touch each sound, then say it fast. Your turn." Bring the word back 3 items later and mark it for review.', 'Andika', 11, 516):
        c.drawString(48, y, line); y -= 15
    y -= 6
    c.setFillColorRGB(*TEAL); c.setFont('Andika-Bold', 12); c.drawString(48, y, 'Sentences to read (student sheet, part 3)'); y -= 16
    c.setFillColorRGB(*INK); c.setFont('Andika', 11)
    for s in [x['text'] for x in L['sentences']][:4]:
        c.drawString(60, y, s + '      right   not yet'); y -= 15
    doc.end()


def student_pages(doc, L):
    c = doc.page()
    y = heading(c, L, 'Read the words', 'Read each word out loud to your teacher.')
    for i, w in enumerate(check_words(L)):
        col, row = i % 2, i // 2; x = 60 + col * 256; yy = y - row * 54
        c.setFillColorRGB(1, 1, 1); c.setStrokeColorRGB(*LINE); c.roundRect(x, yy - 46, 236, 46, 12, fill=1, stroke=1)
        c.setFillColorRGB(*GREY); c.setFont('Andika', 11); c.drawString(x + 10, yy - 16, str(i + 1))
        draw_word(c, x + 118, yy - 33, w, 28, None, center=True)
    y = y - 5 * 54 - 22
    c.setFillColorRGB(*INK); c.setFont('Andika-Bold', 16); c.drawString(48, y, 'Write it'); y -= 10
    for i in range(3):
        yy = y - 36 - i * 40
        c.setFont('Andika', 12); c.drawString(52, yy + 4, str(i + 1)); c.setStrokeColorRGB(*LINE); c.setLineWidth(1.2); c.line(72, yy, 300, yy)
    c.setFont('Andika', 12); c.drawString(320, y - 32, 'Sentence:'); c.line(320, y - 72, 564, y - 72); c.line(320, y - 112, 564, y - 112)
    y -= 136
    c.setFont('Andika-Bold', 16); c.drawString(48, y, 'Read the sentences'); y -= 28
    hearts = {h['w'] for h in L['heart']}
    for s in [x['text'] for x in L['sentences']][:3]:
        x = 60
        for w in s.split(' '):
            core = w.strip('.,!?')
            ww = draw_word(c, x, y, core, 20, heart=core in hearts or core.lower() in hearts)
            c.setFont('Andika-Bold', 20); c.drawString(x + ww, y, w[len(core):]); x += ww + pdfmetrics.stringWidth(w[len(core):] + '  ', 'Andika-Bold', 20) + (22 if (core in hearts or core.lower() in hearts) else 0)
        y -= 30
    doc.end()


def wordlist(L, path):
    doc = Doc(path, 'Island Readers  ·  Unit %d  ·  %s  ·  Lesson %s word list' % (L['unit'], UNIT[L['unit']], L['n']))
    c = doc.page()
    y = heading(c, L, 'Word list: ' + L['label'], 'Words for this lesson by day, heart words, sentences and a rhyme to chant. Focus part in color.', names=False)
    dws = L.get('dayWords') or [[x['word'] for x in L['check']][i * 4:i * 4 + 5] for i in range(3)]
    if not L.get('dayWords'):
        allw = list(dict.fromkeys(L['bellWords'] + [x['word'] for x in L['sort']]))
        n = (len(allw) + 2) // 3; dws = [allw[:n], allw[n:2 * n], allw[2 * n:]]
    for d, ws in enumerate(dws):
        c.setFillColorRGB(*TEAL); c.setFont('Andika-Bold', 13); c.drawString(48, y, 'Day %d: %s' % (d + 1, L['days'][d])); y -= 30
        for i, w in enumerate(ws[:15]):
            col, row = i % 5, i // 5
            draw_word(c, 60 + col * 104, y - row * 30, w, 20, L)
        y -= ((len(ws[:15]) + 4) // 5) * 30 + 6
    c.setFillColorRGB(*TEAL); c.setFont('Andika-Bold', 13); c.drawString(48, y, 'Heart words (learn the red part by heart)'); y -= 30
    x = 60
    for h in L['heart']:
        ww = draw_word(c, x, y, h['w'], 22, heart=True); x += ww + 50
    y -= 34
    c.setFillColorRGB(*TEAL); c.setFont('Andika-Bold', 13); c.drawString(48, y, 'Sentences'); y -= 20
    c.setFillColorRGB(*INK); c.setFont('Andika', 13)
    for s in [x['text'] for x in L['sentences']]: c.drawString(60, y, s); y -= 18
    y -= 8
    c.setFillColorRGB(*TEAL); c.setFont('Andika-Bold', 13); c.drawString(48, y, 'Rhyme to chant (clap the beat)'); y -= 20
    c.setFillColorRGB(*INK); c.setFont('Andika', 13)
    for s in CHANT[L['key']]: c.drawString(60, y, s); y -= 18
    doc.end(); doc.save()


def pics_of(L):
    out = []
    for w, p in L['pics'].items():
        if p.startswith('svg') or not os.path.exists(os.path.join(ROOT, p)): continue
        out.append((w, p))
    return out


def indep_pages(doc, L):
    rnd = random.Random(L['key'])
    words = list(dict.fromkeys([x['word'] for x in L['check']] + L['bellWords']))
    pics = pics_of(L)
    # Page 1: circle the word that matches the picture (or that has the focus part, if few pictures)
    c = doc.page()
    if len(pics) >= 4:
        y = heading(c, L, 'Look, read, circle', 'Look at the picture. Read the words. Circle the word that matches the picture.')
        items = pics[:5]
        for i, (w, p) in enumerate(items):
            yy = y - 10 - i * 112
            c.setFillColorRGB(1, 1, 1); c.setStrokeColorRGB(*LINE); c.roundRect(48, yy - 98, 516, 104, 12, fill=1, stroke=1)
            c.drawImage(ImageReader(png(p)), 58, yy - 92, 120, 92, preserveAspectRatio=True, mask='auto')
            # Real lesson words only as choices (no pseudowords): prefer words that share letters with the answer.
            pool = [x for x in words if x.lower() != w.lower()]
            pool.sort(key=lambda x: (-len(set(x) & set(w)), rnd.random()))
            ch = [w] + pool[:2]
            rnd.shuffle(ch)
            for j, cw in enumerate(ch): draw_word(c, 260 + j * 105, yy - 56, cw, 26, None, center=True)
    else:
        y = heading(c, L, 'Read and color', 'Read each word. Color the %s part.' % L['label'].replace('a floss ending', 'floss ending'))
        for i, w in enumerate(words[:12]):
            col, row = i % 3, i // 3; x = 60 + col * 172; yy = y - 20 - row * 120
            c.setFillColorRGB(1, 1, 1); c.setStrokeColorRGB(*LINE); c.roundRect(x, yy - 80, 156, 90, 12, fill=1, stroke=1)
            c.setFillColorRGB(*INK); c.setFont('Andika-Bold', 38); c.drawCentredString(x + 78, yy - 46, w)
    doc.end()
    # Page 2: read, trace, write
    c = doc.page()
    y = heading(c, L, 'Read, trace, write', 'Read the word. Trace it. Write it on the line. Say each sound as you write.')
    for i, w in enumerate(words[:8]):
        yy = y - 12 - i * 66
        draw_word(c, 60, yy - 30, w, 26, L)
        c.setFillColorRGB(*GREY); c.setFont('Andika', 30); c.drawString(210, yy - 32, w)
        c.setStrokeColorRGB(*LINE); c.setLineWidth(1.2); c.line(210, yy - 38, 360, yy - 38); c.line(390, yy - 38, 560, yy - 38)
        c.setDash(3, 4); c.line(210, yy - 20, 360, yy - 20); c.line(390, yy - 20, 560, yy - 20); c.setDash()
    doc.end()
    # Page 3: sort by writing (no cutting)
    c = doc.page()
    bins = L['bins'][:4]
    y = heading(c, L, 'Read and sort', 'Read each word in the word bank. Write it in the box where it belongs.')
    bank = [x['word'] for x in L['sort'] if x['bin'] in {b['id'] for b in bins}][:12]
    c.setFillColorRGB(1, 1, 1); c.setStrokeColorRGB(*ORANGE); c.roundRect(48, y - 92, 516, 96, 12, fill=1, stroke=1)
    for i, w in enumerate(bank):
        col, row = i % 6, i // 6; draw_word(c, 92 + col * 84, y - 36 - row * 40, w, 20, None, center=True)
    y -= 116
    bw = (516 - (len(bins) - 1) * 12) / len(bins)
    for j, b in enumerate(bins):
        x = 48 + j * (bw + 12)
        c.setFillColorRGB(1, 1, 1); c.setStrokeColorRGB(*TEAL); c.setLineWidth(2); c.roundRect(x, 80, bw, y - 80, 12, fill=1, stroke=1)
        c.setFillColorRGB(*TEAL); c.setFont('Andika-Bold', 22); c.drawCentredString(x + bw / 2, y - 32, b['label'])
        c.setStrokeColorRGB(*LINE); c.setLineWidth(1)
        for k in range(6): c.line(x + 12, y - 80 - k * 48, x + bw - 12, y - 80 - k * 48)
    doc.end()
    # Page 4: finish the sentence (circle and write) + read the rhyme
    c = doc.page()
    y = heading(c, L, 'Finish the sentence', 'Read the sentence. Circle the word that fits. Write it on the line.')
    sents = [x for x in L['sentences']][:4]
    for i, s in enumerate(sents):
        ws = s['words']; cand = [k for k, w in enumerate(ws) if w.strip('.,!?').lower() in {x.lower() for x in words}]
        k = cand[-1] if cand else len(ws) - 1
        ans = ws[k].strip('.,!?'); punct = ws[k][len(ans):]
        other = rnd.choice([x for x in words if x.lower() != ans.lower()])
        if ans[0].isupper(): other = other[0].upper() + other[1:]
        opts = [ans, other]; rnd.shuffle(opts)
        yy = y - 16 - i * 92
        text = ' '.join(ws[:k] + ['________' + punct] + ws[k + 1:])
        c.setFillColorRGB(*INK); c.setFont('Andika-Bold', 20); c.drawString(60, yy - 22, '%d.  %s' % (i + 1, text))
        c.setFont('Andika-Bold', 20)
        for j, o in enumerate(opts): c.drawString(110 + j * 140, yy - 56, o)
    y = y - 16 - len(sents) * 92 - 10
    c.setFillColorRGB(*CREAM2); c.setStrokeColorRGB(*ORANGE); c.roundRect(48, y - 124, 516, 120, 12, fill=1, stroke=1)
    c.setFillColorRGB(*TEAL); c.setFont('Andika-Bold', 14); c.drawString(64, y - 24, 'Read the rhyme. Clap the beat.')
    c.setFillColorRGB(*INK); c.setFont('Andika-Bold', 16)
    for j, line in enumerate(CHANT[L['key']]): c.drawString(80, y - 48 - j * 20, line)
    doc.end()


def main():
    fonts()
    lessons = load()
    for u in (7, 8, 9):
        Ls = [L for L in lessons if L['unit'] == u]
        out = os.path.join(ROOT, 'materials', 'unit%d' % u); os.makedirs(out, exist_ok=True)
        base = 'Island Readers  ·  Unit %d  ·  %s' % (u, UNIT[u])
        ns = ', '.join(L['n'] for L in Ls)
        st = Doc(os.path.join(out, 'Unit%d_Teacher_Led_Student_Sheets.pdf' % u), base + '  ·  student sheets')
        cover(st, 'Student sheets', 'Unit %d: %s' % (u, UNIT[u]), 'Read the words. Write the words your teacher says. Read the sentences.', 'Student sheets for Lessons %s.' % ns)
        for L in Ls: student_pages(st, L)
        st.save()
        cb = Doc(os.path.join(out, 'Unit%d_Teacher_Led_Checks_Combined.pdf' % u), base + '  ·  teacher-led checks')
        cover(cb, 'Teacher-led checks', 'Unit %d: %s' % (u, UNIT[u]), 'Lessons %s in one pack.' % ns, 'For each lesson: a teacher sheet with the script, answers and dictation, then the student sheet.')
        for L in Ls: teacher_pages(cb, L); student_pages(cb, L)
        cb.save()
        ind = Doc(os.path.join(out, 'Unit%d_Independent_Worksheets.pdf' % u), base + '  ·  independent worksheets')
        cover(ind, 'Independent worksheets', 'Unit %d: %s' % (u, UNIT[u]), 'No cutting. Circle, trace, write and sort by writing.', 'Four pages per lesson for Lessons %s. Students work on their own after the lesson.' % ns)
        for L in Ls: indep_pages(ind, L)
        ind.save()
        for L in Ls:
            d = Doc(os.path.join(out, 'Lesson%s_Teacher_Led_Checks.pdf' % L['n']), base + '  ·  Lesson ' + L['n'])
            cover(d, 'Teacher-led checks', 'Lesson %s' % L['n'], L['name'], 'A teacher sheet with the script and answers, then the student sheet for the same words.')
            teacher_pages(d, L); student_pages(d, L); d.save()
            wordlist(L, os.path.join(out, 'Lesson%s_WordList.pdf' % L['n']))
        print('wrote', out)


if __name__ == '__main__':
    main()

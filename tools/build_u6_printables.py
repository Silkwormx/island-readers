#!/usr/bin/env python3
"""Unit 6 teacher checks and daily student sheets.

Words and sentences come from data_u6.js. Original sheets, Andika, cream pages.
"""
import json
import os
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'materials', 'unit6')
W, H = 612, 792
CREAM = (1, 248 / 255, 231 / 255)
CREAM2 = (251 / 255, 239 / 255, 210 / 255)
INK = (43 / 255, 37 / 255, 64 / 255)
ORANGE = (242 / 255, 140 / 255, 0)
TEAL = (31 / 255, 166 / 255, 166 / 255)
GREEN = (46 / 255, 158 / 255, 107 / 255)
LINE = (232 / 255, 214 / 255, 176 / 255)

pdfmetrics.registerFont(TTFont('Andika', '/tmp/Andika-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Andika-Bold', '/tmp/Andika-Bold.ttf'))


def load_lessons():
    raw = open(os.path.join(ROOT, 'data_u6.js'), encoding='utf-8').read()
    body = raw.split('=', 1)[1].strip()
    if body.endswith(';'):
        body = body[:-1]
    return json.loads(body)['lessons']


def uniq(items):
    out = []
    for item in items:
        if item not in out:
            out.append(item)
    return out


def wrap(text, font, size, width):
    words = str(text).split()
    lines, cur = [], ''
    for word in words:
        trial = word if not cur else cur + ' ' + word
        if pdfmetrics.stringWidth(trial, font, size) <= width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines or ['']


class Doc:
    def __init__(self, path):
        self.c = canvas.Canvas(path, pagesize=(W, H))
        self.c.setTitle(os.path.basename(path).replace('_', ' ').replace('.pdf', ''))

    def page(self, footer):
        c = self.c
        c.setFillColorRGB(*CREAM)
        c.rect(0, 0, W, H, fill=1, stroke=0)
        c.setStrokeColorRGB(*ORANGE)
        c.setLineWidth(2)
        c.line(46, 40, W - 46, 40)
        c.setFillColorRGB(*INK)
        c.setFont('Andika', 9)
        c.drawCentredString(W / 2, 24, footer)
        return c

    def save(self):
        self.c.save()


def footer_for(kind, lesson=None):
    base = 'Island Readers  ·  Unit 6  ·  Endings'
    if lesson:
        return base + '  ·  Lesson ' + lesson['n']
    if kind == 'student':
        return base + '  ·  student sheets'
    return base + '  ·  teacher-led checks'


def cover(doc, kicker, title, subtitle, blurb, footer):
    c = doc.page(footer)
    zip_png = '/tmp/zipA-u6.png'
    if not os.path.exists(zip_png):
        Image.open(os.path.join(ROOT, 'img/zipA.webp')).save(zip_png)
    frill = os.path.join(ROOT, 'materials/unit6/frill-v4b.png')
    c.drawImage(ImageReader(zip_png), 64, 530, 140, 170, mask='auto', preserveAspectRatio=True, anchor='s')
    c.drawImage(ImageReader(frill), 408, 515, 150, 190, mask='auto', preserveAspectRatio=True, anchor='s')
    c.setStrokeColorRGB(*ORANGE)
    c.setFillColorRGB(*CREAM2)
    c.setLineWidth(3)
    c.roundRect(78, 300, 456, 210, 22, fill=1, stroke=1)
    c.setFillColorRGB(*INK)
    c.setFont('Andika-Bold', 26)
    c.drawCentredString(W / 2, 440, title)
    c.setFont('Andika-Bold', 16)
    c.drawCentredString(W / 2, 408, kicker)
    c.setFont('Andika', 12)
    y = 372
    for line in wrap(subtitle, 'Andika', 12, 400):
        c.drawCentredString(W / 2, y, line)
        y -= 18
    c.setFont('Andika', 11)
    y = 250
    for line in wrap(blurb, 'Andika', 11, 460):
        c.drawCentredString(W / 2, y, line)
        y -= 16
    doc.c.showPage()


def name_date(c, y):
    c.setFont('Andika', 12)
    c.setFillColorRGB(*INK)
    c.drawString(48, y, 'Name:')
    c.setStrokeColorRGB(*LINE)
    c.setLineWidth(1)
    c.line(96, y - 2, 360, y - 2)
    c.drawString(380, y, 'Date:')
    c.line(420, y - 2, 564, y - 2)
    return y - 28


def heading(c, lesson, title, note):
    c.setFillColorRGB(*ORANGE)
    c.roundRect(48, 724, 150, 26, 10, fill=1, stroke=0)
    c.setFillColorRGB(1, 1, 1)
    c.setFont('Andika-Bold', 11)
    c.drawCentredString(123, 732, 'Lesson ' + lesson['n'])
    c.setFillColorRGB(*INK)
    c.setFont('Andika-Bold', 22)
    c.drawString(48, 690, title)
    c.setFont('Andika', 12)
    y = 668
    for line in wrap(note, 'Andika', 12, 516):
        c.drawString(48, y, line)
        y -= 16
    return name_date(c, y - 8)


def read_page(doc, lesson, words, teacher=False):
    c = doc.page(footer_for('teacher' if teacher else 'student', lesson))
    note = 'Say each word two times. Students read it, then write it on a blank line. Say the ending sound, not the letter name.' if teacher else 'Read each word out loud.'
    y = heading(c, lesson, 'Read the words', note)
    if teacher:
        c.setFillColorRGB(*TEAL)
        c.setFont('Andika-Bold', 12)
        c.drawString(48, y, 'Say this first')
        y -= 18
        c.setFillColorRGB(*INK)
        c.setFont('Andika', 11)
        script = 'Listen. I will say a word two times. Write the word you hear. Listen for the ending sound.'
        for line in wrap(script, 'Andika', 11, 516):
            c.drawString(48, y, line)
            y -= 15
        y -= 8
        c.setFont('Andika-Bold', 12)
        c.drawString(48, y, 'Words to read')
        y -= 8
    cols = 2
    col_w = 250
    row_h = 36
    c.setFont('Andika-Bold', 16)
    for i, word in enumerate(words):
        col = i % cols
        row = i // cols
        x = 48 + col * col_w
        yy = y - 28 - row * row_h
        c.setFillColorRGB(*CREAM2)
        c.roundRect(x, yy - 6, 230, 30, 8, fill=1, stroke=0)
        c.setFillColorRGB(*ORANGE)
        c.setFont('Andika-Bold', 12)
        c.drawString(x + 10, yy + 2, str(i + 1))
        c.setFillColorRGB(*INK)
        c.setFont('Andika-Bold', 16)
        c.drawString(x + 36, yy + 1, word)
    doc.c.showPage()


def sort_groups(lesson, words):
    n = lesson['n']
    if n == '6.1':
        buzz = {'bugs', 'hangs', 'rings', 'tugs', 'hugs', 'bags'}
        groups = [('Hiss, like cats', []), ('Buzz, like bugs', []), ('Extra beat, like boxes', [])]
        for word in words:
            if word.endswith('es'):
                groups[2][1].append(word)
            elif word in buzz:
                groups[1][1].append(word)
            else:
                groups[0][1].append(word)
        return groups
    if n == '6.2':
        groups = [('Extra beat, like landed', []), ('Short sound, like filled', []), ('End sound, like jumped', [])]
        sound = {
            'missed': 'ed_t', 'kissed': 'ed_t', 'wished': 'ed_t', 'bumped': 'ed_t', 'packed': 'ed_t',
            'handed': 'ed_id', 'ended': 'ed_id', 'tested': 'ed_id', 'lifted': 'ed_id', 'melted': 'ed_id'
        }
        for row in lesson.get('build', []):
            sound[row['word']] = row['sound']
        for group in lesson.get('soundGroups', []):
            for word in group['words']:
                sound[word] = {'ed': 'ed_id', 'd': 'ed_d', 't': 'ed_t'}[group['id']]
        for word in words:
            kind = sound.get(word, 'ed_id' if word.endswith('ed') else '')
            if kind == 'ed_d':
                groups[1][1].append(word)
            elif kind == 'ed_t':
                groups[2][1].append(word)
            else:
                groups[0][1].append(word)
        return groups
    groups = [('-ing, like ringing', []), ('-ed, like bumped', []), ('-s, like hangs', [])]
    for word in words:
        if word.endswith('ing'):
            groups[0][1].append(word)
        elif word.endswith('ed'):
            groups[1][1].append(word)
        else:
            groups[2][1].append(word)
    return groups


def sort_page(doc, lesson, words, teacher=False):
    c = doc.page(footer_for('teacher' if teacher else 'student', lesson))
    groups = sort_groups(lesson, words)
    note = 'Students write each word under the ending sound they hear.' if teacher else 'Listen. Write each word in the box for its ending sound.'
    y = heading(c, lesson, 'Sort by ending sound', note)
    c.setFont('Andika', 12)
    c.setFillColorRGB(*INK)
    bank = 'Words: ' + ', '.join(words)
    for line in wrap(bank, 'Andika', 12, 516):
        c.drawString(48, y, line)
        y -= 16
    y -= 8
    if teacher:
        c.setFillColorRGB(*TEAL)
        c.setFont('Andika-Bold', 12)
        c.drawString(48, y, 'Say this first')
        y -= 16
        c.setFillColorRGB(*INK)
        c.setFont('Andika', 11)
        for line in wrap('I will say a word. You write it in the box for the ending sound you hear. Do not use the letter name.', 'Andika', 11, 516):
            c.drawString(48, y, line)
            y -= 14
        y -= 6
        c.setFont('Andika-Bold', 12)
        c.drawString(48, y, 'Answers')
        y -= 18
    box_w = 164
    gap = 12
    top = y
    height = 250 if not teacher else 180
    for i, (label, answers) in enumerate(groups):
        x = 48 + i * (box_w + gap)
        c.setStrokeColorRGB(*ORANGE)
        c.setFillColorRGB(*CREAM2)
        c.setLineWidth(2)
        c.roundRect(x, top - height, box_w, height, 12, fill=1, stroke=1)
        c.setFillColorRGB(*INK)
        c.setFont('Andika-Bold', 10)
        for j, line in enumerate(wrap(label, 'Andika-Bold', 10, box_w - 16)):
            c.drawString(x + 8, top - 18 - j * 13, line)
        if teacher:
            c.setFont('Andika', 12)
            yy = top - 52
            for word in answers:
                c.drawString(x + 10, yy, word)
                yy -= 16
        else:
            c.setStrokeColorRGB(*LINE)
            yy = top - 58
            for _ in range(6):
                c.line(x + 12, yy, x + box_w - 12, yy)
                yy -= 28
    doc.c.showPage()
    return groups


def build_page(doc, lesson, rows, teacher=False):
    c = doc.page(footer_for('teacher' if teacher else 'student', lesson))
    note = 'Students write the whole word. The answer is the base plus the ending.' if teacher else 'Write the word. Add the ending you hear.'
    y = heading(c, lesson, 'Build and write words', note)
    if teacher:
        c.setFillColorRGB(*TEAL)
        c.setFont('Andika-Bold', 12)
        c.drawString(48, y, 'Say this first')
        y -= 16
        c.setFillColorRGB(*INK)
        c.setFont('Andika', 11)
        for line in wrap('Look at the base word. Listen to the whole word. Write the ending, then write the whole word.', 'Andika', 11, 516):
            c.drawString(48, y, line)
            y -= 14
        y -= 8
    for i, row in enumerate(rows):
        c.setFillColorRGB(*CREAM2)
        c.roundRect(48, y - 28, 516, 40, 10, fill=1, stroke=0)
        c.setFillColorRGB(*ORANGE)
        c.setFont('Andika-Bold', 12)
        c.drawString(60, y - 12, str(i + 1))
        c.setFillColorRGB(*INK)
        c.setFont('Andika-Bold', 16)
        prompt = row['base'] + '  +  ' + row['end'] + '   →'
        c.drawString(88, y - 14, prompt)
        if teacher:
            c.setFillColorRGB(*GREEN)
            c.drawString(300, y - 14, row['word'])
        else:
            c.setStrokeColorRGB(*INK)
            c.setLineWidth(1.2)
            c.line(300, y - 16, 540, y - 16)
        y -= 52
    doc.c.showPage()


def sentence_page(doc, lesson, sentences, teacher=False):
    c = doc.page(footer_for('teacher' if teacher else 'student', lesson))
    note = 'Students read the sentence and underline each word that has an ending.' if teacher else 'Read the sentence. Underline each word that has an ending.'
    y = heading(c, lesson, 'Sentences', note)
    if teacher:
        c.setFillColorRGB(*TEAL)
        c.setFont('Andika-Bold', 12)
        c.drawString(48, y, 'Say this first')
        y -= 16
        c.setFillColorRGB(*INK)
        c.setFont('Andika', 11)
        for line in wrap('Read the sentence with me. Then underline every word that has an ending. The sentence stays as it is in the lesson.', 'Andika', 11, 516):
            c.drawString(48, y, line)
            y -= 14
        y -= 6
    for i, sentence in enumerate(sentences):
        c.setFillColorRGB(*ORANGE)
        c.circle(62, y + 4, 11, fill=1, stroke=0)
        c.setFillColorRGB(1, 1, 1)
        c.setFont('Andika-Bold', 11)
        c.drawCentredString(62, y, str(i + 1))
        c.setFillColorRGB(*INK)
        c.setFont('Andika', 14)
        x = 84
        text = sentence['text']
        for line in wrap(text, 'Andika', 14, 470):
            c.drawString(x, y, line)
            y -= 20
        if teacher:
            ends = []
            for part in sentence['words']:
                bare = ''.join(ch for ch in part if ch.isalpha())
                low = bare.lower()
                if len(low) > 2 and (low.endswith('ing') or low.endswith('es') or low.endswith('ed') or low.endswith('s')):
                    ends.append(bare)
            c.setFillColorRGB(*GREEN)
            c.setFont('Andika', 11)
            c.drawString(84, y, 'Underline: ' + ', '.join(ends))
            y -= 18
        else:
            c.setStrokeColorRGB(*LINE)
            c.line(84, y, 540, y)
            y -= 16
        y -= 14
    doc.c.showPage()


def how_page(doc):
    c = doc.page(footer_for('teacher'))
    c.setFillColorRGB(*INK)
    c.setFont('Andika-Bold', 22)
    c.drawString(48, 730, 'How to use these checks')
    blocks = [
        ('What this is', 'Short checks you lead at the end of a Unit 6 lesson. Students read words, sort by the ending sound, build a word, and read sentences. These sheets use the words and sentences from the lesson. They do not change the stories.'),
        ('How to run one', 'Print the teacher page for yourself and the matching student page for each child. Sit where they can hear you. Read Say this first, then each item two times. On listening items, do not show the word before they write.'),
        ('Ending sounds', 'Lesson 6.1: the hiss in cats, the buzz in bugs, and the extra beat in boxes. Lesson 6.2: the extra beat in landed, the short sound in filled, and the end sound in jumped. Lesson 6.3: the ending in ringing. Never say the letter names.'),
        ('After the check', '9 or 10: move on. 7 or 8: review the ending. 6 or below: re-teach with a grown-up, then try again. One check is enough for the end of the lesson.')
    ]
    y = 690
    for title, body in blocks:
        c.setFillColorRGB(*TEAL)
        c.setFont('Andika-Bold', 13)
        c.drawString(48, y, title)
        y -= 18
        c.setFillColorRGB(*INK)
        c.setFont('Andika', 11)
        for line in wrap(body, 'Andika', 11, 516):
            c.drawString(48, y, line)
            y -= 15
        y -= 12
    doc.c.showPage()


def lesson_words(lesson):
    if lesson['n'] == '6.1':
        read = ['cats', 'boxes', 'dishes', 'bugs', 'hangs', 'wishes', 'hats', 'foxes', 'rings', 'maps']
        sort = ['hats', 'dishes', 'bugs', 'boxes', 'maps', 'foxes', 'rings', 'wishes', 'cats', 'hangs']
    elif lesson['n'] == '6.2':
        read = ['jumped', 'packed', 'filled', 'landed', 'helped', 'rested', 'missed', 'handed', 'hugged', 'banged']
        sort = ['landed', 'filled', 'jumped', 'rested', 'packed', 'hugged', 'helped', 'handed', 'banged', 'missed']
    else:
        read = ['hanging', 'bumping', 'lifting', 'swinging', 'helping', 'ringing', 'jumping', 'shifting', 'resting', 'singing']
        sort = ['hanging', 'bumped', 'hangs', 'lifting', 'helped', 'rings', 'jumping', 'rested', 'ringing', 'swings']
    return read, sort


def add_lesson_students(doc, lesson):
    read, sort = lesson_words(lesson)
    read_page(doc, lesson, read, False)
    sort_page(doc, lesson, sort, False)
    build_page(doc, lesson, lesson['build'], False)
    sentence_page(doc, lesson, lesson['sentences'], False)


def add_lesson_teachers(doc, lesson):
    read, sort = lesson_words(lesson)
    read_page(doc, lesson, read, True)
    sort_page(doc, lesson, sort, True)
    build_page(doc, lesson, lesson['build'], True)
    sentence_page(doc, lesson, lesson['sentences'], True)


def write_all():
    os.makedirs(OUT, exist_ok=True)
    lessons = load_lessons()
    by_n = {lesson['n']: lesson for lesson in lessons}
    student = Doc(os.path.join(OUT, 'Unit6_Teacher_Led_Student_Sheets.pdf'))
    cover(
        student,
        'Student sheets',
        'Unit 6: Endings',
        'Read the words. Sort by ending sound. Build and write words. Read the sentences.',
        'Daily practice for Lessons 6.1, 6.2, and 6.3. Your teacher says the words. You write.',
        footer_for('student'))
    for n in ('6.1', '6.2', '6.3'):
        add_lesson_students(student, by_n[n])
    student.save()

    names = {'6.1': 'Lesson6.1_Teacher_Led_Checks.pdf', '6.2': 'Lesson6.2_Teacher_Led_Checks.pdf', '6.3': 'Lesson6.3_Teacher_Led_Checks.pdf'}
    titles = {'6.1': '-s and -es', '6.2': '-ed', '6.3': '-ing'}
    for n, filename in names.items():
        lesson = by_n[n]
        doc = Doc(os.path.join(OUT, filename))
        cover(
            doc,
            'Teacher-led checks',
            'Lesson ' + n,
            titles[n],
            'A teacher page with the script and answers, then the student sheet for the same words.',
            footer_for('teacher', lesson))
        how_page(doc)
        add_lesson_teachers(doc, lesson)
        add_lesson_students(doc, lesson)
        doc.save()

    combined = Doc(os.path.join(OUT, 'Unit6_Teacher_Led_Checks_Combined.pdf'))
    cover(
        combined,
        'Teacher-led checks',
        'Unit 6: Endings',
        'Lessons 6.1, 6.2, and 6.3 in one pack.',
        'Scripts and answers for every lesson, then the student sheets.',
        footer_for('teacher'))
    how_page(combined)
    for n in ('6.1', '6.2', '6.3'):
        add_lesson_teachers(combined, by_n[n])
        add_lesson_students(combined, by_n[n])
    combined.save()
    print('wrote', OUT)


if __name__ == '__main__':
    write_all()

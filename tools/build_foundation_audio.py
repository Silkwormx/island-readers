"""Foundations (Teams 1-5) recorded voice lines.

Same voices and method as the rest of the app (edge-tts, see js/u6.js and the Unit 4 ng/nk build):
  Frill (directions, stories) en-US-AriaNeural rate -12%   (matches audio/nk_p_* Frill lines exactly)
  Zip   (praise line)         en-US-RogerNeural rate +0%
  Words                       en-US-AriaNeural rate -15%   (same as audio/w_*)
Each clip: silence trimmed, loudnorm I=-18 TP=-2, 24 kHz mono 48k, then a 0.25 s quiet tail
(tests/audio-tail.test.mjs: the last consonant must not be clipped).

Isolated letter sounds are NEVER generated here. They need a human recording in audio/phonemes/.

Writes audio/fp_*.mp3 (Frill), audio/fz_*.mp3 (Zip), audio/fs_*.mp3 (stories), audio/fw_*.mp3 (words)
and js/foundation/voice_index.js. Skips files that already exist. Run: python3 tools/build_foundation_audio.py
"""
import asyncio, hashlib, json, os, re, subprocess, sys
import edge_tts

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = os.path.join(ROOT, 'audio')
FRILL = ('en-US-AriaNeural', '-12%', '+0Hz')
ZIP = ('en-US-RogerNeural', '+0%', '+0Hz')
WORD = ('en-US-AriaNeural', '-15%', '+0Hz')

def read(p):
    return open(os.path.join(ROOT, p), encoding='utf8').read()

def norm(t):
    return re.sub(r'\s+', ' ', re.sub(r"[^a-z' ]", ' ', t.lower().replace('\u2019', "'"))).strip()

def slug(t, n=40):
    s = re.sub(r'[^a-z0-9]+', '_', t.lower()).strip('_')[:n].strip('_')
    return s + '_' + hashlib.md5(t.encode()).hexdigest()[:5]

letters = read('js/foundation/letters.js')
day1 = read('js/foundation/day1.js')
program = json.loads(read('foundation/data/program.json'))

# ---- directions (Frill) -------------------------------------------------------------------------
prompts = set()
for src in (letters, day1):
    prompts.update(re.findall(r"setInstr\('([^']+)'\)", src))
    prompts.update(re.findall(r"speak\('([^']+)'\)", src))
    prompts.update(re.findall(r"narrate\('Frill', '([^']+)'\)", src))
    prompts.update(re.findall(r"runFind\([^)]*'([^']+)'\)", src))
    prompts.update(re.findall(r"setInstr\(instr \|\| '([^']+)'\)", src))
    for m in re.finditer(r"setInstr\(dayOf\(group\) === 1 \? '([^']+)' : '([^']+)'\)", src):
        prompts.update(m.groups())
    for m in re.finditer(r"\{ id: '\w+', say: '([^']+)', label: '[^']+', who: '(\w+)' \}", src):
        if m.group(2) == 'Frill': prompts.add(m.group(1))
# lines built in code that the regexes above cannot see
prompts.update(['Listen. Feed Zip the letter you hear.', 'Mastery check. Plain letters only.'])
show = read('js/zip-show.js')
block = re.search(r'const PROMPTS = \{.*?\n  \};', show, re.S)
if not block:
    raise SystemExit('zip-show prompts not found')
prompts.update(re.findall(r"'([^']+)'", block.group(0)))
zip_lines = set(m.group(1) for m in re.finditer(r"\{ id: '\w+', say: '([^']+)', label: '[^']+', who: 'Zip' \}", letters))
zip_lines.add('You did it.')

# Display text keeps the letters. A lone letter would be read as its NAME by any voice, so the
# recording says the same thing without naming letters.
SPOKEN = {
    'Tap a, then m. They link arms.': 'Tap the first letter, then the next one. They link arms.',
}

# ---- story sentences (Frill) --------------------------------------------------------------------
sentences = set()
for m in re.finditer(r"\{ text: '([^']+)'(?:, pic: '[^']+')? \}", letters):
    sentences.add(m.group(1))
for m in re.finditer(r"\{ w: '[^']+', g: (\d)(?:, line: '([^']+)')? \}", letters):
    if m.group(2) and int(m.group(1)) <= 5: sentences.add(m.group(2))
for row in program.get('lessons', []):
    if str(row.get('group', '')).upper() in ('G1', 'G2', 'G3', 'G4', 'G5'):
        for s in row.get('sentences_today') or []: sentences.add(s)
sentences = set(s for s in sentences if len(norm(s).split()) >= 2)

# ---- words (word voice) -------------------------------------------------------------------------
words = set()
for m in re.finditer(r"\{ w: '([^']+)', g: (\d)", letters):
    if int(m.group(2)) <= 5: words.add(m.group(1))
words.update(re.findall(r"name: '([a-z]+)'", letters))
for m in re.finditer(r"word: '([a-z]+)'", letters): words.add(m.group(1))
for blk in re.findall(r"g[1-5]: \[([^\]]+)\]", letters):
    words.update(re.findall(r"'([A-Za-z]+)'", blk))
for blk in re.findall(r"const PARTS = \{(.*?)\};", read('js/foundation/phonemes.js'), re.S):
    words.update(re.findall(r"(\w+):", blk))
words.update(['am', 'at'])
def walk(o, k=''):
    if isinstance(o, dict):
        for kk, v in o.items(): walk(v, kk)
    elif isinstance(o, list):
        for v in o: walk(v, k)
    elif isinstance(o, str) and k in ('new_words', 'words', 'reading_sequence', 'review_words', 'review_sequence', 'read', 'word', 'word_bank'):
        words.add(o)
for row in program.get('lessons', []):
    if str(row.get('group', '')).upper() in ('G1', 'G2', 'G3', 'G4', 'G5'): walk(row)
for s in sentences: words.update(norm(s).split())
words = set(w.lower() for w in words if re.fullmatch(r"[A-Za-z]+", w))
words = set(w for w in words if len(w) > 1 or w in ('a', 'i'))
words.discard('i')   # I has its own heart-word clip (audio/w_I.mp3 / hx_I.mp3); a lone i would be a sound
# edge-tts reads a few short words as abbreviations; give it a spelling it says as the word
WORD_TEXT = {'us': 'us.', 'a': 'uh', 'it': 'it.', 'in': 'in.', 'am': 'am.', 'an': 'an.', 'on': 'on.', 'at': 'at.', 'up': 'up.', 'if': 'if.'}

jobs = []   # (text, voice, filename)
index = {'lines': {}, 'zip': {}, 'words': {}}
for p in sorted(prompts):
    f = 'fp_' + slug(p) + '.mp3'; jobs.append((SPOKEN.get(p, p), FRILL, f)); index['lines'][norm(p)] = 'audio/' + f
for p in sorted(zip_lines):
    f = 'fz_' + slug(p) + '.mp3'; jobs.append((p, ZIP, f)); index['zip'][norm(p)] = 'audio/' + f
for s in sorted(sentences):
    k = norm(s)
    if k in index['lines']: continue
    f = 'fs_' + slug(s) + '.mp3'; jobs.append((s[0].upper() + s[1:], FRILL, f)); index['lines'][k] = 'audio/' + f
for w in sorted(words):
    f = 'fw_' + w + '.mp3'; jobs.append((WORD_TEXT.get(w, w), WORD, f)); index['words'][w] = 'audio/' + f

async def tts(text, voice, out, sem):
    v, r, p = voice
    async with sem:
        for attempt in range(8):
            try:
                raw = out + '.raw.mp3'
                c = edge_tts.Communicate(text, v, rate=r, pitch=p)
                with open(raw, 'wb') as fh:
                    async for ch in c.stream():
                        if ch['type'] == 'audio': fh.write(ch['data'])
                if os.path.getsize(raw) > 500:
                    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af',
                                    'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,'
                                    'loudnorm=I=-18:TP=-2,apad=pad_dur=0.25',
                                    '-ar', '24000', '-ac', '1', '-b:a', '48k', out], check=True)
                    os.remove(raw); return
            except Exception as e:
                print('retry', out, e); await asyncio.sleep(1 + attempt)
        print('FAILED', out)

async def main():
    sem = asyncio.Semaphore(8)
    todo = [(t, v, os.path.join(A, f)) for t, v, f in jobs if not os.path.exists(os.path.join(A, f))]
    print('lines', len(index['lines']), 'zip', len(index['zip']), 'words', len(index['words']), 'to make', len(todo))
    await asyncio.gather(*[tts(t, v, o, sem) for t, v, o in todo])

if __name__ == '__main__':
    asyncio.run(main())
    missing = [f for _, _, f in jobs if not os.path.exists(os.path.join(A, f))]
    if missing: print('MISSING', missing); sys.exit(1)
    body = json.dumps(index, indent=1, sort_keys=True)
    open(os.path.join(ROOT, 'js/foundation/voice_index.js'), 'w', encoding='utf8').write(
        '/* Generated by tools/build_foundation_audio.py. Recorded Foundations lines, stories and words. Do not edit by hand. */\n'
        'window.IR_FOUNDATION_VOICE = ' + body + ';\n')
    print('wrote js/foundation/voice_index.js')

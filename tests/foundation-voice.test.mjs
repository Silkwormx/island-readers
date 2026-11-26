import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('..', import.meta.url);
const read = (p) => fs.readFileSync(new URL(p, root), 'utf8');
function index() {
  const window = {};
  vm.runInNewContext(read('js/foundation/voice_index.js'), { window });
  return window.IR_FOUNDATION_VOICE;
}
const norm = (t) => String(t).toLowerCase().replace(/\u2019/g, "'").replace(/[^a-z' ]/g, ' ').replace(/\s+/g, ' ').trim();

test('every Foundations voice clip in the index is on disk', () => {
  const V = index();
  const all = [...Object.values(V.lines), ...Object.values(V.zip), ...Object.values(V.words)];
  assert.ok(all.length > 300);
  for (const f of all) assert.ok(fs.existsSync(new URL(f, root)), f + ' missing');
});

test('every Foundations direction has Frill\'s recording (no device voice)', () => {
  const V = index();
  const src = read('js/foundation/letters.js') + read('js/foundation/day1.js');
  const lines = [...src.matchAll(/setInstr\('([^']+)'\)/g)].map((m) => m[1]);
  lines.push(...[...src.matchAll(/say: '([^']+)', label: '[^']+', who: 'Frill'/g)].map((m) => m[1]));
  assert.ok(lines.length > 30);
  for (const line of lines) assert.ok(V.lines[norm(line)], 'no recording for: ' + line);
  assert.ok(V.zip[norm('You did it.')], 'Zip line uses Zip\'s voice');
});

test('story lines and Foundations words have recordings', () => {
  const V = index();
  for (const s of ['Sam sat.', 'Sam sat at a mat.', 'pat sat.', 'a pin.', 'tom sat.', 'a cat sat.', 'a dog sat.', 'meg sat.', 'a hen sat.', 'sam ran.']) {
    assert.ok(V.lines[norm(s)], 'story: ' + s);
  }
  for (const w of ['am', 'at', 'sat', 'sam', 'tam', 'mat', 'mats', 'pin', 'fin', 'cat', 'dog', 'bed', 'hat', 'hen', 'log', 'wet', 'a']) {
    assert.ok(V.words[w], 'word: ' + w);
  }
});

test('computer-made letter sounds stay off until a human recording is listed', () => {
  const voice = read('js/foundation/voice.js');
  assert.match(voice, /const RECORDED = \[\];/);
  assert.match(voice, /const PLAY_COMPUTER_SOUNDS = false;/);
  assert.match(voice, /c: 'k'/, 'c plays the k recording');
  const letters = read('js/foundation/letters.js');
  assert.doesNotMatch(letters, /a: 'audio\/phonemes\/a\.mp3'/);
});

test('voice files load before the Foundations screens and are cached', () => {
  const html = read('index.html');
  const at = (s) => html.indexOf(s);
  assert.ok(at('js/foundation/voice_index.js') > 0 && at('js/foundation/voice.js') > at('js/foundation/voice_index.js'));
  assert.ok(at('js/foundation/voice.js') < at('js/foundation/letters.js'));
  assert.ok(at('js/engage.js') < at('js/foundation/voice.js'));
  const sw = read('sw.js');
  assert.match(sw, /voice_index\.js/);
  assert.match(sw, /voice\.js/);
});

test('Foundations clips keep a quiet tail', () => {
  const V = index();
  const f = new URL(V.words.mat, root);
  assert.ok(fs.statSync(f).size > 1000);
});

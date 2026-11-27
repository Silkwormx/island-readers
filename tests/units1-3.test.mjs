import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (p) => fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const raw = read('data_u123.js');
const data = JSON.parse(raw.slice(raw.indexOf('{', raw.indexOf('window.IR_DATA_U'))).trim().replace(/;$/, ''));
const u123 = read('js/u123.js');
const screens = read('js/screens.js');
const html = read('index.html');
const sw = read('sw.js');
const exists = (p) => fs.existsSync(new URL('../' + p, import.meta.url));
const KEYS = ['u11', 'u12', 'u13', 'u14', 'u21', 'u22', 'u23', 'u24', 'u31', 'u32'];

test('Units 1 to 3 load and open from home', () => {
  assert.match(html, /data_u123\.js/);
  assert.match(html, /js\/u123\.js/);
  assert.match(screens, /IR\.u123Route/);
  assert.equal(data.units['1'].name, 'Short Vowels & Floss');
  assert.equal(data.units['2'].name, 'Blends');
  assert.equal(data.units['3'].name, 'Digraphs');
  assert.deepEqual(data.lessons.map((l) => l.key), KEYS);
});

test('every lesson has 3 days, 6+ story pages with art, and its word audio', () => {
  for (const l of data.lessons) {
    assert.equal(l.days.length, 3, l.key);
    assert.ok(l.story.length >= 6, l.key + ' story pages');
    for (const p of l.story) assert.ok(exists(p.img), p.img);
    for (const w of l.bellWords) assert.ok(exists('audio/w_' + w.toLowerCase() + '.mp3'), l.key + ' ' + w);
    assert.equal(l.check.length, 10, l.key + ' check items');
  }
});

test('kept stories and lines are still there', () => {
  assert.match(raw, /I Am Sam/);
  assert.match(raw, /The Raft Trip/);
  assert.match(raw, /I am Sam\./);
});

test('each lesson has a slideshow with three day jumps and teacher printables', () => {
  for (const l of data.lessons) {
    const dir = 'materials/unit' + l.unit + '/slides/' + l.key + '/';
    const man = JSON.parse(read(dir + 'manifest.json'));
    assert.equal(man.days.length, 3, l.key);
    assert.equal(man.slides.length, man.count);
    for (const s of man.slides) assert.ok(exists(dir + s), dir + s);
    assert.match(screens, new RegExp(l.key + ': \\['));
    for (const f of ['_Teacher_Led_Checks.pdf', '_WordList.pdf', '_Slides.pdf']) assert.ok(exists('materials/unit' + l.unit + '/Lesson' + l.n + f), l.n + f);
  }
  for (const u of [1, 2, 3]) {
    for (const f of ['_Teacher_Led_Student_Sheets.pdf', '_Teacher_Led_Checks_Combined.pdf', '_Independent_Worksheets.pdf']) assert.ok(exists('materials/unit' + u + '/Unit' + u + f), u + f);
  }
});

test('house style: no em dashes, no banned words, no letter-sound TTS', () => {
  for (const src of [raw, u123]) {
    assert.doesNotMatch(src, /\u2014/);
    assert.doesNotMatch(src, /\bfree\b/i);
    assert.doesNotMatch(src, /SPARK/i);
  }
  assert.doesNotMatch(u123, /speechSynthesis/);
});

test('service worker caches the new code', () => {
  assert.match(sw, /ir-20261128g/);
  assert.match(sw, /"\.\/data_u123\.js"/);
  assert.match(sw, /"\.\/js\/u123\.js"/);
});

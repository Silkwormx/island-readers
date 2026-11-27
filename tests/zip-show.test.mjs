import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('..', import.meta.url);
const read = (p) => fs.readFileSync(new URL(p, root), 'utf8');

function load() {
  const window = { IR: {} };
  vm.runInNewContext(read('js/zip-show.js'), { window });
  return window.IR.zipShow;
}

const TEAM1 = [
  'a-meet', 'a-word', 'a-silly', 'a-turn', 'a-pop',
  'm-meet', 'm-word', 'm-silly', 'm-turn', 'm-pop',
  'blend-am',
  's-meet', 's-word', 's-silly', 's-turn', 's-pop',
  't-meet', 't-word', 't-silly', 't-turn', 't-pop',
  'blend-sat', 'find', 'zip', 'review'
];

function walk(zs, ids) {
  const out = [];
  ids.forEach((id) => {
    out.push(zs.pick(zs.planBeat(id)));
    if (/-turn$/.test(id)) out.push(zs.pick({ kind: 'cheer', hint: 'Nice!' }));
    if (id === 'zip') ['a', 'm', 's', 't'].forEach((key) => out.push(zs.pick({ kind: 'keyword', key: key, hint: 'Teach me!' })));
  });
  return out;
}

function noRepeats(rows) {
  for (let i = 1; i < rows.length; i++) {
    assert.notEqual(rows[i].id, rows[i - 1].id, 'scene repeated at ' + i + ' ' + rows[i].id);
    assert.notEqual(rows[i].prompt, rows[i - 1].prompt, 'prompt repeated at ' + i + ' ' + rows[i].prompt);
  }
}

test('team 1 beats never repeat a scene or a prompt back to back', () => {
  const zs = load();
  zs.reset();
  const rows = walk(zs, TEAM1);
  assert.ok(rows.length > TEAM1.length);
  noRepeats(rows);
  const apple = rows.find((row, i) => TEAM1[0] && rows[1] && i === 1);
  assert.equal(rows[1].id, 'apple');
  assert.equal(apple.prompt, 'Picture the word.');
  assert.ok(rows.some((row) => row.who === 'Frill' || row.id === 'frill-swim' || row.id === 'highfive'));
});

test('keyword scenes match the sound and neighbors differ', () => {
  const zs = load();
  zs.reset();
  const letters = ['a', 'm', 's', 't', 'p', 'f', 'i', 'n', 'o', 'd', 'c', 'u', 'g', 'b', 'e', 'k', 'h', 'r', 'l', 'w', 'j', 'y', 'x', 'q', 'v', 'z'];
  const rows = letters.map((key) => zs.pick({ kind: 'keyword', key: key, hint: 'Ears on!' }));
  noRepeats(rows);
  assert.equal(rows[0].id, 'apple');
  assert.equal(rows[1].id, 'mangrove');
  assert.equal(rows[2].id, 'snake');
  assert.equal(rows[3].id, 'turtle');
  assert.equal(zs.LETTER.w, 'surf');
});

test('a long listen run still changes the picture and the line', () => {
  const zs = load();
  zs.reset();
  const rows = [];
  for (let i = 0; i < 12; i++) rows.push(zs.pick({ kind: 'listen', hint: 'Ears on!' }));
  noRepeats(rows);
  assert.ok(rows.some((row) => row.id.indexOf('frill-') === 0));
  assert.ok(rows.some((row) => row.prompt !== 'Ears on!'));
});

test('reduced motion and calm mode turn the mascot animation off', () => {
  const css = read('zip-show.css');
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /body\.calm \.zs-art/);
  assert.match(css, /animation:\s*none !important/);
  assert.match(css, /body\.calm \.zs-peekimg/);
  assert.match(css, /\.zs-bits\{display:none\}/);
  assert.match(css, /Andika/);
  const js = read('js/zip-show.js');
  assert.equal(/\bfree\b/i.test(css + js), false);
  assert.equal(/score/i.test(js), false);
});

test('Frill actions keep the upright v4 B poses and do not repeat in a row', () => {
  const zs = load();
  const frills = zs.SCENES.filter((scene) => scene.id.indexOf('frill-') === 0);
  assert.ok(frills.length >= 5);
  frills.forEach((scene) => {
    assert.match(scene.src, /^img\/zip-show\/frill-/);
    assert.equal(fs.existsSync(new URL('../' + scene.src, import.meta.url)), true, scene.src);
    assert.equal(scene.src.includes('frill-swim'), false);
  });
  const js = read('js/zip-show.js');
  assert.equal(js.includes('frill-swim'), false);
  assert.equal(js.includes("src: 'img/frill.webp'"), false);
  zs.reset();
  const rows = [];
  for (let i = 0; i < 16; i++) rows.push(zs.pick({ kind: 'listen', hint: i % 2 ? 'Hear this one.' : 'Ears on!' }));
  noRepeats(rows);
  const seen = rows.filter((row) => row.id.indexOf('frill-') === 0).map((row) => row.id);
  assert.ok(seen.length >= 2);
  assert.ok(new Set(seen).size >= 2);
});

test('action art is on disk and the new files are precached', () => {
  const zs = load();
  const sw = read('sw.js');
  assert.match(sw, /ir-20261128j/);
  assert.match(sw, /js\/zip-show\.js/);
  assert.match(sw, /zip-show\.css/);
  zs.SCENES.forEach((scene) => {
    assert.equal(fs.existsSync(new URL('../' + scene.src, import.meta.url)), true, scene.src);
    assert.match(sw, new RegExp(scene.src.replace(/[.]/g, '\\.')));
  });
});

test('independent lessons use the action scenes', () => {
  const watch = read('js/foundation/team1-watch.js');
  const letters = read('js/foundation/letters.js');
  const html = read('index.html');
  assert.match(watch, /zipShow/);
  assert.match(watch, /planBeat/);
  assert.equal(watch.includes('img/zipA.webp'), false);
  assert.match(letters, /zipShow/);
  assert.match(letters, /fs-withzip/);
  assert.match(html, /js\/zip-show\.js/);
  assert.match(html, /zip-show\.css/);
  assert.match(read('js/u123.js'), /zipShow/);
  assert.match(read('js/u6.js'), /zipShow/);
  const show = read('js/zip-show.js');
  ['Ears on!', 'Your turn!', 'Say it with me!', 'Watch my mouth', 'Can you find it?', 'Teach me!', 'Nice!', 'Blend it fast!'].forEach((line) => {
    assert.ok(show.includes(line), line);
  });
});

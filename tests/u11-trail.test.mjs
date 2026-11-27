import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (p) => fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const trail = read('js/u11trail.js');
const css = read('u11trail.css');
const html = read('index.html');
const sw = read('sw.js');
const u123 = read('js/u123.js');
const screens = read('js/screens.js');
const OK = new Set('a i am an at as mat map man sat sap pat pan tap tan nap fan fat sam pam nat tam'.split(' '));

test('short a trail is wired and other units stay on the old route', () => {
  assert.match(html, /u11trail\.css/);
  assert.match(html, /js\/u11trail\.js/);
  assert.match(u123, /L\.key === 'u11' && IR\.u11Trail/);
  assert.match(sw, /const CACHE = 'ir-20261128o'/);
  assert.match(sw, /u11-zip-frill-cheer\.png/);
  assert.match(sw, /js\/u11trail\.js/);
  assert.match(screens, /#\/library/);
  assert.match(screens, /class: 'homebook'/);
  assert.match(screens, /hero, tabs\), h\('div', \{ class: 'bellslot' \}, grid\)/);
});

test('preview Next is one flag, and exits sit in the top corners', () => {
  assert.match(trail, /const PREVIEW_NEXT = true/);
  assert.match(trail, /Back to Unit/);
  assert.match(trail, /Leave this game\?/);
  assert.match(css, /\.u11t-unit/);
  assert.match(css, /\.u11t-home/);
  assert.match(css, /u11t-preview \.u11t-nav \.ir-forward/);
  assert.match(css, /\.u11trail \.u11t-nav \.ir-back,\n\.u11trail \.u11t-nav \.ir-forward\{display:none\}/);
});

test('choices are numbered, misses are calm, and a sitting stays short', () => {
  assert.match(trail, /function badge\(n\) \{ return IR\.numBadge\(n\); \}/);
  assert.match(trail, /badge\(n \+ 1\)/);
  assert.match(trail, /aria-label': '1\. Yes'/);
  assert.match(trail, /aria-label': '2\. No'/);
  assert.match(trail, /data-pic/);
  assert.doesNotMatch(trail, /tryagain/);
  assert.match(trail, /sittingDefault: 5/);
  assert.match(trail, /const DOSE = \{/);
  assert.match(trail, /firstTryGem: 0\.9/);
  assert.match(trail, /Great job, see you next time/);
  assert.match(trail, /ir_u11_prog/);
  assert.match(trail, /Warm-up/);
  assert.match(trail, /beats: \['concept', 'hear', 'twist'\]/);
  assert.match(trail, /beats: \['buildword'\]/);
  assert.match(trail, /beats: \['picsent'\]/);
  assert.match(trail, /beats: \['sort'\]/);
  assert.match(trail, /beats: \['fill'\]/);
  assert.match(trail, /beats: \['satchel', 'chant'\]/);
  assert.match(trail, /book: 'map-pan'/);
  assert.match(trail, /is-done/);
  assert.match(trail, /is-walk/);
  assert.match(trail, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(trail, /u11t-find/);
});

test('book lines stay inside Unit 1 short a', () => {
  const lines = [...trail.matchAll(/\bline: '([^']+)'/g)].map((m) => m[1]);
  assert.ok(lines.length > 8);
  for (const line of lines) {
    const words = line.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
    for (const w of words) assert.ok(OK.has(w), line + ' -> ' + w);
  }
  assert.doesNotMatch(trail, /\u2014/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (p) => fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const rules = read('js/gamerules.js');
const board = read('js/board.js');
const chain = read('js/chain.js');
const feed = read('js/feedzip.js');
const css = read('styles.css');
const u5 = read('js/u5.js');
const nk = read('js/nk.js');
const ng = read('js/lessons2.js');
const u6 = read('js/u6.js');

test('shared classroom pieces cover every copy of these games', () => {
  assert.match(rules, /IR\.numBadge/);
  assert.match(rules, /IR\.noEMark/);
  assert.match(board, /IR\.numBadge\(t\.n\)/);
  assert.match(chain, /Hear it again/);
  assert.match(chain, /IR\.numBadge\(i \+ 1\)/);
  assert.match(feed, /fz-cheek/);
  assert.match(feed, /classList\.add\('oops'\)/);
  assert.match(css, /@keyframes fz-chomp/);
  assert.match(css, /@keyframes fz-shrug/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /\.noe-x/);
  assert.match(u5, /IR\.noEMark\(\)/);
  assert.doesNotMatch(u5, /setPage\(0\); Snd\.play\(AU\.p\('read'\)\)/);
  assert.doesNotMatch(nk, /setPage\(0\); Snd\.play\(AU\.p\('read'\)\)/);
  assert.doesNotMatch(ng, /Snd\.seq\(\[A\.prompt\('p_story'\)\]/);
  assert.match(u6, /speakerBtn\(\(\) => Snd\.play\(pageAudio\(\)\)/);
  assert.doesNotMatch(u6, /ctx\.progress\(p \/ pages\.length\);\n\s*Snd\.play\(pageAudio\(\)\)/);
});

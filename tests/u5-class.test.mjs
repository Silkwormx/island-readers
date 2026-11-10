import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { blendSoundsReady } = require('../js/blend.js');
const u5 = fs.readFileSync(new URL('../js/u5.js', import.meta.url), 'utf8');
const nk = fs.readFileSync(new URL('../js/nk.js', import.meta.url), 'utf8');
const chain = fs.readFileSync(new URL('../js/chain.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

test('blend is ready from sounded tiles only, and each new word starts over', () => {
  const word = (lits, silentAtEnd) => lits.map((lit, i) => ({ lit, silent: silentAtEnd && i === lits.length - 1 }));
  assert.equal(blendSoundsReady(word([true, true, true, false], true)), true);
  assert.equal(blendSoundsReady(word([true, false, true, false], true)), false);
  assert.equal(blendSoundsReady(word([false, false, false, false], true)), false);
  assert.equal(blendSoundsReady(word([true, true, true, true], false)), true);
  assert.equal(blendSoundsReady([]), false);
  for (const letters of [['c', 'o', 'm', 'e'], ['s', 'o', 'm', 'e'], ['d', 'o', 'n', 'e']]) {
    const fresh = letters.map((ch, i) => ({ lit: false, silent: i === letters.length - 1 && ch === 'e' }));
    assert.equal(blendSoundsReady(fresh), false);
    fresh.forEach((t) => { if (!t.silent) t.lit = true; });
    assert.equal(blendSoundsReady(fresh), true);
  }
});

test('Unit 5 keeps 10 activities, check last, and replaces the bell game', () => {
  const ids = [...u5.matchAll(/id: '(\w+)', title: [^,]+, group: 'activities'/g)].map((m) => m[1]);
  assert.equal(ids.length, 10);
  assert.equal(ids[ids.length - 1], 'check');
  assert.equal(ids[1], 'bells');
  assert.match(u5, /title: 'Match the word'/);
  assert.equal(u5.includes('Read the word out loud. Then tap the bell with the same word.'), false);
  assert.match(u5, /o says \/u\//);
  assert.match(u5, /runLetterChain/);
});

test('letter chain and choice numbers are shared', () => {
  assert.match(chain, /Listen\. Change one letter to make the new word\./);
  assert.match(chain, /This is cap\./);
  assert.match(chain, /glow/);
  assert.match(nk, /blendSoundsReady/);
  assert.match(css, /counter-increment: irpick/);
  assert.match(css, /font-family: "Andika"/);
});

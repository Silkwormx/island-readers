import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'vm';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const games = require('../js/u5games.js');

function loadSkills() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(new URL('../js/skills.js', import.meta.url), 'utf8'), ctx, { filename: 'skills.js' });
  return ctx.window.IR;
}

test('each round is the ten taught short and long pairs', () => {
  const words = games.roundWords();
  assert.deepEqual(words, ['cap', 'cape', 'kit', 'kite', 'hop', 'hope', 'cub', 'cube', 'pet', 'Pete']);
  assert.equal(words.length, 10);
  words.forEach((w) => {
    const info = games.plan(w);
    assert.equal(info.sounds.length, 3);
    assert.equal(info.magic, games.PAIRS.some((p) => p.long === w));
  });
  assert.deepEqual(games.plan('cape').sounds, ['c', 'a', 'p']);
  assert.equal(games.plan('cape').magic, true);
  assert.deepEqual(games.plan('cap').sounds, ['c', 'a', 'p']);
  assert.equal(games.plan('cap').magic, false);
  assert.deepEqual(games.plan('Pete').sounds, ['P', 'e', 't']);
  assert.equal(games.plan('Pete').magic, true);
  assert.equal(games.plan('Pete').vowel, 1);
  assert.deepEqual(games.plan('pet').sounds, ['p', 'e', 't']);
  assert.equal(games.plan('pet').magic, false);
});

test('a wrong box is the first sound that does not match, then the magic e box', () => {
  const cape = games.plan('cape');
  assert.equal(games.firstWrong(['c', 'a', 'p'], true, cape), null);
  assert.equal(games.firstWrong(['c', 'o', 'p'], true, cape), 1);
  assert.equal(games.firstWrong(['c', 'a', 'p'], false, cape), 'e');
  assert.equal(games.firstWrong(['', 'a', 'p'], false, cape), 0);
  const cap = games.plan('cap');
  assert.equal(games.firstWrong(['c', 'a', 'p'], false, cap), null);
  assert.equal(games.firstWrong(['c', 'a', 'p'], true, cap), 'e');
  const extra = games.distractor(['c', 'a', 'p']);
  assert.equal(['c', 'a', 'p'].indexOf(extra), -1);
});

test('the sorting timer stays on unless a grown-up turns it off', () => {
  assert.equal(games.timerOn(undefined), true);
  assert.equal(games.timerOn({}), true);
  assert.equal(games.timerOn({ sortTimerOff: false }), true);
  assert.equal(games.timerOn({ sortTimerOff: true }), false);
});

test('the games are inside both Unit 5 lessons and filed under their skills', () => {
  const u5 = fs.readFileSync(new URL('../js/u5.js', import.meta.url), 'utf8');
  const screens = fs.readFileSync(new URL('../js/screens.js', import.meta.url), 'utf8');
  assert.match(u5, /IR\.u5Games\.sort\(ctx, KEY\)/);
  assert.match(u5, /IR\.u5Games\.spell\(ctx, KEY\)/);
  assert.match(screens, /Turn off the sorting timer/);
  const IR = loadSkills();
  const skills = IR.collectSkills({
    u5: [
      { key: 'u51', n: '5.1', name: 'Silent e', steps: [{ id: 'sort', title: 'Short or Long' }, { id: 'mage', title: 'Magic e Boxes' }] },
      { key: 'u53', n: '5.2', name: 'Tricky silent e', steps: [{ id: 'sort', title: 'Short or Long' }, { id: 'mage', title: 'Magic e Boxes' }] }
    ]
  });
  const pa = skills.find((s) => s.id === 'pa').items;
  const spelling = skills.find((s) => s.id === 'spelling').items;
  assert.equal(JSON.stringify(pa.map((it) => it.href)), JSON.stringify(['#/u51/sort', '#/u53/sort']));
  assert.equal(JSON.stringify(spelling.map((it) => it.href)), JSON.stringify(['#/u51/mage', '#/u53/mage']));
  assert.equal(JSON.stringify(pa.map((it) => it.title)), JSON.stringify(['Short or Long', 'Short or Long']));
  assert.equal(JSON.stringify(spelling.map((it) => it.title)), JSON.stringify(['Magic e Boxes', 'Magic e Boxes']));
});

test('prompt recordings exist for both lessons', () => {
  for (const name of ['u51_p_sort.mp3', 'u53_p_sort.mp3', 'u51_p_mage.mp3', 'u53_p_mage.mp3']) {
    const buf = fs.readFileSync(new URL('../audio/' + name, import.meta.url));
    assert.ok(buf.length > 1000, name);
  }
});

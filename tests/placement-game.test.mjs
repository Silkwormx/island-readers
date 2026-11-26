import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const E = require('../js/placement-engine.js');
const ui = fs.readFileSync(new URL('../js/placement.js', import.meta.url), 'utf8');
const eng = fs.readFileSync(new URL('../js/placement-engine.js', import.meta.url), 'utf8');

/* A simulated reader passes every unit below `level` and misses the rest. */
function simulate(level, hint) {
  const res = {}; if (hint) res.__hint = hint; let words = 0;
  for (let k = 0; k < 40; k++) {
    const s = E.nextStep(res);
    if (s.kind === 'done') return { start: s.start, words };
    const ok = s.unit < level;
    if (s.kind === 'probe') { words += 4; res[s.unit] = { probe: { right: ok ? 4 : 1, made: ok ? 2 : 0 } }; }
    else { words += res[s.unit] && res[s.unit].probe ? 6 : 10; res[s.unit] = Object.assign(res[s.unit] || {}, { full: { right: ok ? 9 : 5 } }); }
  }
  throw new Error('no answer');
}

test('Units 7 to 9 open on the first lesson whose word was missed', () => {
  assert.equal(E.lessonStart(8, [{ n: '8.1', ok: true }, { n: '8.2', ok: false }, { n: '8.3', ok: true }]).lesson, '8.2');
  assert.equal(E.lessonStart(8, [{ n: '8.1', ok: true }, { n: '8.2', ok: false }, { n: '8.3', ok: true }]).href, '#/u8/u82');
  assert.equal(E.lessonStart(9, [{ n: '9.1', ok: true }, { n: '9.2', ok: true }, { n: '9.3', ok: true }, { n: '9.4', ok: false }]).lesson, '9.4');
  assert.equal(E.lessonStart(7, [{ n: '7.1', ok: true }, { n: '7.2', ok: true }, { n: '7.3', ok: true }]).lesson, '7.1');
  assert.equal(E.lessonItems(10).length, 0);
  assert.equal(E.lessonStart(10, []), null);
  assert.ok(ui.includes('lessonPick'));
  assert.ok(ui.includes('Go to Lesson'));
});

test('adaptive search finds every start unit and stays short', () => {
  for (let level = 1; level <= 23; level++) {
    const r = simulate(level);
    assert.equal(r.start, level, 'level ' + level);
    assert.ok(r.words <= 36, 'level ' + level + ' used ' + r.words + ' words');
    for (const hint of [[5, 9], [2], [13, 17], [21]]) assert.equal(simulate(level, hint).start, level);
  }
});

test('start is confirmed by full checks of the start unit and the unit before it', () => {
  const res = {};
  for (let k = 0; k < 40; k++) {
    const s = E.nextStep(res);
    if (s.kind === 'done') { assert.equal(s.start, 9); break; }
    const ok = s.unit < 9;
    res[s.unit] = Object.assign(res[s.unit] || {}, s.kind === 'probe' ? { probe: { right: ok ? 4 : 0, made: ok ? 2 : 0 } } : { full: { right: ok ? 8 : 7 } });
  }
  assert.equal(res[9].full.right, 7); assert.equal(res[8].full.right, 8);
});

test('a probe that passed but a full check under 8 moves the start down', () => {
  const res = { 5: { probe: { right: 4, made: 2 } }, 6: { probe: { right: 1, made: 0 } } };
  let s = E.nextStep(res); assert.deepEqual(s, { kind: 'full', unit: 6 });
  res[6].full = { right: 6 }; s = E.nextStep(res); assert.deepEqual(s, { kind: 'full', unit: 5 });
  res[5].full = { right: 7 }; s = E.nextStep(res); assert.equal(s.kind, 'probe');
});

test('rules match the printable test', () => {
  assert.equal(E.UNITS.length, 22);
  for (const u of E.UNITS) { assert.equal(E.fullItems(u.n).length, 10); assert.equal(E.fullItems(u.n).filter((i) => i.made).length, 5); }
  assert.equal(E.UNIT_PASS, 8);
  assert.equal(E.rowPass(3, 1), true); assert.equal(E.rowPass(3, 0), false); assert.equal(E.rowPass(2, 2), false);
  const rowsAll = Object.fromEntries(E.TEAMS.map((t) => [t.n, { pass: true }]));
  assert.equal(E.foundationsPlacement({ 3: 1 }, rowsAll).team, null);
  assert.equal(E.foundationsPlacement({ 2: 2, 5: 1 }, rowsAll).team, 2);
  assert.equal(E.foundationsPlacement({}, Object.assign({}, rowsAll, { 4: { pass: false } })).team, 4);
  assert.equal(E.screenerOrder(true)[0].unit, 5);
  assert.deepEqual(E.screenerHint([{ unit: 2, ok: true }, { unit: 5, ok: true }, { unit: 9, ok: false }, { unit: 13, ok: false }]), [5, 9]);
});

test('placement copy follows the house rules', () => {
  for (const src of [ui, eng]) {
    assert.equal(/\bfree\b/i.test(src), false);
    assert.equal(/spark/i.test(src), false);
    assert.equal(src.includes('\u2014') || src.includes('\\u2014'), false);
  }
  assert.ok(ui.includes('Grown-up helper'));
  assert.ok(ui.includes("'#/placement/classic'"));
});

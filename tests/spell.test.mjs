import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'vm';

function load() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  ['js/spellplan.js', 'data.js', 'data_nk.js', 'data_u5.js', 'data_u6.js'].forEach((p) => {
    vm.runInContext(fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8'), ctx, { filename: p });
  });
  const plan = ctx.window.IR.spellPlan;
  const packs = { ng: ctx.window.IR_DATA, nk: ctx.window.IR_DATA_NK, u5: ctx.window.IR_DATA_U5, u6: ctx.window.IR_DATA_U6 };
  return { plan, lessons: plan.buildAll(packs) };
}

test('every built lesson gets five spelling steps from its own words', () => {
  const { lessons } = load();
  assert.deepEqual(Array.from(lessons, (L) => String(L.n)), ['4.1', '4.2', '5.1', '5.2', '6.1', '6.2', '6.3']);
  lessons.forEach((L) => {
    assert.ok(L.words.length >= 8, L.n + ' has words');
    assert.equal(L.steps.gap.length, 4, L.n + ' gap');
    assert.equal(L.steps.boxes.length, 3, L.n + ' boxes');
    assert.ok(L.steps.tiles.length >= 3, L.n + ' tiles');
    assert.ok(L.steps.pattern.length >= 3, L.n + ' pattern');
    assert.ok(L.chainCount >= 1, L.n + ' chain');
    L.steps.chains.forEach((chain) => {
      assert.ok(chain.length >= 2 && chain.length <= 4);
    });
  });
});

test('silent e, digraphs, and endings split into sounds', () => {
  const { plan, lessons } = load();
  const spec = plan.LESSONS.find((s) => s.id === 'u51');
  const cake = plan.segment('cake', spec);
  assert.deepEqual(Array.from(cake, (t) => String(t.magic ? 'e*' : t.g)), ['c', 'a', 'k', 'e*']);
  const ship = plan.segment('ship', plan.LESSONS.find((s) => s.id === 'ng'));
  assert.deepEqual(Array.from(ship, (t) => String(t.g)), ['sh', 'i', 'p']);
  const sing = plan.segment('sing', plan.LESSONS.find((s) => s.id === 'ng'));
  assert.deepEqual(Array.from(sing, (t) => String(t.g)), ['s', 'i', 'ng']);
  const boxes = plan.segment('boxes', plan.LESSONS.find((s) => s.id === 'u61'));
  assert.deepEqual(Array.from(boxes, (t) => String(t.g)), ['b', 'o', 'x', 'es']);
  const jumped = plan.segment('jumped', plan.LESSONS.find((s) => s.id === 'u62'));
  assert.deepEqual(Array.from(jumped, (t) => String(t.g)), ['j', 'u', 'm', 'p', 'ed']);
  assert.equal(plan.edSound('jumped'), 'audio/u6_snd_t_cut.mp3');
  assert.equal(plan.soundSrc(jumped[jumped.length - 1], 'jumped'), 'audio/u6_snd_t_cut.mp3');
  const u62 = lessons.find((L) => L.id === 'u62');
  assert.equal(u62.tip.text, 'ed says /t/ in jumped.');
  assert.ok(u62.steps.pattern.some((p) => p.w === 'jumped'));
  assert.equal(u62.chainCount >= 1, true);
});

test('chains change one sound, and later patterns stay out of earlier lessons', () => {
  const { plan, lessons } = load();
  lessons.forEach((L) => {
    L.steps.chains.forEach((chain) => {
      for (let i = 1; i < chain.length; i++) {
        const d = plan.diff(chain[i - 1].tokens, chain[i].tokens);
        assert.ok(d, L.n + ' ' + chain[i - 1].w + ' > ' + chain[i].w);
      }
    });
  });
  const ng = lessons.find((L) => L.id === 'ng');
  assert.ok(!ng.words.some((w) => /nk$/.test(w) || /ed$/.test(w)));
  assert.ok(!ng.words.includes('sings'));
  const u51 = lessons.find((L) => L.id === 'u51');
  assert.ok(!u51.words.includes('takes'));
  assert.ok(u51.words.includes('cake'));
  const u62 = lessons.find((L) => L.id === 'u62');
  assert.ok(!u62.words.some((w) => w.endsWith('ing')));
});

test('spelling lives on the practice page, not on lesson menus', () => {
  const u6 = fs.readFileSync(new URL('../js/u6.js', import.meta.url), 'utf8');
  const u5 = fs.readFileSync(new URL('../js/u5.js', import.meta.url), 'utf8');
  const nk = fs.readFileSync(new URL('../js/nk.js', import.meta.url), 'utf8');
  const screens = fs.readFileSync(new URL('../js/screens.js', import.meta.url), 'utf8');
  const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(u6, /spellCard/);
  assert.doesNotMatch(u5, /spellCard/);
  assert.doesNotMatch(nk, /spellCard/);
  assert.doesNotMatch(screens, /spellCard/);
  assert.match(screens, /Skill Practice/);
  assert.match(screens, /practice\/skills/);
  assert.match(screens, /function spellUnitOpen/);
  assert.match(screens, /Unit ' \+ n \+ ' is coming soon in the full app!/);
  assert.match(screens, /IR\.spellRoute/);
  assert.match(html, /js\/spell\.js/);
  assert.match(sw, /ir-20261113b/);
  assert.match(sw, /js\/spell\.js/);
});

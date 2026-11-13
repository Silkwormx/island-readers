import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'vm';

function load() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(new URL('../js/skills.js', import.meta.url), 'utf8'), ctx, { filename: 'skills.js' });
  return ctx.window.IR;
}

test('skills gather existing activities and search by name or type', () => {
  const IR = load();
  const skills = IR.collectSkills({
    stories: [{ unit: 5, lessonN: '5.1', name: 'Silent e', title: 'The Cut Rope', href: '#/u51/read' }],
    spells: [{ id: 'u51', unit: 5, n: '5.1', name: 'Silent e' }],
    ng: [{ id: 'hear', title: 'Hear and Pick' }, { id: 'meet', title: 'Meet ng' }, { id: 'chain', title: 'Word Chains' }],
    nk: [{ id: 'rhyme', title: 'Rhyme Time' }],
    u5: [{ key: 'u51', n: '5.1', name: 'Silent e', steps: [{ id: 'rhyme', title: 'Rhyme Time' }, { id: 'check', title: 'Zip\'s Check' }] }],
    u6: [{ key: 'u62', n: '6.2', name: '-ed', steps: [{ id: 'rhyme', title: 'Rhyme Call' }, { id: 'fish', title: 'Fish Pond' }] }],
    chests: [{ unit: 1, lesson: 'Units 1–2', name: 'Sight words 1', title: 'Sight words 1', href: '#/chest1' }]
  });
  const by = Object.fromEntries(skills.map((s) => [s.id, s.items.length]));
  assert.equal(by.fluency, 1);
  assert.equal(by.spelling, 1);
  assert.equal(by.rhyme, 3);
  assert.equal(by.pa, 2);
  assert.equal(by.sight, 1);
  assert.equal(skills.find((s) => s.id === 'games'), undefined);
  assert.equal(skills.find((s) => s.id === 'families').soon, true);
  const rhyme = IR.searchSkills(skills, 'rhyme');
  assert.equal(rhyme.length, 3);
  assert.ok(rhyme.every((hit) => hit.href));
  assert.equal(IR.searchSkills(skills, 'word chains').length, 0);
  assert.equal(IR.searchSkills(skills, 'zip').length, 0);
});

test('old practice links redirect into Skill Practice', () => {
  const screens = fs.readFileSync(new URL('../js/screens.js', import.meta.url), 'utf8');
  assert.match(screens, /#\/practice\/spelling/);
  assert.match(screens, /#\/practice\/skills/);
  assert.match(screens, /pbox\('skills', 'Skill Practice'/);
  assert.doesNotMatch(screens, /pbox\('fluency'/);
  assert.doesNotMatch(screens, /pbox\('spelling'/);
});

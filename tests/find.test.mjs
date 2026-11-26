import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const screens = fs.readFileSync(new URL('../js/screens.js', import.meta.url), 'utf8');
const skills = fs.readFileSync(new URL('../js/skills.js', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

test('Find It is a search box and four tabs', () => {
  assert.match(screens, /\['unit', 'By Unit'\]/);
  assert.match(screens, /\['skill', 'By Skill'\]/);
  assert.equal(screens.includes('By Stage'), false);
  assert.match(screens, /\['sight', 'Sight Words'\]/);
  assert.match(screens, /\['fluency', 'Fluency Readers'\]/);
  assert.equal(screens.includes('By Topic / Skill'), false);
  assert.equal(screens.includes('By Unit and Lesson'), false);
  assert.equal(screens.includes("'By Activity'"), false);
  assert.match(screens, /Phonemic Awareness/);
  assert.match(screens, /for \(let n = 1; n <= 22; n\+\+\)/);
  assert.equal(screens.includes('Review stop'), false);
  assert.match(screens, /class: 'bellpath'/);
  assert.equal(screens.includes('TRAIL_STAGES'), false);
  assert.match(sw, /ir-20261127g/);
  assert.match(screens, /openKey === g\.name/);
  assert.match(screens, /data\[mode\]/);
  const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
  assert.match(css, /grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
});

test('all four sight word chests open and are not locked', () => {
  const sight = screens.slice(screens.indexOf("if (key === 'sight')"), screens.indexOf("if (key === 'fluency')"));
  assert.match(sight, /class: 'gchest sbox open'/);
  assert.match(sight, /'#\/chest' \+ n/);
  assert.equal(sight.includes('locked'), false);
  assert.equal(sight.includes('Coming soon'), false);
  assert.equal(skills.includes('locked: !c.href'), false);
  assert.match(skills, /locked: false/);
  const route = screens.slice(screens.indexOf('function route()'), screens.indexOf('function addUnitBack'));
  assert.equal(route.includes('#/practice/sight'), false);
  assert.match(route, /#\/practice\/spelling/);
  assert.match(screens, /if \(id === 'sight'\) return practiceScreen\('sight'\)/);
});

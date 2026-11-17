import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const day1 = fs.readFileSync(new URL('../js/foundation/day1.js', import.meta.url), 'utf8');
const letters = fs.readFileSync(new URL('../js/foundation/letters.js', import.meta.url), 'utf8');

test('Team 1 Day 1 sample is one flow of a and m only', () => {
  const names = ['Meet the Team', 'Ears Only', 'See and Say', 'Hear and Find', 'Build and Blend', 'Meet the Letter', 'Word Work', 'Heart Word', 'Read It'];
  names.forEach((name) => assert.ok(day1.includes(name), name));
  assert.match(day1, /img\/zipA\.webp/);
  assert.match(day1, /img\/frill\.webp/);
  assert.match(day1, /My name is: ' \+ id/);
  assert.match(day1, /My sound is ' \+ L\.sound/);
  assert.match(letters, /#\/foundation\/sample/);
  assert.equal(day1.includes('sat'), false);
  assert.equal(day1.includes('Sam'), false);
  assert.equal(day1.includes("'s'"), false);
  assert.equal(day1.includes("'t'"), false);
});

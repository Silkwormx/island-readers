import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const day1 = fs.readFileSync(new URL('../js/foundation/day1.js', import.meta.url), 'utf8');
const letters = fs.readFileSync(new URL('../js/foundation/letters.js', import.meta.url), 'utf8');

test('Day 1 sample is a short lesson plus a and m games', () => {
  ['Meet the Team', 'Meet the Letter', 'Link Arms', 'Sound Pop', 'Feed the Friend', 'Beginning Sound Catch', 'Letter Hunt', 'Build It', 'Ears Only Blend', 'Quick Flash', 'Read and Match', 'Sound Match', 'Sort the Sound', 'Not yet'].forEach((name) => {
    assert.ok(day1.includes(name), name);
  });
  assert.match(day1, /img\/zipA\.webp/);
  assert.match(day1, /img\/frill\.webp/);
  assert.match(day1, /My name is: ' \+ id/);
  assert.match(day1, /My sound is ' \+ L\.sound/);
  assert.match(day1, /I said it/);
  assert.match(letters, /#\/foundation\/sample/);
  assert.match(day1, /ROUND_N = 12/);
  assert.match(day1, /Round ' \+ x \+ ' of ' \+ n/);
  assert.match(letters, /function plan12/);
  assert.match(letters, /Round ' \+ x \+ ' of ' \+ n/);
  assert.equal(day1.includes('sat'), false);
  assert.equal(day1.includes('Sam'), false);
  assert.equal(day1.includes('best on a tablet'), false);
});

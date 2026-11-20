import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const letters = fs.readFileSync(new URL('../js/foundation/letters.js', import.meta.url), 'utf8');
const start = letters.indexOf('function soundKey');
const end = letters.indexOf('function speakPlain');
const api = new Function(letters.slice(start, end) + '\nreturn { soundKey, speakLinePlan };')();

test('a and I are spoken as words and the highlight stays on those words', () => {
  const line = api.speakLinePlan('I sat a mat');
  assert.deepEqual(line.words, ['I', 'sat', 'a', 'mat']);
  assert.deepEqual(line.spoken, [0, 1, 2, 3]);
  assert.deepEqual(api.speakLinePlan('a').spoken, [0]);
  assert.deepEqual(api.speakLinePlan('I').spoken, [0]);
  const mixed = api.speakLinePlan('mmm a sat');
  assert.deepEqual(mixed.spoken, [1, 2]);
  assert.equal(mixed.words[mixed.spoken[0]], 'a');
  assert.equal(mixed.words[mixed.spoken[1]], 'sat');
});

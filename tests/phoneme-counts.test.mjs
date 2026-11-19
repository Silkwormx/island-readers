import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

/* Hand-written. A part is a phoneme. The number of dots must equal parts.length. */
const EXPECTED = {
  a: { n: 1, parts: ['a'] },
  am: { n: 2, parts: ['a', 'm'] },
  at: { n: 2, parts: ['a', 't'] },
  mat: { n: 3, parts: ['m', 'a', 't'] },
  sat: { n: 3, parts: ['s', 'a', 't'] },
  sam: { n: 3, parts: ['s', 'a', 'm'] },
  tam: { n: 3, parts: ['t', 'a', 'm'] },
  mats: { n: 4, parts: ['m', 'a', 't', 's'] },
  me: { n: 2, parts: ['m', 'ee'] },
  see: { n: 2, parts: ['s', 'ee'] },
  the: { n: 2, parts: ['th', 'uh'] }
};

function loadPhonemes() {
  const window = {};
  vm.runInNewContext(fs.readFileSync(new URL('../js/foundation/phonemes.js', import.meta.url), 'utf8'), { window });
  return window.IRPhonemes;
}

test('every counted word has the handwritten phoneme count', () => {
  const lib = loadPhonemes();
  const used = lib.countWords.concat(lib.buildWords);
  used.forEach((word) => {
    const want = EXPECTED[word.toLowerCase()];
    const got = JSON.parse(JSON.stringify(lib.of(word)));
    assert.ok(want, word + ' has no handwritten count');
    assert.deepEqual(got, want.parts, word + ' parts');
    assert.equal(got.length, want.n, word + ' dot count');
    assert.equal(want.parts.length, want.n);
  });
  ['am', 'at', 'sat', 'mat', 'sam', 'me', 'see', 'the'].forEach((word) => {
    assert.equal(lib.of(word).length, EXPECTED[word].n);
  });
  assert.deepEqual(JSON.parse(JSON.stringify(lib.of('me'))), ['m', 'ee']);
  assert.deepEqual(JSON.parse(JSON.stringify(lib.of('see'))), ['s', 'ee']);
  assert.equal(lib.countWords.filter((word, i, list) => list.findIndex((item) => item.toLowerCase() === word.toLowerCase()) !== i).length, 0);
});

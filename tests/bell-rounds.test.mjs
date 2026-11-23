import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('..', import.meta.url);
function load(file) { return fs.readFileSync(new URL(file, root), 'utf8'); }
const window = { IR: { h() { return {}; }, shuffle(list) { return list.slice(); } } };
vm.runInNewContext(load('data.js') + '\n' + load('data_nk.js') + '\n' + load('data_u6.js'), { window });
vm.runInNewContext(load('js/gamerules.js'), { window, document: { createTextNode(t) { return t; } } });
const D = window.IR_DATA;
const N = window.IR_DATA_NK;
const roundsOf = window.IR.bellRounds;
const close = window.IR.bellClose;

function ngWords() {
  return [].concat(D.bells, D.fish.ng, D.build.map((x) => x.word), D.hear.reduce((list, x) => list.concat([x.word], x.choices), []));
}
function nkWords() {
  return [].concat(N.bells, N.build.map((x) => x.word), N.hear.reduce((list, x) => list.concat([x.word], x.choices), []), N.chain, N.scramble);
}
function u6Words(L) {
  const out = [];
  L.hear.forEach((x) => out.push(x.word, ...x.choices));
  out.push(...L.bells.yes, ...L.bells.no);
  L.build.forEach((x) => out.push(x.word, x.base));
  L.chains.forEach((row) => out.push(...row));
  out.push(...L.feedYes, ...L.feedNo, ...L.fishYes, ...L.fishNo);
  return out;
}

function check(name, words) {
  const rounds = roundsOf(words);
  assert.ok(rounds.length >= 10 && rounds.length <= 12, name + ' has ' + rounds.length);
  rounds.forEach((round) => {
    assert.equal(round.bells.length, 3, name);
    assert.equal(new Set(round.bells).size, 3, name + ' ' + round.bells.join(' '));
    assert.ok(round.bells.includes(round.target), name);
    round.bells.filter((w) => w !== round.target).forEach((w) => {
      assert.ok(close(round.target, w) <= 4, name + ' ' + round.target + ' / ' + w);
    });
  });
}

test('each Ring every bell lesson deals 10 to 12 close trios', () => {
  check('ng', ngWords());
  check('nk', nkWords());
  window.IR_DATA_U6.lessons.forEach((L) => check(L.key, u6Words(L)));
  const rules = load('js/gamerules.js');
  assert.match(rules, /Ring the bell you hear/);
  assert.match(rules, /sfx\.ding/);
  assert.doesNotMatch(rules, /speechSynthesis/);
  assert.match(load('js/orange.js'), /IR\.ringBells/);
  assert.match(load('js/nk_acts.js'), /IR\.ringBells/);
  assert.match(load('js/u6.js'), /IR\.ringBells/);
});

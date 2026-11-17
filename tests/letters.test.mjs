import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const letters = fs.readFileSync(new URL('../js/foundation/letters.js', import.meta.url), 'utf8');
const screens = fs.readFileSync(new URL('../js/screens.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const teach = fs.readFileSync(new URL('../js/teach.js', import.meta.url), 'utf8');

test('Learn the Letters follows the UFLI group order and is not a unit', () => {
  const order = ['a', 'm', 's', 't', 'p', 'f', 'i', 'n', 'o', 'd', 'c', 'u', 'g', 'b', 'e', 'k', 'h', 'r', 'l', 'w', 'j', 'y', 'x', 'q', 'v', 'z'];
  const ids = [...letters.matchAll(/id: '([a-z])', name:/g)].map((m) => m[1]);
  assert.deepEqual(ids, order);
  assert.match(letters, /letters: \['a', 'm', 's', 't'\]/);
  assert.match(letters, /letters: \['v', 'z'\]/);
  assert.match(letters, /This is not a unit/);
  assert.equal(/\bfree\b/i.test(letters), false);
  assert.match(letters, /img\/frill\.webp/);
  assert.equal(letters.includes('frillC'), false);
  assert.match(letters, /Find the letter/);
  assert.match(letters, /Match upper and lower/);
  assert.match(letters, /First sound/);
  assert.match(letters, /Feed Zip/);
  assert.match(letters, /Letter review/);
  assert.match(letters, /Review flash/);
  assert.match(letters, /Meet the letters/);
  assert.match(letters, /Read it!/);
  const steps = ["id: 'flash'", "id: 'ears'", "id: 'meet'", "id: 'say'", "id: 'trace'", "id: 'games'", "id: 'spell'", "id: 'read'", "id: 'check'", "id: 'celebrate'"];
  for (let i = 1; i < steps.length; i++) assert.ok(letters.indexOf(steps[i - 1]) < letters.indexOf(steps[i]), steps[i]);
  assert.match(letters, /Sound play/);
  assert.match(letters, /Spell it/);
  assert.match(letters, /Look what I can read!/);
  assert.match(letters, /g1: \['am', 'at', 'Sam', 'sat'\]/);
  assert.match(letters, /ir_letters_read/);
  assert.match(letters, /program\.json/);
  assert.match(letters, /fadeStep/);
  assert.match(letters, /function hintButton/);
  assert.match(letters, /Say it from the letter/);
  assert.match(letters, /Mastery check/);
  assert.match(letters, /cueFor/);
  assert.match(letters, /llfont-a/);
  assert.match(letters, /Your letter path/);
  assert.match(letters, /Start Group 1/);
  assert.match(letters, /Group check/);
  assert.match(letters, /function lessonsOf/);
  assert.match(letters, /Warm-up/);
  assert.match(letters, /Blend and read/);
  assert.match(letters, /Final art is still needed/);
});

test('reading words stay inside the letters taught so far', () => {
  const groups = [
    ['a', 'm', 's', 't'],
    ['p', 'f', 'i', 'n'],
    ['o', 'd', 'c', 'u'],
    ['g', 'b', 'e', 'k'],
    ['h', 'r', 'l', 'w'],
    ['j', 'y', 'x', 'q'],
    ['v', 'z']
  ];
  const bank = [...letters.matchAll(/\{ w: '([^']+)', g: (\d+)(?:, line: '([^']*)')? \}/g)];
  assert.ok(bank.length > 20);
  const g1 = bank.filter((row) => row[2] === '1').map((row) => row[1]);
  assert.deepEqual(g1, ['am', 'at', 'mat', 'sat', 'Sam', 'Tam']);
  assert.equal(g1.includes('mast'), false);
  let seen = 0;
  const set = new Set();
  bank.forEach((row) => {
    const word = row[1];
    const g = Number(row[2]);
    while (seen < g) { groups[seen].forEach((ch) => set.add(ch)); seen++; }
    const chunks = [word].concat(row[3] ? row[3].split(/\s+/) : []);
    chunks.forEach((part) => {
      const chars = part.toLowerCase().replace(/[^a-z]/g, '').split('');
      chars.forEach((ch) => assert.ok(set.has(ch), part + ' uses ' + ch + ' before group ' + g));
    });
    const body = word.toLowerCase();
    const shape = body.startsWith('qu') ? /^qu[aeiou][a-z]$/ : /^[aeiou][a-z]$|^[a-z][aeiou][a-z]$/;
    assert.match(body, shape, word);
  });
  assert.match(letters, /Sea snake in the sand/);
  assert.match(letters, /Slide your hand like the snake/);
  assert.match(letters, /llcast/);
  assert.match(letters, /hold hands/);
  assert.equal(/\bfree\b/i.test(letters), false);
});

test('picture words put the letter at the start, except x at the end', () => {
  const rows = [...letters.matchAll(/id: '([a-z])'[\s\S]*?word: '([a-z]+)'[\s\S]*?where: '(start|end)'/g)];
  assert.equal(rows.length, 26);
  rows.forEach((row) => {
    const id = row[1];
    const word = row[2];
    const where = row[3];
    if (where === 'end') assert.equal(word.endsWith(id), true, word);
    else assert.equal(word.startsWith(id), true, word);
  });
});

test('home opens Foundation Skills from the first bell, not a sidebar tab', () => {
  const homeStart = screens.indexOf('function homeScreen()');
  const homeEnd = screens.indexOf('function gemScreen()');
  const home = screens.slice(homeStart, homeEnd);
  assert.equal(home.includes("tab('#/foundation'"), false);
  assert.ok(home.indexOf("tab('#/trail'") < home.indexOf("tab('#/find'"));
  assert.ok(home.indexOf("'Foundations'") < home.indexOf('for (let n = 1; n <= 22; n++)'));
  assert.match(home, /foundation\/img\/foundations_cover\.jpg/);
  assert.match(home, /Learn the letters/);
  assert.match(home, /location\.hash = '#\/foundation'/);
  assert.match(home, /class: 'tcard'/);
  assert.equal(home.includes('lettersentry'), false);
  assert.match(screens, /foundationRoute/);
  assert.match(html, /js\/foundation\/letters\.js/);
  assert.match(html, /foundation\/foundation\.css/);
  assert.match(sw, /js\/foundation\/letters\.js/);
  assert.match(sw, /ir-20261118b/);
  assert.match(teach, /#\/foundation/);
  assert.match(letters, /Group 1 slideshow/);
  assert.match(letters, /Learn_the_Letters_Group1\.pdf/);
  assert.match(letters, /Groups 2 to 7 coming soon/);
  assert.equal(sw.includes('Learn_the_Letters_Group1.pdf'), false);
  assert.match(letters, /Foundation Skills/);
  assert.match(letters, /#\/foundation\/letters/);
});

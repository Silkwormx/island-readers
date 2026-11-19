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
  assert.match(letters, /Review the letters/);
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
  assert.match(letters, /'Team ' \+ group\.n/);
  assert.match(letters, /join\(', '\)/);
  assert.match(letters, /Why this order\?/);
  assert.match(letters, /Meet the Team/);
  assert.match(letters, /My name is: /);
  assert.match(letters, /My sound is /);
  assert.match(letters, /function letterIntro/);
  assert.match(letters, /Meet the letters/);
  assert.match(letters, /labels: \['Introduction', 'Games', 'Read It'\]/);
  assert.match(letters, /function paintIdo/);
  assert.match(letters, /function paintWedo/);
  assert.match(letters, /If your child needs a hand/);
  assert.equal(letters.includes('Start Group 1'), false);
  assert.match(letters, /class: 'zfstart2'/);
  assert.match(letters, /Pick up where you left off/);
  assert.match(letters, /Team check/);
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
  assert.match(letters, /Snakes sell sandy socks/);
  assert.match(letters, /Slide your hand like a snake/);
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
  assert.ok(home.indexOf('Trail Map') < home.indexOf("tab('#/find'"));
  assert.ok(home.indexOf('Sight Word Practice') < home.indexOf("tab('#/find'"));
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
  assert.match(sw, /ir-20261122o/);
  assert.match(sw, /foundation\/img\/foundations_sidebar\.jpg/);
  assert.match(teach, /#\/foundation/);
  assert.match(letters, /Teacher Slideshows/);
  assert.match(letters, /IR\.modeBar/);
  assert.match(letters, /function teamTeacher/);
  assert.match(screens, /Teacher Materials/);
  assert.match(screens, /Slideshow/);
  assert.match(screens, /Printables/);
  assert.match(screens, /Coming soon/);
  assert.match(letters, /materials\/team1\/slides\//);
  assert.match(letters, /Learn_the_Letters_Team2\.pdf/);
  assert.equal(letters.includes('Day 1a'), false);
  assert.equal(letters.includes('Day 1b'), false);
  assert.match(letters, /label: 'Day 1', page: 1/);
  assert.match(letters, /label: 'Day 2', page: 34/);
  assert.match(letters, /label: 'Day 5', page: 157/);
  assert.match(letters, /label: 'Day 1', page: 3/);
  assert.match(letters, /label: 'Day 4', page: 93/);
  assert.match(letters, /label: 'Team check', page: 93/);
  assert.match(letters, /Team 1 Quick Sounds/);
  assert.match(letters, /Team 2 Quick Sounds/);
  assert.match(letters, /const SCORE_TRACKER = ''/);
  assert.match(letters, /Teams 3-7 coming soon/);
  assert.equal(letters.includes('Learn_the_Letters_Group1'), false);
  assert.equal(letters.includes(' free'), false);
  assert.equal(sw.includes('Learn_the_Letters_Group1.pdf'), false);
  assert.equal(sw.includes('Learn_the_Letters_Team1.pdf'), false);
  assert.match(letters, /Foundation Skills/);
  assert.match(letters, /pageNav\('#\/home'\)/);
  assert.equal(letters.includes('fs-homebtn'), false);
  assert.equal(letters.includes('fs-titlelink'), false);
  assert.match(letters, /foundation\/img\/foundations_sidebar\.jpg/);
  assert.match(letters, /Zip and Frill with Team 1 letters a, m, s, t on the beach/);
  assert.equal(letters.includes('img/home_zip_frill.webp'), false);
  assert.match(letters, /#\/foundation\/letters/);
});

test('lesson narration is Frill, and Zip says the praise line', () => {
  const csv = fs.readFileSync(new URL('../review-audio/read_aloud_script.csv', import.meta.url), 'utf8');
  const md = fs.readFileSync(new URL('../review-audio/read_aloud_script.md', import.meta.url), 'utf8');
  assert.match(csv, /^area,page\/screen,id\/key,speaker,current text spoken,notes/m);
  assert.match(csv, /lesson-hear,Frill,Tap the sound\./);
  assert.match(csv, /lesson-done,Zip,You did it\./);
  assert.match(md, /Frill is the v4 B nudibranch/);
  assert.match(letters, /who: 'Frill'/);
  assert.match(letters, /who: 'Zip'/);
  assert.match(letters, /img\/frill\.webp/);
  assert.match(letters, /img\/zipA\.webp/);
  assert.equal(csv.includes('.mp3'), false);
});

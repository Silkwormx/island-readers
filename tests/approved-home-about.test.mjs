import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const screens = fs.readFileSync(new URL('../js/screens.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const aboutStart = screens.indexOf('function aboutScreen()');
const aboutEnd = screens.indexOf('function teachersScreen()');
const about = screens.slice(aboutStart, aboutEnd);
const homeStart = screens.indexOf('function homeScreen()');
const homeEnd = screens.indexOf('function gemScreen()');
const home = screens.slice(homeStart, homeEnd);

const APPROVED = [
  'Building reading confidence through phonics practice',
  'Island Readers gives older children a way to revisit the skills they need to become confident readers without being treated like younger learners.',
  'Background',
  'I\\u2019ve taught special education for over 15 years',
  'Foundational skills, not a younger experience',
  'they\\u2019re back in kindergarten',
  'Start with what\\u2019s missing',
  'A short placement check helps identify a starting point and skills that need attention.',
  'letter\\u2013sound relationships and decoding',
  'Practice with a purpose',
  'Word chains help readers notice how changing one sound changes a word and its spelling.',
  'These supports draw on approaches used with learners with dyslexia, ADHD and language-processing difficulties, but can benefit many different readers.',
];

test('about uses the approved copy and keeps the placement check wording', () => {
  for (const line of APPROVED) assert.ok(about.includes(line), line);
  assert.ok(about.includes('Tap \u201cStart here to find your first bell\u201d on the home screen.'));
  assert.ok(about.includes('A group passes at 4 of 5'));
  assert.ok(about.includes('Nothing is recorded or sent, and the microphone is not used.'));
  assert.ok(about.includes("['22', 'big endings: -tion, -ture, -ment']"));
  assert.ok(about.includes('National Reading Panel'));
  assert.equal(about.includes('\\u2014'), false);
  assert.equal(about.includes('\u2014'), false);
  assert.equal(/struggl/i.test(about), false);
  assert.equal(about.includes('Why Island Readers exists'), false);
  assert.equal(about.includes('The national picture'), false);
});

test('home shows Zip and Frill again and keeps the left-column layout', () => {
  assert.ok(home.includes("src: 'img/home_zip_frill.webp'"));
  assert.ok(home.includes('Zip and Frill sit on a tree root reading a book together.'));
  assert.equal(home.includes("src: 'img/zipA.webp'"), false);
  assert.equal(home.includes("src: 'img/frill.webp'"), false);
  assert.equal(home.includes('home_banyan_c.jpg'), false);
  assert.equal(home.includes('frillC.webp'), false);
  const featureCss = css.slice(css.indexOf('Zip and Frill portraits back in the left-column card'));
  assert.equal(/scaleX\s*\(\s*-1|rotateY\(180/.test(home + featureCss), false);
  assert.ok(featureCss.includes('.homefeature .zfpics'));
  assert.ok(home.includes("href: '#/about'"));
  assert.ok(home.includes("href: '#/placement'"));
  assert.ok(home.includes('Learn to read with Zip and Frill'));
  assert.equal(home.includes('Read with Brick and Dash'), false);
  assert.equal(home.includes('Learn to read with Brick and Dash'), false);
  assert.ok(home.includes('Ring every bell by learning its sounds.'));
  assert.equal(home.includes('Learn each sound to fix the bells.'), false);
  assert.ok(home.includes('Learn to read with Zip and Frill. Ring every bell by learning its sounds. Start here to find your first bell.'));
  assert.ok(home.includes('hero, practice), grid'));
  assert.equal(home.includes('banner, hero,'), false);
  const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
  assert.equal(sw.includes('home_banyan_c.jpg'), false);
  assert.ok(sw.includes('ir-20261111f'));
  assert.ok(sw.includes('home_zip_frill.webp'));
});

test('approved image file is the installed jpeg', () => {
  const path = new URL('../img/home_banyan_c.jpg', import.meta.url);
  const buf = fs.readFileSync(path);
  assert.ok(buf.length > 20000);
  assert.equal(buf[0], 0xff);
  assert.equal(buf[1], 0xd8);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const u6 = fs.readFileSync(new URL('../js/u6.js', import.meta.url), 'utf8');
const data = fs.readFileSync(new URL('../data_u6.js', import.meta.url), 'utf8');
const screens = fs.readFileSync(new URL('../js/screens.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const core = fs.readFileSync(new URL('../js/core.js', import.meta.url), 'utf8');

test('Unit 6 is the Endings tile and opens from home', () => {
  assert.match(screens, /\['Endings', '-s \\u00b7 -es \\u00b7 -ed \\u00b7 -ing'/);
  assert.match(screens, /IR\.u6Route/);
  assert.match(screens, /location\.hash = '#\/u6'/);
  assert.match(html, /data_u6\.js/);
  assert.match(html, /js\/u6\.js/);
});

test('three lessons, ten activities, Fish Pond is 9, Zip\'s Check is last', () => {
  assert.match(data, /"n": "6.1"/);
  assert.match(data, /"n": "6.2"/);
  assert.match(data, /"n": "6.3"/);
  const ids = [...u6.matchAll(/id: '(\w+)', title: '([^']+)', group: 'activities'/g)].map((m) => m[1]);
  assert.deepEqual(ids, ['hear', 'bells', 'build', 'chain', 'feed', 'sentence', 'read', 'rhyme', 'fish', 'check']);
  assert.match(u6, /title: 'Fish Pond'/);
  assert.match(u6, /title: 'Zip\\u2019s Check'/);
  assert.match(u6, /title: 'Rhyme Call'/);
  assert.match(u6, /title: 'Add the ending'/);
});

test('check bands and ending-sound correction', () => {
  assert.match(u6, /Move on/);
  assert.match(u6, /Review/);
  assert.match(u6, /Re-teach/);
  assert.match(u6, /score >= 9/);
  assert.match(u6, /score >= 7/);
  assert.match(u6, /About 10 to 12 minutes/);
  assert.match(u6, /Listen again/);
  assert.match(u6, /ending sound/);
  assert.match(u6, /Never say the letter names/);
});

test('stories are Lunch Crabs, Kite That Zipped, and Stick by the Bell', () => {
  assert.match(data, /The Lunch Crabs/);
  assert.match(data, /The Kite That Zipped/);
  assert.match(data, /The Stick by the Bell/);
  assert.match(data, /Six crabs pop up from the sand/);
  assert.match(data, /The kite zipped and flipped past the green bell/);
  assert.match(data, /Zip is ringing the bell/);
  assert.match(data, /"newWords": \["gone"\]/);
  assert.match(data, /"w": "from"/);
  assert.match(data, /"w": "are"/);
  assert.match(data, /"newWords": \["wind", "hole", "snack"\]/);
  assert.match(data, /"w": "as"/);
  assert.doesNotMatch(data, /The Boxes on the Path/);
  assert.doesNotMatch(data, /The Branch on the Bell/);
  assert.doesNotMatch(data, /Frill tucks the rope on the branch/);
  assert.doesNotMatch(data, /A thick branch landed on the bell/);
  assert.doesNotMatch(data, /Zip packs the cups and the hats/);
  assert.doesNotMatch(u6 + data, /\u2014|—/);
  assert.match(sw, /ir-20261113b/);
  const rules = fs.readFileSync(new URL('../js/gamerules.js', import.meta.url), 'utf8');
  assert.match(rules, /IR\.pairCard/);
  assert.match(rules, /lesson \? 'Learn' : 'Read'/);
  assert.match(u6, /IR\.pairCard/);
  assert.match(u6, /title: L\.storyTitle/);
  assert.match(u6, /#\/u6\/' \+ L\.key \+ '\/read'/);
});

test('every Unit 6 speaker line is tagged, and Frill is not Zip', () => {
  const meets = [...data.matchAll(/"who": "(zip|frill)"/g)].map((m) => m[1]);
  assert.equal(meets.length, 10);
  assert.ok(meets.includes('frill') && meets.includes('zip'));
  const pages = [...data.matchAll(/"voice": "(Zip|Frill)"/g)].map((m) => m[1]);
  assert.equal(pages.length, 32);
  assert.equal(pages.filter((v) => v === 'Frill').length, 1);
  assert.match(u6, /en-US-AriaNeural, rate -10%/);
  assert.match(u6, /en-US-RogerNeural, rate \+0%/);
  assert.match(core, /autoplay: true/);
  assert.match(core, /s\.settings\.autoplay = true/);
  assert.match(u6, /setNextLabel/);
  assert.match(data, /"pairs": \[\["box", "boxes"\], \["dish", "dishes"\]\]/);
  assert.match(data, /Letters e and d make three sounds when they end a word/);
  assert.match(data, /"say": "\/ed\/"/);
  assert.match(data, /"say": "\/d\/"/);
  assert.match(data, /"say": "\/t\/"/);
  assert.match(u6, /class: 'edsay'/);
  assert.match(u6, /class: 'edmark'/);
  assert.match(u6, /Answer 1 for yes, 2 for no/);
  assert.match(u6, /yn-secret/);
  assert.match(u6, /from: 'cat', to: 'cats'/);
  assert.match(u6, /from: 'jump', to: 'jumped'/);
  assert.match(u6, /from: 'hang', to: 'hanging'/);
  assert.doesNotMatch(u6, /from: 'cap'/);
});

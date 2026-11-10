import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const u6 = fs.readFileSync(new URL('../js/u6.js', import.meta.url), 'utf8');
const data = fs.readFileSync(new URL('../data_u6.js', import.meta.url), 'utf8');
const screens = fs.readFileSync(new URL('../js/screens.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

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

test('stories are the three planned repairs with no em dash', () => {
  assert.match(data, /The Boxes on the Path/);
  assert.match(data, /The Branch on the Bell/);
  assert.match(data, /The Stick by the Bell/);
  assert.match(data, /Frill tucks the rope on the branch/);
  assert.match(data, /A thick branch landed on the bell/);
  assert.match(data, /Zip is ringing the bell/);
  assert.doesNotMatch(data, /Zip packs the cups and the hats/);
  assert.doesNotMatch(u6 + data, /\u2014|—/);
  assert.match(sw, /ir-20261110f/);
});

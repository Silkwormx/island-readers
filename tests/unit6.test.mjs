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

test('ten activities, Fish Pond is 9, Zip\'s Check is last', () => {
  const ids = [...u6.matchAll(/id: '(\w+)', title: '([^']+)', group: 'activities'/g)].map((m) => m[1]);
  assert.deepEqual(ids, ['hear', 'bells', 'build', 'chain', 'scramble', 'feed', 'sentence', 'read', 'fish', 'check']);
  assert.match(u6, /title: 'Fish Pond'/);
  assert.match(u6, /title: 'Zip\\u2019s Check'/);
});

test('check bands and grown-up error fixes', () => {
  assert.equal((data.match(/"type":/g) || []).length, 10);
  assert.match(u6, /Move on/);
  assert.match(u6, /Review/);
  assert.match(u6, /Re-teach/);
  assert.match(u6, /score >= 9/);
  assert.match(u6, /score >= 7/);
  assert.match(u6, /about 10 minutes/);
  assert.match(u6, /After two misses, show the ending/);
  assert.match(u6, /clap the beats/);
});

test('story is original Zip and Frill text with no em dash', () => {
  assert.match(data, /Zip packs the cups and the hats/);
  assert.match(data, /Frill said, I can help/);
  assert.doesNotMatch(u6 + data, /\u2014|—/);
  assert.match(sw, /data_u6\.js/);
  assert.match(sw, /js\/u6\.js/);
});

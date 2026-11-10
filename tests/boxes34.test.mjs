import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('..', import.meta.url);
const read = (rel) => fs.readFileSync(new URL(rel, root), 'utf8');

function loadData() {
  const ctx = { window: {} };
  vm.runInNewContext(read('data.js'), ctx);
  return ctx.window.IR_DATA;
}

test('boxes 3 and 4 have 50 words, fill-in rounds, and every audio file', () => {
  const D = loadData();
  const chest = read('js/chest.js');
  const screens = read('js/screens.js');
  assert.equal(D.box3.length, 50);
  assert.equal(D.box4.length, 50);
  assert.equal(new Set(D.box3).size, 50);
  assert.equal(new Set(D.box4).size, 50);
  assert.equal(D.fillin3.length, 24);
  assert.equal(D.fillin4.length, 24);
  assert.match(chest, /make\(3, D\.box3/);
  assert.match(chest, /make\(4, D\.box4/);
  assert.match(screens, /href: '#\/chest3'/);
  assert.match(screens, /href: '#\/chest4'/);
  assert.match(screens, /chest\[1-4\]/);
  const files = new Set();
  for (const w of D.box3.concat(D.box4)) files.add('audio/w_' + w + '.mp3');
  for (const list of [D.fillin3, D.fillin4]) {
    for (const it of list) {
      files.add('audio/sf_' + it.id + '.mp3');
      files.add('audio/sq_' + it.id + '.mp3');
      for (const w of it.choices.concat(it.ans)) files.add('audio/w_' + w + '.mp3');
    }
  }
  const missing = [...files].filter((f) => !fs.existsSync(new URL(f, root)));
  assert.deepEqual(missing, []);
});

test('fluency page lists the stories that exist and drops the coming-soon line', () => {
  const screens = read('js/screens.js');
  const data = read('data.js');
  const nk = read('data_nk.js');
  assert.equal(screens.includes('More stories are coming soon.'), false);
  assert.match(screens, /function fluencyStories/);
  assert.match(screens, /Unit ' \+ unit \+ ' \\u00b7 Lesson ' \+ lesson/);
  assert.match(screens, /class: 'fl-title'/);
  assert.match(screens, /#\/u6\/' \+ L\.key \+ '\/read/);
  assert.match(screens, /#\/nk\/read/);
  assert.match(data, /"storyTitle": "The Twigs in the Bell"/);
  assert.match(nk, /"storyTitle": "The Skunk in the Trunk"/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function load(file, name) {
  const window = {};
  vm.runInNewContext(fs.readFileSync(new URL(file, import.meta.url), 'utf8'), { window });
  return window[name];
}

const program = JSON.parse(fs.readFileSync(new URL('../foundation/data/program.json', import.meta.url), 'utf8'));
const nk = load('../data_nk.js', 'IR_DATA_NK');
const u6 = load('../data_u6.js', 'IR_DATA_U6');

/* Spellings this test treats as not yet taught. Heart words and the left list are the only exceptions. */
const UNTAUGHT = [
  [/ew/, 'ew'],
  [/ee/, 'ee'],
  [/aw/, 'aw'],
  [/au/, 'au'],
  [/ou/, 'ou'],
  [/igh/, 'igh'],
  [/^by$/, 'by'],
  [/^gone$/, 'gone'],
  [/^eyes$/, 'eyes'],
  [/^pew$/, 'pew'],
  [/^out$/, 'out'],
  [/^green$/, 'green'],
  [/^claws$/, 'claws']
];

/* Kept on purpose. The pattern belongs to a unit that is not built yet, or the word is a connector. */
const LEFT = {
  foundations: {
    and: 'connector; final blend nd is an unbuilt Unit 2 pattern'
  }
};

function tokens(text) {
  return String(text).toLowerCase().match(/[a-z']+/g) || [];
}

function heartsOf(list) {
  return new Set((list || []).map((item) => String(item.w || item).toLowerCase()));
}

function problems(lines, hearts, left) {
  const bad = [];
  for (const line of lines) {
    for (const word of tokens(line)) {
      if (hearts.has(word) || (left && left[word])) continue;
      if (word === 'zip' || word === 'frill') continue;
      for (const [re, name] of UNTAUGHT) {
        if (re.test(word)) bad.push(word + ' (' + name + ') in: ' + line);
      }
    }
  }
  return bad;
}

test('foundation stories do not keep the easy untaught words', () => {
  const stories = program.lessons.flatMap((lesson) => lesson.story || []);
  const blob = stories.join('\n');
  for (const word of ['pond', 'sand', 'went', 'hill', 'digs', 'hens', 'runs', 'wins', 'jogs', 'wags', 'pens', 'figs']) {
    assert.equal(new RegExp('\\b' + word + '\\b', 'i').test(blob), false, word);
  }
  const hearts = new Set(Object.keys(program.heart_words).map((word) => word.toLowerCase()));
  const bad = problems(stories, hearts, LEFT.foundations);
  assert.deepEqual(bad, []);
});

test('nk and unit 6 stories flag untaught patterns', () => {
  const lessons = [
    { name: 'nk', lines: nk.story.map((page) => page.text), hearts: heartsOf(nk.heart) },
    ...u6.lessons.map((lesson) => ({ name: lesson.key, lines: lesson.story.map((page) => page.text), hearts: heartsOf(lesson.heart) }))
  ];
  for (const lesson of lessons) {
    assert.ok(lesson.hearts.size, lesson.name + ' has heart words');
    const bad = problems(lesson.lines, lesson.hearts, {});
    assert.deepEqual(bad, [], lesson.name);
  }
});

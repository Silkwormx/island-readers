import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const code = fs.readFileSync(new URL('../js/foundation/scope.js', import.meta.url), 'utf8');
const context = { window: {}, globalThis: {} };
vm.runInNewContext(code, context);
const scope = context.window.IRLetterScope;
const program = JSON.parse(fs.readFileSync(new URL('../foundation/data/program.json', import.meta.url), 'utf8'));

function checkItem(item, letters, hearts, where) {
  if (item.type === 'sentence') {
    String(item.value).split(/\s+/).forEach((part) => {
      const word = part.replace(/[^A-Za-z]/g, '');
      if (!word) return;
      assert.equal(scope.wordOk(program, word, letters, hearts), true, where + ' sentence uses ' + word);
    });
    return;
  }
  if (item.type === 'letter') {
    assert.equal(letters.indexOf(item.value) >= 0, true, where + ' shows letter ' + item.value);
    return;
  }
  assert.equal(scope.wordOk(program, item.value, letters, hearts), true, where + ' shows ' + item.value);
}

test('every lesson item stays inside letters and heart words taught so far', () => {
  const lessons = program.lessons;
  lessons.forEach((lesson) => {
    const plan = scope.lessonPlan(program, lesson);
    plan.phases.forEach((phase, n) => {
      const where = lesson.label + ' practice ' + phase.letter;
      phase.items.forEach((item) => checkItem(item, phase.letters, phase.hearts, where));
      assert.equal(phase.letters[phase.letters.length - 1], phase.letter, where);
      if (n === 0 && lesson.lesson_number === 1) {
        const blob = JSON.stringify(phase.items);
        assert.equal(blob.includes('"s"'), false, 'Day 1a must not practice s while teaching a');
        assert.equal(/sat|Sam|mat/i.test(blob), false);
      }
    });
    const close = plan.close;
    close.items.forEach((item) => checkItem(item, close.letters, close.hearts, lesson.label + ' close'));
  });
  const first = scope.lessonPlan(program, lessons[0]);
  assert.deepEqual(first.phases.map((phase) => phase.letter), ['a', 'm']);
  assert.deepEqual(JSON.parse(JSON.stringify(first.phases[0].words)), []);
  assert.deepEqual(JSON.parse(JSON.stringify(first.phases[1].words)), ['am']);
});

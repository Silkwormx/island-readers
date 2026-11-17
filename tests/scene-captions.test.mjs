import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const code = fs.readFileSync(new URL('../js/foundation/scope.js', import.meta.url), 'utf8');
const context = { window: {}, globalThis: {} };
vm.runInNewContext(code, context);
const scope = context.window.IRLetterScope;
const program = JSON.parse(fs.readFileSync(new URL('../foundation/data/program.json', import.meta.url), 'utf8'));
const lettersJs = fs.readFileSync(new URL('../js/foundation/letters.js', import.meta.url), 'utf8');

function words(line) {
  return String(line || '').match(/[A-Za-z']+/g) || [];
}

test('kid scene captions stay short and inside taught letters', () => {
  const lessons = program.lessons;
  const known = [];
  const hearts = [];
  lessons.forEach((lesson) => {
    const letters = known.concat(lesson.new_letters || []);
    const heartsNow = hearts.concat((lesson.heart_words_today || []).map((word) => String(word).toLowerCase()));
    (lesson.word_scenes || []).forEach((scene) => {
      const caption = scene.caption || '';
      assert.notEqual(caption, scene.scene, lesson.label + ' ' + scene.word);
      assert.ok(caption.length <= 40, caption);
      words(caption).forEach((word) => {
        const low = word.toLowerCase();
        if (low === 'a') {
          assert.equal(letters.indexOf('a') >= 0, true, caption);
          return;
        }
        if (heartsNow.indexOf(low) >= 0 && scope.wordOk(program, word, letters.concat(low.split('')), heartsNow)) {
          return;
        }
        assert.equal(scope.wordOk(program, word, letters, heartsNow), true, lesson.label + ' caption ' + caption);
      });
      if (scene.word === 'mat') assert.equal(caption, 'A mat.');
    });
    (lesson.new_letters || []).forEach((id) => { if (known.indexOf(id) < 0) known.push(id); });
    (lesson.heart_words_today || []).forEach((word) => {
      const key = String(word).toLowerCase();
      if (hearts.indexOf(key) < 0) hearts.push(key);
    });
  });
  assert.match(lettersJs, /figcaption', null, caption/);
  assert.match(lettersJs, /alt: scene\.scene/);
  assert.equal(lettersJs.includes('scene.scene || caption'), false);
});
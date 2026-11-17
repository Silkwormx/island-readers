import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const screens = fs.readFileSync(new URL('../js/screens.js', import.meta.url), 'utf8');
const teachers = screens.slice(screens.indexOf('function teachersScreen()'), screens.indexOf('function slidesViewer'));

function count(hay, needle) {
  return hay.split(needle).length - 1;
}

test('every Teacher Materials section uses the Unit 4 lesson card', () => {
  assert.equal(count(teachers, 'function lessonCard'), 1);
  assert.equal(count(teachers, 'Open on smartboard'), 1);
  assert.equal(count(teachers, 'Download slides'), 1);
  assert.equal(count(teachers, 'Daily practice sheets (PDF)'), 1);
  assert.equal(count(teachers, 'Teacher pack (PDF)'), 1);
  assert.equal(count(teachers, 'Full-screen slide show in the browser. No download needed.'), 1);
  assert.equal(count(teachers, 'One PowerPoint for the whole sound.'), 1);
  assert.equal(count(teachers, 'Slides with notes, worksheets and answer key.'), 1);
  assert.match(teachers, /u\.sounds\.map\(lessonCard\)/);
  assert.ok(teachers.includes("name: 'Unit 4 \\u00b7 Glued Sounds'"));
  assert.ok(teachers.includes("name: 'Unit 5 \\u00b7 Silent e'"));
  assert.ok(teachers.includes("name: 'Learn the Letters'"));
  assert.ok(teachers.includes("class: 'tmunit'"));
  assert.ok(teachers.includes("class: 'tmgrid'"));
  assert.ok(teachers.includes("class: 'tmcard'"));
  assert.ok(teachers.includes("class: 'tmsound'"));
  assert.equal(teachers.includes('rows:'), false);
  assert.equal(teachers.includes('tmchecks'), false);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { createSideGroup } = require('../js/side-drop.js');
const screens = fs.readFileSync(new URL('../js/screens.js', import.meta.url), 'utf8');
const letters = fs.readFileSync(new URL('../js/foundation/letters.js', import.meta.url), 'utf8');
const drop = fs.readFileSync(new URL('../js/side-drop.js', import.meta.url), 'utf8');

function item() {
  let open = false;
  return {
    isOpen() { return open; },
    show() { open = true; },
    hide() { open = false; },
    focus() { this.focused = true; }
  };
}

test('a sidebar dropdown opens, closes, and stays the only one open', () => {
  const listeners = [];
  const doc = {
    addEventListener(type, fn) { listeners.push({ type, fn }); },
    removeEventListener(type, fn) {
      const i = listeners.findIndex((row) => row.fn === fn);
      if (i >= 0) listeners.splice(i, 1);
    }
  };
  const group = createSideGroup(doc);
  const about = item();
  const trail = item();
  group.register(about);
  group.register(trail);
  group.open(about);
  assert.equal(about.isOpen(), true);
  assert.equal(trail.isOpen(), false);
  assert.equal(listeners.length, 1);
  group.open(trail);
  assert.equal(about.isOpen(), false);
  assert.equal(trail.isOpen(), true);
  group.close(trail);
  assert.equal(trail.isOpen(), false);
  assert.equal(listeners.length, 0);
  group.open(about);
  listeners[0].fn({ key: 'Escape', preventDefault() { this.stopped = true; } });
  assert.equal(about.isOpen(), false);
  assert.equal(listeners.length, 0);
  group.open(trail);
  listeners[0].fn({ key: 'Enter', preventDefault() {} });
  assert.equal(trail.isOpen(), true);
});

test('home and Foundation sidebars use the dropdown and keep Continue', () => {
  assert.match(drop, /e\.key !== 'Escape'/);
  assert.match(drop, /'aria-label': 'Close'/);
  assert.match(screens, /resetSideGroup\('home'\)/);
  assert.match(screens, /label: 'About Island Readers'/);
  assert.match(screens, /label: 'Trail Map and Placement Test'/);
  assert.match(screens, /label: 'Sight Word Practice'/);
  assert.match(screens, /tab\('#\/find', 'Find It'/);
  assert.match(screens, /h\('b', null, 'Continue'\)/);
  const homeStart = screens.indexOf('function homeScreen()');
  const homeEnd = screens.indexOf('function gemScreen()');
  const home = screens.slice(homeStart, homeEnd);
  assert.match(home, /hero, tabs\), h\('div', \{ class: 'bellslot' \}, grid\)/);
  assert.match(letters, /resetSideGroup\('foundation'\)/);
  assert.match(letters, /label: 'Why this order\?'/);
  assert.match(letters, /label: 'Teacher Slideshows'/);
  assert.match(letters, /label: 'Teacher guide'/);
  assert.match(letters, /label: 'Printables'/);
  assert.match(letters, /label: 'Tracking sheet'/);
  assert.match(letters, /'Teacher mode'/);
  assert.match(letters, /letterContinue\(\)/);
});

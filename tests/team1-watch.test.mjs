import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const watch = fs.readFileSync(new URL('../js/foundation/team1-watch.js', import.meta.url), 'utf8');
const letters = fs.readFileSync(new URL('../js/foundation/letters.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../foundation/foundation.css', import.meta.url), 'utf8');

test('Team 1 independent lesson is the auto-advancing sample', () => {
  assert.match(letters, /group\.id === 'g1' \? base \+ '\/watch' : base \+ '\/intro'/);
  assert.match(letters, /foundation\\\/letters\\\/g1\\\/watch/);
  assert.match(letters, /g\.id === 'g1' && IR\.team1Watch/);
  assert.match(html, /js\/foundation\/team1-watch\.js/);
  assert.match(sw, /js\/foundation\/team1-watch\.js/);
  assert.match(sw, /ir-20261127b/);
  const order = [
    "L.id + '-meet'",
    "L.id + '-word'",
    "L.id + '-silly'",
    "L.id + '-turn'",
    "L.id + '-pop'",
    'letterBeats(BY.a)',
    'letterBeats(BY.m)',
    "'blend-am'",
    'letterBeats(BY.s)',
    'letterBeats(BY.t)',
    "'blend-sat'",
    "'find'",
    "'zip'",
    "'review'",
    "'read'"
  ];
  let at = 0;
  order.forEach((id) => {
    const next = watch.indexOf(id, at);
    assert.ok(next > at, id);
    at = next;
  });
  assert.match(watch, /Say it with me!/);
  assert.match(watch, /Ants add apples\./);
  assert.match(watch, /Alligators act angry\./);
  assert.match(watch, /Moles make mighty mud mountains\./);
  assert.match(watch, /Messy monkeys munch muffins\./);
  assert.match(watch, /Snakes sell sandy socks\./);
  assert.match(watch, /Silly seals sip soup\./);
  assert.match(watch, /Tigers tap ten toes\./);
  assert.match(watch, /Tiny turtles tumble\./);
  assert.match(watch, /allit-a-ants\.jpg/);
  assert.match(watch, /This is /);
  assert.match(watch, /Think /);
  assert.match(watch, /Nice!/);
  assert.match(watch, /Top, middle, or bottom\./);
  assert.match(watch, /Teach Zip/);
  assert.match(watch, /#\/foundation\/letters\/g1\/celebrate/);
  assert.match(watch, /Pause/);
  assert.match(watch, /Replay/);
  assert.equal(watch.includes('>Next<'), false);
  assert.equal(watch.includes('>Prev<'), false);
  assert.equal(watch.includes('speechSynthesis'), false);
  assert.equal(watch.includes('audio/phonemes'), false);
  assert.equal(watch.includes('playPhoneme'), false);
  assert.equal(watch.includes('RogerNeural'), false);
  assert.equal(/\bSPARK\b/.test(watch), false);
  assert.equal(/\bfree\b/i.test(watch), false);
  assert.equal(watch.includes('\u2014'), false);
  assert.equal(watch.includes('toUpperCase'), false);
  assert.match(watch, /Recording needed: pure \/a\//);
  assert.match(watch, /en-US-AriaNeural/);
  assert.match(css, /cv56/);
  assert.match(css, /ss01/);
  ['allit-a-ants.jpg', 'allit-a-alligators.jpg', 'allit-m-moles.jpg', 'allit-m-monkeys.jpg', 'allit-s-snakes.jpg', 'allit-s-seals.jpg', 'allit-t-tigers.jpg', 'allit-t-turtles.jpg'].forEach((name) => {
    assert.equal(fs.existsSync(new URL('../foundation/img/story/' + name, import.meta.url)), true, name);
  });
});

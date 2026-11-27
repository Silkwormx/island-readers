import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const root = new URL('..', import.meta.url);
const read = (p) => fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const exists = (p) => fs.existsSync(new URL('../' + p, import.meta.url));
const raw = read('data_u1012.js');
const data = JSON.parse(raw.slice(raw.indexOf('{', raw.indexOf('window.IR_DATA_U'))).trim().replace(/;$/, ''));
const js = read('js/u1012.js');
const css = read('u1012.css');
const screens = read('js/screens.js');
const html = read('index.html');
const sw = read('sw.js');
const KEYS = ['u101', 'u102', 'u111', 'u112', 'u121', 'u122', 'u123'];

test('Units 10 to 12 load and open from home', () => {
  assert.match(html, /data_u1012\.js/);
  assert.match(html, /js\/u1012\.js/);
  assert.match(html, /u1012\.css/);
  assert.match(screens, /IR\.u1012Route/);
  assert.match(screens, /builtUnitHref/);
  assert.equal(data.units['10'].name, 'More Bossy R');
  assert.equal(data.units['11'].name, 'Long A and E Teams');
  assert.equal(data.units['12'].name, 'Long O and I Teams');
  assert.deepEqual(data.lessons.map((l) => l.key), KEYS);
  assert.match(js, /units: \[10, 11, 12\]/);
  assert.match(js, /chair', 'share', 'clear'/);
});

test('every lesson has 3 days, a 6-page story, a chant, word audio and a 10-item check', () => {
  for (const l of data.lessons) {
    assert.equal(l.days.length, 3, l.key);
    assert.equal(l.story.length, 6, l.key + ' story pages');
    l.story.forEach((p, i) => {
      assert.ok(exists(p.img), p.img);
      assert.ok(exists('audio/' + l.key + '_s_' + (i + 1) + '.mp3'), l.key + ' page audio');
    });
    assert.ok(exists('img/cover_' + l.key + '.webp'), l.key + ' cover');
    for (const w of l.bellWords.concat(l.words)) {
      const file = 'audio/w_' + w.toLowerCase().replace(/[^a-z]/g, '') + '.mp3';
      assert.ok(exists(file), file);
    }
    for (const p of Object.values(l.pics)) assert.ok(exists(p), p);
    assert.equal(l.check.length, 10, l.key);
    assert.ok(l.chant.length >= 2 && l.chant.length <= 4, l.key);
    assert.ok(exists('audio/u1012_chant_' + l.key + '.mp3'), l.key);
    for (const m of l.meet) assert.ok(exists('audio/u1012_p_' + m.audio + '.mp3'), m.audio);
    if (l.key !== 'u122' && l.key !== 'u123') assert.equal(l.heart.length >= 1, true, l.key + ' heart');
    for (const h of l.heart) assert.ok(h.part, h.w);
  }
});

test('each lesson has Meet, Chant and 14 games, and find-the-sound words start plain', () => {
  for (const id of ['meet', 'chant', 'hear', 'bells', 'match', 'build', 'chain', 'scramble', 'feed', 'sentence', 'read', 'sort', 'which', 'rhyme', 'fish', 'check']) {
    assert.match(js, new RegExp("id: '" + id + "'"), id);
  }
  assert.match(js, /Zip\\u2019s Check/);
  assert.match(js, /const b = h\('button', \{ class: 'choice', type: 'button', 'data-w': f\.w \}, f\.w\)/);
  assert.match(js, /b\.replaceChildren\(colorWord\(f\.w, L\)\)/);
  assert.match(js, /wordEl\.replaceChildren\(colorWord\(it\.word, L\)\)/);
  assert.match(js, /wordBtn\.replaceChildren\(colorWord\(it\.word, L\)\)/);
});

test('short and long sorts are mixed, and word-family sorts are the main practice', () => {
  const longShort = data.lessons.filter((l) => l.bins.some((b) => /long|short/.test(b.label)));
  const families = data.lessons.filter((l) => l.bins.every((b) => !/long|short/.test(b.label)));
  assert.ok(families.length >= 5);
  assert.ok(longShort.length >= 1);
  for (const l of longShort) {
    const order = l.sort.map((s) => s.bin);
    const flips = order.slice(1).filter((b, i) => b !== order[i]).length;
    assert.ok(flips >= 4, l.key + ' sort is blocked');
  }
});

test('each lesson has a 3-day slideshow and a written page for each day', () => {
  for (const l of data.lessons) {
    const dir = 'materials/unit' + l.unit + '/slides/' + l.key + '/';
    const man = JSON.parse(read(dir + 'manifest.json'));
    assert.equal(man.days.length, 3, l.key);
    assert.equal(man.slides.length, man.count);
    assert.match(man.slides.join(' '), /slide-001\.jpg/);
    for (const s of man.slides) assert.ok(exists(dir + s), dir + s);
    for (const n of [1, 2, 3]) assert.ok(exists('materials/unit' + l.unit + '/Lesson' + l.n + '_Day' + n + '_Practice.pdf'), l.n + ' day ' + n);
    for (const f of ['_Teacher_Led_Checks.pdf', '_WordList.pdf', '_Slides.pdf']) {
      assert.ok(exists('materials/unit' + l.unit + '/Lesson' + l.n + f), l.n + f);
    }
    const dayText = read('materials/unit' + l.unit + '/slides/' + l.key + '/manifest.json');
    assert.match(dayText, /Day 1/);
    assert.match(dayText, /Day 3/);
  }
  for (const u of [10, 11, 12]) {
    for (const f of ['_Teacher_Led_Student_Sheets.pdf', '_Teacher_Led_Checks_Combined.pdf', '_Independent_Worksheets.pdf']) {
      assert.ok(exists('materials/unit' + u + '/Unit' + u + f), u + f);
    }
  }
});

test('house style: no em dashes, no banned words, no letter-name speech', () => {
  for (const src of [raw, js, css]) {
    assert.doesNotMatch(src, /\u2014/);
    assert.doesNotMatch(src, /\bfree\b/i);
    assert.doesNotMatch(src, /SPARK/i);
  }
  assert.doesNotMatch(js, /speechSynthesis/);
});

test('service worker caches the new units', () => {
  assert.match(sw, /const CACHE = 'ir-20261127i'/);
  for (const f of ['data_u1012.js', 'js/u1012.js', 'u1012.css', 'img/u101_p01.webp', 'materials/unit12/slides/u123/manifest.json']) {
    assert.match(sw, new RegExp('"\\./' + f.replace(/[.]/g, '\\.') + '"'), f);
  }
});

function start(cmd, args) { return spawn(cmd, args, { cwd: root.pathname, stdio: 'ignore' }); }
async function waitFor(url, tries = 80) {
  for (let i = 0; i < tries; i++) {
    try { const r = await fetch(url); if (r.ok) return; } catch (e) {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error('server did not start');
}

test('phone viewports fit, and story pages do not scroll', { timeout: 300000 }, async () => {
  const port = 8798;
  const debug = 9338;
  const server = start('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1']);
  const chrome = start('google-chrome', [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--mute-audio', '--autoplay-policy=no-user-gesture-required',
    '--remote-debugging-port=' + debug, '--user-data-dir=/tmp/chrome-u1012-fit', 'about:blank'
  ]);
  try {
    await waitFor('http://127.0.0.1:' + port + '/');
    await waitFor('http://127.0.0.1:' + debug + '/json/version');
    const version = await (await fetch('http://127.0.0.1:' + debug + '/json/version')).json();
    const bws = new WebSocket(version.webSocketDebuggerUrl);
    let id = 0; const pending = new Map();
    const send = (method, params = {}, sessionId) => {
      const msg = { id: ++id, method, params };
      if (sessionId) msg.sessionId = sessionId;
      bws.send(JSON.stringify(msg));
      return new Promise((resolve, reject) => pending.set(msg.id, { resolve, reject }));
    };
    await new Promise((resolve, reject) => { bws.addEventListener('open', resolve); bws.addEventListener('error', reject); });
    bws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const p = pending.get(msg.id); pending.delete(msg.id);
        if (msg.error) p.reject(new Error(JSON.stringify(msg.error))); else p.resolve(msg.result);
      }
    });
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    await send('Page.enable', {}, sessionId);
    await send('Runtime.enable', {}, sessionId);
    const ev = async (expr) => {
      const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true }, sessionId);
      if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
      return r.result.value;
    };
    const open = async (hash, width, height) => {
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: true }, sessionId);
      await send('Page.navigate', { url: 'http://127.0.0.1:' + port + '/?fit=' + Date.now() + hash }, sessionId);
      const t0 = Date.now();
      while (Date.now() - t0 < 8000) {
        if (await ev(`!!document.querySelector('.u1012step .activity, .u1012page, .u1012slides .slide-img[src]')`)) break;
        await new Promise((r) => setTimeout(r, 80));
      }
      await new Promise((r) => setTimeout(r, 350));
    };
    const measure = () => ev(`(() => {
      const bad = [];
      const se = document.scrollingElement;
      if (se.scrollHeight > innerHeight + 2 || se.scrollWidth > innerWidth + 2) bad.push('page scrolls');
      const stage = document.querySelector('.u1012step .stage');
      if (stage && stage.scrollHeight > stage.clientHeight + 4) bad.push('stage scrolls');
      const nav = document.querySelector('.u1012step .lesson-nav, .u1012slides .slidebar');
      if (nav) {
        const r = nav.getBoundingClientRect();
        if (r.bottom > innerHeight + 1) bad.push('bottom control cut off');
      }
      document.querySelectorAll('.u1012page .lessontab, .u1012page .gamecard, .u1012page .storycard').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (!r.width) return;
        if (r.height < 36) bad.push('collapsed: ' + (el.innerText || '').trim().slice(0, 18));
        if (r.bottom > innerHeight + 1 || r.top < -1 || r.right > innerWidth + 1) bad.push('card cut off: ' + (el.innerText || '').trim().slice(0, 18));
      });
      document.querySelectorAll('.u1012step .activity button, .u1012slides button').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width && (r.bottom > innerHeight + 1 || r.right > innerWidth + 1 || r.left < -1)) bad.push('off screen: ' + (el.innerText || '').trim().slice(0, 18));
      });
      const img = document.querySelector('.u1012slides .slide-img');
      if (img && img.src) {
        const r = img.getBoundingClientRect();
        if (r.width && (r.bottom > innerHeight + 1 || r.right > innerWidth + 1)) bad.push('slide cropped');
      }
      return bad;
    })()`);
    const routes = [];
    for (const s of ['meet', 'chant', 'hear', 'bells', 'match', 'build', 'chain', 'scramble', 'feed', 'sentence', 'read', 'sort', 'which', 'rhyme', 'fish', 'check']) routes.push('#/u10/u101/' + s);
    for (const hash of ['#/u10', '#/u11', '#/u12', '#/u10/u101', '#/u11/u111', '#/u12/u121', '#/u11/u112/sort', '#/u12/u123/which', '#/u12/u121/fish', '#/teachers/slides/u101']) routes.push(hash);
    const problems = [];
    for (const [w, h] of [[390, 844], [360, 740], [844, 390]]) {
      for (const hash of routes) {
        await open(hash, w, h);
        const bad = await measure();
        if (bad.length) problems.push(w + 'x' + h + ' ' + hash + ': ' + [...new Set(bad)].join('; '));
      }
    }
    bws.close();
    assert.deepEqual(problems, []);
  } finally {
    server.kill('SIGTERM');
    chrome.kill('SIGTERM');
  }
});

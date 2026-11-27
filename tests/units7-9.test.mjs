import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const root = new URL('..', import.meta.url);
const read = (p) => fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const exists = (p) => fs.existsSync(new URL('../' + p, import.meta.url));
const raw = read('data_u789.js');
const data = JSON.parse(raw.slice(raw.indexOf('{', raw.indexOf('window.IR_DATA_U'))).trim().replace(/;$/, ''));
const u789 = read('js/u789.js');
const css = read('u789.css');
const screens = read('js/screens.js');
const html = read('index.html');
const sw = read('sw.js');
const KEYS = ['u71', 'u72', 'u73', 'u81', 'u82', 'u83', 'u91', 'u92', 'u93', 'u94'];

test('Units 7 to 9 load and open from home', () => {
  assert.match(html, /data_u789\.js/);
  assert.match(html, /js\/u789\.js/);
  assert.match(html, /u789\.css/);
  assert.match(screens, /IR\.u789Route/);
  assert.equal(data.units['7'].name, 'Syllables');
  assert.equal(data.units['8'].name, 'Tricky Sounds');
  assert.equal(data.units['9'].name, 'Bossy R');
  assert.deepEqual(data.lessons.map((l) => l.key), KEYS);
});

test('every lesson has 3 days, a 6-page story with art and narration, a chant, word audio and a 10-item check', () => {
  for (const l of data.lessons) {
    assert.equal(l.days.length, 3, l.key);
    assert.equal(l.story.length, 6, l.key + ' story pages');
    l.story.forEach((p, i) => {
      assert.ok(exists(p.img), p.img);
      assert.ok(exists('audio/' + l.key + '_s_' + (i + 1) + '.mp3'), l.key + ' page audio ' + (i + 1));
    });
    assert.ok(exists('img/cover_' + l.key + '.webp'), l.key + ' cover');
    assert.ok(exists('img/pick_' + l.key + '.webp'), l.key + ' picker art');
    assert.ok(exists('img/pick_review.webp'), 'review picker art');
    for (const w of l.bellWords) assert.ok(exists('audio/w_' + w.toLowerCase() + '.mp3'), l.key + ' ' + w);
    for (const w of l.words) assert.ok(exists('audio/w_' + w.toLowerCase() + '.mp3'), l.key + ' ' + w);
    for (const p of Object.values(l.pics)) assert.ok(p.startsWith('svg') || exists(p), l.key + ' pic ' + p);
    assert.equal(l.check.length, 10, l.key + ' check items');
    assert.ok(l.chant.length >= 2 && l.chant.length <= 4, l.key + ' chant');
    assert.ok(exists('audio/u789_chant_' + l.key + '.mp3'), l.key + ' chant audio');
    for (const m of [1, 2, 3]) assert.ok(exists('audio/u789_p_' + l.key + '_m' + m + '.mp3'), l.key + ' meet audio ' + m);
  }
});

test('lesson 9.4 first word chain has no bard or curd and changes one sound', () => {
  const chain = data.lessons.find((l) => l.key === 'u94').chains[0];
  assert.deepEqual(chain, ['shirt', 'short', 'sort', 'port', 'fort', 'fork']);
  assert.equal(chain.includes('bard') || chain.includes('curd'), false);
  const graph = ['tch', 'dge', 'ore', 'ar', 'or', 'er', 'ir', 'ur', 'sh', 'ch', 'th', 'wh', 'ck', 'ng', 'nk', 'ff', 'll', 'ss', 'zz'];
  function split(w) {
    const s = w.toLowerCase(); const out = []; let i = 0;
    while (i < s.length) {
      let hit = null;
      for (const g of graph) {
        if (s.startsWith(g, i) && !( /^(ar|or|er|ir|ur)$/.test(g) && i + 2 < s.length && 'aeiou'.includes(s[i + 2]))) { hit = g; break; }
      }
      if (hit) { out.push(hit); i += hit.length; } else { out.push(s[i]); i += 1; }
    }
    return out;
  }
  for (let i = 1; i < chain.length; i++) {
    const a = split(chain[i - 1]); const b = split(chain[i]);
    const diffs = Math.max(a.length, b.length);
    let n = 0;
    for (let k = 0; k < diffs; k++) if (a[k] !== b[k]) n += 1;
    assert.equal(n, 1, chain[i - 1] + ' to ' + chain[i]);
    assert.ok(exists('audio/chg_' + chain[i - 1] + '_' + chain[i] + '.mp3'));
    assert.ok(exists('audio/w_' + chain[i] + '.mp3'));
  }
});

test('each lesson has Meet, Chant and 14 games ending with Zip\u2019s Check', () => {
  for (const id of ['meet', 'chant', 'hear', 'bells', 'match', 'build', 'chain', 'scramble', 'feed', 'sentence', 'read', 'sort', 'which', 'rhyme', 'fish', 'check']) {
    assert.match(u789, new RegExp("id: '" + id + "'"), id);
  }
  assert.match(u789, /Zip\\u2019s Check/);
});

test('action art: Zip and Frill doing something on every game, never the same picture twice in a row, calm motion', () => {
  const m = /const BUDDY = (\{[\s\S]*?\});/.exec(u789);
  assert.ok(m, 'BUDDY map');
  const buddy = Function('return ' + m[1])();
  const order = ['meet', 'chant', 'hear', 'bells', 'match', 'build', 'chain', 'scramble', 'feed', 'sentence', 'read', 'sort', 'which', 'rhyme', 'fish', 'check'];
  const pics = { meet: 'zip_magnify', chant: 'frill_drum', bells: 'frill_bell' };
  const seq = order.map((id) => buddy[id] || pics[id] || null);
  for (let i = 1; i < seq.length; i++) if (seq[i] && seq[i - 1]) assert.notEqual(seq[i], seq[i - 1], order[i]);
  for (const k of new Set(Object.values(buddy).concat(Object.values(pics)))) assert.ok(exists('img/u789act/act_' + k + '.webp'), k);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /body\.calm \.u789step \.buddy\{animation:none/);
});

test('missing pure sounds are marked for teachers, never spoken by TTS', () => {
  assert.match(u789, /Recording needed/);
  assert.doesNotMatch(u789, /speechSynthesis/);
  const pure = fs.readdirSync(new URL('../audio/phonemes/', import.meta.url)).map((f) => f.replace(/\.mp3$/, ''));
  const needed = new Set();
  for (const l of data.lessons) for (const r of l.rec) if (!pure.includes(r)) needed.add(r);
  assert.ok(needed.size > 0);
});

test('each lesson has a slideshow with three day jumps and teacher printables', () => {
  for (const l of data.lessons) {
    const dir = 'materials/unit' + l.unit + '/slides/' + l.key + '/';
    const man = JSON.parse(read(dir + 'manifest.json'));
    assert.equal(man.days.length, 3, l.key);
    assert.equal(man.slides.length, man.count);
    for (const s of man.slides) assert.ok(exists(dir + s), dir + s);
    assert.match(screens, new RegExp(l.key + ': \\['));
    assert.match(screens, new RegExp('teachers/slides/' + l.key));
    for (const f of ['_Teacher_Led_Checks.pdf', '_WordList.pdf', '_Slides.pdf']) assert.ok(exists('materials/unit' + l.unit + '/Lesson' + l.n + f), l.n + f);
  }
  for (const u of [7, 8, 9]) {
    for (const f of ['_Teacher_Led_Student_Sheets.pdf', '_Teacher_Led_Checks_Combined.pdf', '_Independent_Worksheets.pdf']) assert.ok(exists('materials/unit' + u + '/Unit' + u + f), u + f);
  }
});

test('house style: no em dashes, no banned words', () => {
  for (const src of [raw, u789, css]) {
    assert.doesNotMatch(src, /\u2014/);
    assert.doesNotMatch(src, /\bfree\b/i);
    assert.doesNotMatch(src, /SPARK/i);
  }
});

test('phone-safe CSS: small viewport height, safe area, equal answer tracks', () => {
  assert.match(css, /100svh/);
  assert.match(css, /100dvh/);
  assert.match(css, /safe-area-inset-bottom/);
  assert.match(css, /minmax\(0,1fr\)/);
});

test('service worker caches the new code and media', () => {
  assert.match(sw, /const CACHE = 'ir-20261127n'/);
  for (const f of ['data_u789.js', 'js/u789.js', 'u789.css', 'img/u71_p01.webp', 'materials/unit9/slides/u94/manifest.json']) {
    assert.match(sw, new RegExp('"\\./' + f.replace(/[.]/g, '\\.') + '"'), f);
  }
});

function start(cmd, args, cwd) { return spawn(cmd, args, { cwd, stdio: 'ignore' }); }
async function waitFor(url, tries = 60) {
  for (let i = 0; i < tries; i++) {
    try { const r = await fetch(url); if (r.ok) return; } catch (e) {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error('server did not start');
}

test('phone viewports: no scroll, equal answer buttons, bottom control visible, slides fit', { timeout: 600000 }, async () => {
  const port = 8797;
  const debug = 9337;
  const server = start('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], root.pathname);
  const chrome = start('google-chrome', [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--mute-audio', '--autoplay-policy=no-user-gesture-required',
    '--remote-debugging-port=' + debug, '--user-data-dir=/tmp/chrome-u789-fit', 'about:blank'
  ], root.pathname);
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
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
      return r.result.value;
    };
    const open = async (hash, width, height) => {
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 2, mobile: true }, sessionId);
      await send('Page.navigate', { url: 'http://127.0.0.1:' + port + '/?fit=' + Date.now() + hash }, sessionId);
      const t0 = Date.now();
      while (Date.now() - t0 < 8000) {
        if (await ev(`!!document.querySelector('.u789step .activity, .slidescreen .slide-img[src]')`)) break;
        await new Promise((r) => setTimeout(r, 80));
      }
      await new Promise((r) => setTimeout(r, 500));
    };
    const measure = () => ev(`(() => {
      const bad = [];
      const se = document.scrollingElement;
      if (se.scrollHeight > innerHeight + 2 || se.scrollWidth > innerWidth + 2) bad.push('page scrolls');
      const stage = document.querySelector('.u789step .stage');
      if (stage && stage.scrollHeight > stage.clientHeight + 4) bad.push('stage scrolls');
      const nav = document.querySelector('.u789step .lesson-nav');
      if (nav) {
        const r = nav.getBoundingClientRect();
        if (r.bottom > innerHeight + 1) bad.push('bottom control cut off');
        nav.querySelectorAll('button').forEach((b) => { const q = b.getBoundingClientRect(); if (q.width && (q.bottom > innerHeight + 1 || q.right > innerWidth + 1)) bad.push('control button cut off'); });
      }
      document.querySelectorAll('.u789step .activity button, .u789step .activity .choice').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width && (r.bottom > innerHeight + 1 || r.right > innerWidth + 1 || r.left < -1)) bad.push('off screen: ' + (el.innerText || '').trim().slice(0, 16));
      });
      document.querySelectorAll('.u789step .choice, .u789step .bellbtn, .u789step .tile, .u789step .chip, .u789step .fz-bubble').forEach((el) => {
        const r = el.getBoundingClientRect(); if (!r.width) return;
        el.querySelectorAll('span').forEach((sp) => { const q = sp.getBoundingClientRect(); if (q.width && (q.top < r.top - 2 || q.bottom > r.bottom + 2 || q.left < r.left - 2 || q.right > r.right + 2)) bad.push('text clipped: ' + (el.innerText || '').trim().slice(0, 16)); });
      });
      const groups = {};
      const sel = '.u789step .choices > .choice, .u789step .bank > .tile, .u789step .chainopts > *, .u789step .bellrow > .bellbtn, .u789step .fz-field > .fz-bubble, .u789step .sortbins > *, .u789step .chips > .chip';
      document.querySelectorAll(sel).forEach((el) => {
        const r = el.getBoundingClientRect(); if (!r.width) return;
        const k = el.parentElement.className; (groups[k] = groups[k] || []).push([r.width, r.height]);
      });
      for (const [k, v] of Object.entries(groups)) {
        if (v.some((s) => Math.abs(s[0] - v[0][0]) > 2 || Math.abs(s[1] - v[0][1]) > 2)) bad.push('unequal buttons in ' + k);
      }
      const img = document.querySelector('.slidescreen .slide-img');
      if (img) {
        const r = img.getBoundingClientRect();
        if (r.bottom > innerHeight + 1 || r.right > innerWidth + 1 || r.left < -1 || r.top < -1) bad.push('slide cropped');
        document.querySelectorAll('.slidescreen button').forEach((b) => { const q = b.getBoundingClientRect(); if (q.width && (q.bottom > innerHeight + 1 || q.right > innerWidth + 1)) bad.push('slide button cut off'); });
      }
      return bad;
    })()`);
    const steps = ['meet', 'chant', 'hear', 'bells', 'match', 'build', 'chain', 'scramble', 'feed', 'sentence', 'read', 'sort', 'which', 'rhyme', 'fish', 'check'];
    const routes = [];
    for (const k of ['u71', 'u83', 'u94']) for (const s of steps) routes.push('#/u' + k[1] + '/' + k + '/' + s);
    for (const k of ['u72', 'u73', 'u81', 'u82', 'u91', 'u92', 'u93']) for (const s of ['meet', 'which', 'read', 'chain', 'sentence', 'fish', 'build']) routes.push('#/u' + k[1] + '/' + k + '/' + s);
    routes.push('#/u7/review/hear', '#/teachers/slides/u71', '#/teachers/slides/u83', '#/teachers/slides/u94');
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

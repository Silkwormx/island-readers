import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

/* Units 1-3 and 7-12 have no story reader yet. 4, 5, and 6 do. */
test('only units 4, 5, and 6 register story readers', () => {
  const screens = fs.readFileSync(new URL('../js/screens.js', import.meta.url), 'utf8');
  const fn = screens.slice(screens.indexOf('function fluencyStories'), screens.indexOf('function spellUnitOpen'));
  assert.match(fn, /add\('4'/);
  assert.match(fn, /add\('5'/);
  assert.match(fn, /add\('6'/);
  ['1', '2', '3', '7', '8', '9', '10', '11', '12'].forEach((n) => {
    assert.equal(fn.includes("add('" + n + "'"), false, 'unit ' + n + ' should not have a story reader');
  });
});

const STORIES = [
  ['ng', '#/lesson/2', true],
  ['nk', '#/nk/listen', true],
  ['unit 5 silent e', '#/u51/listen', true],
  ['unit 5 tricky silent e', '#/u53/listen', true],
  ['unit 6 lunch crabs', '#/u6/u61/read', true],
  ['unit 6 kite', '#/u6/u62/read', true],
  ['unit 6 stick', '#/u6/u63/read', true],
  ['team 1 read it', '#/foundation/letters/g1/read', false]
];

function chromeSession() {
  const chrome = spawn('google-chrome', [
    '--headless=new', '--disable-gpu', '--no-first-run',
    '--user-data-dir=/tmp/chrome-stories-' + process.pid,
    '--remote-debugging-port=9422', 'about:blank'
  ], { stdio: 'ignore' });
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  return (async () => {
    for (let i = 0; i < 30; i++) {
      try { await fetch('http://127.0.0.1:9422/json/version'); break; } catch (e) { await sleep(100); }
    }
    const info = await (await fetch('http://127.0.0.1:9422/json/version')).json();
    const ws = new WebSocket(info.webSocketDebuggerUrl);
    await new Promise((ok) => ws.addEventListener('open', ok));
    let seq = 0;
    const pending = new Map();
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const { res, rej } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) rej(new Error(JSON.stringify(msg.error)));
        else res(msg.result);
      }
    });
    const send = (method, params, sessionId) => new Promise((res, rej) => {
      const id = ++seq;
      pending.set(id, { res, rej });
      const body = { id, method, params: params || {} };
      if (sessionId) body.sessionId = sessionId;
      ws.send(JSON.stringify(body));
    });
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    await send('Page.enable', {}, sessionId);
    await send('Runtime.enable', {}, sessionId);
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true }, sessionId);
    async function evalJs(expr) {
      const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }, sessionId);
      if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 400));
      return r.result.value;
    }
    return {
      chrome,
      async go(hash) {
        await send('Page.navigate', { url: 'http://127.0.0.1:8765/index.html' + hash }, sessionId);
        await sleep(800);
      },
      evalJs,
      sleep
    };
  })();
}

const STATE = `(() => {
  const label = document.querySelector('.story-say') || document.querySelector('.activity.story .small');
  const text = label ? label.textContent : '';
  const m = /Page (\\d+) of (\\d+)/.exec(text);
  const next = document.querySelector('.lesson-nav .btn.next');
  const back = document.querySelector('.lesson-nav .storyback');
  const home = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Home');
  const box = (el) => {
    if (!el || el.hidden) return null;
    const r = el.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, h: r.height, on: r.height >= 44 && r.top >= 0 && r.bottom <= 850 };
  };
  return {
    hearts: document.querySelectorAll('.heartchip').length,
    page: m ? Number(m[1]) : 0,
    total: m ? Number(m[2]) : 0,
    done: !!document.querySelector('.complete, .ll1end, .llend, .llcelebrate'),
    next: box(next),
    back: box(back),
    home: box(home)
  };
})()`;

test('each story can be paged from the heart words to the end on a phone', async () => {
  const session = await chromeSession();
  try {
    for (const [name, hash, paged] of STORIES) {
      await session.go(hash);
      let guard = 0;
      let sawPage = false;
      let backed = false;
      while (guard < 30) {
        const st = await session.evalJs(STATE);
        assert.ok(st.home && st.home.on, name + ' Home is not on screen');
        if (st.done && !paged) break;
        if (st.page && st.total && st.page === st.total) { sawPage = true; break; }
        assert.ok(st.next && st.next.on, name + ' Next is not on screen ' + JSON.stringify(st.next));
        if (paged && st.page > 1 && !backed) {
          await session.evalJs(`document.querySelector('.lesson-nav .storyback').click()`);
          await session.sleep(400);
          const back = await session.evalJs(STATE);
          assert.ok(back.page === st.page - 1, name + ' Back did not leave page ' + st.page);
          backed = true;
          await session.evalJs(`document.querySelector('.lesson-nav .btn.next').click()`);
          await session.sleep(350);
        }
        await session.evalJs(`document.querySelector('.lesson-nav .btn.next').click()`);
        await session.sleep(350);
        guard += 1;
        if (st.page) sawPage = true;
      }
      const end = await session.evalJs(STATE);
      if (paged) {
        assert.equal(sawPage, true, name + ' never opened a story page');
        assert.equal(end.page, end.total, name + ' stopped on page ' + end.page + ' of ' + end.total);
        assert.ok(end.page > 1, name + ' has only one page');
      } else {
        assert.equal(end.done, true, name + ' did not reach the end');
      }
    }
  } finally {
    session.chrome.kill('SIGKILL');
  }
});

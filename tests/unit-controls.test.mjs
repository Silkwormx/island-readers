import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const root = new URL('..', import.meta.url);

function start(cmd, args) {
  return spawn(cmd, args, { cwd: root.pathname, stdio: 'ignore' });
}

async function waitFor(url) {
  for (let i = 0; i < 50; i++) {
    try { const r = await fetch(url); if (r.ok) return; } catch (e) {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error('did not start ' + url);
}

test('Units 1-3 and 7-9 use one control row; other units do not', async () => {
  const port = 8791;
  const debug = 9331;
  const server = start('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1']);
  const chrome = start('google-chrome', [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--mute-audio',
    '--remote-debugging-port=' + debug, '--user-data-dir=/tmp/chrome-unit-controls', 'about:blank'
  ]);
  try {
    await waitFor('http://127.0.0.1:' + port + '/');
    await waitFor('http://127.0.0.1:' + debug + '/json/version');
    const version = await (await fetch('http://127.0.0.1:' + debug + '/json/version')).json();
    const ws = new WebSocket(version.webSocketDebuggerUrl);
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
    await new Promise((ok) => ws.addEventListener('open', ok));
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    await send('Page.enable', {}, sessionId);
    await send('Runtime.enable', {}, sessionId);
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true }, sessionId);
    const ev = async (expr) => {
      const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }, sessionId);
      if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 400));
      return r.result.value;
    };
    const open = async (hash) => {
      await send('Page.navigate', { url: 'http://127.0.0.1:' + port + '/index.html' + hash }, sessionId);
      const t0 = Date.now();
      while (Date.now() - t0 < 8000) {
        if (await ev(`location.hash.indexOf(${JSON.stringify(hash.slice(1))}) >= 0 && !!document.querySelector('.screen')`)) break;
        await new Promise((r) => setTimeout(r, 80));
      }
      await new Promise((r) => setTimeout(r, 250));
    };
    const look = `(() => {
      const rows = [...document.querySelectorAll('.ir-controls')].filter((el) => el.getClientRects().length);
      const labels = rows[0] ? [...rows[0].querySelectorAll('button')].filter((b) => !b.hidden && b.getClientRects().length).map((b) => (b.innerText || b.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim()) : [];
      const heights = rows[0] ? [...rows[0].querySelectorAll('button')].filter((b) => !b.hidden && b.getClientRects().length).map((b) => Math.round(b.getBoundingClientRect().height)) : [];
      const box = (el) => { const r = el.getBoundingClientRect(); return r.height >= 44 && r.top >= 0 && r.bottom <= 846 && r.left >= -1 && r.right <= 392; };
      const cut = rows[0] ? [...rows[0].querySelectorAll('button')].filter((b) => !b.hidden && b.getClientRects().length && !box(b)).map((b) => (b.innerText || '').trim()) : [];
      const nextPage = [...document.querySelectorAll('button')].some((b) => /^next page$/i.test((b.innerText || '').replace(/\\s+/g, ' ').trim()));
      return {
        rows: rows.length,
        labels,
        heights,
        cut,
        mute: document.querySelectorAll('.sfxmute').length,
        nextPage,
        story: !!document.querySelector('.activity.story .panel'),
        page: ((document.querySelector('.story-say') || {}).textContent || '')
      };
    })()`;
    await open('#/home');
    let home = await ev(look);
    assert.equal(home.rows, 0, 'home should keep its own layout');
    await open('#/u6/u61/read');
    let u6 = await ev(look);
    assert.equal(u6.rows, 0, 'Unit 6 is outside this cleanup');
    await open('#/foundation/letters/g1/read');
    let found = await ev(look);
    assert.equal(found.rows, 0, 'Foundations is outside this cleanup');

    for (const hash of ['#/u1/u11/meet', '#/u1/u11/hear', '#/u8/u81/match', '#/u7/u71/feed']) {
      await open(hash);
      const st = await ev(look);
      assert.equal(st.rows, 1, hash + ' control rows ' + st.rows);
      assert.equal(st.mute, 0, hash + ' still has a sound off button');
      assert.equal(st.nextPage, false, hash + ' still has Next page');
      assert.ok(st.labels.some((t) => /home/i.test(t)), hash + ' missing Home ' + st.labels.join('|'));
      assert.ok(st.labels.some((t) => /back/i.test(t)), hash + ' missing Back ' + st.labels.join('|'));
      assert.equal(st.cut.length, 0, hash + ' cut off ' + st.cut.join(','));
      const shown = st.heights.filter((n) => n > 0);
      assert.ok(shown.length >= 2 && Math.max(...shown) - Math.min(...shown) <= 1, hash + ' button heights ' + shown.join(','));
    }
    await open('#/u1/u11/meet');
    const meet = await ev(look);
    assert.ok(meet.labels.some((t) => /^next/i.test(t)), 'meet missing Forward ' + meet.labels.join('|'));

    await open('#/u1/u11/read');
    await ev(`document.querySelector('.lesson-nav .btn.next').click()`);
    await new Promise((r) => setTimeout(r, 300));
    const story = await ev(look);
    assert.equal(story.rows, 1, 'story control rows');
    assert.equal(story.nextPage, false, 'story still has a middle Next page');
    assert.equal(story.story, true, 'story picture did not open');
    assert.match(story.page, /Page 1 of /, story.page);
    assert.ok(story.labels.some((t) => /repeat/i.test(t)), 'story missing Repeat ' + story.labels.join('|'));
    assert.equal(story.cut.length, 0, 'story controls cut off');
    await ev(`document.querySelector('.lesson-nav .btn.next').click()`);
    await new Promise((r) => setTimeout(r, 250));
    const page2 = await ev(look);
    assert.match(page2.page, /Page 2 of /);
  } finally {
    chrome.kill('SIGKILL');
    server.kill('SIGKILL');
  }
});

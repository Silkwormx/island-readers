import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const root = new URL('..', import.meta.url);
function start(cmd, args) { return spawn(cmd, args, { cwd: root.pathname, stdio: 'ignore' }); }
async function waitFor(url) {
  for (let i = 0; i < 50; i++) {
    try { const r = await fetch(url); if (r.ok) return; } catch (e) {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error('did not start ' + url);
}

test('Units 1-3 and 7-9 play the deck in the app', async () => {
  const port = 8792;
  const debug = 9332;
  const server = start('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1']);
  const chrome = start('google-chrome', [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--mute-audio',
    '--remote-debugging-port=' + debug, '--user-data-dir=/tmp/chrome-slides', 'about:blank'
  ]);
  try {
    await waitFor('http://127.0.0.1:' + port + '/');
    await waitFor('http://127.0.0.1:' + debug + '/json/version');
    const version = await (await fetch('http://127.0.0.1:' + debug + '/json/version')).json();
    const ws = new WebSocket(version.webSocketDebuggerUrl);
    let seq = 0; const pending = new Map();
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const box = pending.get(msg.id); pending.delete(msg.id);
        if (msg.error) box.rej(new Error(JSON.stringify(msg.error))); else box.res(msg.result);
      }
    });
    const send = (method, params, sessionId) => new Promise((res, rej) => {
      const id = ++seq; pending.set(id, { res, rej });
      const body = { id, method, params: params || {} };
      if (sessionId) body.sessionId = sessionId;
      ws.send(JSON.stringify(body));
    });
    await new Promise((ok) => ws.addEventListener('open', ok));
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    await send('Page.enable', {}, sessionId);
    await send('Runtime.enable', {}, sessionId);
    const ev = async (expr) => {
      const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }, sessionId);
      if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 300));
      return r.result.value;
    };
    const open = async (hash, w, h) => {
      await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 500 }, sessionId);
      await send('Page.navigate', { url: 'http://127.0.0.1:' + port + '/index.html' + hash }, sessionId);
      const t0 = Date.now();
      while (Date.now() - t0 < 8000) {
        if (await ev(`!!document.querySelector('.slide-img[src]')`)) break;
        await new Promise((r) => setTimeout(r, 80));
      }
      await new Promise((r) => setTimeout(r, 400));
    };
    const look = `(() => {
      const img = document.querySelector('.slide-img');
      const r = img ? img.getBoundingClientRect() : null;
      const row = document.querySelector('.slide-controls');
      const labels = row ? [...row.querySelectorAll('button')].map((b) => (b.innerText || '').replace(/\\s+/g, ' ').trim()) : [];
      const cut = row ? [...row.querySelectorAll('button')].filter((b) => { const q = b.getBoundingClientRect(); return q.bottom > innerHeight + 1 || q.right > innerWidth + 1 || q.height < 44; }).length : 0;
      return {
        calm: document.querySelector('.slidescreen').classList.contains('slidecalm'),
        sides: document.querySelectorAll('.slide-nav').length,
        count: (document.querySelector('.slide-count') || {}).textContent || '',
        labels, cut,
        img: r && r.width > 80 && r.height > 80 && r.top >= -1 && r.bottom <= innerHeight + 1 && r.left >= -1 && r.right <= innerWidth + 1,
        rows: document.querySelectorAll('.ir-controls').length
      };
    })()`;
    for (const [hash, w, h] of [['#/teachers/slides/u21', 390, 844], ['#/teachers/slides/u81', 1280, 800], ['#/teachers/slides/u21', 1280, 800]]) {
      await open(hash, w, h);
      const st = await ev(look);
      assert.equal(st.calm, true, hash);
      assert.equal(st.sides, 0, hash + ' still has side arrows');
      assert.equal(st.rows, 1, hash);
      assert.match(st.count, /^\d+ of \d+$/, st.count);
      assert.deepEqual(st.labels, ['Home', 'Back', 'Next', 'Full']);
      assert.equal(st.cut, 0, hash + ' controls cut off');
      assert.equal(st.img, true, hash + ' slide not fully on screen');
    }
    await ev(`document.querySelector('.slide-forward').click()`);
    await new Promise((r) => setTimeout(r, 200));
    const next = await ev(`document.querySelector('.slide-count').textContent`);
    assert.equal(next, '2 of 67');
    await open('#/teachers/slides/ng', 390, 844);
    const ng = await ev(look);
    assert.equal(ng.calm, false, 'Unit 4 deck should keep its own player');
    assert.ok(ng.sides >= 2, 'Unit 4 still uses its side arrows');
  } finally {
    chrome.kill('SIGKILL');
    server.kill('SIGKILL');
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
const root = new URL('..', import.meta.url);

function start(cmd, args, cwd) {
  const child = spawn(cmd, args, { cwd, stdio: 'ignore' });
  return child;
}

async function waitFor(url, tries = 40) {
  for (let i = 0; i < tries; i++) {
    try { const r = await fetch(url); if (r.ok) return; } catch (e) {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error('server did not start');
}

test('Unit 6 word tiles do not overflow at phone, tablet, and smartboard widths', async () => {
  const port = 8791;
  const debug = 9331;
  const server = start('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], root.pathname);
  const chrome = start('google-chrome', [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--mute-audio',
    '--remote-debugging-port=' + debug, '--user-data-dir=/tmp/chrome-u6-fit', 'about:blank'
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
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 500 }, sessionId);
      await send('Page.navigate', { url: 'http://127.0.0.1:' + port + '/?fit=' + Date.now() + hash }, sessionId);
      const t0 = Date.now();
      while (Date.now() - t0 < 8000) {
        if (await ev(`document.querySelectorAll('.u6step .choice, .u6step .bigword, .u6step .fz-bubble, .u6step .chainfrom').length > 0`)) return;
        await new Promise((r) => setTimeout(r, 80));
      }
      throw new Error('no tiles for ' + hash);
    };
    const overflow = async () => ev(`(() => {
      const bad = [];
      document.querySelectorAll('.u6step .choice, .u6step .bigword, .u6step .fz-bubble').forEach((el) => {
        const word = (el.innerText || '').replace(/\\s+/g, ' ').trim();
        if (!word) return;
        const style = getComputedStyle(el);
        const clipsX = el.scrollWidth > el.clientWidth + 4;
        const hiddenY = style.overflowY === 'hidden' || style.overflow === 'hidden';
        const clipsY = hiddenY && el.scrollHeight > el.clientHeight + 4;
        if (clipsX || clipsY) bad.push(word);
      });
      return bad;
    })()`);
    const routes = ['#/u6/u61/hear', '#/u6/u61/bells', '#/u6/u61/sentence', '#/u6/u62/hear', '#/u6/u62/sentence', '#/u6/u63/hear', '#/u6/u61/feed', '#/u6/u61/chain'];
    const widths = [375, 768, 1280];
    const problems = [];
    for (const width of widths) {
      for (const hash of routes) {
        await open(hash, width, width < 500 ? 800 : 900);
        await new Promise((r) => setTimeout(r, 150));
        const bad = await overflow();
        if (bad.length) problems.push(width + ' ' + hash + ' ' + bad.join('; '));
        if (hash.endsWith('/feed') || hash.endsWith('/chain')) {
          const scrolls = await ev(`(() => {
            const stage = document.querySelector('.stage');
            const page = document.scrollingElement;
            const pageScroll = page.scrollHeight > window.innerHeight + 8;
            const stageScroll = stage && stage.scrollHeight > stage.clientHeight + 8;
            return pageScroll || stageScroll;
          })()`);
          if (scrolls) problems.push(width + ' ' + hash + ' scrolls');
        }
      }
    }
    bws.close();
    assert.deepEqual(problems, []);
  } finally {
    server.kill('SIGTERM');
    chrome.kill('SIGTERM');
  }
});

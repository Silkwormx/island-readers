import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const HEAR = new Set(['Beginning Sound Catch', 'First sound', 'Sound Match', 'Sort the Sound']);

const GAMES = [
  ['Sound Pop', '#/foundation/letters/g1/play/pop'],
  ['Beginning Sound Catch', '#/foundation/letters/g1/play/catch'],
  ['First sound', '#/foundation/letters/g1/sound'],
  ['Count the Sounds', '#/foundation/letters/g1/play/count'],
  ['Sound Match', '#/foundation/letters/g1/play/sound'],
  ['Letter Hunt', '#/foundation/letters/g1/play/hunt'],
  ['Find the letter', '#/foundation/letters/g1/find'],
  ['Match upper and lower', '#/foundation/letters/g1/match'],
  ['Feed the Friend', '#/foundation/letters/g1/play/feed'],
  ['Feed Zip', '#/foundation/letters/g1/feed'],
  ['Build It', '#/foundation/letters/g1/play/build'],
  ['Blend and Pick', '#/foundation/letters/g1/play/ears'],
  ['Read and Match', '#/foundation/letters/g1/play/match'],
  ['Quick Flash', '#/foundation/letters/g1/play/flash'],
  ['Sort the Sound', '#/foundation/letters/g1/play/sort']
];

function chromeSession() {
  const chrome = spawn('google-chrome', [
    '--headless=new', '--disable-gpu', '--no-first-run',
    '--user-data-dir=/tmp/chrome-team1-games-' + process.pid,
    '--remote-debugging-port=9399', 'about:blank'
  ], { stdio: 'ignore' });
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  return (async () => {
    for (let i = 0; i < 30; i++) {
      try { await fetch('http://127.0.0.1:9399/json/version'); break; } catch (e) { await sleep(100); }
    }
    const info = await (await fetch('http://127.0.0.1:9399/json/version')).json();
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
        await sleep(700);
      },
      evalJs,
      sleep
    };
  })();
}

test('every Team 1 game reaches its end screen in 12 rounds on a phone', async () => {
  const session = await chromeSession();
  try {
    for (const [name, hash] of GAMES) {
      await session.go(hash);
      const fit = await session.evalJs(`(() => {
        const s = document.querySelector('.screen');
        const next = document.querySelector('.lesson-nav .btn.next, .fs-slidenav .next');
        const home = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Home');
        const nr = next ? next.getBoundingClientRect() : null;
        const hr = home ? home.getBoundingClientRect() : null;
        const small = [...document.querySelectorAll('.ll1card,.ll1bubble,.ll1friend,.ll1hunt,.llchoice,.llbuddy,.fz-choice,button.ll1tap')]
          .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.width < 44 || r.height < 44); })
          .map((el) => el.className + ' ' + Math.round(el.getBoundingClientRect().width));
        return {
          overflow: s.scrollWidth > 392,
          next: !!(nr && nr.height >= 44 && nr.top >= 0 && nr.bottom <= 846),
          home: !!(hr && hr.height >= 44 && hr.top >= 0 && hr.bottom <= 846),
          small
        };
      })()`);
      assert.equal(fit.overflow, false, name + ' overflows');
      assert.equal(fit.next, true, name + ' Next is not on screen');
      assert.equal(fit.home, true, name + ' Home is not on screen');
      assert.deepEqual(fit.small, [], name + ' has a small target ' + fit.small.join(','));
      let ended = false;
      let seen = 0;
      for (let round = 0; round < 16 && !ended; round++) {
        ended = await session.evalJs(`!!document.querySelector('.ll1end, .llend, .complete')`);
        if (ended) break;
        if (HEAR.has(name)) {
          const hear = await session.evalJs(`(() => {
            const text = document.body.innerText || '';
            const choices = [...document.querySelectorAll('[data-yes]')].filter((el) => {
              const r = el.getBoundingClientRect();
              return r.width >= 44 && r.height >= 44;
            });
            const replayLabel = ${JSON.stringify(name === 'Sound Match' ? 'Hear the sound' : 'Hear the word')};
            const replay = [...document.querySelectorAll('button')].some((b) => (b.textContent || '').trim() === replayLabel);
            const next = document.querySelector('.lesson-nav .btn.next');
            const nr = next ? next.getBoundingClientRect() : null;
            return {
              choices: choices.length,
              replay,
              next: !!(nr && !next.hidden && nr.height >= 44),
              any: /\\bany\\b/i.test(text),
              scores: document.querySelectorAll('.teampip').length
            };
          })()`);
          assert.ok(hear.choices >= 3 && hear.choices <= 4, name + ' round ' + (seen + 1) + ' has ' + hear.choices + ' choices');
          assert.equal(hear.replay, true, name + ' is missing ' + (name === 'Sound Match' ? 'Hear the sound' : 'Hear the word'));
          assert.equal(hear.next, true, name + ' Next is missing');
          assert.equal(hear.any, false, name + ' still says any');
          assert.equal(hear.scores, 0, name + ' still shows Zip or Frill scores');
          seen += 1;
        }
        await session.evalJs(`(() => {
          const hearGame = ${HEAR.has(name) ? 'true' : 'false'};
          if (!hearGame) {
            const yes = document.querySelector('[data-yes="1"]');
            if (yes) yes.click();
          }
          const next = document.querySelector('.lesson-nav .btn.next');
          if (next && !next.hidden) next.click();
        })()`);
        await session.sleep(400);
      }
      if (HEAR.has(name)) assert.ok(seen >= 12, name + ' only checked ' + seen + ' rounds');
      ended = await session.evalJs(`!!document.querySelector('.ll1end, .llend, .complete')`);
      assert.equal(ended, true, name + ' did not reach the end screen');
    }
  } finally {
    session.chrome.kill('SIGKILL');
  }
});

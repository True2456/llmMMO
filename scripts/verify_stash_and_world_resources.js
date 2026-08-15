import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import WebSocket from 'ws';

async function fetchJson(url, retries = 10) {
  for (let i = 0; i < retries; i++) {
    try {
      const data = await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          let buf = '';
          res.on('data', chunk => buf += chunk);
          res.on('end', () => resolve(JSON.parse(buf)));
        });
        req.on('error', reject);
        req.setTimeout(1000, () => { req.destroy(); reject(new Error('timeout')); });
      });
      return data;
    } catch (e) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  throw new Error(`Failed to fetch JSON from ${url}`);
}

async function verifyStashAndResources() {
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const cdpPort = 9231;
  const profileDir = `/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/scratch/chrome-stash-profile-2`;

  try {
    fs.rmSync(profileDir, { recursive: true, force: true });
  } catch (e) {}

  const chromeProc = spawn(chromePath, [
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${profileDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1280,720',
    'http://localhost:3000'
  ]);

  const listData = await fetchJson(`http://127.0.0.1:${cdpPort}/json/list`, 15);
  const page = listData.find(p => p.type === 'page' && p.url.includes('localhost:3000'));
  if (!page) throw new Error('Could not find page in Chrome CDP');

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(resolve => ws.on('open', resolve));

  let reqId = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const id = reqId++;
    const handler = (data) => {
      const msg = JSON.parse(data);
      if (msg.id === id) {
        ws.off('message', handler);
        resolve(msg.result);
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');

  await new Promise(r => setTimeout(r, 1200));
  // Enter guest mode
  await send('Runtime.evaluate', { expression: `document.getElementById('btn-modal-guest').click();` });
  await new Promise(r => setTimeout(r, 2000));

  // Open Stash Vault and deposit materials to demonstrate 50 slots and 25x stacking
  await send('Runtime.evaluate', {
    expression: `
      window.ui.openStashVault(window.latestGameState.self);
      window.network.send({ type: 'DEPOSIT_STASH', slotIndex: 3, quantity: 5 });
      window.network.send({ type: 'DEPOSIT_STASH', slotIndex: 1, quantity: 1 });
      setTimeout(() => {
        if (window.latestGameState?.self) window.ui.openStashVault(window.latestGameState.self);
      }, 300);
    `
  });

  await new Promise(r => setTimeout(r, 1500));

  // 1. Capture Stash Modal with 50 slots and 25x stacking
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_live_stash_modal.png', Buffer.from(shot1.data, 'base64'));
  console.log('✅ Captured prima_live_stash_modal.png');

  // Close stash modal and walk into the newly enriched resource forest/ore wilderness
  await send('Runtime.evaluate', {
    expression: `
      document.getElementById('stash-modal').classList.add('hidden');
      window.network.move(82, 134);
    `
  });

  await new Promise(r => setTimeout(r, 2500));

  // 2. Capture Rich World Biome Resources
  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_live_rich_world_resources.png', Buffer.from(shot2.data, 'base64'));
  console.log('✅ Captured prima_live_rich_world_resources.png');

  ws.close();
  chromeProc.kill();
  try {
    fs.rmSync(profileDir, { recursive: true, force: true });
  } catch (e) {}
}

verifyStashAndResources().catch(console.error);

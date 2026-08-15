import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import WebSocket from 'ws';

async function verifyLiveActions() {
  console.log('Testing live browser player actions...');

  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const cdpPort = 9224;
  const profileDir = `/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/scratch/chrome-actions-profile`;

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

  await new Promise(r => setTimeout(r, 2000));

  const listData = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${cdpPort}/json/list`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = listData.find(p => p.type === 'page' && p.url.includes('localhost:3000'));
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
  await send('DOM.enable');

  await new Promise(r => setTimeout(r, 1500));

  // 1. Click Guest button
  await send('Runtime.evaluate', {
    expression: `document.getElementById('btn-modal-guest').click();`
  });

  await new Promise(r => setTimeout(r, 2000));

  // 2. Click Copper Node via network manager
  console.log('  Testing Mining Copper Boulder...');
  const res1 = await send('Runtime.evaluate', {
    expression: `
      const copper = window.latestGameState.nodes.find(n => n.type.includes('BOULDER') || n.name.includes('Copper'));
      if (copper) {
        window.network.interactResource(copper.id);
        JSON.stringify({ found: true, id: copper.id, x: copper.x, y: copper.y });
      } else {
        JSON.stringify({ found: false });
      }
    `
  });
  console.log('    Interacting with node:', res1.result.value);

  // Wait 8.5 seconds for full walk and mining cycle (8 steps + 2 gathering ticks)
  await new Promise(r => setTimeout(r, 8500));

  const invCheck = await send('Runtime.evaluate', {
    expression: `
      JSON.stringify({
        selfX: window.latestGameState.self?.x,
        selfY: window.latestGameState.self?.y,
        actionState: window.latestGameState.self?.actionState,
        inventory: window.latestGameState.self?.inventory?.filter(Boolean)
      });
    `
  });
  console.log('    Player state after mining:', invCheck.result.value);

  // 3. Take screenshot of live gathering
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_live_mining_working.png', Buffer.from(shot1.data, 'base64'));
  console.log('✅ Screenshot captured: prima_live_mining_working.png');

  ws.close();
  chromeProc.kill();
  try {
    fs.rmSync(profileDir, { recursive: true, force: true });
  } catch (e) {}
}

verifyLiveActions().catch(console.error);

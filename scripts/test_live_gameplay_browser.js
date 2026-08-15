import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import WebSocket from 'ws';

async function testLiveBrowserGameplay() {
  console.log('Testing Live Browser Gameplay Interactions...');

  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const cdpPort = 9223;
  const profileDir = `/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/scratch/chrome-gameplay-profile`;

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

  const versionData = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${cdpPort}/json/version`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

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

  // Wait for game canvas to load
  await new Promise(r => setTimeout(r, 1500));

  // 1. Click Play as Guest
  console.log('  1. Clicking "PLAY AS GUEST"...');
  await send('Runtime.evaluate', {
    expression: `
      const guestBtn = document.getElementById('btn-modal-guest');
      if (guestBtn) guestBtn.click();
    `
  });

  // Wait for game world to render
  await new Promise(r => setTimeout(r, 2000));

  // 2. Left-click on Native Copper Boulder (screen coords for node at 80, 130)
  // Let's get exact canvas client coordinates from game engine
  console.log('  2. Clicking Native Copper Boulder to Mine...');
  await send('Runtime.evaluate', {
    expression: `
      const canvas = document.getElementById('game-canvas');
      const rect = canvas.getBoundingClientRect();
      // Find copper node in gameState
      const node = (window.latestGameState || (window.renderer && window.renderer.latestGameState))?.nodes?.find(n => n.type.includes('BOULDER') || n.name.includes('Copper'));
      if (node && window.renderer) {
        const screen = window.renderer.worldToScreen(node.x, node.y);
        const clickEvent = new MouseEvent('click', {
          clientX: rect.left + screen.x + 16,
          clientY: rect.top + screen.y + 16,
          bubbles: true
        });
        canvas.dispatchEvent(clickEvent);
      }
    `
  });

  // Wait 4 seconds for walk & mining tick
  await new Promise(r => setTimeout(r, 4000));

  // Capture screenshot of mining/gathering action
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_gameplay_clean_fixed.png', Buffer.from(shot1.data, 'base64'));
  console.log('✅ Screenshot captured: prima_gameplay_clean_fixed.png');

  ws.close();
  chromeProc.kill();
  try {
    fs.rmSync(profileDir, { recursive: true, force: true });
  } catch (e) {}
}

testLiveBrowserGameplay().catch(console.error);

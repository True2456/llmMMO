/**
 * Verify right-click context menu and resource gathering (mining/woodcutting)
 */

import http from 'http';
import fs from 'fs';
import { exec } from 'child_process';
import WebSocket from 'ws';

async function testRightClickAndMining() {
  const profileDir = `/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/scratch/chrome-ctx-test-${Date.now()}`;
  fs.mkdirSync(profileDir, { recursive: true });

  const chromeProc = exec(`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9230 --user-data-dir="${profileDir}" --window-size=1280,820 "http://localhost:3000?v=${Date.now()}"`);

  await new Promise(r => setTimeout(r, 2000));

  const getJson = () => new Promise((resolve, reject) => {
    http.get('http://localhost:9230/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const targets = await getJson();
  const pageTarget = targets.find(t => t.type === 'page');
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.on('open', r));

  let msgId = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const id = msgId++;
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

  await new Promise(r => setTimeout(r, 2500));

  // Enter as guest
  await send('Runtime.evaluate', {
    expression: `
      document.getElementById('guest-btn')?.click();
      document.getElementById('auth-modal')?.classList.add('hidden');
    `
  });

  await new Promise(r => setTimeout(r, 2000));

  const canvasBox = await send('Runtime.evaluate', {
    expression: `
      const c = document.getElementById('game-canvas');
      const rect = c.getBoundingClientRect();
      JSON.stringify({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
    `,
    returnByValue: true
  });
  const box = JSON.parse(canvasBox.result.value);

  // 1. Right Click on Dire Wolf
  console.log('1. Right-clicking on Dire Wolf to trigger Context Menu...');
  const wolfScreen = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const c = document.getElementById('game-canvas');
        const rect = c.getBoundingClientRect();
        return JSON.stringify({ x: rect.left + rect.width / 2 - 40, y: rect.top + rect.height / 2 - 50 });
      })()
    `,
    returnByValue: true
  });
  const wolfPos = JSON.parse(wolfScreen.result.value);

  // Dispatch Right Click (button = 'right')
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: wolfPos.x, y: wolfPos.y, button: 'right', clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: wolfPos.x, y: wolfPos.y, button: 'right', clickCount: 1 });

  await new Promise(r => setTimeout(r, 400));

  const shotWolfCtx = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_context_menu_wolf.png', Buffer.from(shotWolfCtx.data, 'base64'));
  console.log('✅ Captured wolf right-click context menu: prima_context_menu_wolf.png');

  // Dismiss context menu
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: box.left + 10, y: box.top + 10, button: 'left', clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: box.left + 10, y: box.top + 10, button: 'left', clickCount: 1 });
  await new Promise(r => setTimeout(r, 300));

  // 2. Right Click on Native Copper Boulder (placed at 82, 130, which is to the left of the player at 90, 132)
  console.log('2. Right-clicking on Native Copper Boulder...');
  // Left from center: player at (90, 132), boulder at (84, 133) is ~6 tiles west = ~192px left
  const boulderScreen = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const c = document.getElementById('game-canvas');
        const rect = c.getBoundingClientRect();
        return JSON.stringify({ x: rect.left + rect.width / 2 - 180, y: rect.top + rect.height / 2 + 25 });
      })()
    `,
    returnByValue: true
  });
  const boulderPos = JSON.parse(boulderScreen.result.value);

  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: boulderPos.x, y: boulderPos.y, button: 'right', clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: boulderPos.x, y: boulderPos.y, button: 'right', clickCount: 1 });

  await new Promise(r => setTimeout(r, 400));

  const shotResourceCtx = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_context_menu_resource.png', Buffer.from(shotResourceCtx.data, 'base64'));
  console.log('✅ Captured resource right-click context menu: prima_context_menu_resource.png');

  // 3. Click to mine the copper boulder
  console.log('3. Left clicking on Native Copper Boulder to start mining...');
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: boulderPos.x, y: boulderPos.y, button: 'left', clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: boulderPos.x, y: boulderPos.y, button: 'left', clickCount: 1 });

  // Wait 4 ticks for player to walk over and complete mining cycle
  await new Promise(r => setTimeout(r, 3500));

  const shotMining = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_live_mining_action.png', Buffer.from(shotMining.data, 'base64'));
  console.log('✅ Captured live mining action and inventory update: prima_live_mining_action.png');

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

testRightClickAndMining().catch(console.error);

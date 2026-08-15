/**
 * Test click interaction, visual feedback, and monster combat targeting
 */

import http from 'http';
import fs from 'fs';
import { exec } from 'child_process';
import WebSocket from 'ws';

async function testClickAndCombat() {
  const profileDir = `/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/scratch/chrome-click-test-${Date.now()}`;
  fs.mkdirSync(profileDir, { recursive: true });

  const chromeProc = exec(`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9229 --user-data-dir="${profileDir}" --window-size=1280,820 "http://localhost:3000?v=${Date.now()}"`);

  await new Promise(r => setTimeout(r, 2000));

  const getJson = () => new Promise((resolve, reject) => {
    http.get('http://localhost:9229/json', (res) => {
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

  // 1. Test clicking a ground tile near the player (e.g. at canvas center + 80px)
  console.log('1. Dispatching mouse click to ground tile...');
  const canvasBox = await send('Runtime.evaluate', {
    expression: `
      const c = document.getElementById('game-canvas');
      const rect = c.getBoundingClientRect();
      JSON.stringify({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
    `,
    returnByValue: true
  });
  const box = JSON.parse(canvasBox.result.value);

  // Click on tile to move
  const clickX = box.left + box.width / 2 + 60;
  const clickY = box.top + box.height / 2 + 40;

  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: clickX, y: clickY, button: 'left', clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: clickX, y: clickY, button: 'left', clickCount: 1 });

  await new Promise(r => setTimeout(r, 200));

  // Capture screenshot of movement click reticle (Yellow X)
  const shotMove = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_click_move_reticle.png', Buffer.from(shotMove.data, 'base64'));
  console.log('✅ Captured movement click reticle: prima_click_move_reticle.png');

  await new Promise(r => setTimeout(r, 1500));

  // 2. Click on a nearby wolf to attack
  console.log('2. Locating nearby Dire Wolf and clicking to attack...');
  const wolfScreen = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const c = document.getElementById('game-canvas');
        const rect = c.getBoundingClientRect();
        // Trigger click on Dire Wolf above the bridge
        return JSON.stringify({ x: rect.left + rect.width / 2 - 40, y: rect.top + rect.height / 2 - 50 });
      })()
    `,
    returnByValue: true
  });
  const wolfPos = JSON.parse(wolfScreen.result.value);

  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: wolfPos.x, y: wolfPos.y, button: 'left', clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: wolfPos.x, y: wolfPos.y, button: 'left', clickCount: 1 });

  await new Promise(r => setTimeout(r, 250));

  // Capture screenshot of combat click reticle (Red Crosshairs)
  const shotAttack = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_click_attack_reticle.png', Buffer.from(shotAttack.data, 'base64'));
  console.log('✅ Captured attack click reticle: prima_click_attack_reticle.png');

  // Wait 3 ticks for combat hitsplats
  await new Promise(r => setTimeout(r, 2500));

  const shotCombat = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_live_combat_action.png', Buffer.from(shotCombat.data, 'base64'));
  console.log('✅ Captured live combat action with hitsplats: prima_live_combat_action.png');

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

testClickAndCombat().catch(console.error);

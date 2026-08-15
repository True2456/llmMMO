/**
 * Test right-click context menu persistence, hover behavior, and mouse-off dismissal
 */

import http from 'http';
import fs from 'fs';
import { exec } from 'child_process';
import WebSocket from 'ws';

async function testMenuPersistence() {
  const profileDir = `/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/scratch/chrome-menu-dismiss-test-${Date.now()}`;
  fs.mkdirSync(profileDir, { recursive: true });

  const chromeProc = exec(`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9231 --user-data-dir="${profileDir}" --window-size=1280,820 "http://localhost:3000?v=${Date.now()}"`);

  await new Promise(r => setTimeout(r, 2000));

  const getJson = () => new Promise((resolve, reject) => {
    http.get('http://localhost:9231/json', (res) => {
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

  await new Promise(r => setTimeout(r, 1500));

  // 1. Trigger single right click on Dire Wolf
  console.log('1. Dispatching single right-click on Dire Wolf...');
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

  // Press & immediately release right mouse button
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: wolfPos.x, y: wolfPos.y, button: 'right', clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: wolfPos.x, y: wolfPos.y, button: 'right', clickCount: 1 });

  await new Promise(r => setTimeout(r, 200));

  // Verify menu is visible and persistently open
  const isVisibleAfterRelease = await send('Runtime.evaluate', {
    expression: `!document.getElementById('context-menu').classList.contains('hidden')`,
    returnByValue: true
  });
  console.log(`Menu visible after right-click release: ${isVisibleAfterRelease.result.value}`);

  // Capture screenshot of open menu
  const shotPersist = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_menu_persistent_open.png', Buffer.from(shotPersist.data, 'base64'));

  // 2. Mouse off the menu to far right
  console.log('2. Moving mouse away from menu to test auto-dismiss...');
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: wolfPos.x + 350, y: wolfPos.y + 100 });

  // Wait 400ms for mouseleave debounce
  await new Promise(r => setTimeout(r, 450));

  const isHiddenAfterMouseOff = await send('Runtime.evaluate', {
    expression: `document.getElementById('context-menu').classList.contains('hidden')`,
    returnByValue: true
  });
  console.log(`Menu auto-dismissed on mouse-off: ${isHiddenAfterMouseOff.result.value}`);

  const shotDismissed = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_menu_auto_dismissed.png', Buffer.from(shotDismissed.data, 'base64'));

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

testMenuPersistence().catch(console.error);

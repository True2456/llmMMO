/**
 * Comprehensive visual verification for Starter Settlement, 16-Bit Minimap,
 * Town Elders, Beginner Training Fauna, and Guaranteed Gathering
 */

import http from 'http';
import fs from 'fs';
import { exec } from 'child_process';
import WebSocket from 'ws';

async function testSettlementAndMinimap() {
  const profileDir = `/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/scratch/chrome-settlement-test-${Date.now()}`;
  fs.mkdirSync(profileDir, { recursive: true });

  const chromeProc = exec(`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9232 --user-data-dir="${profileDir}" --window-size=1280,820 "http://localhost:3000?v=${Date.now()}"`);

  await new Promise(r => setTimeout(r, 2000));

  const getJson = () => new Promise((resolve, reject) => {
    http.get('http://localhost:9232/json', (res) => {
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

  await new Promise(r => setTimeout(r, 2000));

  // Enter as guest
  await send('Runtime.evaluate', {
    expression: `
      document.getElementById('guest-btn')?.click();
      document.getElementById('auth-modal')?.classList.add('hidden');
    `
  });

  // Wait 2.5s for initial world sync and render ticks
  await new Promise(r => setTimeout(r, 2500));

  // 1. Capture Ash-River Settlement and Minimap overview
  console.log('1. Capturing Ash-River Encampment Settlement & 16-Bit Minimap...');
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_settlement_and_minimap.png', Buffer.from(shot1.data, 'base64'));

  // 2. Right click on Elder Kael to open Dialogue Context Menu
  console.log('2. Right-clicking on Elder Kael for dialogue...');
  const elderPos = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const c = document.getElementById('game-canvas');
        const rect = c.getBoundingClientRect();
        return JSON.stringify({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 - 10 });
      })()
    `,
    returnByValue: true
  });
  const ePos = JSON.parse(elderPos.result.value);

  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: ePos.x, y: ePos.y, button: 'right', clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: ePos.x, y: ePos.y, button: 'right', clickCount: 1 });

  await new Promise(r => setTimeout(r, 300));
  const shotElder = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_elder_dialogue_menu.png', Buffer.from(shotElder.data, 'base64'));

  // Click "Talk to Elder Kael"
  await send('Runtime.evaluate', {
    expression: `
      const items = Array.from(document.querySelectorAll('.context-menu-item'));
      const talkBtn = items.find(i => i.textContent.includes('Talk'));
      if (talkBtn) talkBtn.click();
    `
  });

  await new Promise(r => setTimeout(r, 800));
  const shotChat = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_elder_spoken_chat.png', Buffer.from(shotChat.data, 'base64'));

  // 3. Left click on River Clay Bank / Native Copper to demonstrate Guaranteed Gathering
  console.log('3. Gathering Native Copper Boulder & River Clay...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        // Send gather action for immediate feedback
        const node = window.latestGameState?.nodes?.find(n => n.available && (n.type.includes('COPPER') || n.type.includes('CLAY')));
        if (node) {
          window.network?.interactResource(node.id);
          window.renderer?.addClickReticle(node.x, node.y, 'GATHER');
        }
      })()
    `
  });

  // Wait 1.8s for gathering ticks and floating XP hitsplat
  await new Promise(r => setTimeout(r, 1800));
  const shotGather = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_guaranteed_gathering.png', Buffer.from(shotGather.data, 'base64'));

  ws.close();
  chromeProc.kill();
  console.log('✅ ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
  process.exit(0);
}

testSettlementAndMinimap().catch(console.error);

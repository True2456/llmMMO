/**
 * Capture full live gameplay action screenshot
 */

import http from 'http';
import fs from 'fs';
import { exec } from 'child_process';
import WebSocket from 'ws';

async function captureGameplay() {
  const profileDir = `/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/scratch/chrome-gameplay-${Date.now()}`;
  fs.mkdirSync(profileDir, { recursive: true });

  const chromeProc = exec(`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9227 --user-data-dir="${profileDir}" --window-size=1280,820 "http://localhost:3000?v=${Date.now()}"`);

  await new Promise(r => setTimeout(r, 2000));

  const getJson = () => new Promise((resolve, reject) => {
    http.get('http://localhost:9227/json', (res) => {
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

  // Enter as guest and force hide modal
  await send('Runtime.evaluate', {
    expression: `
      const guestBtn = document.getElementById('guest-btn');
      if (guestBtn) guestBtn.click();
      const modal = document.getElementById('auth-modal');
      if (modal) modal.classList.add('hidden');

      // Select items tab
      document.querySelectorAll('.hud-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.panel-section').forEach(p => p.classList.remove('active'));
      const itemTab = document.querySelector('.hud-tab[data-tab="items"]');
      if (itemTab) itemTab.classList.add('active');
      const itemPanel = document.getElementById('panel-items');
      if (itemPanel) itemPanel.classList.add('active');
    `
  });

  await new Promise(r => setTimeout(r, 3000));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const outputPath = '/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_live_gameplay.png';
  fs.writeFileSync(outputPath, Buffer.from(shot.data, 'base64'));

  console.log(`✅ Live gameplay screenshot saved at: ${outputPath}`);
  ws.close();
  chromeProc.kill();
  process.exit(0);
}

captureGameplay().catch(console.error);

/**
 * Capture screenshots of Quests, Skills and Atlas tabs with new 200x200 world
 */

import http from 'http';
import fs from 'fs';
import { exec } from 'child_process';
import WebSocket from 'ws';

async function captureTab(tabName, outputFileName) {
  const profileDir = `/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/scratch/chrome-tab-${tabName}-${Date.now()}`;
  fs.mkdirSync(profileDir, { recursive: true });

  const chromeProc = exec(`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9228 --user-data-dir="${profileDir}" --window-size=1280,820 "http://localhost:3000?v=${Date.now()}"`);

  await new Promise(r => setTimeout(r, 2000));

  const getJson = () => new Promise((resolve, reject) => {
    http.get('http://localhost:9228/json', (res) => {
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

  // Dismiss modal and click desired tab
  await send('Runtime.evaluate', {
    expression: `
      document.getElementById('guest-btn')?.click();
      document.getElementById('auth-modal')?.classList.add('hidden');
      document.querySelectorAll('.hud-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.panel-section').forEach(p => p.classList.remove('active'));

      const targetTab = document.querySelector('.hud-tab[data-tab="${tabName}"]');
      if (targetTab) targetTab.classList.add('active');
      const targetPanel = document.getElementById('panel-${tabName}');
      if (targetPanel) targetPanel.classList.add('active');
    `
  });

  await new Promise(r => setTimeout(r, 2000));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/${outputFileName}`, Buffer.from(shot.data, 'base64'));

  ws.close();
  chromeProc.kill();
}

async function main() {
  console.log('Capturing Quests view...');
  await captureTab('quests', 'prima_quests_view.png');
  console.log('Capturing Skills view...');
  await captureTab('skills', 'prima_skills_20_view.png');
  console.log('Capturing Atlas view...');
  await captureTab('atlas', 'prima_atlas_view.png');
  console.log('✅ Captured all tabs!');
  process.exit(0);
}

main().catch(console.error);

/**
 * Capture live game view of Ash-River Encampment with active players & bots
 */

import http from 'http';
import fs from 'fs';
import { exec } from 'child_process';
import WebSocket from 'ws';

async function captureTown() {
  const artifactDir = '/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7';
  const profileDir = `${artifactDir}/scratch/chrome-town-${Date.now()}`;
  fs.mkdirSync(profileDir, { recursive: true });

  const chromeProc = exec(`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9241 --user-data-dir="${profileDir}" --window-size=1280,820 "https://llmmmo.onrender.com"`);

  await new Promise(r => setTimeout(r, 2500));

  const getJson = () => new Promise((resolve, reject) => {
    http.get('http://localhost:9241/json', (res) => {
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

  await new Promise(r => setTimeout(r, 2500));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const outputPath = `${artifactDir}/prima_live_town_players_and_bots.png`;
  fs.writeFileSync(outputPath, Buffer.from(shot.data, 'base64'));

  console.log(`✅ Captured screenshot to ${outputPath}`);
  ws.close();
  chromeProc.kill();
  process.exit(0);
}

captureTown().catch(console.error);

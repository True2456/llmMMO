import http from 'http';
import fs from 'fs';
import { exec } from 'child_process';
import WebSocket from 'ws';

async function captureTerrainAndLoot() {
  console.log('Capturing Clean Starter Town & Ground Looting in action...');
  const port = 9245;
  const profileDir = `/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/scratch/chrome-terrain-loot-${Date.now()}`;
  fs.mkdirSync(profileDir, { recursive: true });

  const chromeProc = exec(`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=${port} --user-data-dir="${profileDir}" --window-size=1280,820 "http://localhost:3000?v=${Date.now()}"`);

  await new Promise(r => setTimeout(r, 2000));

  const getJson = () => new Promise((resolve, reject) => {
    http.get(`http://localhost:${port}/json`, (res) => {
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

  // Wait 3.5s for world and bots to render
  await new Promise(r => setTimeout(r, 3500));

  // Capture screenshot of clean starter town & looting
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_dots3_nemotron_ultra.png', Buffer.from(shot1.data, 'base64'));
  console.log('✅ Screenshot captured: prima_dots3_nemotron_ultra.png');

  ws.close();
  chromeProc.kill();
  try {
    fs.rmSync(profileDir, { recursive: true, force: true });
  } catch (e) {}
}

captureTerrainAndLoot().catch(console.error);

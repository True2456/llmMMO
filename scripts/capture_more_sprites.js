import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import WebSocket from 'ws';

async function captureMoreSprites() {
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const cdpPort = 9229;
  const profileDir = `/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/scratch/chrome-more-sprites-profile`;

  try {
    fs.rmSync(profileDir, { recursive: true, force: true });
  } catch (e) {}

  const chromeProc = spawn(chromePath, [
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${profileDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1280,1000',
    'http://localhost:3000/sprites_viewer.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const listData = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${cdpPort}/json/list`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = listData.find(p => p.type === 'page' && p.url.includes('sprites_viewer.html'));
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

  await new Promise(r => setTimeout(r, 1200));

  // Scroll to Weapons, Armors, Foods
  await send('Runtime.evaluate', {
    expression: `window.scrollTo(0, 1600);`
  });
  await new Promise(r => setTimeout(r, 500));
  const shot4 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_sprites_weapons_armors_foods.png', Buffer.from(shot4.data, 'base64'));
  console.log('✅ Captured prima_sprites_weapons_armors_foods.png');

  // Scroll to Terrain & Tiles
  await send('Runtime.evaluate', {
    expression: `window.scrollTo(0, 2250);`
  });
  await new Promise(r => setTimeout(r, 500));
  const shot5 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_sprites_terrain_and_tiles.png', Buffer.from(shot5.data, 'base64'));
  console.log('✅ Captured prima_sprites_terrain_and_tiles.png');

  ws.close();
  chromeProc.kill();
  try {
    fs.rmSync(profileDir, { recursive: true, force: true });
  } catch (e) {}
}

captureMoreSprites().catch(console.error);

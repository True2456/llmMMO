import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import WebSocket from 'ws';

async function captureSpriteAtlas() {
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const cdpPort = 9228;
  const profileDir = `/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/scratch/chrome-sprites-profile`;

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

  // 1. Screenshot top (Fauna, Beasts, Elders)
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_sprites_monsters_and_npcs.png', Buffer.from(shot1.data, 'base64'));
  console.log('✅ Captured prima_sprites_monsters_and_npcs.png');

  // 2. Scroll to Crafting Stations and Objects
  await send('Runtime.evaluate', {
    expression: `window.scrollTo(0, 520);`
  });
  await new Promise(r => setTimeout(r, 500));
  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_sprites_stations_and_objects.png', Buffer.from(shot2.data, 'base64'));
  console.log('✅ Captured prima_sprites_stations_and_objects.png');

  // 3. Scroll to Item Icons
  await send('Runtime.evaluate', {
    expression: `window.scrollTo(0, 1100);`
  });
  await new Promise(r => setTimeout(r, 500));
  const shot3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_sprites_item_icons.png', Buffer.from(shot3.data, 'base64'));
  console.log('✅ Captured prima_sprites_item_icons.png');

  ws.close();
  chromeProc.kill();
  try {
    fs.rmSync(profileDir, { recursive: true, force: true });
  } catch (e) {}
}

captureSpriteAtlas().catch(console.error);

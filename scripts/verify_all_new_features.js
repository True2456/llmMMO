import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import WebSocket from 'ws';

async function verifyAllFeatures() {
  console.log('Testing full live features in browser...');

  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const cdpPort = 9225;
  const profileDir = `/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/scratch/chrome-verify-profile`;

  try {
    fs.rmSync(profileDir, { recursive: true, force: true });
  } catch (e) {}

  const chromeProc = spawn(chromePath, [
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${profileDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1280,720',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const listData = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${cdpPort}/json/list`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = listData.find(p => p.type === 'page' && p.url.includes('localhost:3000'));
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
  await send('DOM.enable');

  await new Promise(r => setTimeout(r, 1500));

  // 1. Enter as Guest
  console.log('1. Logging in as Guest...');
  await send('Runtime.evaluate', {
    expression: `document.getElementById('btn-modal-guest').click();`
  });

  await new Promise(r => setTimeout(r, 2000));

  // 2. Test Dialogue Modal with Elder Kael
  console.log('2. Opening NPC Dialogue Modal with Elder Kael...');
  await send('Runtime.evaluate', {
    expression: `
      const elder = window.latestGameState.npcs.find(n => n.name.includes('Elder Kael') || n.isTownNpc);
      if (elder) {
        window.ui.openDialogue(elder);
      }
    `
  });

  await new Promise(r => setTimeout(r, 800));

  const shotDiag = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_live_dialogue_modal.png', Buffer.from(shotDiag.data, 'base64'));
  console.log('  ✅ Screenshot captured: prima_live_dialogue_modal.png');

  // Close dialogue
  await send('Runtime.evaluate', {
    expression: `document.getElementById('btn-dialogue-close').click();`
  });

  await new Promise(r => setTimeout(r, 500));

  // 3. Test Crafting Workshop Modal with Crucible Station
  console.log('3. Opening Crafting Workshop Modal with Smelting Crucible...');
  await send('Runtime.evaluate', {
    expression: `
      const crucible = window.latestGameState.nodes.find(n => n.isStation && (n.stationType === 'STATION_CRUCIBLE' || n.type.includes('CRUCIBLE')));
      if (crucible) {
        window.ui.openCraftingStation(crucible, window.latestGameState.self);
      }
    `
  });

  await new Promise(r => setTimeout(r, 800));

  const shotCraft = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_live_crafting_modal.png', Buffer.from(shotCraft.data, 'base64'));
  console.log('  ✅ Screenshot captured: prima_live_crafting_modal.png');

  // Close crafting modal
  await send('Runtime.evaluate', {
    expression: `document.getElementById('btn-crafting-close').click();`
  });

  await new Promise(r => setTimeout(r, 500));

  // 4. Take clean live overview screenshot
  const shotMain = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_live_overview_enhanced.png', Buffer.from(shotMain.data, 'base64'));
  console.log('  ✅ Screenshot captured: prima_live_overview_enhanced.png');

  ws.close();
  chromeProc.kill();
  try {
    fs.rmSync(profileDir, { recursive: true, force: true });
  } catch (e) {}

  console.log('🎉 Browser verification completed successfully!');
}

verifyAllFeatures().catch(console.error);

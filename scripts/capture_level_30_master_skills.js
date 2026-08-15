/**
 * Capture High-Resolution Verification Screenshots of:
 * 1. Sprite Atlas Inspector containing all Level 1-30 item icons, nodes, equipment
 * 2. In-Game 20 Skills Panel with all unlocks
 * 3. In-Game Crafting Station Modal with Level 1-30 recipes
 */

import http from 'http';
import fs from 'fs';
import { exec } from 'child_process';
import WebSocket from 'ws';

async function capture() {
  const artifactDir = '/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7';

  // =========================================================================
  // 1. Capture Full Sprite Atlas Inspector (All Level 1-30 Items & Nodes)
  // =========================================================================
  console.log('1. Capturing Sprite Atlas Inspector for Level 1-30 Items & Nodes...');
  const profileDir1 = `${artifactDir}/scratch/chrome-sprites-${Date.now()}`;
  fs.mkdirSync(profileDir1, { recursive: true });

  const chromeProc1 = exec(`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9230 --user-data-dir="${profileDir1}" --window-size=1400,1200 "http://localhost:3000/sprites_viewer.html?v=${Date.now()}"`);

  await new Promise(r => setTimeout(r, 2000));

  const getJson = (port) => new Promise((resolve, reject) => {
    http.get(`http://localhost:${port}/json`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const targets1 = await getJson(9230);
  const page1 = targets1.find(t => t.type === 'page');
  const ws1 = new WebSocket(page1.webSocketDebuggerUrl);
  await new Promise(r => ws1.on('open', r));

  let msgId = 1;
  const send1 = (method, params = {}) => new Promise(resolve => {
    const id = msgId++;
    const handler = (data) => {
      const msg = JSON.parse(data);
      if (msg.id === id) {
        ws1.off('message', handler);
        resolve(msg.result);
      }
    };
    ws1.on('message', handler);
    ws1.send(JSON.stringify({ id, method, params }));
  });

  await send1('Page.enable');
  await send1('Runtime.enable');
  await new Promise(r => setTimeout(r, 1500));

  const shot1 = await send1('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/prima_sprites_level_30_matrix.png`, Buffer.from(shot1.data, 'base64'));
  console.log('  ✅ Captured prima_sprites_level_30_matrix.png');

  ws1.close();
  chromeProc1.kill();

  // =========================================================================
  // 2. Capture In-Game Gameplay & 20 Skills View
  // =========================================================================
  console.log('2. Capturing In-Game 20 Skills View...');
  const profileDir2 = `${artifactDir}/scratch/chrome-skills-${Date.now()}`;
  fs.mkdirSync(profileDir2, { recursive: true });

  const chromeProc2 = exec(`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9231 --user-data-dir="${profileDir2}" --window-size=1280,820 "http://localhost:3000?v=${Date.now()}"`);

  await new Promise(r => setTimeout(r, 2000));
  const targets2 = await getJson(9231);
  const page2 = targets2.find(t => t.type === 'page');
  const ws2 = new WebSocket(page2.webSocketDebuggerUrl);
  await new Promise(r => ws2.on('open', r));

  const send2 = (method, params = {}) => new Promise(resolve => {
    const id = msgId++;
    const handler = (data) => {
      const msg = JSON.parse(data);
      if (msg.id === id) {
        ws2.off('message', handler);
        resolve(msg.result);
      }
    };
    ws2.on('message', handler);
    ws2.send(JSON.stringify({ id, method, params }));
  });

  await send2('Page.enable');
  await send2('Runtime.enable');
  await new Promise(r => setTimeout(r, 2000));

  // Dismiss modal and switch to skills tab
  await send2('Runtime.evaluate', {
    expression: `
      document.getElementById('guest-btn')?.click();
      document.getElementById('auth-modal')?.classList.add('hidden');
      
      const skillsTab = document.querySelector('.hud-tab[data-tab="skills"]');
      if (skillsTab) skillsTab.click();
    `
  });

  await new Promise(r => setTimeout(r, 1500));
  const shot2 = await send2('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/prima_live_skills_20_unlocked.png`, Buffer.from(shot2.data, 'base64'));
  console.log('  ✅ Captured prima_live_skills_20_unlocked.png');

  // =========================================================================
  // 3. Open Crafting Modal and Capture Level 1-30 Recipes
  // =========================================================================
  console.log('3. Capturing In-Game Specialized Crafting Recipes Modal...');
  await send2('Runtime.evaluate', {
    expression: `
      if (window.ui && window.ui.openCraftingStation) {
        window.ui.openCraftingStation({
          id: 'node_crucible_test',
          type: 'CRUCIBLE_STATION',
          stationType: 'STATION_CRUCIBLE',
          name: 'Clay Smelting Crucible'
        });
      }
    `
  });

  await new Promise(r => setTimeout(r, 1000));
  const shot3 = await send2('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${artifactDir}/prima_live_crafting_recipes_level30.png`, Buffer.from(shot3.data, 'base64'));
  console.log('  ✅ Captured prima_live_crafting_recipes_level30.png');

  ws2.close();
  chromeProc2.kill();

  console.log('\n🎉 ALL LIVE CDP SCREENSHOTS CAPTURED SUCCESSFULLY!');
  process.exit(0);
}

capture().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});

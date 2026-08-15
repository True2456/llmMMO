/**
 * Capture screenshots of the new MCP AI Control Center Modal & HUD Tab
 */

import http from 'http';
import fs from 'fs';
import { exec } from 'child_process';
import WebSocket from 'ws';

async function captureMcpSettings() {
  const artifactDir = '/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7';
  const profileDir = `${artifactDir}/scratch/chrome-mcp-${Date.now()}`;
  fs.mkdirSync(profileDir, { recursive: true });

  const chromeProc = exec(`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9248 --user-data-dir="${profileDir}" --window-size=1280,920 "http://localhost:3000"`);

  await new Promise(r => setTimeout(r, 2000));

  const getJson = () => new Promise((resolve, reject) => {
    http.get('http://localhost:9248/json', (res) => {
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
  await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 1500));

  // Enter as guest
  await send('Runtime.evaluate', {
    expression: `
      document.getElementById('btn-modal-guest')?.click();
      document.getElementById('auth-modal')?.classList.add('hidden');
    `
  });

  await new Promise(r => setTimeout(r, 1500));

  // Click MCP Settings Button & Reset Scroll
  const domInfo = await send('Runtime.evaluate', {
    expression: `
      document.getElementById('btn-mcp-settings')?.click();
      const body = document.querySelector('.mcp-modal-body');
      if (body) body.scrollTop = 0;
      const configSec = document.querySelector('.mcp-config-section');
      const claudePane = document.getElementById('pane-config-claude');
      ({
        configSecExists: !!configSec,
        configSecHeight: configSec ? configSec.clientHeight : 0,
        claudePaneDisplay: claudePane ? window.getComputedStyle(claudePane).display : 'none',
        claudeSnippetText: document.getElementById('code-claude-snippet')?.textContent?.substring(0, 40)
      })
    `,
    returnByValue: true
  });
  console.log('DOM Info:', domInfo.result?.value);

  await new Promise(r => setTimeout(r, 800));

  // 1. Capture Modal Top (Status & 1-Click Configs)
  const shotModal = await send('Page.captureScreenshot', { format: 'png' });
  const modalPath = `${artifactDir}/prima_mcp_settings_modal.png`;
  fs.writeFileSync(modalPath, Buffer.from(shotModal.data, 'base64'));
  console.log(`✅ Saved MCP Modal screenshot to ${modalPath}`);

  // 2. Scroll modal down to capture Live Playground & Tool Docs
  await send('Runtime.evaluate', {
    expression: `
      const body = document.querySelector('.mcp-modal-body');
      if (body) body.scrollTop = 420;
    `
  });

  await new Promise(r => setTimeout(r, 500));

  const shotPlayground = await send('Page.captureScreenshot', { format: 'png' });
  const playPath = `${artifactDir}/prima_mcp_playground_modal.png`;
  fs.writeFileSync(playPath, Buffer.from(shotPlayground.data, 'base64'));
  console.log(`✅ Saved MCP Playground screenshot to ${playPath}`);

  // 3. Close modal and switch to MCP HUD Tab
  await send('Runtime.evaluate', {
    expression: `
      document.getElementById('btn-mcp-close')?.click();
      const tab = document.querySelector('.hud-tab[data-tab="mcp"]');
      if (tab) tab.click();
    `
  });

  await new Promise(r => setTimeout(r, 1000));

  const shotTab = await send('Page.captureScreenshot', { format: 'png' });
  const tabPath = `${artifactDir}/prima_mcp_hud_tab.png`;
  fs.writeFileSync(tabPath, Buffer.from(shotTab.data, 'base64'));
  console.log(`✅ Saved MCP HUD Tab screenshot to ${tabPath}`);

  try { chromeProc.kill(); } catch (e) {}
  process.exit(0);
}

captureMcpSettings().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});

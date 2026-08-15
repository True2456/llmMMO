import http from 'http';
import fs from 'fs';
import { exec } from 'child_process';
import WebSocket from 'ws';

async function captureSwarmScreenshot() {
  const profileDir = `/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/scratch/chrome-swarm-test-${Date.now()}`;
  fs.mkdirSync(profileDir, { recursive: true });

  const chromeProc = exec(`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9234 --user-data-dir="${profileDir}" --window-size=1280,820 "http://localhost:3000?v=${Date.now()}"`);

  await new Promise(r => setTimeout(r, 2000));

  const getJson = () => new Promise((resolve, reject) => {
    http.get('http://localhost:9234/json', (res) => {
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

  // Wait 3.5s for the swarm to gather around the town center
  await new Promise(r => setTimeout(r, 3500));

  // Send a chat message to prompt the AI agents in earshot
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        window.network?.chat("Greetings Gorak_The_Flint and fellow LLMs! What are we crafting today?");
      })()
    `
  });

  await new Promise(r => setTimeout(r, 2500));

  console.log('Capturing Live OpenRouter Swarm in action...');
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_openrouter_swarm_live.png', Buffer.from(shot.data, 'base64'));

  // Switch to AI Agents chat tab
  await send('Runtime.evaluate', {
    expression: `
      const tabs = Array.from(document.querySelectorAll('.chat-tab'));
      const agentTab = tabs.find(t => t.textContent.includes('AI Agents'));
      if (agentTab) agentTab.click();
    `
  });

  await new Promise(r => setTimeout(r, 800));
  const shotChatTab = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/prima_openrouter_swarm_chat_tab.png', Buffer.from(shotChatTab.data, 'base64'));

  ws.close();
  chromeProc.kill();
  console.log('✅ OpenRouter Swarm screenshots captured successfully!');
  process.exit(0);
}

captureSwarmScreenshot().catch(console.error);

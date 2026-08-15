import http from 'http';
import WebSocket from 'ws';
import { exec } from 'child_process';
import fs from 'fs';

async function checkConsoleErrors() {
  const profileDir = `/Users/true/.gemini/antigravity/brain/52ecd2ef-e271-448b-910d-53d11fa626d7/scratch/chrome-console-err-${Date.now()}`;
  fs.mkdirSync(profileDir, { recursive: true });

  const chromeProc = exec(`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9233 --user-data-dir="${profileDir}" --window-size=1280,820 "http://localhost:3000?v=${Date.now()}"`);

  await new Promise(r => setTimeout(r, 2000));

  const getJson = () => new Promise((resolve, reject) => {
    http.get('http://localhost:9233/json', (res) => {
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

  ws.on('message', (data) => {
    const msg = JSON.parse(data);
    if (msg.method === 'Runtime.exceptionThrown') {
      console.error('JS EXCEPTION:', JSON.stringify(msg.params.exceptionDetails, null, 2));
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE:', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
    }
  });

  await new Promise(r => setTimeout(r, 3000));

  await send('Runtime.evaluate', {
    expression: `
      document.getElementById('guest-btn')?.click();
      document.getElementById('auth-modal')?.classList.add('hidden');
    `
  });

  await new Promise(r => setTimeout(r, 2500));

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

checkConsoleErrors().catch(console.error);

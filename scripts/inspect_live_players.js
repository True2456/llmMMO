/**
 * Inspect all players, entities, and bots on live cloud server wss://llmmmo.onrender.com
 */

import WebSocket from 'ws';

async function inspect() {
  console.log('Connecting to wss://llmmmo.onrender.com ...');
  const ws = new WebSocket('wss://llmmmo.onrender.com');

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      ws.close();
      reject(new Error('Timed out waiting for state'));
    }, 10000);

    ws.on('open', () => {
      console.log('Connected.');
    });

    ws.on('message', (data) => {
      const msg = JSON.parse(data);
      if (msg.type === 'WELCOME') {
        console.log('WELCOME packet:', msg);
      } else if (msg.type === 'TICK') {
        console.log('--- LIVE TICK STATE ---');
        console.log('Total Players online:', msg.players?.length);
        console.log('Players:');
        for (const p of (msg.players || [])) {
          console.log(`  - [ID: ${p.id}] "${p.username}" at (${p.x}, ${p.y}), isAgent: ${p.isAgent}, badge: ${p.badge}, action: ${p.actionState}`);
        }
        console.log('Nearby Beasts count:', msg.beasts?.length);
        console.log('Chat Log (last 5 messages):');
        for (const c of (msg.chatLog || []).slice(0, 5)) {
          console.log(`  [${c.timestamp || 'chat'}] ${c.sender}: ${c.message}`);
        }
        clearTimeout(timeout);
        ws.close();
        resolve();
      }
    });

    ws.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });

  process.exit(0);
}

inspect().catch(err => {
  console.error(err);
  process.exit(1);
});

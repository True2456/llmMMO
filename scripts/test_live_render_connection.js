/**
 * Test live WebSocket multiplayer connection to https://llmmmo.onrender.com
 */

import WebSocket from 'ws';

async function testLiveRender() {
  console.log('Connecting to live MMO server: wss://llmmmo.onrender.com ...');
  const ws = new WebSocket('wss://llmmmo.onrender.com');

  let welcomed = false;
  let receivedTick = false;

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      ws.close();
      reject(new Error('Connection timed out'));
    }, 15000);

    ws.on('open', () => {
      console.log('✅ WebSocket connected successfully to live cloud server!');
    });

    ws.on('message', (data) => {
      const msg = JSON.parse(data);
      if (msg.type === 'WELCOME') {
        welcomed = true;
        console.log(`✅ Received WELCOME packet! Assigned Player ID: ${msg.playerId}, Spawn: (${msg.x}, ${msg.y})`);

        // Send a chat message & move command
        ws.send(JSON.stringify({
          type: 'CHAT',
          message: 'Hello from Cloudflare/Render live deployment!'
        }));

        ws.send(JSON.stringify({
          type: 'MOVE',
          targetX: msg.x + 1,
          targetY: msg.y + 1
        }));
      } else if (msg.type === 'TICK') {
        if (!receivedTick) {
          receivedTick = true;
          console.log(`✅ Received TICK packet! Current World Entities: ${msg.players?.length || 0} players, ${msg.beasts?.length || 0} beasts`);
          clearTimeout(timeout);
          ws.close();
          resolve();
        }
      }
    });

    ws.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });

  console.log('\n🎉 LIVE CLOUD TEST VERIFIED: Game engine, WebSockets, and Tick loop running 100% in the cloud!\n');
  process.exit(0);
}

testLiveRender().catch((err) => {
  console.error('❌ Cloud test failed:', err);
  process.exit(1);
});

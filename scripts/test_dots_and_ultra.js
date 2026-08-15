import https from 'https';

const API_KEY = process.env.OPENROUTER_API_KEY || '';

async function testModel(modelName) {
  const start = Date.now();
  const payload = JSON.stringify({
    model: modelName,
    messages: [
      { role: 'system', content: 'You are a prehistoric miner in PRIMA MMO. Output JSON only: {"thought":"...","action":"GATHER","params":{"nodeId":"node_copper"}}' },
      { role: 'user', content: 'What resource are you gathering right now?' }
    ],
    max_tokens: 150
  });

  return new Promise((resolve) => {
    const req = https.request('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://prima-mmo.local',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const elapsed = Date.now() - start;
        console.log(`[${modelName}] Status: ${res.statusCode} | Latency: ${elapsed}ms`);
        console.log(`  Response: ${data.slice(0, 300)}...\n`);
        resolve({ model: modelName, status: res.statusCode, elapsed });
      });
    });

    req.on('error', (e) => {
      console.error(`[${modelName}] Error:`, e.message);
      resolve({ model: modelName, error: e.message });
    });
    req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('Testing Dots3-Note Preview (free) and Nemotron 3 Ultra (free)...\n');
  await testModel('dots-studio/dots-3-note-preview:free');
  await testModel('nvidia/nemotron-3-ultra-550b-a55b:free');
}

runTests();

import https from 'https';

const API_KEY = process.env.OPENROUTER_API_KEY || '';

async function testModel(modelName) {
  const start = Date.now();
  const payload = JSON.stringify({
    model: modelName,
    messages: [
      { role: 'system', content: 'You are a prehistoric hunter in PRIMA MMO. Output a JSON object: {"thought":"...","action":"ATTACK"}' },
      { role: 'user', content: 'You see a wild boar. What do you do?' }
    ],
    max_tokens: 120
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
  await testModel('nvidia/nemotron-3.5-lightning:free');
  await testModel('poolside/laguna-s-2.1:free');
  await testModel('poolside/laguna-xs-2.1:free');
}

runTests();

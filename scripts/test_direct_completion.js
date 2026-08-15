import https from 'https';

const API_KEY = process.env.OPENROUTER_API_KEY || '';

const payload = JSON.stringify({
  model: 'openrouter/free',
  messages: [
    { role: 'system', content: 'You are Gorak_The_Flint, a prehistoric flint knapper in the MMORPG PRIMA: Age of Bronze. Respond in 1 brief in-character sentence.' },
    { role: 'user', content: 'What are you doing today in the Ash-River Encampment?' }
  ],
  max_tokens: 100
});

const req = https.request('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'HTTP-Referer': 'https://prima-mmo.local',
    'X-Title': 'PRIMA: Age of Bronze MMORPG',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('RESPONSE:', data);
  });
});

req.on('error', console.error);
req.write(payload);
req.end();

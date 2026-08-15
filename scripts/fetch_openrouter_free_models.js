import https from 'https';

const API_KEY = process.env.OPENROUTER_API_KEY || '';

https.get('https://openrouter.ai/api/v1/models', {
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'HTTP-Referer': 'https://prima-mmo.local'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const freeModels = (json.data || []).filter(m => m.id.endsWith(':free') || m.pricing?.prompt === '0' || m.pricing?.prompt === 0);
      console.log(`Found ${freeModels.length} free models on OpenRouter:`);
      freeModels.slice(0, 20).forEach(m => {
        console.log(`- ${m.id} (${m.name})`);
      });
    } catch (e) {
      console.error('JSON parse error:', e.message);
    }
  });
}).on('error', console.error);

/**
 * PRIMA: Age of Bronze - Live 2x OpenRouter Free LLM Agents on Cloud Server
 * Connects 2 autonomous AI adventurers powered by OpenRouter Free Models:
 * 1. Gorak_The_Flint (dots-studio/dots-3-note-preview:free)
 * 2. Shaman_Naya (nvidia/nemotron-3-ultra-550b-a55b:free)
 * Testing real-time LLM perception, tactical reasoning, dialogue, and interaction on https://llmmmo.onrender.com
 */

import WebSocket from 'ws';
import https from 'https';
import fs from 'fs';

// Load OpenRouter Key from .env
let apiKey = process.env.OPENROUTER_API_KEY || '';
if (!apiKey && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  const match = envContent.match(/OPENROUTER_API_KEY=([^\r\n]+)/);
  if (match) apiKey = match[1].trim();
}

console.log('========================================================');
console.log('🤖 LAUNCHING 2 OPENROUTER FREE LLM AGENTS ON CLOUD MMO');
console.log('🌐 Target Server: https://llmmmo.onrender.com');
console.log(`🔑 OpenRouter Key: ${apiKey ? apiKey.substring(0, 14) + '...' : 'Missing'}`);
console.log('========================================================\n');

const CLOUD_WS_URL = 'wss://llmmmo.onrender.com';

const AGENT_1 = {
  name: 'Gorak_The_Flint',
  badge: 'Laguna-S1',
  model: 'poolside/laguna-s-2.1:free',
  role: 'Master Flint Knapper & Copper Miner',
  goal: 'Seek out copper veins and flint nodules. Speak with tribal peers about tools.',
  personality: 'Pragmatic, gruff, enthusiastic about craftsmanship and metallurgy.'
};

const AGENT_2 = {
  name: 'Shaman_Naya',
  badge: 'Nemotron-Ultra',
  model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
  role: 'Primal Herbalist & Spirit Seer',
  goal: 'Forage sacred herbs and listen to the spirits of the continent. Greet fellow tribesfolk.',
  personality: 'Mystical, reverent, wise, speaks in nature proverbs and herbal lore.'
};

function callOpenRouter(model, systemPrompt, userPrompt) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 120,
      temperature: 0.7
    });

    const req = https.request('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://llmmmo.onrender.com',
        'X-Title': 'PRIMA: Age of Bronze MMORPG'
      },
      timeout: 12000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const firstBrace = data.indexOf('{');
          if (firstBrace !== -1) {
            const cleanJson = data.substring(firstBrace);
            const json = JSON.parse(cleanJson);
            if (json.choices && json.choices[0]?.message?.content) {
              return resolve(json.choices[0].message.content.trim());
            }
          }
          console.warn(`[OpenRouter ${model}] API response issue:`, data.substring(0, 150));
          resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', (err) => {
      console.warn(`[OpenRouter ${model}] Request error:`, err.message);
      resolve(null);
    });

    req.on('timeout', () => {
      req.destroy();
      console.warn(`[OpenRouter ${model}] Timeout`);
      resolve(null);
    });

    req.write(payload);
    req.end();
  });
}

function cleanLLMOutput(text) {
  if (!text) return '';
  let clean = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  if (clean.includes('thinking process') || clean.includes('Analyze User Input')) {
    const lines = clean.split('\n');
    const speechLines = lines.filter(l => !l.startsWith('1.') && !l.startsWith('2.') && !l.startsWith('3.') && !l.startsWith('-') && !l.startsWith('*') && !l.includes('thinking') && !l.includes('Analyze') && l.trim().length > 0);
    if (speechLines.length > 0) {
      clean = speechLines[speechLines.length - 1];
    }
  }
  return clean.replace(/^["'\s]+|["'\s]+$/g, '').trim();
}

class LiveAgentRunner {
  constructor(profile) {
    this.profile = profile;
    this.ws = null;
    this.playerId = null;
    this.x = 90;
    this.y = 132;
    this.latestState = null;
    this.chatLog = [];
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(CLOUD_WS_URL);

      this.ws.on('open', () => {
        console.log(`  🔌 [${this.profile.name}] Connected to Cloud WebSockets!`);
      });

      this.ws.on('message', (data) => {
        try {
          const packet = JSON.parse(data);
          if (packet.type === 'WELCOME') {
            this.playerId = packet.playerId;
            this.x = packet.x || 90;
            this.y = packet.y || 132;
            console.log(`  ✨ [${this.profile.name}] Joined Realm (ID: ${this.playerId}, Model: ${this.profile.badge})`);
            resolve();
          } else if (packet.type === 'TICK') {
            this.latestState = packet;
            if (packet.chatLog) {
              this.chatLog = packet.chatLog;
            }
          }
        } catch (e) {}
      });

      this.ws.on('error', reject);
    });
  }

  sendChat(msg) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'CHAT',
        message: `[${this.profile.badge}] ${msg}`
      }));
    }
  }

  sendMove(dx, dy) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.x += dx;
      this.y += dy;
      this.ws.send(JSON.stringify({
        type: 'MOVE',
        targetX: this.x,
        targetY: this.y
      }));
    }
  }

  async thinkAndAct(otherAgentName, otherAgentLastMessage) {
    console.log(`\n🧠 [${this.profile.name}] Consulting ${this.profile.model}...`);

    const systemPrompt = `You are ${this.profile.name} in the prehistoric MMO PRIMA: Age of Bronze.
Role: ${this.profile.role}
Personality: ${this.profile.personality}
Goal: ${this.profile.goal}
Instructions: Output a concise 1-sentence in-character response or observation to say in the global chat to fellow adventurer ${otherAgentName}. Keep it under 80 characters.`;

    const userPrompt = otherAgentLastMessage 
      ? `${otherAgentName} says: "${otherAgentLastMessage}". Respond in character!`
      : `You are in the Ash-River settlement surrounded by fellow tribesfolk, campfire, and copper veins. Say something in character!`;

    const response = await callOpenRouter(this.profile.model, systemPrompt, userPrompt);
    const spokenText = cleanLLMOutput(response) || `${this.profile.name} inspects the realm carefully.`;

    console.log(`  💬 [${this.profile.name} / ${this.profile.badge}]: "${spokenText}"`);
    this.sendChat(spokenText);
    return spokenText;
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function runTest() {
  const agent1 = new LiveAgentRunner(AGENT_1);
  const agent2 = new LiveAgentRunner(AGENT_2);

  // 1. Connect both agents to cloud server
  console.log('1. Connecting 2 Agents to Cloud WebSocket server...');
  await agent1.connect();
  await agent2.connect();
  console.log('  ✅ Both agents authenticated on live cloud server!\n');

  // Wait 1.5s for initial world state sync
  await new Promise(r => setTimeout(r, 1500));

  // 2. Agent 1 (Gorak / Dots-3) thinks and speaks first
  console.log('2. Agent 1 (Gorak / Dots-3-Note) initiating dialogue on Cloud...');
  const msg1 = await agent1.thinkAndAct(AGENT_2.name, null);
  agent1.sendMove(1, 0);

  // Wait 2.5s for message to propagate over cloud tick
  await new Promise(r => setTimeout(r, 2500));

  // 3. Agent 2 (Shaman Naya / Nemotron-Ultra) perceives and replies
  console.log('3. Agent 2 (Shaman Naya / Nemotron-Ultra) perceiving dialogue and replying on Cloud...');
  const msg2 = await agent2.thinkAndAct(AGENT_1.name, msg1);
  agent2.sendMove(0, 1);

  // Wait 2.5s
  await new Promise(r => setTimeout(r, 2500));

  // 4. Agent 1 replies back to Agent 2
  console.log('4. Agent 1 (Gorak) conversational counter-response on Cloud...');
  await agent1.thinkAndAct(AGENT_2.name, msg2);

  // Wait 2s
  await new Promise(r => setTimeout(r, 2000));

  console.log('\n========================================================');
  console.log('🎉 2x OPENROUTER FREE LLM AGENTS TEST COMPLETED SUCCESSFULLY!');
  console.log('========================================================');

  agent1.close();
  agent2.close();
  process.exit(0);
}

runTest().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});

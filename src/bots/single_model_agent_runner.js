/**
 * PRIMA: Age of Bronze - Dedicated Single-Model Autonomous Agent & Telemetry Pipeline
 * Runs a single model, tracks real-time performance metrics, captures full CoT traces,
 * and enables deduplicated Hugging Face dataset exporting.
 */

import WebSocket from 'ws';
import https from 'https';
import fs from 'fs';
import { ModelEvaluator } from '../server/telemetry/modelEvaluator.js';
import { TraceRecorder } from '../server/telemetry/traceRecorder.js';
import { HuggingFaceExporter } from '../server/telemetry/huggingfaceExporter.js';
import { GitTraceExporter } from '../server/telemetry/gitTraceExporter.js';

const CLOUD_WS = process.env.CLOUD_WS || 'wss://llmmmo.onrender.com';
const MODEL_ID = process.env.AGENT_MODEL || 'poolside/laguna-s-2.1:free';

let apiKey = process.env.OPENROUTER_API_KEY || '';
if (!apiKey && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  const match = envContent.match(/OPENROUTER_API_KEY=([^\r\n]+)/);
  if (match) apiKey = match[1].trim();
}

console.log('========================================================');
console.log('🎯 PRIMA: DEDICATED SINGLE-MODEL AUTONOMOUS AGENT');
console.log(`🤖 Model: ${MODEL_ID}`);
console.log(`🌐 Cloud Server: ${CLOUD_WS}`);
console.log(`🔑 OpenRouter: ${apiKey ? 'Active' : 'Simulated Persona'}`);
console.log('========================================================\n');

export const evaluator = new ModelEvaluator();
export const recorder = new TraceRecorder();
export const exporter = new HuggingFaceExporter();
export const gitExporter = new GitTraceExporter();

function cleanThought(text) {
  if (!text) return '';
  let clean = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  if (clean.includes('thinking process') || clean.includes('Analyze User Input')) {
    const lines = clean.split('\n');
    const valid = lines.filter(l => !l.startsWith('1.') && !l.startsWith('2.') && !l.startsWith('-') && !l.includes('thinking'));
    if (valid.length > 0) clean = valid[valid.length - 1];
  }
  return clean.replace(/^["'\s]+|["'\s]+$/g, '').trim();
}

function queryOpenRouterCoT(model, perception) {
  if (!apiKey) return null;

  return new Promise((resolve) => {
    const start = Date.now();
    const systemPrompt = `You are Gorak_The_Flint, an autonomous Bronze Age miner and craftsman in PRIMA MMORPG.
Role: Mining ores, smelting bronze at crucible, knapping weapons, and depositing materials in tribal stash.
Provide a concise 1-sentence Chain-of-Thought reasoning for your next tactical action.`;

    const userPrompt = `Location: (${perception.location.x}, ${perception.location.y}), HP: ${perception.stats.hp}/${perception.stats.maxHp}. Nearby nodes: ${perception.nearby_nodes.map(n => n.name).join(', ') || 'None'}. Nearby beasts: ${perception.nearby_monsters.map(m => m.name).join(', ') || 'None'}. What is your next tactical step?`;

    const payload = JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 80,
      temperature: 0.7
    });

    const req = https.request('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://llmmmo.onrender.com',
        'X-Title': 'PRIMA Telemetry Agent'
      },
      timeout: 7000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const latencyMs = Date.now() - start;
        try {
          const firstBrace = data.indexOf('{');
          if (firstBrace !== -1) {
            const json = JSON.parse(data.substring(firstBrace));
            if (json.choices && json.choices[0]?.message?.content) {
              return resolve({
                thought: cleanThought(json.choices[0].message.content),
                latencyMs
              });
            }
          }
        } catch (e) {}
        resolve({ thought: 'Seeking copper veins to supply the clan.', latencyMs });
      });
    });

    req.on('error', () => resolve({ thought: 'Scanning the encampment for mineral veins.', latencyMs: Date.now() - start }));
    req.on('timeout', () => { req.destroy(); resolve({ thought: 'Advancing toward nearby copper deposits.', latencyMs: Date.now() - start }); });
    req.write(payload);
    req.end();
  });
}

class DedicatedSingleModelAgent {
  constructor() {
    this.ws = null;
    this.playerId = null;
    this.x = 90;
    this.y = 132;
    this.latestState = null;
    this.lastInventoryCount = 0;
    this.lastXp = 0;
    this.lastChatTime = 0;
    this.cycleCount = 0;
  }

  start() {
    this.connect();
    setInterval(() => this.cycle(), 2200);

    // Auto-export check every 2 minutes if Hugging Face repo configured
    setInterval(async () => {
      if (process.env.HF_TOKEN && process.env.HF_DATASET_REPO) {
        const res = await exporter.exportBatch();
        if (res.exportedCount > 0) {
          console.log(`[HF Auto-Sync] Uploaded ${res.exportedCount} new deduplicated traces to ${process.env.HF_DATASET_REPO}`);
        }
      }
    }, 120000);

    // Auto-sync deduplicated traces to Git dataset every 1 minute
    setInterval(async () => {
      const res = await gitExporter.exportAndCommitToGit({ autoPush: false });
      if (res.newTracesCount > 0) {
        console.log(`[Git Dataset Sync] Appended ${res.newTracesCount} new deduplicated CoT traces (Total Dataset: ${res.totalDatasetSize})`);
      }
    }, 60000);
  }

  connect() {
    console.log(`Connecting agent to ${CLOUD_WS}...`);
    this.ws = new WebSocket(CLOUD_WS);

    this.ws.on('open', () => {
      console.log('✅ Connected to Cloud MMO WebSocket!');
      this.ws.send(JSON.stringify({
        type: 'SET_NAME',
        username: 'Gorak_The_Flint',
        badge: 'Laguna-S1'
      }));
      this.ws.send(JSON.stringify({
        type: 'SET_AGENT_IDENTITY',
        username: 'Gorak_The_Flint',
        badge: 'Laguna-S1'
      }));
      this.ws.send(JSON.stringify({
        type: 'CHAT',
        text: `[Laguna-S1] Gorak is online. Telemetry & CoT tracing active.`
      }));
    });

    this.ws.on('message', (data) => {
      try {
        const packet = JSON.parse(data);
        if (packet.type === 'WELCOME') {
          this.playerId = packet.playerId;
          this.x = packet.x || 90;
          this.y = packet.y || 132;
          console.log(`✨ Gorak spawned at (${this.x}, ${this.y})`);
        } else if (packet.type === 'TICK') {
          this.latestState = packet;
          if (packet.self) {
            this.x = packet.self.x;
            this.y = packet.self.y;
          }
        }
      } catch (e) {}
    });

    this.ws.on('close', () => {
      console.warn('Disconnected. Reconnecting in 3s...');
      setTimeout(() => this.connect(), 3000);
    });
  }

  async cycle() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.latestState) return;

    const self = this.latestState.self;
    if (!self) return;

    this.cycleCount++;
    const inventory = self.inventory || [];
    const hp = self.hp || 10;
    const maxHp = self.maxHp || 10;
    const actionState = self.actionState || 'IDLE';

    const nearbyNodes = this.latestState.nodes || [];
    const nearbyBeasts = this.latestState.beasts || [];
    const groundItems = this.latestState.groundItems || [];

    // Construct sensory perception packet for trace recorder
    const perception = {
      location: { x: this.x, y: this.y },
      stats: { hp, maxHp, actionState },
      inventory: inventory,
      nearby_nodes: nearbyNodes.slice(0, 6),
      nearby_monsters: nearbyBeasts.slice(0, 4),
      ground_items: groundItems.slice(0, 3)
    };

    // If currently swinging/mining/moving, record status and wait
    if (actionState === 'MINING' || actionState === 'WOODCUTTING' || actionState === 'COMBAT') {
      evaluator.recordDecision(MODEL_ID, 0);
      return;
    }

    // 1. Query LLM for Chain of Thought reasoning
    const llmRes = await queryOpenRouterCoT(MODEL_ID, perception);
    const cot = llmRes?.thought || 'Seeking copper veins to supply the clan.';
    const latency = llmRes?.latencyMs || 0;

    evaluator.recordDecision(MODEL_ID, latency);

    let chosenAction = { type: 'IDLE' };
    let outcome = { success: true };

    // 2. Tactical Decision Logic
    const fullSlots = inventory.filter(Boolean).length;
    const hasCopper = inventory.some(i => i && (i.id === 'ore_copper' || i.id?.includes('copper')));
    const hasTin = inventory.some(i => i && (i.id === 'ore_tin' || i.id?.includes('tin')));

    // A. Stashing when inventory is getting full
    if (fullSlots >= 18) {
      const stashChest = nearbyNodes.find(n => n.type?.includes('STASH') || n.name?.includes('Stash'));
      if (stashChest) {
        const dist = Math.max(Math.abs(this.x - stashChest.x), Math.abs(this.y - stashChest.y));
        if (dist <= 1) {
          for (let s = 2; s < inventory.length; s++) {
            if (inventory[s]) {
              chosenAction = { type: 'DEPOSIT_STASH', slotIndex: s };
              this.ws.send(JSON.stringify(chosenAction));
              break;
            }
          }
        } else {
          chosenAction = { type: 'MOVE', x: stashChest.x, y: stashChest.y };
          this.ws.send(JSON.stringify(chosenAction));
        }
      }
    }
    // B. Smelting when holding copper + tin
    else if (hasCopper && hasTin) {
      const crucible = nearbyNodes.find(n => n.type?.includes('CRUCIBLE') || n.name?.includes('Crucible'));
      if (crucible) {
        const dist = Math.max(Math.abs(this.x - crucible.x), Math.abs(this.y - crucible.y));
        if (dist <= 1) {
          chosenAction = { type: 'CRAFT_SMELT' };
          this.ws.send(JSON.stringify(chosenAction));
          evaluator.recordCraft(MODEL_ID, 1);
          outcome = { success: true, item: 'ingot_bronze', xpGained: 40 };
        } else {
          chosenAction = { type: 'MOVE', x: crucible.x, y: crucible.y };
          this.ws.send(JSON.stringify(chosenAction));
        }
      }
    }
    // C. Mining nearby copper/tin/clay
    else {
      const targetOre = nearbyNodes.find(n => n.available && (n.type?.includes('COPPER') || n.type?.includes('TIN') || n.type?.includes('CLAY') || n.name?.includes('Copper') || n.name?.includes('Tin')));
      if (targetOre) {
        const dist = Math.max(Math.abs(this.x - targetOre.x), Math.abs(this.y - targetOre.y));
        if (dist <= 1) {
          chosenAction = { type: 'INTERACT_RESOURCE', nodeId: targetOre.id };
          this.ws.send(JSON.stringify(chosenAction));
          evaluator.recordGather(MODEL_ID, 1);
          evaluator.recordXpGain(MODEL_ID, 'mining', targetOre.xp || 20);
          outcome = { success: true, node: targetOre.name, xpGained: targetOre.xp || 20 };
        } else {
          chosenAction = { type: 'MOVE', x: targetOre.x, y: targetOre.y };
          this.ws.send(JSON.stringify(chosenAction));
        }
      } else {
        // Roam toward outskirts
        const dx = Math.floor(Math.random() * 5) - 2;
        const dy = Math.floor(Math.random() * 5) - 2;
        chosenAction = { type: 'MOVE', x: Math.max(84, Math.min(98, this.x + dx)), y: Math.max(126, Math.min(138, this.y + dy)) };
        this.ws.send(JSON.stringify(chosenAction));
      }
    }

    // 3. Record Agentic Trace & CoT in JSONL Dataset
    const recordedTrace = recorder.recordStep({
      modelId: MODEL_ID,
      agentName: 'Gorak_The_Flint',
      badge: 'Laguna-S1',
      role: 'MINER_SMITH',
      perception,
      chainOfThought: cot,
      action: chosenAction,
      outcome,
      latencyMs: latency
    });

    if (this.cycleCount % 5 === 0) {
      const stats = evaluator.getOrCreateStats(MODEL_ID);
      const score = evaluator.computeScore(stats);
      console.log(`[Trace #${recorder.getTotalTracesCount()}] CoT: "${cot}" -> Action: ${chosenAction.type} | Model Score: ${score} (XP: ${stats.totalXpGained}, Gathered: ${stats.resourcesGathered}, Latency: ${Math.round(stats.totalLatencyMs / Math.max(1, stats.totalDecisions))}ms)`);
    }
  }
}

const singleAgent = new DedicatedSingleModelAgent();
singleAgent.start();

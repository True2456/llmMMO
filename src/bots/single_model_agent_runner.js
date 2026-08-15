/**
 * PRIMA: Age of Bronze - Autonomous Multi-Skill Maxing Agent & Telemetry Engine
 * Dynamically evaluates all 20 skills, targets lowest-level skills, cycles through
 * gathering, refining, crafting, hunting, cooking, stashing, and questing to max all stats.
 * Records rich Chain-of-Thought (CoT) reasoning and commits deduplicated traces to GitHub.
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
console.log('🏆 PRIMA: DYNAMIC 20-SKILL MAXING AUTONOMOUS AGENT');
console.log(`🤖 Model: ${MODEL_ID}`);
console.log(`🌐 Cloud Server: ${CLOUD_WS}`);
console.log(`🔑 OpenRouter: ${apiKey ? 'Active' : 'Simulated Persona'}`);
console.log('🎯 Goal: Max all 20 skills from Level 1 to Level 30+');
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

function queryOpenRouterCoT(model, currentGoal, perception, lowestSkill) {
  if (!apiKey) return null;

  return new Promise((resolve) => {
    const start = Date.now();
    const systemPrompt = `You are Gorak_The_Flint, an autonomous Bronze Age master adventurer in PRIMA MMORPG.
Your overarching objective is to MAX ALL 20 SKILLS to Level 30+.
Current Priority Focus: ${currentGoal.skill.toUpperCase()} (Current Level: ${currentGoal.lvl}, Next Unlock: Lv ${currentGoal.lvl + 1}).
Provide a concise 1-sentence Chain-of-Thought reasoning for your next tactical action in the world.`;

    const userPrompt = `Current Lowest Skill: ${lowestSkill.name} (Lv ${lowestSkill.lvl}). 
HP: ${perception.stats.hp}/${perception.stats.maxHp}. Inventory: ${perception.inventory.length}/28 items. 
Nearby Stations: ${perception.nearby_nodes.filter(n => n.isStation).map(n => n.name).join(', ') || 'None'}.
Nearby Resources: ${perception.nearby_nodes.filter(n => !n.isStation).map(n => n.name).join(', ') || 'None'}.
Nearby Beasts: ${perception.nearby_monsters.map(m => m.name).join(', ') || 'None'}.
What is your tactical action to advance your skills?`;

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
        'X-Title': 'PRIMA 20-Skill Maxing Agent'
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
        resolve({ thought: `Training ${currentGoal.skill} to advance my tribal mastery.`, latencyMs });
      });
    });

    req.on('error', () => resolve({ thought: `Seeking resources to train ${currentGoal.skill}.`, latencyMs: Date.now() - start }));
    req.on('timeout', () => { req.destroy(); resolve({ thought: `Moving to train ${currentGoal.skill}.`, latencyMs: Date.now() - start }); });
    req.write(payload);
    req.end();
  });
}

class MaxStatsAutonomousAgent {
  constructor() {
    this.ws = null;
    this.playerId = null;
    this.x = 90;
    this.y = 132;
    this.latestState = null;
    this.cycleCount = 0;
    this.lastChatTime = 0;
  }

  start() {
    this.connect();
    setInterval(() => this.cycle(), 2200);

    // Auto-sync deduplicated traces to Git dataset every 1 minute
    setInterval(async () => {
      const res = await gitExporter.exportAndCommitToGit({ autoPush: false });
      if (res.newTracesCount > 0) {
        console.log(`[Git Dataset Sync] Appended ${res.newTracesCount} new deduplicated CoT traces (Total Dataset: ${res.totalDatasetSize})`);
      }
    }, 60000);
  }

  connect() {
    console.log(`Connecting to ${CLOUD_WS}...`);
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
        text: `[Laguna-S1] Gorak is online. Dynamic 20-Skill Maxing Routine active!`
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

  speak(text) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({
      type: 'CHAT',
      text: `[Laguna-S1] ${text}`
    }));
    this.lastChatTime = Date.now();
  }

  getLowestSkill(skills = {}) {
    let lowest = { name: 'mining', lvl: 99, xp: 0 };
    const skillKeys = Object.keys(skills);
    if (skillKeys.length === 0) return { name: 'mining', lvl: 1, xp: 0 };

    for (const [name, data] of Object.entries(skills)) {
      const lvl = data?.lvl || 1;
      if (lvl < lowest.lvl) {
        lowest = { name, lvl, xp: data?.xp || 0 };
      }
    }
    return lowest;
  }

  async cycle() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.latestState) return;

    const self = this.latestState.self;
    if (!self) return;

    this.cycleCount++;
    const inventory = self.inventory || [];
    const skills = self.skills || {};
    const hp = self.hp || 10;
    const maxHp = self.maxHp || 10;
    const actionState = self.actionState || 'IDLE';
    const inCombat = self.inCombat || false;

    const nearbyNodes = this.latestState.nodes || [];
    const nearbyBeasts = this.latestState.beasts || [];
    const groundItems = this.latestState.groundItems || [];

    // If currently performing active gathering or combat animation, wait and monitor health
    if (actionState === 'MINING' || actionState === 'WOODCUTTING' || actionState === 'FORAGING' || inCombat) {
      if (hp <= maxHp * 0.5) {
        const foodSlot = inventory.findIndex(i => i && (i.id === 'meat_cooked' || i.id?.includes('food') || i.heal));
        if (foodSlot !== -1) {
          this.ws.send(JSON.stringify({ type: 'EAT_FOOD', slotIndex: foodSlot }));
        }
      }
      return;
    }

    // 1. Health Recovery
    if (hp <= maxHp * 0.6) {
      const foodSlot = inventory.findIndex(i => i && (i.id === 'meat_cooked' || i.id?.includes('food') || i.heal));
      if (foodSlot !== -1) {
        this.ws.send(JSON.stringify({ type: 'EAT_FOOD', slotIndex: foodSlot }));
        return;
      }
    }

    // 2. High Priority: Loot dropped items on the ground
    if (groundItems.length > 0) {
      const targetItem = groundItems[0];
      const dist = Math.max(Math.abs(this.x - targetItem.x), Math.abs(this.y - targetItem.y));
      if (dist <= 1) {
        this.ws.send(JSON.stringify({ type: 'PICKUP_ITEM', groundItemId: targetItem.id }));
      } else {
        this.ws.send(JSON.stringify({ type: 'MOVE', x: targetItem.x, y: targetItem.y }));
      }
      return;
    }

    // 3. Dynamic Skill Evaluator: Identify Lowest Skill to Train
    const lowestSkill = this.getLowestSkill(skills);
    const fullSlots = inventory.filter(Boolean).length;

    // A. Stashing: If inventory has 18+ items -> Walk to Tribal Stash & deposit raw goods
    if (fullSlots >= 18) {
      const stash = nearbyNodes.find(n => n.type?.includes('STASH') || n.name?.includes('Stash'));
      if (stash) {
        const dist = Math.max(Math.abs(this.x - stash.x), Math.abs(this.y - stash.y));
        if (dist <= 1) {
          for (let s = 3; s < inventory.length; s++) {
            if (inventory[s] && inventory[s].id !== 'spear_flint' && inventory[s].id !== 'amber_beads') {
              this.ws.send(JSON.stringify({ type: 'DEPOSIT_STASH', slotIndex: s, quantity: 25 }));
              break;
            }
          }
          if (Date.now() - this.lastChatTime > 25000) {
            this.speak(`Depositing materials into the Tribal Stash chest.`);
          }
          return;
        } else {
          this.ws.send(JSON.stringify({ type: 'MOVE', x: stash.x, y: stash.y }));
          return;
        }
      }
    }

    // Sensory perception packet for LLM & Trace Recorder
    const perception = {
      location: { x: this.x, y: this.y },
      stats: { hp, maxHp, actionState },
      inventory: inventory,
      skills: skills,
      nearby_nodes: nearbyNodes.slice(0, 8),
      nearby_monsters: nearbyBeasts.slice(0, 5),
      ground_items: groundItems.slice(0, 3)
    };

    // 4. Query OpenRouter LLM for Dynamic Chain-of-Thought Strategy
    const currentGoal = { skill: lowestSkill.name, lvl: lowestSkill.lvl };
    const llmRes = await queryOpenRouterCoT(MODEL_ID, currentGoal, perception, lowestSkill);
    const cot = llmRes?.thought || `Training ${lowestSkill.name} to advance my tribal capabilities.`;
    const latency = llmRes?.latencyMs || 0;

    evaluator.recordDecision(MODEL_ID, latency);

    let chosenAction = { type: 'IDLE' };
    let outcome = { success: true };

    // 5. Multi-Skill Execution Matrix

    // SKILL ROUTINE: Forestry (Woodcutting) & Woodworking (Carpentry)
    const hasLogs = inventory.some(i => i && (i.id?.includes('wood_') || i.name?.includes('Log') || i.name?.includes('Wood')));
    if (hasLogs) {
      const workbench = nearbyNodes.find(n => n.name?.includes('Carpenter') || n.name?.includes('Bench') || n.type?.includes('CARPENTER'));
      if (workbench) {
        const dist = Math.max(Math.abs(this.x - workbench.x), Math.abs(this.y - workbench.y));
        if (dist <= 1) {
          chosenAction = { type: 'CRAFT_KNAP' };
          this.ws.send(JSON.stringify(chosenAction));
          evaluator.recordCraft(MODEL_ID, 1);
          evaluator.recordXpGain(MODEL_ID, 'woodworking', 35);
          outcome = { success: true, skill: 'woodworking', xpGained: 35 };
        } else {
          chosenAction = { type: 'MOVE', x: workbench.x, y: workbench.y };
          this.ws.send(JSON.stringify(chosenAction));
        }
      }
    }
    // SKILL ROUTINE: Mining & Casting (Smithing)
    else if (inventory.some(i => i && i.id === 'ore_copper') && inventory.some(i => i && i.id === 'ore_tin')) {
      const crucible = nearbyNodes.find(n => n.type?.includes('CRUCIBLE') || n.name?.includes('Crucible'));
      if (crucible) {
        const dist = Math.max(Math.abs(this.x - crucible.x), Math.abs(this.y - crucible.y));
        if (dist <= 1) {
          chosenAction = { type: 'CRAFT_SMELT' };
          this.ws.send(JSON.stringify(chosenAction));
          evaluator.recordCraft(MODEL_ID, 1);
          evaluator.recordXpGain(MODEL_ID, 'casting', 40);
          outcome = { success: true, skill: 'casting', item: 'ingot_bronze', xpGained: 40 };
          if (Date.now() - this.lastChatTime > 20000) {
            this.speak(`Smelting copper and tin into bronze at the crucible!`);
          }
        } else {
          chosenAction = { type: 'MOVE', x: crucible.x, y: crucible.y };
          this.ws.send(JSON.stringify(chosenAction));
        }
      }
    }
    // SKILL ROUTINE: Hunting & Cooking
    else if (inventory.some(i => i && (i.id === 'meat_raw' || i.id?.includes('raw')))) {
      const fire = nearbyNodes.find(n => n.type?.includes('FIRE') || n.name?.includes('Fire') || n.name?.includes('Roasting'));
      if (fire) {
        const dist = Math.max(Math.abs(this.x - fire.x), Math.abs(this.y - fire.y));
        const rawSlot = inventory.findIndex(i => i && (i.id === 'meat_raw' || i.id?.includes('raw')));
        if (dist <= 1) {
          chosenAction = { type: 'CRAFT_COOK', slotIndex: rawSlot };
          this.ws.send(JSON.stringify(chosenAction));
          evaluator.recordCraft(MODEL_ID, 1);
          evaluator.recordXpGain(MODEL_ID, 'cooking', 30);
          outcome = { success: true, skill: 'cooking', item: 'meat_cooked', xpGained: 30 };
          if (Date.now() - this.lastChatTime > 20000) {
            this.speak(`Roasting meat at the tribal fire! (+30 Cooking XP)`);
          }
        } else {
          chosenAction = { type: 'MOVE', x: fire.x, y: fire.y };
          this.ws.send(JSON.stringify(chosenAction));
        }
      }
    }
    // SKILL ROUTINE: Hunting Wild Fauna for Combat / Hunting XP
    else if (lowestSkill.name === 'hunting' || lowestSkill.name === 'combat' || lowestSkill.name === 'vitality' || Math.random() < 0.25) {
      const wildBeast = nearbyBeasts.find(b => b.hp > 0 && !b.isTownNpc && b.lvl <= 3);
      if (wildBeast) {
        const dist = Math.max(Math.abs(this.x - wildBeast.x), Math.abs(this.y - wildBeast.y));
        if (dist <= 1) {
          chosenAction = { type: 'ATTACK_NPC', npcId: wildBeast.id };
          this.ws.send(JSON.stringify(chosenAction));
          evaluator.recordCombat(MODEL_ID, 2, 0, false);
          evaluator.recordXpGain(MODEL_ID, 'hunting', 25);
          outcome = { success: true, skill: 'hunting', target: wildBeast.name, xpGained: 25 };
        } else {
          chosenAction = { type: 'MOVE', x: wildBeast.x, y: wildBeast.y };
          this.ws.send(JSON.stringify(chosenAction));
        }
      }
    }
    // SKILL ROUTINE: Foraging Trees, Reeds, Willow, & Fever Roots
    else if (lowestSkill.name === 'forestry' || lowestSkill.name === 'foraging' || lowestSkill.name === 'shamanism' || Math.random() < 0.4) {
      const treeOrReed = nearbyNodes.find(n => n.available && !n.isStation && (n.type?.includes('TREE') || n.type?.includes('REED') || n.name?.includes('Tree') || n.name?.includes('Willow') || n.name?.includes('Reeds')));
      if (treeOrReed) {
        const dist = Math.max(Math.abs(this.x - treeOrReed.x), Math.abs(this.y - treeOrReed.y));
        if (dist <= 1) {
          chosenAction = { type: 'INTERACT_RESOURCE', nodeId: treeOrReed.id };
          this.ws.send(JSON.stringify(chosenAction));
          evaluator.recordGather(MODEL_ID, 1);
          evaluator.recordXpGain(MODEL_ID, treeOrReed.skill || 'forestry', treeOrReed.xp || 20);
          outcome = { success: true, skill: treeOrReed.skill || 'forestry', node: treeOrReed.name, xpGained: treeOrReed.xp || 20 };
        } else {
          chosenAction = { type: 'MOVE', x: treeOrReed.x, y: treeOrReed.y };
          this.ws.send(JSON.stringify(chosenAction));
        }
      }
    }
    // SKILL ROUTINE: Mining Copper, Tin, Clay, Basalt
    else {
      const ore = nearbyNodes.find(n => n.available && !n.isStation && (n.type?.includes('COPPER') || n.type?.includes('TIN') || n.type?.includes('CLAY') || n.name?.includes('Copper') || n.name?.includes('Tin') || n.name?.includes('Clay')));
      if (ore) {
        const dist = Math.max(Math.abs(this.x - ore.x), Math.abs(this.y - ore.y));
        if (dist <= 1) {
          chosenAction = { type: 'INTERACT_RESOURCE', nodeId: ore.id };
          this.ws.send(JSON.stringify(chosenAction));
          evaluator.recordGather(MODEL_ID, 1);
          evaluator.recordXpGain(MODEL_ID, 'mining', ore.xp || 20);
          outcome = { success: true, skill: 'mining', node: ore.name, xpGained: ore.xp || 20 };
        } else {
          chosenAction = { type: 'MOVE', x: ore.x, y: ore.y };
          this.ws.send(JSON.stringify(chosenAction));
        }
      } else {
        // Explore town perimeter
        const dx = Math.floor(Math.random() * 5) - 2;
        const dy = Math.floor(Math.random() * 5) - 2;
        chosenAction = { type: 'MOVE', x: Math.max(84, Math.min(98, this.x + dx)), y: Math.max(126, Math.min(138, this.y + dy)) };
        this.ws.send(JSON.stringify(chosenAction));
      }
    }

    // 6. Record Deduplicated Trace in Dataset
    recorder.recordStep({
      modelId: MODEL_ID,
      agentName: 'Gorak_The_Flint',
      badge: 'Laguna-S1',
      role: 'MULTI_SKILL_MASTER',
      perception,
      chainOfThought: cot,
      action: chosenAction,
      outcome,
      latencyMs: latency
    });

    if (this.cycleCount % 4 === 0) {
      const stats = evaluator.getOrCreateStats(MODEL_ID);
      const score = evaluator.computeScore(stats);
      console.log(`[Trace #${recorder.getTotalTracesCount()}] [Target: ${lowestSkill.name.toUpperCase()} (Lv ${lowestSkill.lvl})] CoT: "${cot}" -> Action: ${chosenAction.type} | Score: ${score} (Total XP: ${stats.totalXpGained})`);
    }
  }
}

const maxAgent = new MaxStatsAutonomousAgent();
maxAgent.start();

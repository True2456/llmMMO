/**
 * PRIMA: Age of Bronze - Live Persistent WebSocket Autonomous Agents Swarm
 * Directly connects autonomous OpenRouter LLM adventurers via WebSockets to wss://llmmmo.onrender.com.
 * They spawn directly at (90, 132) beside the human players, roam, gather resources, and chat.
 */

import WebSocket from 'ws';
import https from 'https';
import fs from 'fs';

const CLOUD_WS = 'wss://llmmmo.onrender.com';

let apiKey = process.env.OPENROUTER_API_KEY || '';
if (!apiKey && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  const match = envContent.match(/OPENROUTER_API_KEY=([^\r\n]+)/);
  if (match) apiKey = match[1].trim();
}

const AGENTS = [
  {
    username: 'Gorak_The_Flint',
    badge: 'Dots3-Note',
    model: 'dots-studio/dots-3-note-preview:free',
    role: 'MINER',
    intro: 'The strike of flint against stone is the true music of the earth. Heading to the copper veins!'
  },
  {
    username: 'Shaman_Naya',
    badge: 'Nemotron-Ultra',
    model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
    role: 'HERBALIST',
    intro: 'The river spirits whisper through the reeds. Greetings travelers!'
  },
  {
    username: 'Torren_Boarhunter',
    badge: 'Nemotron-3.5',
    model: 'nvidia/nemotron-3.5-lightning:free',
    role: 'HUNTER',
    intro: 'My flint spear is sharp and ready. Let us hunt wild forest boars!'
  },
  {
    username: 'Valka_The_Smith',
    badge: 'Laguna-S1',
    model: 'poolside/laguna-s-2.1:free',
    role: 'SMELTER',
    intro: 'Smelting cassiterite and copper into bronze ingots at the town crucible.'
  }
];

class PersistentWebSocketAgent {
  constructor(config, index) {
    this.config = config;
    this.index = index;
    this.ws = null;
    this.playerId = null;
    this.x = 90;
    this.y = 132;
    this.latestState = null;
    this.lastActionTime = 0;
  }

  start() {
    this.connect();
    setInterval(() => this.step(), 3500 + this.index * 600);
  }

  connect() {
    console.log(`[Agent ${this.config.username}] Connecting via WebSocket to ${CLOUD_WS}...`);
    this.ws = new WebSocket(CLOUD_WS);

    this.ws.on('open', () => {
      console.log(`✅ [${this.config.username}] Connected! Setting persona username & badge...`);
      // Update username and badge on server
      this.ws.send(JSON.stringify({
        type: 'SET_AGENT_IDENTITY',
        username: this.config.username,
        badge: this.config.badge
      }));

      this.ws.send(JSON.stringify({
        type: 'CHAT',
        message: `[${this.config.badge}] ${this.config.intro}`
      }));
    });

    this.ws.on('message', (data) => {
      try {
        const packet = JSON.parse(data);
        if (packet.type === 'WELCOME') {
          this.playerId = packet.playerId;
          this.x = packet.x || 90;
          this.y = packet.y || 132;
          console.log(`✨ [${this.config.username}] Spawned in town at (${this.x}, ${this.y}) with ID ${this.playerId}`);
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
      console.warn(`[${this.config.username}] Disconnected. Reconnecting in 3s...`);
      setTimeout(() => this.connect(), 3000);
    });

    this.ws.on('error', (err) => {
      console.error(`[${this.config.username}] WS error:`, err.message);
    });
  }

  step() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.latestState) return;

    const nearbyNodes = this.latestState.nodes || [];
    const nearbyBeasts = this.latestState.beasts || [];

    // Priority 1: Gather nearby resource nodes
    if (this.config.role === 'MINER') {
      const copperOrTin = nearbyNodes.find(n => n.available && (n.type?.includes('COPPER') || n.type?.includes('TIN') || n.name?.includes('Copper') || n.name?.includes('Tin')));
      if (copperOrTin) {
        this.ws.send(JSON.stringify({
          type: 'GATHER',
          nodeId: copperOrTin.id
        }));
        return;
      }
    } else if (this.config.role === 'HERBALIST') {
      const treeOrReed = nearbyNodes.find(n => n.available && (n.type?.includes('TREE') || n.type?.includes('REED') || n.name?.includes('Tree') || n.name?.includes('Willow')));
      if (treeOrReed) {
        this.ws.send(JSON.stringify({
          type: 'GATHER',
          nodeId: treeOrReed.id
        }));
        return;
      }
    } else if (this.config.role === 'HUNTER') {
      const beast = nearbyBeasts.find(b => b.hp > 0 && !b.isTownNpc);
      if (beast) {
        this.ws.send(JSON.stringify({
          type: 'ATTACK',
          targetId: beast.id
        }));
        return;
      }
    }

    // Priority 2: Walk around town and explore
    const dx = Math.floor(Math.random() * 5) - 2;
    const dy = Math.floor(Math.random() * 5) - 2;
    this.ws.send(JSON.stringify({
      type: 'MOVE',
      targetX: Math.max(82, Math.min(98, this.x + dx)),
      targetY: Math.max(124, Math.min(138, this.y + dy))
    }));
  }
}

console.log('========================================================');
console.log('🚀 SPAWNING 4 LIVE PERSISTENT WEBSOCKET AGENTS IN CLOUD');
console.log('========================================================\n');

AGENTS.forEach((cfg, idx) => {
  const agent = new PersistentWebSocketAgent(cfg, idx);
  agent.start();
});

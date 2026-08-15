/**
 * PRIMA: Age of Bronze - Live Autonomous MMORPG Human-Like Players
 * Implements complete full-cycle player behaviors:
 * - Gathering specific resources (Ores, Trees, Reeds, Clay)
 * - Hunting beasts (Boars, Foxes, Hares) & Looting dropped ground items
 * - Walking to town stations (Crucible, Roasting Fire, Knapping Bench, Stash Chest)
 * - Cooking raw meat at campfire, Smelting bronze at crucible, Knapping tools
 * - Equipping crafted gear & eating food when low HP
 * - Depositing excess items into the 50-slot Tribal Stash
 * - Conversing dynamically with players & town elders
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

function callOpenRouterThought(model, systemPrompt, userPrompt) {
  if (!apiKey) return null;
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 60,
      temperature: 0.7
    });

    const req = https.request('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://llmmmo.onrender.com',
        'X-Title': 'PRIMA MMORPG'
      },
      timeout: 6000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const firstBrace = data.indexOf('{');
          if (firstBrace !== -1) {
            const json = JSON.parse(data.substring(firstBrace));
            if (json.choices && json.choices[0]?.message?.content) {
              return resolve(json.choices[0].message.content.trim());
            }
          }
        } catch (e) {}
        resolve(null);
      });
    });

    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.write(payload);
    req.end();
  });
}

const AGENTS = [
  {
    username: 'Gorak_The_Flint',
    badge: 'Dots3-Note',
    model: 'dots-studio/dots-3-note-preview:free',
    role: 'MINER_SMITH',
    intro: 'Heading to the copper rocks and tin veins. Will smelt bronze at the crucible!'
  },
  {
    username: 'Torren_Boarhunter',
    badge: 'Nemotron-3.5',
    model: 'nvidia/nemotron-3.5-lightning:free',
    role: 'HUNTER_COOK',
    intro: 'Tracking wild boars in the savanna. Roasting meat at the tribal fire!'
  },
  {
    username: 'Shaman_Naya',
    badge: 'Nemotron-Ultra',
    model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
    role: 'FORAGER_ALCHEMIST',
    intro: 'Foraging reeds and gathering willow bark to brew herbal salves.'
  },
  {
    username: 'Valka_The_Smith',
    badge: 'Laguna-S1',
    model: 'poolside/laguna-s-2.1:free',
    role: 'ARTISAN_TRADER',
    intro: 'Refining alloys and crafting chieftain spears at the knapping bench.'
  }
];

class FullCyclePlayerBot {
  constructor(config, index) {
    this.config = config;
    this.index = index;
    this.ws = null;
    this.playerId = null;
    this.x = 90;
    this.y = 132;
    this.latestState = null;
    this.lastChatTime = 0;
    this.currentGoal = 'GATHERING';
    this.actionCooldown = 0;
  }

  start() {
    this.connect();
    setInterval(() => this.tickLoop(), 1200 + this.index * 300);
  }

  connect() {
    console.log(`[Bot ${this.config.username}] Connecting to ${CLOUD_WS}...`);
    this.ws = new WebSocket(CLOUD_WS);

    this.ws.on('open', () => {
      console.log(`✅ [${this.config.username}] Connected! Setting name & badge...`);
      this.ws.send(JSON.stringify({
        type: 'SET_NAME',
        username: this.config.username,
        badge: this.config.badge
      }));
      this.ws.send(JSON.stringify({
        type: 'SET_AGENT_IDENTITY',
        username: this.config.username,
        badge: this.config.badge
      }));
      this.ws.send(JSON.stringify({
        type: 'CHAT',
        text: `[${this.config.badge}] ${this.config.intro}`
      }));
    });

    this.ws.on('message', (data) => {
      try {
        const packet = JSON.parse(data);
        if (packet.type === 'WELCOME') {
          this.playerId = packet.playerId;
          this.x = packet.x || 90;
          this.y = packet.y || 132;
          console.log(`✨ [${this.config.username}] Spawned in town at (${this.x}, ${this.y})`);
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

  speak(msg) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({
      type: 'CHAT',
      text: `[${this.config.badge}] ${msg}`
    }));
    this.lastChatTime = Date.now();
  }

  async tickLoop() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.latestState) return;

    const self = this.latestState.self;
    if (!self) return;

    const inventory = self.inventory || [];
    const hp = self.hp || 10;
    const maxHp = self.maxHp || 10;
    const actionState = self.actionState || 'IDLE';
    const inCombat = self.inCombat || false;

    const nearbyNodes = this.latestState.nodes || [];
    const nearbyBeasts = this.latestState.beasts || [];
    const groundItems = this.latestState.groundItems || [];

    // If currently performing an active gathering/combat animation or moving, let action proceed
    if (actionState === 'MINING' || actionState === 'WOODCUTTING' || actionState === 'FORAGING' || inCombat) {
      // If low HP during combat, eat food immediately!
      if (hp <= maxHp * 0.5) {
        const foodSlot = inventory.findIndex(i => i && (i.id === 'meat_cooked' || i.id === 'bread_flatbread' || i.id.includes('food') || i.heal));
        if (foodSlot !== -1) {
          this.ws.send(JSON.stringify({ type: 'EAT_FOOD', slotIndex: foodSlot }));
        }
      }
      return;
    }

    // 1. Health Recovery: Eat food if hurt
    if (hp <= maxHp * 0.6) {
      const foodSlot = inventory.findIndex(i => i && (i.id === 'meat_cooked' || i.id === 'bread_flatbread' || i.id.includes('food') || i.heal));
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

    // 3. Stashing: If inventory has 18+ items, walk to Tribal Stash Chest & deposit raw materials
    const fullSlots = inventory.filter(Boolean).length;
    if (fullSlots >= 18) {
      const stashChest = nearbyNodes.find(n => n.type?.includes('STASH') || n.name?.includes('Stash'));
      if (stashChest) {
        const dist = Math.max(Math.abs(this.x - stashChest.x), Math.abs(this.y - stashChest.y));
        if (dist <= 1) {
          // Deposit items from slot 3 to 27
          for (let slot = 3; slot < inventory.length; slot++) {
            if (inventory[slot] && inventory[slot].id !== 'spear_flint' && inventory[slot].id !== 'amber_beads') {
              this.ws.send(JSON.stringify({ type: 'DEPOSIT_STASH', slotIndex: slot, quantity: 25 }));
              break;
            }
          }
          if (Date.now() - this.lastChatTime > 25000) {
            this.speak(`Deposited harvested goods into the Tribal Stash chest.`);
          }
          return;
        } else {
          this.ws.send(JSON.stringify({ type: 'MOVE', x: stashChest.x, y: stashChest.y }));
          return;
        }
      }
    }

    // 4. Role-Specific Intelligent Game Cycles
    switch (this.config.role) {
      case 'MINER_SMITH': {
        const hasCopper = inventory.some(i => i && (i.id === 'ore_copper' || i.id?.includes('copper')));
        const hasTin = inventory.some(i => i && (i.id === 'ore_tin' || i.id?.includes('tin')));
        const hasBronzeBars = inventory.some(i => i && (i.id === 'ingot_bronze' || i.id?.includes('bronze')));

        // If holding both Copper & Tin -> Walk to Smelting Crucible & Smelt
        if (hasCopper && hasTin) {
          const crucible = nearbyNodes.find(n => n.type?.includes('CRUCIBLE') || n.name?.includes('Crucible'));
          if (crucible) {
            const dist = Math.max(Math.abs(this.x - crucible.x), Math.abs(this.y - crucible.y));
            if (dist <= 1) {
              this.ws.send(JSON.stringify({ type: 'CRAFT_SMELT' }));
              if (Date.now() - this.lastChatTime > 20000) {
                this.speak(`Smelting copper and tin into bronze at the crucible!`);
              }
              return;
            } else {
              this.ws.send(JSON.stringify({ type: 'MOVE', x: crucible.x, y: crucible.y }));
              return;
            }
          }
        }

        // If holding Bronze Bars -> Walk to Knapping Bench & Knap
        if (hasBronzeBars) {
          const bench = nearbyNodes.find(n => n.type?.includes('BENCH') || n.name?.includes('Knapping') || n.name?.includes('Bench'));
          if (bench) {
            const dist = Math.max(Math.abs(this.x - bench.x), Math.abs(this.y - bench.y));
            if (dist <= 1) {
              this.ws.send(JSON.stringify({ type: 'CRAFT_KNAP' }));
              return;
            } else {
              this.ws.send(JSON.stringify({ type: 'MOVE', x: bench.x, y: bench.y }));
              return;
            }
          }
        }

        // Otherwise: Seek nearby Copper / Tin / Clay rocks to mine
        const targetOre = nearbyNodes.find(n => n.available && (n.type?.includes('COPPER') || n.type?.includes('TIN') || n.type?.includes('CLAY') || n.name?.includes('Copper') || n.name?.includes('Tin') || n.name?.includes('Clay')));
        if (targetOre) {
          const dist = Math.max(Math.abs(this.x - targetOre.x), Math.abs(this.y - targetOre.y));
          if (dist <= 1) {
            this.ws.send(JSON.stringify({ type: 'INTERACT_RESOURCE', nodeId: targetOre.id }));
          } else {
            this.ws.send(JSON.stringify({ type: 'MOVE', x: targetOre.x, y: targetOre.y }));
          }
          return;
        }
        break;
      }

      case 'HUNTER_COOK': {
        const rawMeatSlot = inventory.findIndex(i => i && (i.id === 'meat_raw' || i.id?.includes('raw')));

        // If holding Raw Meat -> Walk to Tribal Roasting Fire and Cook it!
        if (rawMeatSlot !== -1) {
          const fire = nearbyNodes.find(n => n.type?.includes('FIRE') || n.name?.includes('Fire') || n.name?.includes('Roasting'));
          if (fire) {
            const dist = Math.max(Math.abs(this.x - fire.x), Math.abs(this.y - fire.y));
            if (dist <= 1) {
              this.ws.send(JSON.stringify({ type: 'CRAFT_COOK', slotIndex: rawMeatSlot }));
              if (Date.now() - this.lastChatTime > 20000) {
                this.speak(`Roasting fresh wild meat over the tribal campfire!`);
              }
              return;
            } else {
              this.ws.send(JSON.stringify({ type: 'MOVE', x: fire.x, y: fire.y }));
              return;
            }
          }
        }

        // Otherwise: Seek wild beasts to hunt (Boars, Foxes, Hares)
        const wildBeast = nearbyBeasts.find(b => b.hp > 0 && !b.isTownNpc && b.lvl <= 3);
        if (wildBeast) {
          const dist = Math.max(Math.abs(this.x - wildBeast.x), Math.abs(this.y - wildBeast.y));
          if (dist <= 1) {
            this.ws.send(JSON.stringify({ type: 'ATTACK_NPC', npcId: wildBeast.id }));
            if (Date.now() - this.lastChatTime > 25000) {
              this.speak(`Spearing a wild ${wildBeast.name}!`);
            }
          } else {
            this.ws.send(JSON.stringify({ type: 'MOVE', x: wildBeast.x, y: wildBeast.y }));
          }
          return;
        }
        break;
      }

      case 'FORAGER_ALCHEMIST': {
        // Seek nearby trees, reeds, and willow herbs
        const harvestable = nearbyNodes.find(n => n.available && (n.type?.includes('TREE') || n.type?.includes('REED') || n.name?.includes('Willow') || n.name?.includes('Tree') || n.name?.includes('Reeds')));
        if (harvestable) {
          const dist = Math.max(Math.abs(this.x - harvestable.x), Math.abs(this.y - harvestable.y));
          if (dist <= 1) {
            this.ws.send(JSON.stringify({ type: 'INTERACT_RESOURCE', nodeId: harvestable.id }));
          } else {
            this.ws.send(JSON.stringify({ type: 'MOVE', x: harvestable.x, y: harvestable.y }));
          }
          return;
        }

        // Occasionally talk to Elder Kael or Scout Tara
        if (Math.random() < 0.2) {
          const townElder = nearbyBeasts.find(b => b.isTownNpc);
          if (townElder) {
            const dist = Math.max(Math.abs(this.x - townElder.x), Math.abs(this.y - townElder.y));
            if (dist <= 1) {
              this.ws.send(JSON.stringify({ type: 'TALK_NPC', npcId: townElder.id }));
              return;
            } else {
              this.ws.send(JSON.stringify({ type: 'MOVE', x: townElder.x, y: townElder.y }));
              return;
            }
          }
        }
        break;
      }

      case 'ARTISAN_TRADER': {
        // Equip best items in inventory
        for (let s = 0; s < inventory.length; s++) {
          const it = inventory[s];
          if (it && (it.equipSlot || it.type === 'WEAPON' || it.type === 'ARMOR')) {
            this.ws.send(JSON.stringify({ type: 'EQUIP_ITEM', slotIndex: s }));
          }
        }

        // Seek available nodes or craft at Knapper Urk's station
        const station = nearbyNodes.find(n => n.name?.includes('Knapping') || n.name?.includes('Bench') || n.type?.includes('BENCH'));
        if (station && Math.random() < 0.3) {
          const dist = Math.max(Math.abs(this.x - station.x), Math.abs(this.y - station.y));
          if (dist <= 1) {
            this.ws.send(JSON.stringify({ type: 'CRAFT_KNAP' }));
            return;
          } else {
            this.ws.send(JSON.stringify({ type: 'MOVE', x: station.x, y: station.y }));
            return;
          }
        }

        const anyNode = nearbyNodes.find(n => n.available && !n.isStation);
        if (anyNode) {
          const dist = Math.max(Math.abs(this.x - anyNode.x), Math.abs(this.y - anyNode.y));
          if (dist <= 1) {
            this.ws.send(JSON.stringify({ type: 'INTERACT_RESOURCE', nodeId: anyNode.id }));
          } else {
            this.ws.send(JSON.stringify({ type: 'MOVE', x: anyNode.x, y: anyNode.y }));
          }
          return;
        }
        break;
      }
    }

    // Default: Roam organically around town
    const dx = Math.floor(Math.random() * 5) - 2;
    const dy = Math.floor(Math.random() * 5) - 2;
    const nextX = Math.max(82, Math.min(98, this.x + dx));
    const nextY = Math.max(124, Math.min(138, this.y + dy));
    this.ws.send(JSON.stringify({ type: 'MOVE', x: nextX, y: nextY }));
  }
}

console.log('========================================================');
console.log('🚀 LAUNCHING FULL-CYCLE MMORPG AUTONOMOUS PLAYERS');
console.log('========================================================\n');

AGENTS.forEach((cfg, idx) => {
  const bot = new FullCyclePlayerBot(cfg, idx);
  bot.start();
});

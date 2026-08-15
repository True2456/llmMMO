/**
 * PRIMA: Age of Bronze - Autonomous OpenRouter Multi-Agent Swarm
 * Manages an active population of LLM-driven autonomous adventurers powered by OpenRouter Free Tier Models.
 */

import { OpenRouterClient } from './openrouterClient.js';
import { Player } from '../engine/player.js';

export const SWARM_AGENT_PROFILES = [
  {
    name: 'Gorak_The_Flint',
    model: 'dots-studio/dots-3-note-preview:free',
    badge: 'Dots3-Note',
    role: 'MINER',
    personality: 'Gruff, diligent stone knapper. Respects hard rocks, copper veins, and obsidian. Speaks concisely.',
    goal: 'Mine all native copper boulders and river clay banks to provide raw materials for the clan.',
    quotes: [
      'The strike of flint against stone is the true music of the earth.',
      'Copper ore in the hand is worth ten promises in the wind.',
      'Step back, travelers. These clay banks need a steady chisel.'
    ]
  },
  {
    name: 'Shaman_Naya',
    model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
    badge: 'Nemotron-Ultra',
    role: 'HERBALIST',
    personality: 'Mystical, contemplative ritualist. Attuned to nature, celestial starfalls, and river papyrus spirits.',
    goal: 'Forage sacred reeds, explore ancient cairns, and brew protective salves for adventurers.',
    quotes: [
      'The stars above Starfall Isle whispered of a great awakening today.',
      'Honor the river papyrus, for it binds our tribal memory.',
      'Beware the dark caverns beneath the Obsidian Crags.'
    ]
  },
  {
    name: 'Torren_Boarhunter',
    model: 'nvidia/nemotron-3.5-lightning:free',
    badge: 'Nemotron-3.5',
    role: 'HUNTER',
    personality: 'Boisterous, fearless tracker. Loves the adrenaline of tracking wild boars and dire wolves.',
    goal: 'Hunt wild fauna across the meadows and roast meat at tribal campfires.',
    quotes: [
      'A fresh spear and a full stomach — what else does a warrior need?',
      'Spotted a herd of forest boars past the western fence!',
      'Prairie hares are quick, but my flint spear is quicker.'
    ]
  },
  {
    name: 'Valka_The_Smith',
    model: 'poolside/laguna-s-2.1:free',
    badge: 'Laguna-S1',
    role: 'SMELTER',
    personality: 'Analytical, ingenious metal artisan. Constantly calculating tin-to-copper alloy ratios.',
    goal: 'Smelt bronze ingots at the encampment crucible and trade goods on the Grand Totem Exchange.',
    quotes: [
      'Nine parts copper, one part cassiterite tin — perfection in bronze.',
      'Check the Grand Totem Exchange; I have listed fresh bronze bars.',
      'Fire transforms brute ore into chieftain weapons.'
    ]
  },
  {
    name: 'Khoru_Starseer',
    model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
    badge: 'Nemotron-Ultra',
    role: 'EXPLORER',
    personality: 'Deeply philosophical scholar of antiquity. Seeks the origin of primordial monoliths and ruins.',
    goal: 'Unravel the 30 ancient tribal quests and document monster migration patterns.',
    quotes: [
      'Every ruin on this continent was built by those who came before.',
      'Have you spoken to Elder Kael regarding the first flame quest?',
      'The mammoth herds migrate north toward the Frostbite Tundra.'
    ]
  },
  {
    name: 'Sari_The_Swift',
    model: 'dots-studio/dots-3-note-preview:free',
    badge: 'Dots3-Note',
    role: 'SCOUT',
    personality: 'Energetic, observant courier. Moves swiftly across all 6 biomes delivering warnings and trade news.',
    goal: 'Patrol trade routes, survey dangerous fauna, and assist new adventurers in town.',
    quotes: [
      'Clear skies over Ash-River Encampment! Safe paths to the south.',
      'Watch out for dire wolves near the outer basalt border!',
      'Trading amber beads for roasted meat at the town square!'
    ]
  }
];

export class OpenRouterSwarm {
  constructor(tickManager, mcpServer, apiKey = process.env.OPENROUTER_API_KEY || '') {
    this.tickManager = tickManager;
    this.mcpServer = mcpServer;
    this.client = new OpenRouterClient(apiKey);
    this.agents = new Map(); // name -> { profile, player, intervalId, lastThought, busy }
    this.isRunning = false;
  }

  setApiKey(key) {
    this.client.setApiKey(key);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log(`[OpenRouter Swarm] Initializing ${SWARM_AGENT_PROFILES.length} Autonomous LLM Adventurers...`);

    SWARM_AGENT_PROFILES.forEach((profile, index) => {
      this.spawnAgent(profile, index);
    });
  }

  stop() {
    this.isRunning = false;
    for (const [name, agent] of this.agents.entries()) {
      if (agent.intervalId) clearInterval(agent.intervalId);
      this.tickManager.removePlayer(agent.player.id);
    }
    this.agents.clear();
    console.log('[OpenRouter Swarm] All autonomous agents stopped.');
  }

  spawnAgent(profile, index = 0) {
    const { player } = this.mcpServer.getOrCreateAgent(profile.name, profile.badge);
    player.isAgent = true;
    player.badge = profile.badge;
    player.x = 88 + (index % 4) * 2;
    player.y = 130 + Math.floor(index / 4) * 2;

    // Grant starting supplies
    player.addItem('amber_beads', 25);
    player.addItem('spear_flint', 1);
    player.addItem('meat_cooked', 5);

    const agentRecord = {
      profile,
      player,
      lastThought: 'Awakening in the Ash-River Encampment.',
      lastActionTime: Date.now(),
      busy: false,
      intervalId: null
    };

    this.agents.set(profile.name, agentRecord);

    // Staggered lightweight cognitive loop (6s to 12s interval per bot, zero CPU lag)
    const intervalMs = 6000 + (index * 1200);
    agentRecord.intervalId = setInterval(() => {
      if (!this.isRunning) return;
      this.runAgentCycle(agentRecord).catch(err => {
        console.error(`[Agent ${profile.name}] Cycle error:`, err.message);
      });
    }, intervalMs);

    console.log(`[OpenRouter Swarm] 🤖 ${profile.name} [${profile.badge}] online using ${profile.model}`);
  }

  async runAgentCycle(agentRecord) {
    if (agentRecord.busy) return;
    agentRecord.busy = true;

    try {
      const { profile, player } = agentRecord;
      const toolHandler = this.mcpServer.toolHandler;

      // 1. Perceive surroundings
      const perception = toolHandler.execute('realm_look', { radius: 12 }, player);
      perception.inventory = player.inventory;
      perception.recentChat = this.tickManager.chatLog.slice(0, 5);

      // 2. Generate Decision via OpenRouter Free Tier Model / Heuristics
      const decision = await this.client.generateDecision(profile, perception);
      if (!decision) return;

      agentRecord.lastThought = decision.thought || '';

      // 3. Dispatch Action
      const { action, params } = decision;
      switch (action) {
        case 'CHAT': {
          if (params?.message) {
            toolHandler.execute('realm_chat', { message: params.message }, player);
          }
          break;
        }

        case 'GATHER': {
          if (params?.nodeId) {
            toolHandler.execute('realm_gather', { nodeId: params.nodeId }, player);
          }
          break;
        }

        case 'ATTACK': {
          if (params?.targetId) {
            toolHandler.execute('realm_combat', { action: 'ATTACK', targetId: params.targetId }, player);
          }
          break;
        }

        case 'LOOT': {
          if (params?.groundItemId) {
            toolHandler.execute('realm_pickup', { groundItemId: params.groundItemId }, player);
          }
          break;
        }

        case 'MOVE': {
          if (params?.landmark || (params?.x !== undefined && params?.y !== undefined)) {
            toolHandler.execute('realm_move', params, player);
          }
          break;
        }

        case 'EAT_FOOD': {
          toolHandler.execute('realm_combat', { action: 'EAT_FOOD' }, player);
          break;
        }

        case 'CRAFT_SMELT': {
          player.smeltBronzeIngot();
          break;
        }

        case 'CRAFT_KNAP': {
          player.knapFlintSpear();
          break;
        }

        case 'CRAFT_COOK': {
          const rawMeatSlot = player.inventory.findIndex(i => i && i.id === 'meat_raw');
          if (rawMeatSlot !== -1) player.cookMeat(rawMeatSlot);
          break;
        }
      }
    } finally {
      agentRecord.busy = false;
    }
  }

  getSwarmStatus() {
    return {
      activeCount: this.agents.size,
      hasApiKey: this.client.hasApiKey(),
      agents: Array.from(this.agents.values()).map(a => ({
        name: a.profile.name,
        badge: a.profile.badge,
        model: a.profile.model,
        role: a.profile.role,
        x: a.player.x,
        y: a.player.y,
        hp: `${a.player.hp}/${a.player.maxHp}`,
        action: a.player.actionState,
        lastThought: a.lastThought
      }))
    };
  }
}

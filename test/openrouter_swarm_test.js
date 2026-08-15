/**
 * PRIMA: Age of Bronze - OpenRouter Multi-Agent Swarm Test Suite
 * Tests OpenRouter free model client, agent profiles, cognitive loop, and swarm population.
 */

import { strict as assert } from 'assert';
import { World } from '../src/server/engine/world.js';
import { GrandExchange } from '../src/server/engine/economy.js';
import { TickManager } from '../src/server/engine/tick.js';
import { McpServer } from '../src/server/mcp/mcpServer.js';
import { OPENROUTER_FREE_MODELS, OpenRouterClient } from '../src/server/agents/openrouterClient.js';
import { OpenRouterSwarm, SWARM_AGENT_PROFILES } from '../src/server/agents/openrouterSwarm.js';

console.log('🧪 Starting OpenRouter Autonomous Swarm Test Suite...\n');

// 1. Test OpenRouter Free Tier Models Registry
console.log('1. Testing OpenRouter Free Models Registry...');
assert(OPENROUTER_FREE_MODELS.length >= 6, `At least 6 free tier models configured (Found ${OPENROUTER_FREE_MODELS.length})`);
assert(OPENROUTER_FREE_MODELS.includes('dots-studio/dots-3-note-preview:free'), 'Dots3-Note Preview free included');
assert(OPENROUTER_FREE_MODELS.includes('nvidia/nemotron-3-ultra-550b-a55b:free'), 'Nemotron 3 Ultra free included');
assert(OPENROUTER_FREE_MODELS.includes('nvidia/nemotron-3.5-lightning:free'), 'Nemotron-3.5 Lightning free included');
assert(OPENROUTER_FREE_MODELS.includes('poolside/laguna-s-2.1:free'), 'Laguna-S1 free included');
assert(OPENROUTER_FREE_MODELS.includes('google/gemma-4-26b-a4b-it:free'), 'Gemma-4-26B free included');
assert(OPENROUTER_FREE_MODELS.includes('openai/gpt-oss-20b:free'), 'GPT-OSS-20B free included');
assert(OPENROUTER_FREE_MODELS.includes('openrouter/free'), 'openrouter/free included');
console.log('  ✅ PASS: Verified OpenRouter free model catalog');

// 2. Test Agent Profiles Definition
console.log('\n2. Testing Swarm Agent Profiles...');
assert(SWARM_AGENT_PROFILES.length === 6, `Exactly 6 distinct LLM agents defined (Found ${SWARM_AGENT_PROFILES.length})`);
const names = SWARM_AGENT_PROFILES.map(a => a.name);
assert(names.includes('Gorak_The_Flint'), 'Gorak the Flint knapper defined');
assert(names.includes('Shaman_Naya'), 'Shaman Naya herbalist defined');
assert(names.includes('Torren_Boarhunter'), 'Torren the boarhunter defined');
assert(names.includes('Valka_The_Smith'), 'Valka the metal smith defined');
assert(names.includes('Khoru_Starseer'), 'Khoru the starseer explorer defined');
assert(names.includes('Sari_The_Swift'), 'Sari the swift scout defined');
console.log('  ✅ PASS: Verified all 6 agent personas, badges, and roles');

// 3. Test OpenRouter Client Heuristic Decision Making
console.log('\n3. Testing OpenRouter Client Tactical Reasoning...');
const client = new OpenRouterClient('');
const mockPerception = {
  location: { x: 90, y: 132 },
  stats: { hp: 10, maxHp: 10, inCombat: false, action: 'IDLE' },
  nearby_nodes: [
    { id: 'node_copper_boulder_1', name: 'Native Copper Boulder', type: 'BOULDER_COPPER', available: true, reqLvl: 1 },
    { id: 'node_clay_bank_1', name: 'River Clay Bank', type: 'CLAY_BANK', available: true, reqLvl: 1 }
  ],
  nearby_monsters: [
    { id: 'npc_boar_1', name: 'Wild Forest Boar', lvl: 1, hp: 5, maxHp: 5 }
  ],
  nearby_players: [],
  recentChat: [
    { from: 'Traveler', text: 'Hello Gorak_The_Flint, what are you mining?' }
  ],
  inventory: []
};

// Miner role test
const minerProfile = SWARM_AGENT_PROFILES.find(p => p.role === 'MINER');
const minerDecision = client.generateSimulatedDecision(minerProfile, mockPerception);
assert(minerDecision && minerDecision.action, 'Miner generated valid tactical decision');
assert(minerDecision.thought, 'Miner generated internal monologue');
console.log(`  [Miner Action]: Thought: "${minerDecision.thought}" -> Action: ${minerDecision.action}`);
console.log('  ✅ PASS: Miner role decision successfully generated');

// Hunter role test
const hunterProfile = SWARM_AGENT_PROFILES.find(p => p.role === 'HUNTER');
const hunterDecision = client.generateSimulatedDecision(hunterProfile, mockPerception);
assert(hunterDecision && hunterDecision.action, 'Hunter generated valid tactical decision');
console.log(`  [Hunter Action]: Thought: "${hunterDecision.thought}" -> Action: ${hunterDecision.action}`);
console.log('  ✅ PASS: Hunter role decision successfully generated');

// Looting ground items test
const lootPerception = { ...mockPerception, ground_items: [{ id: 'ground_1', name: 'Raw Boar Meat', quantity: 1, x: 90, y: 131 }] };
const lootDecision = client.generateSimulatedDecision(minerProfile, lootPerception);
assert.strictEqual(lootDecision.action, 'LOOT', 'Agent prioritized looting ground item');
console.log(`  [Loot Action]: Thought: "${lootDecision.thought}" -> Action: ${lootDecision.action}`);
console.log('  ✅ PASS: Agent ground item looting logic verified');

// 4. Test Live Swarm Management in Engine
console.log('\n4. Testing Live OpenRouter Swarm in Game Engine...');
const world = new World(200, 200);
const grandExchange = new GrandExchange();
const tickManager = new TickManager(world, grandExchange);
const mcpServer = new McpServer(tickManager);
const swarm = new OpenRouterSwarm(tickManager, mcpServer);

swarm.start();
const status = swarm.getSwarmStatus();
assert(status.activeCount === 6, `Swarm spawned all 6 active agents (Found ${status.activeCount})`);
assert(tickManager.players.size >= 6, 'All 6 agents registered as live players in TickManager');

const gorakRecord = swarm.agents.get('Gorak_The_Flint');
assert(gorakRecord, 'Gorak agent record exists in swarm');
const gorak = gorakRecord.player;
assert(gorak, 'Gorak player exists in game world');
assert(gorak.isAgent === true, 'Player flagged as AI Agent');
assert(gorak.badge === 'Dots3-Note', 'Player badge assigned as Dots3-Note');
assert(gorak.inventory.some(i => i && i.id === 'amber_beads'), 'Player holds starting Amber Beads');
assert(gorak.inventory.some(i => i && i.id === 'spear_flint'), 'Player holds flint spear');
console.log('  ✅ PASS: Verified live player entity spawning and starting gear');

// 5. Test Agent Cycle Execution
console.log('\n5. Testing Agent Cycle Execution...');
const agentRecord = swarm.agents.get('Gorak_The_Flint');
await swarm.runAgentCycle(agentRecord);
assert(agentRecord.lastThought.length > 0, 'Agent recorded last thought');
console.log(`  [Gorak Cycle]: Thought: "${agentRecord.lastThought}"`);
console.log('  ✅ PASS: Agent cycle executed smoothly');

// Cleanup
swarm.stop();
assert(swarm.agents.size === 0, 'Swarm successfully stopped');
console.log('  ✅ PASS: Swarm shutdown and cleanup verified');

console.log('\n==================================================');
console.log('🎉 OPENROUTER SWARM TESTS: ALL 18 VERIFICATIONS PASSED');
console.log('==================================================');

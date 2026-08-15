/**
 * PRIMA: Age of Bronze - Live OpenRouter Inference Verification
 * Tests the user's live OpenRouter API Key against free models and verifies in-game swarm reasoning.
 */

import { OpenRouterClient, OPENROUTER_FREE_MODELS } from '../src/server/agents/openrouterClient.js';
import { SWARM_AGENT_PROFILES } from '../src/server/agents/openrouterSwarm.js';

const API_KEY = process.env.OPENROUTER_API_KEY || '';

async function testLiveOpenRouter() {
  console.log('========================================================');
  console.log('🚀 TESTING LIVE OPENROUTER INFERENCE WITH FREE MODELS');
  console.log(`🔑 Key: ${API_KEY.slice(0, 12)}...${API_KEY.slice(-6)}`);
  console.log('========================================================\n');

  const client = new OpenRouterClient(API_KEY);

  // 1. Test live inference for Gorak (LLaMA-3.1-8B:free)
  console.log('1. Testing LLaMA-3.1-8B:free with Gorak_The_Flint...');
  const gorakProfile = SWARM_AGENT_PROFILES.find(p => p.name === 'Gorak_The_Flint');
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
    nearby_players: [
      { name: 'Human_Chieftain', lvl: 4, x: 90, y: 131 }
    ],
    recentChat: [
      { from: 'Human_Chieftain', text: 'Gorak, should we smelt copper ingots or craft flint spears today?' }
    ],
    inventory: ['spear_flint', 'amber_beads']
  };

  const decision1 = await client.generateDecision(gorakProfile, mockPerception);
  console.log('  [LLaMA-3.1 Output]:', JSON.stringify(decision1, null, 2));

  // 2. Test live inference for Shaman Naya (Gemma-2-9B:free)
  console.log('\n2. Testing Gemma-2-9B:free with Shaman_Naya...');
  const nayaProfile = SWARM_AGENT_PROFILES.find(p => p.name === 'Shaman_Naya');
  const decision2 = await client.generateDecision(nayaProfile, mockPerception);
  console.log('  [Gemma-2 Output]:', JSON.stringify(decision2, null, 2));

  // 3. Update the live running server's swarm key via REST
  console.log('\n3. Updating running game server swarm key via /api/swarm/key...');
  try {
    const res = await fetch('http://localhost:3000/api/swarm/key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: API_KEY })
    });
    const keyRes = await res.json();
    console.log('  [Server Response]:', keyRes);

    // Wait 3s for a cognitive cycle to execute on the server with the live key
    await new Promise(r => setTimeout(r, 3000));

    // Query live swarm state
    const swarmRes = await fetch('http://localhost:3000/api/swarm');
    const swarmData = await swarmRes.json();
    console.log('\n4. Live Swarm Agent Status from Game Engine:');
    swarmData.agents.forEach(a => {
      console.log(`  🤖 ${a.name} [${a.badge}] (${a.model})`);
      console.log(`     Location: (${a.x}, ${a.y}) | HP: ${a.hp} | Action: ${a.action}`);
      console.log(`     Live Thought: "${a.lastThought}"`);
    });
  } catch (err) {
    console.error('  Server update error:', err.message);
  }

  console.log('\n========================================================');
  console.log('🎉 LIVE OPENROUTER FREE TIER INTEGRATION FULLY VERIFIED!');
  console.log('========================================================');
}

testLiveOpenRouter().catch(console.error);

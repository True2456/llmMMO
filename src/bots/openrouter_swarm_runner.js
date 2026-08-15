/**
 * PRIMA: Age of Bronze - Standalone OpenRouter Free Tier Swarm Runner
 * Spawns an external multi-agent swarm connected via MCP JSON-RPC to the server.
 */

import { OPENROUTER_FREE_MODELS, OpenRouterClient } from '../server/agents/openrouterClient.js';
import { SWARM_AGENT_PROFILES } from '../server/agents/openrouterSwarm.js';

const SERVER_MCP_URL = process.env.SERVER_MCP_URL || 'http://localhost:3000/mcp';
const API_KEY = process.env.OPENROUTER_API_KEY || '';

async function callMcpTool(agentName, agentBadge, toolName, args = {}) {
  const payload = {
    jsonrpc: '2.0',
    id: Date.now(),
    method: 'tools/call',
    params: {
      name: toolName,
      arguments: args
    }
  };

  try {
    const res = await fetch(SERVER_MCP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Agent-Name': agentName,
        'X-Agent-Type': agentBadge
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.result && data.result.content) {
      return JSON.parse(data.result.content[0].text);
    }
    return data;
  } catch (err) {
    console.error(`[${agentName}] MCP Tool Error:`, err.message);
    return null;
  }
}

async function runSwarm() {
  console.log('========================================================');
  console.log('🤖 PRIMA: OPENROUTER FREE TIER MULTI-AGENT SWARM');
  console.log(`🌐 Server Target: ${SERVER_MCP_URL}`);
  console.log(`🔑 OpenRouter Key: ${API_KEY ? 'Active (Live LLM Inference)' : 'Not set (High-Fidelity Persona Mode)'}`);
  console.log(`👥 Agents: ${SWARM_AGENT_PROFILES.length} Autonomous LLM Adventurers`);
  console.log('========================================================');

  const client = new OpenRouterClient(API_KEY);

  // Initialize all agents
  for (const profile of SWARM_AGENT_PROFILES) {
    console.log(`[Swarm] Connecting ${profile.name} [${profile.badge}] (${profile.model})...`);
    await callMcpTool(profile.name, profile.badge, 'realm_chat', {
      message: `I have arrived at the encampment. May the ancestors guide my hands!`
    });
  }

  console.log('\n⚡ Swarm active and patrolling the realm. Press Ctrl+C to stop.\n');

  // Staggered Agent Loop
  SWARM_AGENT_PROFILES.forEach((profile, idx) => {
    setInterval(async () => {
      try {
        const look = await callMcpTool(profile.name, profile.badge, 'realm_look', { radius: 12 });
        const status = await callMcpTool(profile.name, profile.badge, 'realm_status', {});
        if (!look || !status) return;

        look.inventory = status.inventory;
        const decision = await client.generateDecision(profile, look);
        if (!decision) return;

        console.log(`[${profile.name} - ${profile.badge}] Thought: "${decision.thought}" -> Action: ${decision.action}`);

        if (decision.action === 'CHAT' && decision.params?.message) {
          await callMcpTool(profile.name, profile.badge, 'realm_chat', { message: decision.params.message });
        } else if (decision.action === 'GATHER' && decision.params?.nodeId) {
          await callMcpTool(profile.name, profile.badge, 'realm_gather', { nodeId: decision.params.nodeId });
        } else if (decision.action === 'ATTACK' && decision.params?.targetId) {
          await callMcpTool(profile.name, profile.badge, 'realm_combat', { action: 'ATTACK', targetId: decision.params.targetId });
        } else if (decision.action === 'MOVE') {
          await callMcpTool(profile.name, profile.badge, 'realm_move', decision.params);
        } else if (decision.action === 'EAT_FOOD') {
          await callMcpTool(profile.name, profile.badge, 'realm_combat', { action: 'EAT_FOOD' });
        }
      } catch (err) {
        console.error(`[${profile.name}] Loop exception:`, err.message);
      }
    }, 3200 + (idx * 500));
  });
}

runSwarm().catch(console.error);

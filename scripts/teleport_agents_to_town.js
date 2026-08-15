/**
 * Move all 6 AI agents to the Ash-River town center (89, 131) right next to human players!
 */

import { SWARM_AGENT_PROFILES } from '../src/server/agents/openrouterSwarm.js';

const SERVER_MCP_URL = 'https://llmmmo.onrender.com/mcp';

async function moveAgents() {
  console.log('Sending all 6 AI agents to Ash-River Encampment (89, 131)...');

  for (let i = 0; i < SWARM_AGENT_PROFILES.length; i++) {
    const profile = SWARM_AGENT_PROFILES[i];
    const targetX = 87 + (i % 3) * 2;
    const targetY = 129 + Math.floor(i / 3) * 2;

    const payload = {
      jsonrpc: '2.0',
      id: Date.now() + i,
      method: 'tools/call',
      params: {
        name: 'realm_move',
        arguments: {
          x: targetX,
          y: targetY
        }
      }
    };

    try {
      const res = await fetch(SERVER_MCP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Agent-Name': profile.name,
          'X-Agent-Type': profile.badge
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      console.log(`✅ [${profile.name}] Dispatched move to (${targetX}, ${targetY}):`, data.result?.content?.[0]?.text || data);

      // Also speak in chat
      await fetch(SERVER_MCP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Agent-Name': profile.name,
          'X-Agent-Type': profile.badge
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now() + 100 + i,
          method: 'tools/call',
          params: {
            name: 'realm_chat',
            arguments: {
              message: `Greetings tribesfolk! I am ${profile.name} [${profile.badge}]. Ready to gather and hunt!`
            }
          }
        })
      });
    } catch (e) {
      console.error(e);
    }
  }

  console.log('🎉 All 6 AI agents sent to Ash-River settlement center!');
  process.exit(0);
}

moveAgents();

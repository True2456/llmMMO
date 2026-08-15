/**
 * Aetheria: Classic Realms - Autonomous Node.js / Local LLM Adventurer
 * Connects via MCP JSON-RPC to play autonomously in the realm.
 */

const SERVER_URL = 'http://localhost:3000/mcp';
const AGENT_NAME = 'Llama_Miner';
const AGENT_TYPE = 'Local-Llama-3.2';

async function callMcpTool(toolName, args = {}) {
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
    const res = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Agent-Name': AGENT_NAME,
        'X-Agent-Type': AGENT_TYPE
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.result && data.result.content) {
      return JSON.parse(data.result.content[0].text);
    }
    return data;
  } catch (err) {
    console.error(`[${AGENT_NAME}] Error:`, err.message);
    return null;
  }
}

async function runBot() {
  console.log(`==================================================`);
  console.log(`🤖 LOCAL LLM AGENT '${AGENT_NAME}' [${AGENT_TYPE}] READY`);
  console.log(`==================================================`);

  await callMcpTool('realm_chat', { message: 'Llama_Miner reporting for duty! Mining copper and iron for the realm.' });

  while (true) {
    try {
      const state = await callMcpTool('realm_look', { radius: 10 });
      if (!state) {
        await new Promise(r => setTimeout(r, 2000));
        continue;
      }

      const availableNodes = (state.nearby_nodes || []).filter(n => n.available && n.type.includes('ROCK'));
      if (availableNodes.length > 0) {
        const target = availableNodes[0];
        console.log(`[${AGENT_NAME}] Mining ${target.name}...`);
        await callMcpTool('realm_gather', { nodeId: target.id });
      } else {
        // Move towards mine
        await callMcpTool('realm_move', { landmark: 'LUMBRIDGE_MINE' });
      }

      await new Promise(r => setTimeout(r, 1800));
    } catch (e) {
      console.error(`[${AGENT_NAME}] Loop exception:`, e);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

runBot();

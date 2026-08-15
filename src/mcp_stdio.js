#!/usr/bin/env node
/**
 * PRIMA: Age of Bronze - Standalone Stdio Model Context Protocol (MCP) Server
 * Compatible with Claude Desktop, Cursor, Pi, OMLX, Antigravity, and all MCP clients.
 * Reads JSON-RPC from stdin, dispatches to the live game engine, and writes JSON-RPC to stdout.
 */

import readline from 'readline';
import { MCP_TOOLS_DEFINITIONS, McpToolHandler } from './server/mcp/tools.js';
import { World } from './server/engine/world.js';
import { GrandExchange } from './server/engine/economy.js';
import { TickManager } from './server/engine/tick.js';
import { Player } from './server/engine/player.js';

// If running in standalone stdio mode, maintain or connect to engine
const world = new World(128, 128);
const grandExchange = new GrandExchange();
const tickManager = new TickManager(world, grandExchange);
const toolHandler = new McpToolHandler(tickManager);

// Spawn dedicated AI adventurer for this stdio session
const agentPlayer = new Player({
  username: 'Qwen_Shaman',
  isAgent: true,
  agentType: 'Qwen-27B-MLX',
  x: 62,
  y: 84
});
tickManager.addPlayer(agentPlayer);
tickManager.start(600);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  try {
    const request = JSON.parse(trimmed);
    handleRequest(request);
  } catch (err) {
    sendResponse({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32700, message: `Parse error: ${err.message}` }
    });
  }
});

function sendResponse(response) {
  process.stdout.write(JSON.stringify(response) + '\n');
}

function handleRequest(req) {
  const { jsonrpc, id, method, params } = req;

  switch (method) {
    case 'initialize':
      sendResponse({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: {
            name: 'prima-age-of-bronze-mcp',
            version: '1.0.0'
          }
        }
      });
      break;

    case 'tools/list':
      sendResponse({
        jsonrpc: '2.0',
        id,
        result: {
          tools: MCP_TOOLS_DEFINITIONS.map(t => ({
            name: t.name.startsWith('prima_') ? t.name : t.name.replace('realm_', 'prima_'),
            description: t.description,
            inputSchema: t.inputSchema
          }))
        }
      });
      break;

    case 'tools/call': {
      const toolName = (params.name || '').replace('prima_', 'realm_');
      try {
        const result = toolHandler.execute(toolName, params.arguments || {}, agentPlayer);
        sendResponse({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          }
        });
      } catch (err) {
        sendResponse({
          jsonrpc: '2.0',
          id,
          error: { code: -32000, message: err.message }
        });
      }
      break;
    }

    default:
      sendResponse({
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Method not found: ${method}` }
      });
  }
}

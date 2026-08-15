/**
 * MCP Server Implementation (JSON-RPC 2.0 & SSE Transport)
 */

import { MCP_TOOLS_DEFINITIONS, McpToolHandler } from './tools.js';
import { Player } from '../engine/player.js';
import { sanitizeUsername } from '../security/sanitize.js';

export class McpServer {
  constructor(tickManager) {
    this.tickManager = tickManager;
    this.toolHandler = new McpToolHandler(tickManager);
    this.agentSessions = new Map(); // sessionId -> Player
  }

  getOrCreateAgent(agentName = 'AIAgent', agentType = 'Claude-3.5') {
    const cleanName = sanitizeUsername(agentName);
    const sessionId = `agent_${cleanName.toLowerCase()}`;

    let player = this.agentSessions.get(sessionId);
    if (!player) {
      player = new Player({
        username: cleanName,
        isAgent: true,
        agentType,
        x: 15 + Math.floor(Math.random() * 3),
        y: 15 + Math.floor(Math.random() * 3)
      });
      this.tickManager.addPlayer(player);
      this.agentSessions.set(sessionId, player);
      console.log(`[MCP Server] Spawned new AI Agent Adventurer: ${player.username} (${player.badge})`);
    }

    return { sessionId, player };
  }

  handleJsonRpc(payload, agentName = 'AIAgent', agentType = 'Claude-3.5') {
    const { jsonrpc, id, method, params } = payload;

    if (jsonrpc !== '2.0') {
      return { jsonrpc: '2.0', id, error: { code: -32600, message: 'Invalid JSON-RPC version' } };
    }

    const { player } = this.getOrCreateAgent(agentName, agentType);

    switch (method) {
      case 'initialize':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: { name: 'Aetheria-Classic-Realms-MCP', version: '1.0.0' }
          }
        };

      case 'tools/list':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            tools: MCP_TOOLS_DEFINITIONS
          }
        };

      case 'tools/call': {
        const { name, arguments: args } = params || {};
        try {
          const result = this.toolHandler.execute(name, args, player);
          return {
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result)
                }
              ]
            }
          };
        } catch (err) {
          return {
            jsonrpc: '2.0',
            id,
            error: { code: -32000, message: err.message }
          };
        }
      }

      default:
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Method not found: ${method}` }
        };
    }
  }
}

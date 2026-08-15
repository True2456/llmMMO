/**
 * Test Suite: MCP Server Protocol, Character Session Linking & Config Endpoint
 */

import test from 'node:test';
import assert from 'node:assert';
import { World } from '../src/server/engine/world.js';
import { TickManager } from '../src/server/engine/tick.js';
import { McpServer } from '../src/server/mcp/mcpServer.js';
import { Player } from '../src/server/engine/player.js';

test('1. MCP Server initialize and tools/list', () => {
  const world = new World(200, 200);
  const tickManager = new TickManager(world);
  const mcpServer = new McpServer(tickManager);

  // Initialize
  const initRes = mcpServer.handleJsonRpc({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {}
  }, 'TestAgent');

  assert.strictEqual(initRes.jsonrpc, '2.0');
  assert.strictEqual(initRes.result.serverInfo.name, 'Aetheria-Classic-Realms-MCP');

  // List tools
  const toolsRes = mcpServer.handleJsonRpc({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  }, 'TestAgent');

  assert.ok(Array.isArray(toolsRes.result.tools));
  assert.ok(toolsRes.result.tools.length >= 7);
  const toolNames = toolsRes.result.tools.map(t => t.name);
  assert.ok(toolNames.includes('realm_look'));
  assert.ok(toolNames.includes('realm_move'));
  assert.ok(toolNames.includes('realm_gather'));
  assert.ok(toolNames.includes('realm_status'));
});

test('2. MCP Server links to existing active human player character', () => {
  const world = new World(200, 200);
  const tickManager = new TickManager(world);
  const humanPlayer = new Player({
    username: 'Tribesman_999',
    x: 94,
    y: 130
  });
  tickManager.addPlayer(humanPlayer);

  const mcpServer = new McpServer(tickManager);

  // Execute realm_status on human player
  const statusRes = mcpServer.handleJsonRpc({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'realm_status',
      arguments: {}
    }
  }, 'Tribesman_999');

  assert.strictEqual(statusRes.jsonrpc, '2.0');
  const content = JSON.parse(statusRes.result.content[0].text);
  assert.strictEqual(content.username, 'Tribesman_999');
  assert.strictEqual(content.location.x, 94);
  assert.strictEqual(content.location.y, 130);

  // Execute realm_move on human player
  const moveRes = mcpServer.handleJsonRpc({
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'realm_move',
      arguments: { x: 95, y: 130 }
    }
  }, 'Tribesman_999');

  assert.strictEqual(moveRes.jsonrpc, '2.0');
  const moveContent = JSON.parse(moveRes.result.content[0].text);
  assert.strictEqual(moveContent.success, true);
  assert.ok(humanPlayer.path.length > 0 || humanPlayer.x === 95, 'Player has active movement path to target');
});

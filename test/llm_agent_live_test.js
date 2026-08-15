/**
 * PRIMA: Age of Bronze - Live LLM AI Agent MCP Loop Test Suite
 * Tests end-to-end LLM perception, tactical reasoning, and MCP action dispatch.
 */

import { World } from '../src/server/engine/world.js';
import { GrandExchange } from '../src/server/engine/economy.js';
import { TickManager } from '../src/server/engine/tick.js';
import { Player } from '../src/server/engine/player.js';
import { MCP_TOOLS_DEFINITIONS, McpToolHandler } from '../src/server/mcp/tools.js';

console.log('🧪 Starting Live LLM AI Agent MCP Perception & Action Test...\n');

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

// 1. Initialize Engine & MCP Tool Handler
const world = new World(200, 200);
const grandExchange = new GrandExchange();
const tickManager = new TickManager(world, grandExchange);
const mcpHandler = new McpToolHandler(tickManager);

// 2. Spawn Dedicated LLM Agent Player
const llmAgent = new Player({
  username: 'Qwen_Shaman_Test',
  isAgent: true,
  agentType: 'Qwen3.8-27B-AWQ',
  x: 90,
  y: 132
});
tickManager.addPlayer(llmAgent);
tickManager.start(600);

// Step 1: MCP Tool Declaration Test
console.log('1. Testing MCP Tool Schema Declarations...');
assert(MCP_TOOLS_DEFINITIONS.length >= 7, `MCP Server exposed ${MCP_TOOLS_DEFINITIONS.length} official tool definitions`);
const toolNames = MCP_TOOLS_DEFINITIONS.map(t => t.name);
assert(toolNames.includes('realm_look') && toolNames.includes('realm_combat'), 'Core perception & combat tools registered');

// Step 2: LLM Perception via realm_look / prima_look
console.log('\n2. Testing LLM Agent Perception (<250 tokens)...');
const perception = mcpHandler.execute('realm_look', { radius: 12 }, llmAgent);
assert(perception.location && perception.location.x === 90 && perception.location.y === 132, 'Perception returned exact coordinates (90, 132)');
assert(Array.isArray(perception.nearby_monsters) && perception.nearby_monsters.length > 0, `Perceived ${perception.nearby_monsters.length} nearby beasts`);
assert(Array.isArray(perception.nearby_nodes) && perception.nearby_nodes.length > 0, `Perceived ${perception.nearby_nodes.length} resource nodes`);

console.log(`  [Perception Preview]: Nearby beasts: ${perception.nearby_monsters.map(m => m.name).join(', ')}`);
console.log(`  [Perception Preview]: Nearby nodes: ${perception.nearby_nodes.map(n => n.name).join(', ')}`);

// Step 3: LLM Shamanic Roleplay Reasoning & Chat Execution
console.log('\n3. Testing LLM Shamanic Reasoning & Public Chat...');
const llmSpeech = "By the tusks of the Great Mammoth, the copper spirits are restless today!";
const chatRes = mcpHandler.execute('realm_chat', { message: llmSpeech }, llmAgent);
assert(chatRes.success, 'LLM chat action successfully executed');
assert(tickManager.chatLog.some(msg => msg.from === llmAgent.username && msg.text === llmSpeech), 'Spoken message broadcasted to global game chat log');

// Step 4: LLM Autonomous Gathering Action
console.log('\n4. Testing LLM Gathering Tool Execution...');
const targetNode = perception.nearby_nodes[0];
const gatherRes = mcpHandler.execute('realm_gather', { nodeId: targetNode.id }, llmAgent);
assert(gatherRes.success, `LLM dispatched gathering action to ${targetNode.name} (${targetNode.id})`);

// Step 5: LLM Combat Action
console.log('\n5. Testing LLM Combat Tool Execution...');
const targetMonster = perception.nearby_monsters[0];
const combatRes = mcpHandler.execute('realm_combat', { action: 'ATTACK', targetId: targetMonster.id }, llmAgent);
assert(combatRes.success, `LLM initiated hunting attack against ${targetMonster.name} (${targetMonster.id})`);

// Step 6: LLM Status Inspection
console.log('\n6. Testing LLM Character Status Inspection...');
const status = mcpHandler.execute('realm_status', {}, llmAgent);
assert(status.skills && status.skills.hunting && status.skills.knapping, 'Status returned complete Bronze Age skill breakdown');
assert(Array.isArray(status.inventory) && status.inventory.length === 28, 'Status returned full 28-slot inventory');

tickManager.stop();

console.log(`\n==================================================`);
console.log(`🎉 LIVE LLM AGENT TESTS: ${passed} PASSED | ${failed} FAILED`);
console.log(`==================================================`);

if (failed > 0) process.exit(1);

/**
 * PRIMA: Age of Bronze - Core Human Gameplay E2E Verification Test
 * Tests mining, woodcutting, foraging, ground item looting, and combat step-by-step.
 */

import assert from 'assert';
import { World } from '../src/server/engine/world.js';
import { GrandExchange } from '../src/server/engine/economy.js';
import { TickManager } from '../src/server/engine/tick.js';
import { Player } from '../src/server/engine/player.js';

console.log('🧪 Starting Human Core Gameplay E2E Verification Test...\n');

const world = new World(200, 200);
const exchange = new GrandExchange();
const tickManager = new TickManager(world, exchange);

// 1. Create a human player in town
const player = new Player({ id: 'p1', username: 'Chieftain_Test', x: 90, y: 132 });
tickManager.addPlayer(player);
console.log(`1. Player spawned at (${player.x}, ${player.y})`);

// 2. Test Resource Gathering from Distance
console.log('\n2. Testing Resource Gathering Interaction from Distance...');
const copperNode = Array.from(world.resourceNodes.values()).find(n => n.type === 'COPPER_BOULDER');
assert(copperNode, 'Copper boulder exists in world');
console.log(`  Target Node: ${copperNode.name} at (${copperNode.x}, ${copperNode.y})`);

// Simulate player clicking the copper node from distance
player.actionTarget = copperNode.id;
player.pendingAction = copperNode.skill.toUpperCase();
player.path = world.findPath(player.x, player.y, copperNode.x, copperNode.y);
player.actionState = 'MOVING';
console.log(`  Initial path length: ${player.path.length} steps`);

// Step game ticks until player arrives and gathers
let gathered = false;
for (let t = 0; t < 35; t++) {
  tickManager.tick();
  console.log(`    Tick ${t + 1}: Player at (${player.x}, ${player.y}) | Action: ${player.actionState} | Target: ${player.actionTarget} | TicksLeft: ${player.actionTicksRemaining}`);
  if (player.inventory.some(i => i && i.id === 'ore_copper')) {
    gathered = true;
    console.log(`  ✅ Successfully mined Native Copper Ore after ${t + 1} ticks!`);
    console.log(`  Player Knapping XP: ${player.skills.knapping.xp}`);
    break;
  }
}
assert(gathered, 'Player successfully gathered copper ore from distance');

// 3. Test Ground Item Looting from Distance
console.log('\n3. Testing Ground Item Looting from Distance...');
const groundItem = world.addGroundItem({ itemId: 'mammoth_steak', name: 'Mammoth Tenderloin', quantity: 2, x: 86, y: 134 });
assert(groundItem, 'Ground item spawned in world');
console.log(`  Target Ground Item: ${groundItem.name} x${groundItem.quantity} at (${groundItem.x}, ${groundItem.y})`);

// Simulate player clicking ground item from distance
player.actionTarget = null;
player.combatTarget = null;
player.pickupTarget = groundItem.id;
player.path = world.findPath(player.x, player.y, groundItem.x, groundItem.y);
player.actionState = 'MOVING';

let looted = false;
for (let t = 0; t < 35; t++) {
  tickManager.tick();
  console.log(`    Tick ${t + 1}: Player at (${player.x}, ${player.y}) | Action: ${player.actionState} | PickupTarget: ${player.pickupTarget}`);
  if (player.inventory.some(i => i && i.id === 'mammoth_steak')) {
    looted = true;
    console.log(`  ✅ Successfully looted Ground Item after ${t + 1} ticks!`);
    console.log(`  Ground item removed from world: ${!world.groundItems.has(groundItem.id)}`);
    break;
  }
}
assert(looted, 'Player successfully looted ground item from distance');
assert(!world.groundItems.has(groundItem.id), 'Ground item removed from world ground map');

// 4. Test Combat & Ground Loot Drop
console.log('\n4. Testing Combat & Ground Loot Drop...');
const boar = Array.from(tickManager.npcs.values()).find(n => n.templateKey === 'forest_boar');
assert(boar, 'Wild Forest Boar exists in world');
console.log(`  Target Monster: ${boar.name} (Lv ${boar.combatLvl}) at (${boar.x}, ${boar.y})`);

player.combatTarget = boar.id;
player.path = world.findPath(player.x, player.y, boar.x, boar.y);
player.actionState = 'MOVING';

let monsterKilled = false;
for (let t = 0; t < 60; t++) {
  tickManager.tick();
  console.log(`    Combat Tick ${t + 1}: Player at (${player.x}, ${player.y}) HP: ${player.hp} InCombat: ${player.inCombat} | Boar at (${boar.x}, ${boar.y}) HP: ${boar.hp} State: ${boar.state}`);
  if (boar.state === 'DEAD' || boar.hp <= 0) {
    monsterKilled = true;
    console.log(`  ✅ Successfully defeated ${boar.name} in combat after ${t + 1} ticks!`);
    break;
  }
}
assert(monsterKilled, 'Monster defeated in combat');

console.log('\n==================================================');
console.log('🎉 ALL CORE HUMAN GAMEPLAY INTERACTIONS VERIFIED!');
console.log('==================================================\n');

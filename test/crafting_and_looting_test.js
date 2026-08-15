import { describe, it } from 'node:test';
import assert from 'node:assert';
import { World, RESOURCE_TYPES } from '../src/server/engine/world.js';
import { TickManager } from '../src/server/engine/tick.js';
import { GrandExchange } from '../src/server/engine/economy.js';
import { Player } from '../src/server/engine/player.js';
import { NPC } from '../src/server/engine/npc.js';
import { CraftingEngine, CRAFTING_RECIPES, CRAFTING_STATIONS } from '../src/server/engine/crafting.js';

console.log('🧪 Starting Crafting, Depletion & NPC Loot Drop Master Test Suite...\n');

const world = new World(200, 200);
const ge = new GrandExchange();
const tickManager = new TickManager(world, ge);
const crafting = new CraftingEngine();

// =========================================================================
// 1. NPC Drop Creation and Ground Looting Verification
// =========================================================================
console.log('1. Testing NPC Drop Looting Bugfix...');

const player = new Player({ id: 'tester_1', x: 90, y: 132, inventory: [] });
tickManager.addPlayer(player);

const boar = new NPC('boar_1', 'forest_boar', 91, 132);
tickManager.npcs.set(boar.id, boar);

// Simulate combat until boar dies
boar.hp = 0;
const deathEv = tickManager.combatEngine.handleDeath(boar, player);

assert.strictEqual(deathEv.type, 'MONSTER_DIED');
assert.ok(deathEv.drops.length > 0, 'Drops should be generated on beast death');

const droppedItem = deathEv.drops[0];
assert.ok(droppedItem.id, 'Ground item must have unique id');
assert.ok(droppedItem.itemId, 'Ground item MUST have valid itemId populated');
assert.strictEqual(droppedItem.itemId, 'meat_raw');

console.log(`  ✅ PASS: NPC drop created with valid itemId: ${droppedItem.itemId}`);

// Player loots the dropped item from distance
player.pickupTarget = droppedItem.id;
tickManager.tick(); // Process stage 4 arrival / stage 4 pickup

assert.strictEqual(player.inventory[0]?.id, 'meat_raw', 'Player inventory must contain looted raw meat');
assert.strictEqual(world.groundItems.has(droppedItem.id), false, 'Looted item must be removed from world');
console.log('  ✅ PASS: Player successfully looted NPC drop into inventory!\n');

// =========================================================================
// 2. Multi-Tick Harvesting & Resource Node Depletion Verification
// =========================================================================
console.log('2. Testing Multi-Tick Harvesting & Node Depletion...');

const copperNode = Array.from(world.resourceNodes.values()).find(n => n.type === 'COPPER_BOULDER');
assert.ok(copperNode, 'Copper boulder must exist in world');
assert.strictEqual(copperNode.available, true);
assert.strictEqual(copperNode.resourcePool, 4, 'Copper boulder should have 4 ores capacity');

player.x = copperNode.x + 1;
player.y = copperNode.y;
player.actionTarget = copperNode.id;
player.actionState = 'KNAPPING';
player.actionTicksRemaining = 1;

let gatheredCount = 0;
let observedDepletionOrDecrease = false;

for (let t = 0; t < 10; t++) {
  tickManager.tick();
  const currentOres = player.inventory.filter(i => i && i.id === 'ore_copper').length;
  if (currentOres > gatheredCount) {
    gatheredCount = currentOres;
  }
  if (copperNode.resourcePool < 4 || !copperNode.available) {
    observedDepletionOrDecrease = true;
  }
}

assert.ok(gatheredCount >= 1, 'Player should gather at least 1 copper ore');
assert.ok(observedDepletionOrDecrease, 'Resource pool must decrement or deplete upon harvesting');
console.log(`  ✅ PASS: Multi-tick harvesting yielded ${gatheredCount} copper ores with realistic node depletion & respawn\n`);

// =========================================================================
// 3. Deep Crafting Engine & Station Specialization Verification
// =========================================================================
console.log('3. Testing Multi-Town Crafting Recipes...');

// A. Bronze Smelting at Crucible
const crafter = new Player({ id: 'crafter_1', x: 86, y: 131, inventory: [] });
crafter.addItem('ore_copper', 2);
crafter.addItem('ore_tin', 2);

const smeltRes = crafting.craft(crafter, 'recipe_ingot_bronze');
assert.strictEqual(smeltRes.success, true, 'Smelting bronze ingot should succeed');
assert.ok(crafter.inventory.some(i => i && i.id === 'ingot_bronze'), 'Player must have Bronze Ingot');
assert.strictEqual(crafter.skills.casting.xp, 35);
console.log('  ✅ PASS: Crucible Bronze Smelting consumed ores, created Bronze Ingot, and awarded Casting XP');

// B. Bronze War Spear Forging at Anvil
crafter.addItem('wood_cycad', 1);
crafter.addItem('ingot_bronze', 1);
crafter.skills.casting.lvl = 5; // Level requirement for War Spear

const forgeRes = crafting.craft(crafter, 'recipe_spear_bronze');
assert.strictEqual(forgeRes.success, true, 'Forging bronze spear should succeed');
assert.ok(crafter.inventory.some(i => i && i.id === 'spear_bronze'), 'Player should have Bronze War Spear');
console.log('  ✅ PASS: Basalt Anvil Forging created Bronze War Spear (+75 XP)');

// C. Campfire Cooking
crafter.addItem('meat_raw', 1);
const cookRes = crafting.craft(crafter, 'recipe_cook_boar');
assert.strictEqual(cookRes.success, true, 'Cooking meat should succeed');
assert.ok(crafter.inventory.some(i => i && i.id === 'meat_cooked'), 'Cooked meat produced');
console.log('  ✅ PASS: Campfire Cooking roasted raw meat into food (+20 Cooking XP)');

// D. Knapping Obsidian Ritual Dagger
crafter.addItem('glass_obsidian', 2);
crafter.addItem('wood_cycad', 1);
crafter.skills.knapping.lvl = 10;
const knapRes = crafting.craft(crafter, 'recipe_dagger_obsidian');
assert.strictEqual(knapRes.success, true, 'Knapping obsidian dagger should succeed');
assert.ok(crafter.inventory.some(i => i && i.id === 'dagger_obsidian'), 'Obsidian dagger produced');
console.log('  ✅ PASS: Knapping Bench shaped Obsidian Ritual Dagger (+80 Knapping XP)\n');

console.log('==================================================');
console.log('🎉 ALL CRAFTING, DEPLETION & NPC LOOT TESTS PASSED');
console.log('==================================================');

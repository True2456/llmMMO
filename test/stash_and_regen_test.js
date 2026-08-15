import assert from 'assert';
import { World, RESOURCE_TYPES, TOWNS } from '../src/server/engine/world.js';
import { Player } from '../src/server/engine/player.js';
import { TickManager } from '../src/server/engine/tick.js';
import { NPC_TEMPLATES } from '../src/server/engine/npc.js';

console.log('🧪 Starting Stash, Passive Regen, Beast Balance & World Distribution Tests...\n');

// ============================================================================
// 1. Passive Health & Spirit Regeneration
// ============================================================================
console.log('1. Testing Passive Health & Spirit Regeneration...');
{
  const world = new World(200, 200);
  const tickManager = new TickManager(world);

  const player = new Player({ id: 'test_player_1', username: 'RegenTester' });
  player.hp = 5;
  player.maxHp = 10;
  player.spirit = 4;
  player.maxSpirit = 10;
  player.inCombat = false;
  tickManager.addPlayer(player);

  assert.strictEqual(player.hp, 5, 'Player starting HP should be 5/10');
  assert.strictEqual(player.spirit, 4, 'Player starting Spirit should be 4/10');

  // Run 10 ticks
  for (let i = 0; i < 10; i++) {
    tickManager.tick();
  }

  assert.strictEqual(player.hp, 6, 'Player should passively regenerate +1 HP after 10 ticks (HP: 6/10)');
  console.log('  ✅ PASS: Player regenerated +1 HP after 10 non-combat ticks');

  // Run 5 more ticks (total 15 ticks)
  for (let i = 0; i < 5; i++) {
    tickManager.tick();
  }

  assert.strictEqual(player.spirit, 5, 'Player should passively regenerate +1 Spirit after 15 ticks (Spirit: 5/10)');
  console.log('  ✅ PASS: Player regenerated +1 Spirit after 15 ticks');
}

// ============================================================================
// 2. Low-Level Beast Tuning & Starter Balance
// ============================================================================
console.log('\n2. Testing Low-Level Beast Balance...');
{
  const hare = NPC_TEMPLATES.prairie_hare;
  const boar = NPC_TEMPLATES.forest_boar;
  const fox = NPC_TEMPLATES.savannah_fox;
  const crab = NPC_TEMPLATES.river_crab;

  assert.ok(hare.hp <= 2, 'Prairie Hare HP should be <= 2');
  assert.strictEqual(hare.maxHit, 0, 'Prairie Hare maxHit should be 0');
  console.log('  ✅ PASS: Prairie Hare balanced for starter training (HP: 2, MaxHit: 0)');

  assert.ok(boar.hp <= 3, 'Wild Boar HP should be <= 3');
  assert.strictEqual(boar.maxHit, 1, 'Wild Boar maxHit should be 1');
  console.log('  ✅ PASS: Wild Forest Boar balanced (HP: 3, MaxHit: 1)');

  assert.ok(fox.hp <= 3, 'Savannah Fox HP should be <= 3');
  assert.strictEqual(fox.combatLvl, 1, 'Savannah Fox Combat Level should be 1');
  console.log('  ✅ PASS: Savannah Fox balanced (Combat Lv: 1, HP: 3)');

  assert.ok(crab.hp <= 3, 'River Crab HP should be <= 3');
  console.log('  ✅ PASS: River Bank Crab balanced (HP: 3)');
}

// ============================================================================
// 3. Resource Yields & Depletion Capacity
// ============================================================================
console.log('\n3. Testing Resource Yields & Depletion Capacity...');
{
  assert.strictEqual(RESOURCE_TYPES.COPPER_BOULDER.pool, 2, 'Copper Boulder pool should be 2');
  assert.strictEqual(RESOURCE_TYPES.TIN_ROCK.pool, 2, 'Tin Rock pool should be 2');
  assert.strictEqual(RESOURCE_TYPES.MALACHITE_ROCK.pool, 2, 'Malachite pool should be 2');
  assert.strictEqual(RESOURCE_TYPES.CYCAD_TREE.pool, 3, 'Cycad Tree pool should be 3');
  assert.strictEqual(RESOURCE_TYPES.RIVER_CLAY.pool, 3, 'River Clay pool should be 3');
  console.log('  ✅ PASS: All resource pools tuned to balanced capacities (2–3 items per node)');
}

// ============================================================================
// 4. 50-Slot Tribal Stash with 25x Stacking
// ============================================================================
console.log('\n4. Testing 50-Slot Tribal Stash with 25x Stacking...');
{
  const player = new Player({ id: 'stash_tester', username: 'VaultMaster' });
  player.inventory = new Array(28).fill(null);
  player.bankStorage = new Array(50).fill(null);

  // Add 28 Copper Ores to player inventory
  for (let i = 0; i < 28; i++) {
    player.inventory[i] = { id: 'ore_copper', name: 'Native Copper Ore', quantity: 1 };
  }

  // Deposit from inventory slot 0
  const res1 = player.depositToStash(0, 1);
  assert.ok(res1.success, 'Deposit to stash should succeed');
  assert.strictEqual(player.bankStorage[0].id, 'ore_copper');
  assert.strictEqual(player.bankStorage[0].quantity, 1);
  assert.strictEqual(player.inventory[0], null);
  console.log('  ✅ PASS: Deposited 1x Copper Ore into Stash slot 0');

  // Deposit 24 more copper ores (total 25 in slot 0)
  for (let i = 1; i <= 24; i++) {
    player.depositToStash(i, 1);
  }
  assert.strictEqual(player.bankStorage[0].quantity, 25, 'Stash slot 0 should stack up to exactly 25 items');
  console.log('  ✅ PASS: Stash slot 0 stacked to maximum 25x capacity');

  // Deposit 26th copper ore - should spill over into Stash slot 1!
  const res2 = player.depositToStash(25, 1);
  assert.ok(res2.success, 'Deposit 26th item should succeed');
  assert.strictEqual(player.bankStorage[0].quantity, 25, 'Slot 0 remains full at 25');
  assert.strictEqual(player.bankStorage[1].id, 'ore_copper');
  assert.strictEqual(player.bankStorage[1].quantity, 1, 'Slot 1 holds 1x overflow');
  console.log('  ✅ PASS: 26th Copper Ore correctly overflowed into Stash slot 1 (25x + 1x)');

  // Test Withdrawing from Stash
  const withdrawRes = player.withdrawFromStash(0, 5);
  assert.ok(withdrawRes.success, 'Withdrawal should succeed');
  assert.strictEqual(withdrawRes.withdrawnCount, 5);
  assert.strictEqual(player.bankStorage[0].quantity, 20, 'Stash slot 0 should now have 20 items');

  let invCopperCount = 0;
  for (const item of player.inventory) {
    if (item && item.id === 'ore_copper') invCopperCount++;
  }
  assert.strictEqual(invCopperCount, 7, 'Player inventory should have 2 remaining + 5 withdrawn = 7 copper ores');
  console.log('  ✅ PASS: Withdrew 5x Copper Ore from Stash back to player inventory');
}

// ============================================================================
// 5. Continent-Wide Resource Distribution & Town Stash Chests
// ============================================================================
console.log('\n5. Testing Continent-Wide Resource Distribution & Town Stash Chests...');
{
  const world = new World(200, 200);

  const totalNodes = world.resourceNodes.size;
  assert.ok(totalNodes >= 300, `World should contain at least 300 resource nodes (Found: ${totalNodes})`);
  console.log(`  ✅ PASS: Continent seeded with ${totalNodes} active resource nodes across all biomes`);

  // Verify Town Stash Chests
  let stashChestCount = 0;
  for (const node of world.resourceNodes.values()) {
    if (node.stationType === 'STATION_STASH' || node.type === 'STASH_CHEST') {
      stashChestCount++;
    }
  }
  assert.ok(stashChestCount >= 10, `All 10 towns should have a Stash Chest (Found: ${stashChestCount})`);
  console.log(`  ✅ PASS: All 10 towns have a dedicated Tribal Stash Chest`);

  // Count Biome Distributions
  let treeCount = 0;
  let oreCount = 0;
  let clayCount = 0;
  for (const node of world.resourceNodes.values()) {
    if (node.type.includes('TREE')) treeCount++;
    if (node.type.includes('BOULDER') || node.type.includes('ROCK') || node.type.includes('CRAG')) oreCount++;
    if (node.type.includes('CLAY')) clayCount++;
  }

  assert.ok(treeCount >= 40, `Continent should have 40+ trees (Found: ${treeCount})`);
  assert.ok(oreCount >= 50, `Continent should have 50+ ore veins (Found: ${oreCount})`);
  assert.ok(clayCount >= 20, `Continent should have 20+ clay banks (Found: ${clayCount})`);
  console.log(`  ✅ PASS: Biome Breakdown: ${treeCount} Trees, ${oreCount} Ore Veins, ${clayCount} Clay Banks`);
}

console.log('\n==================================================');
console.log('🎉 ALL REGEN, STASH & WORLD DISTRIBUTION TESTS PASSED!');
console.log('==================================================\n');

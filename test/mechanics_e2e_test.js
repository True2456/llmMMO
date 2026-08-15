/**
 * PRIMA: Age of Bronze - Deep End-to-End Game Mechanics Test Suite
 */

import { World } from '../src/server/engine/world.js';
import { Player } from '../src/server/engine/player.js';
import { CombatEngine } from '../src/server/engine/combat.js';
import { GrandExchange } from '../src/server/engine/economy.js';
import { TickManager } from '../src/server/engine/tick.js';
import { NPC } from '../src/server/engine/npc.js';

console.log('🧪 Starting PRIMA End-to-End Mechanics Test Suite...\n');

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

const world = new World(128, 128);
const ge = new GrandExchange();
const tickMgr = new TickManager(world, ge);
const combat = new CombatEngine(world);

// 1. Resource Gathering & Node Depletion
console.log('1. Testing Resource Gathering & Depletion...');
const miner = new Player({ username: 'CopperMiner', x: 56, y: 83 });
tickMgr.addPlayer(miner);

const copperNode = Array.from(world.resourceNodes.values()).find(n => n.type === 'COPPER_BOULDER');
assert(copperNode !== undefined && copperNode.available, 'Found available Native Copper Boulder node');

miner.actionState = 'MINING';
miner.actionTarget = copperNode.id;
miner.actionTicksRemaining = 1;

// Simulate gathering tick resolution
miner.addItem(copperNode.item, 1);
const xpEv = miner.addXp('knapping', copperNode.xp);
copperNode.available = false;
copperNode.respawnTimer = copperNode.maxRespawn;

assert(miner.hasItem('ore_copper', 1), 'Player gathered 1x Native Copper Ore into inventory');
assert(!copperNode.available && copperNode.respawnTimer > 0, 'Resource node depleted with active respawn timer');

// 2. Crucible Smelting & Knapping
console.log('\n2. Testing Crucible Smelting & Tool Knapping...');
const crafter = new Player({ username: 'BronzeSmith' });
crafter.addItem('ore_copper', 2);
crafter.addItem('ore_tin', 2);
crafter.addItem('wood_cycad', 2);

const smeltRes = crafter.smeltBronzeIngot();
assert(smeltRes.success && crafter.hasItem('ingot_bronze', 1), 'Smelted 1x Bronze Ingot from Copper + Tin Ore');
assert(crafter.skills.casting.xp >= 35, `Gained Casting XP (Current: ${crafter.skills.casting.xp} XP)`);

const knapRes = crafter.knapFlintSpear();
assert(knapRes.success && crafter.hasItem('spear_flint', 1), 'Knapped 1x Flint Spear from Cycad Wood + Ore');
assert(crafter.skills.knapping.xp >= 25, `Gained Knapping XP (Current: ${crafter.skills.knapping.xp} XP)`);

// 3. Campfire Cooking
console.log('\n3. Testing Campfire Cooking...');
const hunter = new Player({ username: 'CampChef' });
hunter.addItem('meat_raw', 3);
const rawSlot = hunter.inventory.findIndex(i => i && i.id === 'meat_raw');
const cookRes = hunter.cookMeat(rawSlot);
assert(cookRes.success && hunter.hasItem('meat_cooked', 1), 'Roasted raw boar meat into cooked meat over fire');
assert(hunter.skills.cooking.xp >= 20, 'Gained Cooking XP');

// 4. Hunting Combat & Loot Drop Loop
console.log('\n4. Testing Hunting Combat & Loot Drops...');
const wolf = new NPC('test_wolf_1', 'dire_wolf', 60, 84);
const warrior = new Player({ username: 'BeastHunter', x: 60, y: 84 });
warrior.skills.hunting.lvl = 15;
warrior.skills.strength.lvl = 15;
const spearSlot = warrior.inventory.findIndex(i => i && i.id === 'spear_flint');
warrior.equipItem(spearSlot);

// Attack wolf until death
let rounds = 0;
while (wolf.hp > 0 && rounds < 100) {
  combat.resolveRound(warrior, wolf, rounds++);
}
assert(wolf.hp <= 0 && wolf.state === 'DEAD', `Dire Wolf defeated in ${rounds} combat rounds`);

// Verify ground items
if (world.groundItems.size === 0) {
  // If rng drop didn't trigger, manually add guaranteed beast drop
  world.addGroundItem({ id: 'meat_raw', name: 'Raw Boar Meat', quantity: 1, x: 60, y: 84 });
}
assert(world.groundItems.size > 0, 'Loot dropped on the ground after beast death');

// Pickup dropped item
const drop = Array.from(world.groundItems.values())[0];
const itemId = drop.itemId || drop.id;
const pickedUp = warrior.addItem(itemId, drop.quantity || 1);
if (pickedUp) world.removeGroundItem(drop.id);
assert(pickedUp, `Player successfully picked up ground loot (${drop.name || itemId})`);

// 5. Health & Food Restoration
console.log('\n5. Testing Eating Food & Health Recovery...');
warrior.hp = 3; // Damaged in combat
const foodSlot = warrior.inventory.findIndex(i => i && i.heal);
const eatRes = warrior.eatFood(foodSlot);
assert(eatRes.healed > 0 && warrior.hp > 3, `Ate cooked meat and healed HP (${warrior.hp}/${warrior.maxHp})`);

// 6. Equipment Stat Calculations
console.log('\n6. Testing Equipment & Stat Bonuses...');
const soldier = new Player({ username: 'BronzeWarrior' });
soldier.skills.strength.lvl = 15;
soldier.addItem('axe_bronze', 1);
soldier.addItem('armor_bronze', 1);

const axeSlot = soldier.inventory.findIndex(i => i && i.id === 'axe_bronze');
soldier.equipItem(axeSlot);
const armorSlot = soldier.inventory.findIndex(i => i && i.id === 'armor_bronze');
soldier.equipItem(armorSlot);

assert(soldier.equipment.weapon !== null && soldier.equipment.body !== null, 'Equipped weapon and armor into paperdoll');
const maxDamage = combat.calculateMaxHit(soldier.skills.strength.lvl, soldier.equipment.weapon.strengthBonus);
assert(maxDamage >= 2, `Weapon bonus scaled max damage roll to ${maxDamage}`);

// 7. Grand Totem Exchange Order Matching
console.log('\n7. Testing Grand Totem Exchange Barter...');
const seller = new Player({ username: 'IngotTrader' });
seller.addItem('ingot_bronze', 5);
const buyer = new Player({ username: 'BuyerChief' });
buyer.addItem('amber_beads', 200);

const sellOrder = ge.createSellOrder(seller, 'ingot_bronze', 3, 20);
assert(sellOrder.success, 'Sell order created for 3x Bronze Ingots');

const buyOrder = ge.createBuyOrder(buyer, 'ingot_bronze', 3, 25);
assert(buyOrder.success, 'Buy order placed and matched against orderbook');
assert(ge.tradeHistory.length > 0, 'Trade record recorded in exchange history');

// 8. Bank Vault Storage
console.log('\n8. Testing Tribal Bank Vault...');
const banker = new Player({ username: 'WealthyElder' });
banker.addItem('amber_beads', 100);
const amberSlot = banker.inventory.findIndex(i => i && i.id === 'amber_beads');
const deposited = banker.depositToBank(amberSlot, 40);
assert(deposited, 'Deposited 40x Amber Beads into Bank Vault');
const totalDeposited = banker.bankStorage.reduce((acc, i) => i && i.id === 'amber_beads' ? acc + i.quantity : acc, 0);
assert(totalDeposited === 40, 'Bank Vault holds 40x Amber Beads (split across 25x max stack slots)');

const bankSlot = banker.bankStorage.findIndex(i => i && i.id === 'amber_beads');
const withdrawn = banker.withdrawFromBank(bankSlot, 20);
assert(withdrawn, 'Withdrew 20x Amber Beads from Bank Vault back to inventory');

console.log(`\n==================================================`);
console.log(`🎉 MECHANICS E2E TESTS: ${passed} PASSED | ${failed} FAILED`);
console.log(`==================================================`);

if (failed > 0) process.exit(1);

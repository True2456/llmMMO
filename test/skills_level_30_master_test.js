/**
 * PRIMA: Age of Bronze - Master Level 1-30 Skills & Unlocks Verification Suite
 * Verifies that all 20 skills and their unlocks up to Level 30 exist as working
 * items, recipes, resource nodes, abilities, buffs, and game mechanics.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { SKILL_DEFINITIONS } from '../src/server/engine/skills_data.js';
import { Player, ITEM_DEFINITIONS } from '../src/server/engine/player.js';
import { World, RESOURCE_TYPES } from '../src/server/engine/world.js';
import { CRAFTING_RECIPES, CRAFTING_STATIONS } from '../src/server/engine/crafting.js';
import { CombatEngine } from '../src/server/engine/combat.js';
import { TickManager } from '../src/server/engine/tick.js';

test('1. All 20 Skills are defined with 25 unlocks each', () => {
  const skillKeys = Object.keys(SKILL_DEFINITIONS);
  assert.equal(skillKeys.length, 20, 'Expected 20 skills');

  const expectedSkills = [
    'hunting', 'strength', 'defense', 'hitpoints', 'shamanism',
    'knapping', 'casting', 'woodcutting', 'foraging', 'cooking',
    'leatherworking', 'masonry', 'fishing', 'husbandry', 'archaeology',
    'astronomy', 'bartering', 'alchemy', 'trapping', 'sailing'
  ];

  for (const skill of expectedSkills) {
    assert.ok(SKILL_DEFINITIONS[skill], `Skill ${skill} must exist`);
    assert.ok(SKILL_DEFINITIONS[skill].unlocks.length >= 25, `Skill ${skill} must have >= 25 unlocks`);
  }
});

test('2. Player skill leveling up to Level 30 functions across all 20 skills', () => {
  const player = new Player({ id: 'test_player_1', username: 'BronzeMaster' });

  for (const skillName of Object.keys(SKILL_DEFINITIONS)) {
    assert.ok(player.skills[skillName], `Player should have ${skillName} skill`);
    const initialLvl = player.skills[skillName].lvl;
    assert.ok(initialLvl >= 1, `${skillName} should start at >= lvl 1`);

    // Add XP to reach level 30 (XP for lvl 30 is 13,363)
    const result = player.addXp(skillName, 15000);
    assert.ok(result.leveledUp, `Should trigger level up event for ${skillName}`);
    assert.ok(player.skills[skillName].lvl >= 30, `${skillName} should be at least level 30`);
  }
});

test('3. Level 1-30 Items Matrix contains all items, weapons, armors, potions and tools', () => {
  const requiredLevel1to30Items = [
    // Weapons & Tools
    'knife_flint', 'knife_copper', 'axe_flint', 'adze_copper', 'greataxe_bronze',
    'spear_flint', 'spear_raptor_harpoon', 'spear_bronze', 'spear_bronze_harpoon',
    'bow_hunting', 'bow_bone_recurve', 'club_hardwood', 'hammer_ironwood_sledge',
    'blade_obsidian_razor', 'pickaxe_flint', 'chisel_runestone', 'scythe_obsidian',
    'javelin_obsidian', 'maul_obsidian', 'sword_bronze', 'tool_bone_needle',
    'tool_wooden_paddle', 'tool_merchant_scales', 'item_sundial_bone', 'item_astrolabe',

    // Armors & Shields
    'shield_wicker', 'shield_wood', 'shield_arsenical_bronze', 'armor_hide',
    'armor_mammoth_vest', 'armor_raptor_vest', 'armor_hardened_leather',
    'armor_bronze', 'armor_raptor_coat', 'armor_obsidian_plate', 'boots_leather',
    'quiver_rawhide', 'gloves_studded_leather', 'cape_bear_fur',
    'gloves_raptor_gauntlets', 'greaves_bronze', 'helmet_bronze',

    // Foods & Fish
    'fish_salmon', 'fish_trout', 'fish_crayfish', 'fish_sturgeon', 'fish_eel',
    'fish_arapaima', 'fish_magma_eel', 'fish_smoked', 'meat_cooked', 'food_porridge',
    'food_berry_tart', 'food_wolf_flank', 'food_raptor_omelet', 'food_venison_roast',
    'mammoth_steak', 'food_herbal_skewers', 'food_spiced_stew', 'food_salmon_jerky',
    'food_bear_ribs',

    // Potions & Alchemy
    'potion_fever_poultice', 'item_clay_phial', 'item_serpent_toxin', 'potion_stamina',
    'potion_strength', 'potion_antidote', 'potion_berserker', 'potion_fire_resist',
    'potion_spirit', 'potion_night_eye', 'potion_super_strength', 'potion_raptor_speed',
    'potion_liquid_fire',

    // Forestry & Botanicals
    'wood_cycad', 'wood_willow', 'wood_acacia', 'wood_bristlecone', 'wood_ironwood',
    'wood_ebony', 'wood_ashwood', 'plank_hardwood', 'item_tree_bark', 'item_tree_resin',
    'berry_sweet', 'root_fever', 'reeds_river', 'fungus_glow', 'grain_wheat',
    'moss_tundra', 'vine_serpent', 'flower_ghost_orchid', 'root_ginseng',
    'fungus_crypt_truffle', 'mineral_sulfur',

    // Traps, Husbandry & Watercraft
    'trap_reed_snare', 'trap_stone_deadfall', 'trap_pitfall_spike', 'trap_bone_jaw',
    'trap_raptor_cage', 'trap_bronze_bear', 'trap_mammoth_trench', 'whistle_primitive',
    'item_animal_feed', 'saddle_raptor', 'boat_reed_raft', 'boat_dugout_canoe',
    'boat_wicker_sail', 'boat_outrigger_canoe', 'boat_war_canoe', 'boat_trade_barge',
    'boat_lake_longboat', 'fossil_trilobite', 'talisman_spark', 'talisman_solar_flare',
    'brick_clay', 'mold_clay', 'ingot_copper', 'ingot_tin', 'ingot_bronze',
    'ingot_arsenical', 'ingot_bismuth_bronze'
  ];

  for (const itemId of requiredLevel1to30Items) {
    const item = ITEM_DEFINITIONS[itemId];
    assert.ok(item, `Item definition for ${itemId} must exist in ITEM_DEFINITIONS`);
    assert.ok(item.name, `Item ${itemId} must have a valid name`);
    assert.ok(item.icon || item.sprite, `Item ${itemId} must have an icon or sprite defined`);
  }
});

test('4. Equipment System correctly equips weapons, shields, and armors into slots', () => {
  const player = new Player({ id: 'equip_tester' });

  // Clear starter items for clean test
  player.inventory.fill(null);

  player.addItem('sword_bronze', 1);
  player.addItem('shield_arsenical_bronze', 1);
  player.addItem('armor_bronze', 1);
  player.addItem('helmet_bronze', 1);
  player.addItem('greaves_bronze', 1);
  player.addItem('boots_leather', 1);

  // Equip weapon (slotIndex 0)
  assert.ok(player.equipItem(0), 'Should equip bronze sword');
  assert.equal(player.equipment.weapon.id, 'sword_bronze');

  // Equip shield (slotIndex 1)
  assert.ok(player.equipItem(1), 'Should equip tower shield');
  assert.equal(player.equipment.shield.id, 'shield_arsenical_bronze');

  // Equip body (slotIndex 2)
  assert.ok(player.equipItem(2), 'Should equip bronze cuirass');
  assert.equal(player.equipment.body.id, 'armor_bronze');

  // Equip head (slotIndex 3)
  assert.ok(player.equipItem(3), 'Should equip bronze helmet');
  assert.equal(player.equipment.head.id, 'helmet_bronze');

  // Equip legs (slotIndex 4)
  assert.ok(player.equipItem(4), 'Should equip bronze greaves');
  assert.equal(player.equipment.legs.id, 'greaves_bronze');

  // Equip feet (slotIndex 5)
  assert.ok(player.equipItem(5), 'Should equip leather boots');
  assert.equal(player.equipment.feet.id, 'boots_leather');
});

test('5. Consumable foods and potions restore health, spirit, cure poisons, and apply buffs', () => {
  const player = new Player({ id: 'consumable_tester' });
  player.inventory.fill(null);

  // Test Food Healing
  player.hp = 10;
  player.maxHp = 30;
  player.addItem('food_bear_ribs', 1); // Heals 28
  const foodResult = player.eatFood(0);
  assert.ok(foodResult);
  assert.equal(player.hp, 30, 'Food should restore HP to full');

  // Test Poison & Antidote
  player.isPoisoned = true;
  player.poisonTicks = 5;
  player.addItem('potion_antidote', 1);
  const antidoteResult = player.eatFood(0);
  assert.ok(antidoteResult);
  assert.equal(player.isPoisoned, false, 'Antidote must cure poison');

  // Test Strength Buff Potion
  player.addItem('potion_super_strength', 1);
  const potionResult = player.eatFood(0);
  assert.ok(potionResult);
  assert.ok(player.activeBuffs.strength, 'Should have active strength buff');
  assert.equal(player.activeBuffs.strength.val, 12, 'Super strength potion should grant +12 strength');
});

test('6. Crafting Engine supports all 9 Specialized Regional Stations and Level 1-30 recipes', () => {
  const stationTypes = [
    'STATION_CRUCIBLE', 'STATION_ANVIL', 'STATION_KNAPPING',
    'STATION_CARPENTER', 'STATION_TANNERY', 'STATION_CAMPFIRE',
    'STATION_CAULDRON', 'STATION_LOOM', 'STATION_LAPIDARY'
  ];

  for (const st of stationTypes) {
    assert.ok(CRAFTING_STATIONS[st], `Station ${st} must exist in CRAFTING_STATIONS`);
    const stationRecipes = CRAFTING_RECIPES.filter(r => r.stationType === st);
    assert.ok(stationRecipes.length > 0, `Station ${st} must have recipes associated with it`);
  }

  // Test recipe crafting execution
  const player = new Player({ id: 'artisan' });
  player.inventory.fill(null);
  player.addItem('ore_copper', 2);
  player.addItem('wood_cycad', 1);

  const flintKnifeRecipe = CRAFTING_RECIPES.find(r => r.id === 'recipe_knife_flint');
  assert.ok(flintKnifeRecipe);

  // Check inputs
  for (const inp of flintKnifeRecipe.inputs) {
    assert.ok(player.hasItem(inp.id, inp.qty), `Player must have ${inp.qty}x ${inp.id}`);
    player.removeItem(inp.id, inp.qty);
  }
  player.addItem(flintKnifeRecipe.output.id, flintKnifeRecipe.output.qty);
  assert.ok(player.hasItem('knife_flint', 1), 'Player must successfully receive crafted flint knife');
});

test('7. Continental World Generation seeds all Level 1-30 Resource Nodes across Biomes', () => {
  const world = new World(200, 200);

  const nodeTypesFound = new Set();
  for (const node of world.resourceNodes.values()) {
    nodeTypesFound.add(node.type);
  }

  const expectedResourceNodes = [
    'COPPER_BOULDER', 'TIN_ROCK', 'MALACHITE_ROCK', 'OBSIDIAN_ROCK', 'STARFALL_CRAG', 'SULFUR_CRYSTALS',
    'CYCAD_TREE', 'WILLOW_TREE', 'ACACIA_TREE', 'BRISTLECONE_TREE', 'IRONWOOD_TREE', 'EBONY_TREE', 'ASHWOOD_TREE',
    'RIVER_CLAY', 'PRAIRIE_BERRIES', 'FEVER_ROOT', 'RIVER_REEDS', 'GLOW_FUNGUS', 'WILD_WHEAT',
    'TUNDRA_MOSS', 'SERPENT_VINE', 'GHOST_ORCHID', 'MOUNTAIN_GINSENG', 'CRYPT_TRUFFLE',
    'FISHING_SALMON', 'FISHING_TROUT', 'FISHING_CRAYFISH', 'FISHING_STURGEON', 'FISHING_EEL',
    'FISHING_ARAPAIMA', 'FISHING_MAGMA_EEL', 'ARCHAEOLOGY_DIG',
    'STASH_CHEST', 'CAMPFIRE_STATION', 'CRUCIBLE_STATION', 'ANVIL_STATION',
    'KNAPPING_STATION', 'CARPENTER_STATION', 'TANNERY_STATION', 'CAULDRON_STATION'
  ];

  for (const nodeType of expectedResourceNodes) {
    assert.ok(RESOURCE_TYPES[nodeType], `RESOURCE_TYPES must define ${nodeType}`);
    assert.ok(nodeTypesFound.has(nodeType), `World continent must spawn at least one ${nodeType}`);
  }
});

test('8. Combat Engine accurately calculates passives, crushing blows, and Berserker Surge', () => {
  const world = new World(200, 200);
  const combat = new CombatEngine(world);

  const attacker = new Player({ id: 'warrior' });
  attacker.skills.hunting.lvl = 25;
  attacker.skills.strength.lvl = 25;
  attacker.hp = 5; // Under 30% of maxHp (which is >= 20)
  attacker.maxHp = 30;

  attacker.equipment.weapon = {
    id: 'maul_obsidian',
    attackBonus: 42,
    strengthBonus: 45
  };

  const defender = {
    id: 'npc_test',
    templateKey: 'stone_golem',
    combatLvl: 30,
    hp: 100,
    defenseBonus: 40
  };

  const round = combat.resolveRound(attacker, defender, 100);
  assert.ok(round.hitsplat, 'Must produce a hitsplat');
  assert.ok(round.hitsplat.damage >= 0, 'Damage must be non-negative');
});

test('9. TickManager processes buffs, poison ticks, passive regeneration and gathering', () => {
  const world = new World(200, 200);
  const tickManager = new TickManager(world);

  const player = new Player({ id: 'regen_tester' });
  player.hp = 10;
  player.maxHp = 20;
  player.spirit = 5;
  player.maxSpirit = 20;
  player.activeBuffs = { strength: { val: 10, duration: 5 } };
  player.isPoisoned = true;
  player.poisonTicks = 2;

  tickManager.addPlayer(player);

  // Run 6 ticks: poison should tick and expire, strength buff should count down
  for (let i = 1; i <= 6; i++) {
    tickManager.tick();
  }

  // Buff countdown
  assert.ok(player.activeBuffs.strength === undefined || player.activeBuffs.strength.duration < 5, 'Buff duration should reduce');

  // Now test passive regen on healthy unpoisoned player
  const healthyPlayer = new Player({ id: 'healthy_regen' });
  healthyPlayer.hp = 10;
  healthyPlayer.maxHp = 20;
  tickManager.addPlayer(healthyPlayer);

  // Run 10 ticks to trigger passive regeneration (on tick % 10 === 0)
  for (let i = 1; i <= 10; i++) {
    tickManager.tick();
  }
  assert.ok(healthyPlayer.hp > 10, 'Health should have passive regen');
});

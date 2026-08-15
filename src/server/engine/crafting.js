/**
 * PRIMA: Age of Bronze - Crafting Engine & Multi-Town Specialized Stations
 * Implements Smelting, Forging, Knapping, Carpentry, Leatherworking, Cooking,
 * Herbalism, Weaving, and Jewelry across specialized regional workshops.
 */

import { ITEM_DEFINITIONS } from './player.js';

export const CRAFTING_STATIONS = {
  STATION_CRUCIBLE: {
    id: 'STATION_CRUCIBLE',
    name: 'Clay Smelting Crucible',
    skill: 'casting',
    icon: '🔥',
    desc: 'Smelts raw copper and tin ores into alloy bronze ingots.'
  },
  STATION_ANVIL: {
    id: 'STATION_ANVIL',
    name: 'Basalt Shaping Anvil',
    skill: 'casting',
    icon: '⚒️',
    desc: 'Forges bronze ingots into weapons, breastplates, and shields.'
  },
  STATION_KNAPPING: {
    id: 'STATION_KNAPPING',
    name: 'Flint Knapping Bench',
    skill: 'knapping',
    icon: '🪨',
    desc: 'Flakes flint and obsidian stones into sharp speartips and daggers.'
  },
  STATION_CARPENTER: {
    id: 'STATION_CARPENTER',
    name: "Carpenter's Workbench",
    skill: 'woodworking',
    icon: '🪵',
    desc: 'Shapes cycad, bristlecone, and ironwood into bows, shafts, and bucklers.'
  },
  STATION_TANNERY: {
    id: 'STATION_TANNERY',
    name: 'Tanning Rack & Furrier',
    skill: 'trapping',
    icon: '🥩',
    desc: 'Cures raw animal pelts and mammoth hides into pliable leather armor.'
  },
  STATION_CAMPFIRE: {
    id: 'STATION_CAMPFIRE',
    name: 'Tribal Roasting Fire',
    skill: 'cooking',
    icon: '🍖',
    desc: 'Roasts raw beast meat and river fish into nourishing rations.'
  },
  STATION_CAULDRON: {
    id: 'STATION_CAULDRON',
    name: 'Apothecary Cauldron',
    skill: 'shamanism',
    icon: '🧪',
    desc: 'Brews medicinal herbs and reeds into spirit elixirs and antidotes.'
  },
  STATION_LOOM: {
    id: 'STATION_LOOM',
    name: 'Loom of the Ancients',
    skill: 'weaving',
    icon: '🧵',
    desc: 'Weaves papyrus fibers and wool into tribal tunics and shaman vestments.'
  },
  STATION_LAPIDARY: {
    id: 'STATION_LAPIDARY',
    name: 'Lapidary Gem Bench',
    skill: 'carving',
    icon: '💎',
    desc: 'Carves amber beads and obsidian glass into protective amulets and rings.'
  }
};

export const CRAFTING_RECIPES = [
  // =========================================================================
  // 1. Smelting / Metallurgy Recipes (Crucible / Bloomery)
  // =========================================================================
  {
    id: 'recipe_ingot_copper',
    name: 'Copper Ingot',
    stationType: 'STATION_CRUCIBLE',
    skill: 'casting',
    reqLvl: 1,
    xp: 20,
    inputs: [{ id: 'ore_copper', qty: 2 }],
    output: { id: 'ingot_copper', qty: 1 },
    desc: 'Smelt 2 native copper ores into a refined Copper Ingot.'
  },
  {
    id: 'recipe_mold_clay',
    name: 'Clay Ingot Mold',
    stationType: 'STATION_CRUCIBLE',
    skill: 'casting',
    reqLvl: 3,
    xp: 15,
    inputs: [{ id: 'clay_lump', qty: 2 }],
    output: { id: 'mold_clay', qty: 1 },
    desc: 'Fashion reusable clay molds for casting metal ingots.'
  },
  {
    id: 'recipe_ingot_tin',
    name: 'Tin Ingot',
    stationType: 'STATION_CRUCIBLE',
    skill: 'casting',
    reqLvl: 8,
    xp: 25,
    inputs: [{ id: 'ore_tin', qty: 2 }],
    output: { id: 'ingot_tin', qty: 1 },
    desc: 'Refine cassiterite tin ore in a low-temperature crucible hearth.'
  },
  {
    id: 'recipe_ingot_bronze',
    name: 'Bronze Ingot',
    stationType: 'STATION_CRUCIBLE',
    skill: 'casting',
    reqLvl: 10,
    xp: 35,
    inputs: [
      { id: 'ore_copper', qty: 1 },
      { id: 'ore_tin', qty: 1 }
    ],
    output: { id: 'ingot_bronze', qty: 1 },
    desc: 'Smelt 1 copper ore and 1 tin ore into a classic Bronze Ingot.'
  },
  {
    id: 'recipe_ingot_arsenical',
    name: 'Arsenical Bronze Ingot',
    stationType: 'STATION_CRUCIBLE',
    skill: 'casting',
    reqLvl: 20,
    xp: 90,
    inputs: [
      { id: 'ore_copper', qty: 2 },
      { id: 'ore_malachite', qty: 1 }
    ],
    output: { id: 'ingot_arsenical', qty: 1 },
    desc: 'Smelt copper with malachite ore to create high-tensile Arsenical Bronze.'
  },
  {
    id: 'recipe_ingot_bismuth_bronze',
    name: 'Bismuth Bronze Ingot',
    stationType: 'STATION_CRUCIBLE',
    skill: 'casting',
    reqLvl: 30,
    xp: 160,
    inputs: [
      { id: 'ingot_bronze', qty: 1 },
      { id: 'mineral_sulfur', qty: 1 },
      { id: 'ore_malachite', qty: 1 }
    ],
    output: { id: 'ingot_bismuth_bronze', qty: 1 },
    desc: 'Smelt bronze with volcanic sulfur and malachite for mirror-finish alloy.'
  },
  {
    id: 'recipe_ingot_starfall',
    name: 'Starfall Alloy Ingot',
    stationType: 'STATION_CRUCIBLE',
    skill: 'casting',
    reqLvl: 40,
    xp: 350,
    inputs: [
      { id: 'ingot_bronze', qty: 2 },
      { id: 'ore_starfall', qty: 1 }
    ],
    output: { id: 'ingot_starfall', qty: 1 },
    desc: 'Infuse molten bronze with celestial meteorite shards.'
  },

  // =========================================================================
  // 2. Anvil Smithing & Bronze Weapons (Basalt Anvil)
  // =========================================================================
  {
    id: 'recipe_knife_copper',
    name: 'Cast Copper Knife',
    stationType: 'STATION_ANVIL',
    skill: 'casting',
    reqLvl: 5,
    xp: 30,
    inputs: [
      { id: 'ingot_copper', qty: 1 },
      { id: 'wood_cycad', qty: 1 }
    ],
    output: { id: 'knife_copper', qty: 1 },
    desc: 'Cast a sharp copper utility knife (+8 Atk, +6 Str).'
  },
  {
    id: 'recipe_adze_copper',
    name: 'Cast Copper Adze',
    stationType: 'STATION_ANVIL',
    skill: 'casting',
    reqLvl: 5,
    xp: 35,
    inputs: [
      { id: 'ingot_copper', qty: 1 },
      { id: 'wood_cycad', qty: 1 }
    ],
    output: { id: 'adze_copper', qty: 1 },
    desc: 'Cast a woodcutting adze (+9 Atk, +8 Str).'
  },
  {
    id: 'recipe_greataxe_bronze',
    name: 'Bronze Greataxe',
    stationType: 'STATION_ANVIL',
    skill: 'casting',
    reqLvl: 10,
    xp: 95,
    inputs: [
      { id: 'ingot_bronze', qty: 3 },
      { id: 'wood_cycad', qty: 1 }
    ],
    output: { id: 'greataxe_bronze', qty: 1 },
    desc: 'Forge a devastating two-handed Bronze Greataxe (+25 Atk, +28 Str).'
  },
  {
    id: 'recipe_axe_bronze',
    name: 'Cast Bronze Axe',
    stationType: 'STATION_ANVIL',
    skill: 'casting',
    reqLvl: 12,
    xp: 50,
    inputs: [
      { id: 'ingot_bronze', qty: 1 },
      { id: 'wood_cycad', qty: 1 }
    ],
    output: { id: 'axe_bronze', qty: 1 },
    desc: 'Cast a sharp Bronze Woodchopping Axe (+14 Atk, +12 Str).'
  },
  {
    id: 'recipe_spear_bronze',
    name: 'Bronze War Spear',
    stationType: 'STATION_ANVIL',
    skill: 'casting',
    reqLvl: 15,
    xp: 75,
    inputs: [
      { id: 'ingot_bronze', qty: 2 },
      { id: 'wood_cycad', qty: 1 }
    ],
    output: { id: 'spear_bronze', qty: 1 },
    desc: 'Forge a heavy Bronze War Spear (+45 Atk, +40 Str).'
  },
  {
    id: 'recipe_spear_bronze_harpoon',
    name: 'Heavy Bronze Harpoon',
    stationType: 'STATION_ANVIL',
    skill: 'casting',
    reqLvl: 20,
    xp: 110,
    inputs: [
      { id: 'ingot_bronze', qty: 2 },
      { id: 'wood_willow', qty: 1 }
    ],
    output: { id: 'spear_bronze_harpoon', qty: 1 },
    desc: 'Wield armor-piercing cast bronze harpoon (+32 Atk, +28 Str).'
  },
  {
    id: 'recipe_shield_arsenical_bronze',
    name: 'Arsenical Bronze Tower Shield',
    stationType: 'STATION_ANVIL',
    skill: 'casting',
    reqLvl: 20,
    xp: 130,
    inputs: [
      { id: 'ingot_arsenical', qty: 2 },
      { id: 'wood_ironwood', qty: 1 }
    ],
    output: { id: 'shield_arsenical_bronze', qty: 1 },
    desc: 'Reinforced heavy bronze tower shield (+24 Def).'
  },
  {
    id: 'recipe_armor_bronze',
    name: 'Cast Bronze Cuirass',
    stationType: 'STATION_ANVIL',
    skill: 'casting',
    reqLvl: 22,
    xp: 140,
    inputs: [{ id: 'ingot_bronze', qty: 3 }],
    output: { id: 'armor_bronze', qty: 1 },
    desc: 'Hammer three bronze ingots into a heavy chestplate (+28 Def).'
  },
  {
    id: 'recipe_greaves_bronze',
    name: 'Cast Bronze Greaves',
    stationType: 'STATION_ANVIL',
    skill: 'casting',
    reqLvl: 22,
    xp: 110,
    inputs: [{ id: 'ingot_bronze', qty: 2 }],
    output: { id: 'greaves_bronze', qty: 1 },
    desc: 'Cast bronze leg armor plates (+18 Def).'
  },
  {
    id: 'recipe_sword_bronze',
    name: 'Cast Bronze Leaf Sword',
    stationType: 'STATION_ANVIL',
    skill: 'casting',
    reqLvl: 25,
    xp: 160,
    inputs: [
      { id: 'ingot_bronze', qty: 2 },
      { id: 'item_tree_resin', qty: 1 }
    ],
    output: { id: 'sword_bronze', qty: 1 },
    desc: 'Forge the iconic leaf-bladed bronze sword (+34 Atk, +30 Str).'
  },
  {
    id: 'recipe_helmet_bronze',
    name: 'Bronze Horned Helmet',
    stationType: 'STATION_ANVIL',
    skill: 'casting',
    reqLvl: 28,
    xp: 180,
    inputs: [
      { id: 'ingot_bronze', qty: 2 },
      { id: 'amber_beads', qty: 10 }
    ],
    output: { id: 'helmet_bronze', qty: 1 },
    desc: 'Cast reinforced bronze horned war helmet (+16 Def).'
  },

  // =========================================================================
  // 3. Knapping & Stoneworking (Flint Knapping Bench)
  // =========================================================================
  {
    id: 'recipe_knife_flint',
    name: 'Flint Flake Knife',
    stationType: 'STATION_KNAPPING',
    skill: 'knapping',
    reqLvl: 1,
    xp: 15,
    inputs: [
      { id: 'ore_copper', qty: 1 },
      { id: 'wood_cycad', qty: 1 }
    ],
    output: { id: 'knife_flint', qty: 1 },
    desc: 'Shape sharp flint skinning knife (+4 Atk, +3 Str).'
  },
  {
    id: 'recipe_spear_flint',
    name: 'Flint Spear',
    stationType: 'STATION_KNAPPING',
    skill: 'knapping',
    reqLvl: 3,
    xp: 25,
    inputs: [
      { id: 'wood_cycad', qty: 1 },
      { id: 'ore_copper', qty: 1 }
    ],
    output: { id: 'spear_flint', qty: 1 },
    desc: 'Knap a sharp flint stone spearhead bound to cycad wood (+6 Atk, +5 Str).'
  },
  {
    id: 'recipe_axe_flint',
    name: 'Flint Handaxe',
    stationType: 'STATION_KNAPPING',
    skill: 'knapping',
    reqLvl: 5,
    xp: 35,
    inputs: [
      { id: 'ore_copper', qty: 1 },
      { id: 'wood_cycad', qty: 1 }
    ],
    output: { id: 'axe_flint', qty: 1 },
    desc: 'Chip a sturdy stone handaxe (+8 Atk, +7 Str).'
  },
  {
    id: 'recipe_tool_bone_needle',
    name: 'Bone Needle & Awl',
    stationType: 'STATION_KNAPPING',
    skill: 'knapping',
    reqLvl: 8,
    xp: 40,
    inputs: [
      { id: 'meat_raw', qty: 1 },
      { id: 'clay_lump', qty: 1 }
    ],
    output: { id: 'tool_bone_needle', qty: 1 },
    desc: 'Fashion bone needle tools for leathercrafting.'
  },
  {
    id: 'recipe_blade_obsidian_razor',
    name: 'Obsidian Razor Blade',
    stationType: 'STATION_KNAPPING',
    skill: 'knapping',
    reqLvl: 10,
    xp: 55,
    inputs: [
      { id: 'glass_obsidian', qty: 1 },
      { id: 'wood_cycad', qty: 1 }
    ],
    output: { id: 'blade_obsidian_razor', qty: 1 },
    desc: 'Shape ultra-sharp volcanic glass scalpel (+16 Atk, +12 Str).'
  },
  {
    id: 'recipe_pickaxe_flint',
    name: 'Flint Pickaxe',
    stationType: 'STATION_KNAPPING',
    skill: 'knapping',
    reqLvl: 12,
    xp: 65,
    inputs: [
      { id: 'ore_copper', qty: 2 },
      { id: 'wood_cycad', qty: 1 }
    ],
    output: { id: 'pickaxe_flint', qty: 1 },
    desc: 'Craft durable stone pickaxe for mining (+6 Atk, +6 Str).'
  },
  {
    id: 'recipe_spear_raptor_harpoon',
    name: 'Saber Raptor Harpoon',
    stationType: 'STATION_KNAPPING',
    skill: 'knapping',
    reqLvl: 6,
    xp: 45,
    inputs: [
      { id: 'ore_copper', qty: 1 },
      { id: 'wood_willow', qty: 1 }
    ],
    output: { id: 'spear_raptor_harpoon', qty: 1 },
    desc: 'Knap a barbed bone harpoon for hunting raptors (+12 Atk, +10 Str).'
  },
  {
    id: 'recipe_dagger_obsidian',
    name: 'Obsidian Ritual Dagger',
    stationType: 'STATION_KNAPPING',
    skill: 'knapping',
    reqLvl: 20,
    xp: 80,
    inputs: [
      { id: 'glass_obsidian', qty: 2 },
      { id: 'wood_cycad', qty: 1 }
    ],
    output: { id: 'dagger_obsidian', qty: 1 },
    desc: 'Razor-sharp volcanic glass dagger (+28 Atk, +24 Str).'
  },
  {
    id: 'recipe_chisel_runestone',
    name: 'Runestone Chisel',
    stationType: 'STATION_KNAPPING',
    skill: 'knapping',
    reqLvl: 22,
    xp: 90,
    inputs: [
      { id: 'glass_obsidian', qty: 1 },
      { id: 'clay_lump', qty: 2 }
    ],
    output: { id: 'chisel_runestone', qty: 1 },
    desc: 'Craft fine chisel for stone carving and masonry.'
  },
  {
    id: 'recipe_scythe_obsidian',
    name: 'Obsidian War Scythe',
    stationType: 'STATION_KNAPPING',
    skill: 'knapping',
    reqLvl: 28,
    xp: 130,
    inputs: [
      { id: 'glass_obsidian', qty: 3 },
      { id: 'wood_ironwood', qty: 1 }
    ],
    output: { id: 'scythe_obsidian', qty: 1 },
    desc: 'Knap wide curved blade for two-handed war scythe (+38 Atk, +36 Str).'
  },
  {
    id: 'recipe_javelin_obsidian',
    name: 'Obsidian War Javelin',
    stationType: 'STATION_KNAPPING',
    skill: 'knapping',
    reqLvl: 30,
    xp: 150,
    inputs: [
      { id: 'glass_obsidian', qty: 2 },
      { id: 'wood_ashwood', qty: 1 }
    ],
    output: { id: 'javelin_obsidian', qty: 1 },
    desc: 'Throw razor-sharp volcanic glass javelins (+35 Atk, +30 Str).'
  },
  {
    id: 'recipe_maul_obsidian',
    name: 'Obsidian War Maul',
    stationType: 'STATION_KNAPPING',
    skill: 'knapping',
    reqLvl: 30,
    xp: 160,
    inputs: [
      { id: 'glass_obsidian', qty: 4 },
      { id: 'wood_ironwood', qty: 2 }
    ],
    output: { id: 'maul_obsidian', qty: 1 },
    desc: 'Devastating volcanic obsidian war maul (+42 Atk, +45 Str).'
  },

  // =========================================================================
  // 4. Carpentry, Woodworking & Watercraft (Carpenter's Workbench)
  // =========================================================================
  {
    id: 'recipe_boat_reed_raft',
    name: 'Papyrus Reed Raft',
    stationType: 'STATION_CARPENTER',
    skill: 'woodworking',
    reqLvl: 1,
    xp: 25,
    inputs: [
      { id: 'reeds_river', qty: 4 },
      { id: 'item_tree_bark', qty: 2 }
    ],
    output: { id: 'boat_reed_raft', qty: 1 },
    desc: 'Build a light reed raft to cross shallow rivers.'
  },
  {
    id: 'recipe_tool_wooden_paddle',
    name: 'Carved Wooden Paddle',
    stationType: 'STATION_CARPENTER',
    skill: 'woodworking',
    reqLvl: 3,
    xp: 20,
    inputs: [{ id: 'wood_cycad', qty: 1 }],
    output: { id: 'tool_wooden_paddle', qty: 1 },
    desc: 'Carve wooden paddle increasing river navigation speed.'
  },
  {
    id: 'recipe_shield_wicker',
    name: 'Wicker Round Shield',
    stationType: 'STATION_CARPENTER',
    skill: 'woodworking',
    reqLvl: 3,
    xp: 25,
    inputs: [
      { id: 'reeds_river', qty: 3 },
      { id: 'wood_cycad', qty: 1 }
    ],
    output: { id: 'shield_wicker', qty: 1 },
    desc: 'Craft woven wicker round shield (+8 Def).'
  },
  {
    id: 'recipe_shield_wood',
    name: 'Tribal Wood Buckler',
    stationType: 'STATION_CARPENTER',
    skill: 'woodworking',
    reqLvl: 5,
    xp: 35,
    inputs: [
      { id: 'wood_cycad', qty: 2 },
      { id: 'item_tree_resin', qty: 1 }
    ],
    output: { id: 'shield_wood', qty: 1 },
    desc: 'Carve a durable wooden shield (+6 Def).'
  },
  {
    id: 'recipe_club_hardwood',
    name: 'Heavy Hardwood Club',
    stationType: 'STATION_CARPENTER',
    skill: 'woodworking',
    reqLvl: 8,
    xp: 45,
    inputs: [{ id: 'wood_acacia', qty: 2 }],
    output: { id: 'club_hardwood', qty: 1 },
    desc: 'Wield a dense hardwood war club (+10 Atk, +14 Str).'
  },
  {
    id: 'recipe_boat_dugout_canoe',
    name: 'Dugout Pine Canoe',
    stationType: 'STATION_CARPENTER',
    skill: 'woodworking',
    reqLvl: 8,
    xp: 60,
    inputs: [
      { id: 'wood_bristlecone', qty: 2 },
      { id: 'item_tree_resin', qty: 1 }
    ],
    output: { id: 'boat_dugout_canoe', qty: 1 },
    desc: 'Hollow out pine logs into sturdy single-person canoe.'
  },
  {
    id: 'recipe_bow_hunting',
    name: 'Hunting Recurve Bow',
    stationType: 'STATION_CARPENTER',
    skill: 'woodworking',
    reqLvl: 10,
    xp: 65,
    inputs: [
      { id: 'wood_willow', qty: 1 },
      { id: 'item_tree_bark', qty: 2 }
    ],
    output: { id: 'bow_hunting', qty: 1 },
    desc: 'Craft flexible hunting bow (+18 Atk, +15 Str).'
  },
  {
    id: 'recipe_bow_bone_recurve',
    name: 'Bone Recurve Bow',
    stationType: 'STATION_CARPENTER',
    skill: 'woodworking',
    reqLvl: 12,
    xp: 80,
    inputs: [
      { id: 'wood_willow', qty: 1 },
      { id: 'meat_raw', qty: 2 },
      { id: 'reeds_river', qty: 2 }
    ],
    output: { id: 'bow_bone_recurve', qty: 1 },
    desc: 'Reinforced bone composite bow (+24 Atk, +20 Str).'
  },
  {
    id: 'recipe_boat_wicker_sail',
    name: 'Wicker-Sail Canoe',
    stationType: 'STATION_CARPENTER',
    skill: 'woodworking',
    reqLvl: 12,
    xp: 90,
    inputs: [
      { id: 'boat_dugout_canoe', qty: 1 },
      { id: 'reeds_river', qty: 3 }
    ],
    output: { id: 'boat_wicker_sail', qty: 1 },
    desc: 'Catch river winds to travel effortlessly downstream.'
  },
  {
    id: 'recipe_boat_outrigger_canoe',
    name: 'Stabilized Outrigger Canoe',
    stationType: 'STATION_CARPENTER',
    skill: 'woodworking',
    reqLvl: 15,
    xp: 110,
    inputs: [
      { id: 'boat_dugout_canoe', qty: 1 },
      { id: 'wood_willow', qty: 2 }
    ],
    output: { id: 'boat_outrigger_canoe', qty: 1 },
    desc: 'Build stabilized outriggers for lake navigation.'
  },
  {
    id: 'recipe_plank_hardwood',
    name: 'Hardwood Plank (x2)',
    stationType: 'STATION_CARPENTER',
    skill: 'woodworking',
    reqLvl: 18,
    xp: 45,
    inputs: [{ id: 'wood_bristlecone', qty: 1 }],
    output: { id: 'plank_hardwood', qty: 2 },
    desc: 'Split dense timber into 2x construction planks.'
  },
  {
    id: 'recipe_hammer_ironwood_sledge',
    name: 'Ironwood Sledge',
    stationType: 'STATION_CARPENTER',
    skill: 'woodworking',
    reqLvl: 18,
    xp: 120,
    inputs: [
      { id: 'wood_ironwood', qty: 2 },
      { id: 'glass_obsidian', qty: 1 }
    ],
    output: { id: 'hammer_ironwood_sledge', qty: 1 },
    desc: 'Heavy two-handed battle and construction sledge (+28 Atk, +32 Str).'
  },
  {
    id: 'recipe_boat_war_canoe',
    name: 'Bronze Age War Canoe',
    stationType: 'STATION_CARPENTER',
    skill: 'woodworking',
    reqLvl: 20,
    xp: 150,
    inputs: [
      { id: 'wood_ironwood', qty: 2 },
      { id: 'ingot_bronze', qty: 2 }
    ],
    output: { id: 'boat_war_canoe', qty: 1 },
    desc: 'Construct 4-person war canoe with bronze ramming prow.'
  },
  {
    id: 'recipe_boat_trade_barge',
    name: 'River Trade Barge',
    stationType: 'STATION_CARPENTER',
    skill: 'woodworking',
    reqLvl: 25,
    xp: 190,
    inputs: [
      { id: 'plank_hardwood', qty: 4 },
      { id: 'wood_ironwood', qty: 2 }
    ],
    output: { id: 'boat_trade_barge', qty: 1 },
    desc: 'Construct cargo barges carrying up to 100 items.'
  },
  {
    id: 'recipe_boat_lake_longboat',
    name: 'Great Lake Longboat',
    stationType: 'STATION_CARPENTER',
    skill: 'woodworking',
    reqLvl: 30,
    xp: 250,
    inputs: [
      { id: 'wood_ebony', qty: 4 },
      { id: 'ingot_bronze', qty: 3 }
    ],
    output: { id: 'boat_lake_longboat', qty: 1 },
    desc: 'Multi-oar longboats for navigating northern waters.'
  },

  // =========================================================================
  // 5. Leatherworking & Tanning (Tanning Rack & Furrier)
  // =========================================================================
  {
    id: 'recipe_boots_leather',
    name: 'Leather Footwraps',
    stationType: 'STATION_TANNERY',
    skill: 'trapping',
    reqLvl: 3,
    xp: 25,
    inputs: [
      { id: 'meat_raw', qty: 2 },
      { id: 'item_tree_bark', qty: 1 }
    ],
    output: { id: 'boots_leather', qty: 1 },
    desc: 'Stitch soft leather boots increasing run speed (+4 Def, +1 Speed).'
  },
  {
    id: 'recipe_quiver_rawhide',
    name: 'Rawhide Quiver',
    stationType: 'STATION_TANNERY',
    skill: 'trapping',
    reqLvl: 5,
    xp: 35,
    inputs: [
      { id: 'meat_raw', qty: 2 },
      { id: 'reeds_river', qty: 1 }
    ],
    output: { id: 'quiver_rawhide', qty: 1 },
    desc: 'Craft quivers holding up to 50 arrows or spears (+2 Def).'
  },
  {
    id: 'recipe_gloves_studded_leather',
    name: 'Studded Leather Bracers',
    stationType: 'STATION_TANNERY',
    skill: 'trapping',
    reqLvl: 8,
    xp: 45,
    inputs: [
      { id: 'meat_raw', qty: 2 },
      { id: 'ore_copper', qty: 1 }
    ],
    output: { id: 'gloves_studded_leather', qty: 1 },
    desc: 'Reinforce leather cuffs with stone studs (+5 Def).'
  },
  {
    id: 'recipe_armor_hide',
    name: 'Cured Mammoth Hide Tunic',
    stationType: 'STATION_TANNERY',
    skill: 'trapping',
    reqLvl: 10,
    xp: 60,
    inputs: [
      { id: 'meat_raw', qty: 2 },
      { id: 'clay_lump', qty: 2 }
    ],
    output: { id: 'armor_hide', qty: 1 },
    desc: 'Tan animal hide with clay to create tough body armor (+10 Def).'
  },
  {
    id: 'recipe_armor_mammoth_vest',
    name: 'Mammoth Carapace Vest',
    stationType: 'STATION_TANNERY',
    skill: 'trapping',
    reqLvl: 15,
    xp: 90,
    inputs: [
      { id: 'meat_raw', qty: 2 },
      { id: 'mammoth_tusk', qty: 1 }
    ],
    output: { id: 'armor_mammoth_vest', qty: 1 },
    desc: 'Equip dense mammoth bone plated armor (+22 Def).'
  },
  {
    id: 'recipe_armor_raptor_vest',
    name: 'Raptor Scale Vest',
    stationType: 'STATION_TANNERY',
    skill: 'trapping',
    reqLvl: 15,
    xp: 85,
    inputs: [
      { id: 'meat_raw', qty: 2 },
      { id: 'flower_ghost_orchid', qty: 1 }
    ],
    output: { id: 'armor_raptor_vest', qty: 1 },
    desc: 'Stitch lightweight reptile scale chestplate (+16 Def).'
  },
  {
    id: 'recipe_armor_hardened_leather',
    name: 'Hardened Leather Cuirass',
    stationType: 'STATION_TANNERY',
    skill: 'trapping',
    reqLvl: 20,
    xp: 110,
    inputs: [
      { id: 'meat_raw', qty: 2 },
      { id: 'item_tree_resin', qty: 2 }
    ],
    output: { id: 'armor_hardened_leather', qty: 1 },
    desc: 'Boil leather in resin for rigid breastplate (+20 Def).'
  },
  {
    id: 'recipe_cape_bear_fur',
    name: 'Cave Bear Fur Cloak',
    stationType: 'STATION_TANNERY',
    skill: 'trapping',
    reqLvl: 22,
    xp: 125,
    inputs: [
      { id: 'meat_raw', qty: 2 },
      { id: 'moss_tundra', qty: 2 }
    ],
    output: { id: 'cape_bear_fur', qty: 1 },
    desc: 'Sew heavy fur cape granting frost immunity (+12 Def).'
  },
  {
    id: 'recipe_gloves_raptor_gauntlets',
    name: 'Reinforced Raptor Gauntlets',
    stationType: 'STATION_TANNERY',
    skill: 'trapping',
    reqLvl: 25,
    xp: 140,
    inputs: [
      { id: 'meat_raw', qty: 2 },
      { id: 'glass_obsidian', qty: 1 }
    ],
    output: { id: 'gloves_raptor_gauntlets', qty: 1 },
    desc: 'Claw-tipped leather combat gloves (+8 Def, +4 Atk).'
  },
  {
    id: 'recipe_armor_raptor_coat',
    name: 'Raptor Scale Coat',
    stationType: 'STATION_TANNERY',
    skill: 'trapping',
    reqLvl: 28,
    xp: 160,
    inputs: [
      { id: 'meat_raw', qty: 3 },
      { id: 'vine_serpent', qty: 2 }
    ],
    output: { id: 'armor_raptor_coat', qty: 1 },
    desc: 'Equip piercing-resistant raptor scale cuirass (+25 Def).'
  },

  // =========================================================================
  // 6. Campfire Cooking Recipes (Tribal Roasting Fire)
  // =========================================================================
  {
    id: 'recipe_cook_boar',
    name: 'Roasted Boar Meat',
    stationType: 'STATION_CAMPFIRE',
    skill: 'cooking',
    reqLvl: 1,
    xp: 20,
    inputs: [{ id: 'meat_raw', qty: 1 }],
    output: { id: 'meat_cooked', qty: 1 },
    desc: 'Roast raw boar meat over open embers (+6 HP heal).'
  },
  {
    id: 'recipe_cook_salmon',
    name: 'Smoked River Salmon',
    stationType: 'STATION_CAMPFIRE',
    skill: 'cooking',
    reqLvl: 3,
    xp: 25,
    inputs: [{ id: 'fish_salmon', qty: 1 }],
    output: { id: 'fish_smoked', qty: 1 },
    desc: 'Smoke freshwater catch over embers (+8 HP heal).'
  },
  {
    id: 'recipe_food_porridge',
    name: 'Clay Pot Porridge',
    stationType: 'STATION_CAMPFIRE',
    skill: 'cooking',
    reqLvl: 5,
    xp: 35,
    inputs: [
      { id: 'grain_wheat', qty: 2 },
      { id: 'clay_lump', qty: 1 }
    ],
    output: { id: 'food_porridge', qty: 1 },
    desc: 'Stew wild grains with water for stamina food (+10 HP heal).'
  },
  {
    id: 'recipe_food_berry_tart',
    name: 'Wild Berry Tart',
    stationType: 'STATION_CAMPFIRE',
    skill: 'cooking',
    reqLvl: 8,
    xp: 45,
    inputs: [
      { id: 'berry_sweet', qty: 2 },
      { id: 'grain_wheat', qty: 1 }
    ],
    output: { id: 'food_berry_tart', qty: 1 },
    desc: 'Bake sweet berry cakes in hot stone hearths (+12 HP heal).'
  },
  {
    id: 'recipe_food_wolf_flank',
    name: 'Roasted Wolf Flank',
    stationType: 'STATION_CAMPFIRE',
    skill: 'cooking',
    reqLvl: 10,
    xp: 55,
    inputs: [{ id: 'meat_raw', qty: 2 }],
    output: { id: 'food_wolf_flank', qty: 1 },
    desc: 'Cook savory dire wolf meat (+14 HP heal).'
  },
  {
    id: 'recipe_food_raptor_omelet',
    name: 'Raptor Egg Omelet',
    stationType: 'STATION_CAMPFIRE',
    skill: 'cooking',
    reqLvl: 15,
    xp: 75,
    inputs: [
      { id: 'meat_raw', qty: 1 },
      { id: 'root_fever', qty: 1 }
    ],
    output: { id: 'food_raptor_omelet', qty: 1 },
    desc: 'Cook nutritious raptor omelet with prairie herbs (+16 HP heal).'
  },
  {
    id: 'recipe_food_venison_roast',
    name: 'Highland Venison Roast',
    stationType: 'STATION_CAMPFIRE',
    skill: 'cooking',
    reqLvl: 18,
    xp: 90,
    inputs: [
      { id: 'meat_raw', qty: 1 },
      { id: 'berry_sweet', qty: 1 }
    ],
    output: { id: 'food_venison_roast', qty: 1 },
    desc: 'Roast tender deer meat with wild berries (+18 HP heal).'
  },
  {
    id: 'recipe_mammoth_steak',
    name: 'Roasted Mammoth Steak',
    stationType: 'STATION_CAMPFIRE',
    skill: 'cooking',
    reqLvl: 20,
    xp: 110,
    inputs: [{ id: 'meat_raw', qty: 3 }],
    output: { id: 'mammoth_steak', qty: 1 },
    desc: 'Hearty prime mammoth steak (+20 HP heal).'
  },
  {
    id: 'recipe_food_herbal_skewers',
    name: 'Herbal Meat Skewers',
    stationType: 'STATION_CAMPFIRE',
    skill: 'cooking',
    reqLvl: 22,
    xp: 125,
    inputs: [
      { id: 'meat_raw', qty: 1 },
      { id: 'root_fever', qty: 1 },
      { id: 'root_ginseng', qty: 1 }
    ],
    output: { id: 'food_herbal_skewers', qty: 1 },
    desc: 'Meat skewered with healing fever root (+22 HP heal, cures poison).'
  },
  {
    id: 'recipe_food_spiced_stew',
    name: 'Savannah Spiced Stew',
    stationType: 'STATION_CAMPFIRE',
    skill: 'cooking',
    reqLvl: 25,
    xp: 140,
    inputs: [
      { id: 'meat_raw', qty: 2 },
      { id: 'grain_wheat', qty: 1 },
      { id: 'fungus_glow', qty: 1 }
    ],
    output: { id: 'food_spiced_stew', qty: 1 },
    desc: 'Simmer rich broth in clay pot (+24 HP heal).'
  },
  {
    id: 'recipe_food_salmon_jerky',
    name: 'Smoked Salmon Jerky (x2)',
    stationType: 'STATION_CAMPFIRE',
    skill: 'cooking',
    reqLvl: 28,
    xp: 155,
    inputs: [
      { id: 'fish_salmon', qty: 2 },
      { id: 'item_tree_resin', qty: 1 }
    ],
    output: { id: 'food_salmon_jerky', qty: 2 },
    desc: 'High-stamina travel rations (stackable food, +12 HP heal).'
  },
  {
    id: 'recipe_food_bear_ribs',
    name: 'Cave Bear Ribs',
    stationType: 'STATION_CAMPFIRE',
    skill: 'cooking',
    reqLvl: 30,
    xp: 180,
    inputs: [
      { id: 'meat_raw', qty: 2 },
      { id: 'fungus_crypt_truffle', qty: 1 }
    ],
    output: { id: 'food_bear_ribs', qty: 1 },
    desc: 'Roast enormous apex predator ribs with truffles (+28 HP heal).'
  },

  // =========================================================================
  // 7. Alchemy, Potions & Elixirs (Apothecary Cauldron)
  // =========================================================================
  {
    id: 'recipe_potion_fever_poultice',
    name: 'Antiseptic Fever Poultice',
    stationType: 'STATION_CAULDRON',
    skill: 'shamanism',
    reqLvl: 1,
    xp: 20,
    inputs: [
      { id: 'root_fever', qty: 2 },
      { id: 'clay_lump', qty: 1 }
    ],
    output: { id: 'potion_fever_poultice', qty: 1 },
    desc: 'Topical poultice that stops bleeding and restores +8 HP.'
  },
  {
    id: 'recipe_item_clay_phial',
    name: 'Clay Potion Phial (x2)',
    stationType: 'STATION_CAULDRON',
    skill: 'shamanism',
    reqLvl: 3,
    xp: 15,
    inputs: [{ id: 'clay_lump', qty: 2 }],
    output: { id: 'item_clay_phial', qty: 2 },
    desc: 'Bake clay phials for liquid potion storage.'
  },
  {
    id: 'recipe_item_serpent_toxin',
    name: 'Serpent Toxin Phial',
    stationType: 'STATION_CAULDRON',
    skill: 'shamanism',
    reqLvl: 5,
    xp: 35,
    inputs: [
      { id: 'vine_serpent', qty: 2 },
      { id: 'item_clay_phial', qty: 1 }
    ],
    output: { id: 'item_serpent_toxin', qty: 1 },
    desc: 'Extract viper venom to coat weapons with lethal poison.'
  },
  {
    id: 'recipe_potion_stamina',
    name: 'Stamina Tonic',
    stationType: 'STATION_CAULDRON',
    skill: 'shamanism',
    reqLvl: 8,
    xp: 45,
    inputs: [
      { id: 'berry_sweet', qty: 2 },
      { id: 'root_fever', qty: 1 },
      { id: 'item_clay_phial', qty: 1 }
    ],
    output: { id: 'potion_stamina', qty: 1 },
    desc: 'Herbal tonic restoring 100% run stamina instantly.'
  },
  {
    id: 'recipe_potion_strength',
    name: 'Hunter Strength Brew',
    stationType: 'STATION_CAULDRON',
    skill: 'shamanism',
    reqLvl: 10,
    xp: 60,
    inputs: [
      { id: 'root_ginseng', qty: 1 },
      { id: 'meat_raw', qty: 1 },
      { id: 'item_clay_phial', qty: 1 }
    ],
    output: { id: 'potion_strength', qty: 1 },
    desc: 'Brew potion boosting Strength by +5 for 5 minutes.'
  },
  {
    id: 'recipe_potion_antidote',
    name: 'Antidote Elixir',
    stationType: 'STATION_CAULDRON',
    skill: 'shamanism',
    reqLvl: 12,
    xp: 70,
    inputs: [
      { id: 'moss_tundra', qty: 2 },
      { id: 'root_fever', qty: 1 },
      { id: 'item_clay_phial', qty: 1 }
    ],
    output: { id: 'potion_antidote', qty: 1 },
    desc: 'Neutralizes all forms of poison and venom.'
  },
  {
    id: 'recipe_potion_berserker',
    name: 'Berserker War Draught',
    stationType: 'STATION_CAULDRON',
    skill: 'shamanism',
    reqLvl: 15,
    xp: 90,
    inputs: [
      { id: 'vine_serpent', qty: 1 },
      { id: 'fungus_glow', qty: 1 },
      { id: 'item_clay_phial', qty: 1 }
    ],
    output: { id: 'potion_berserker', qty: 1 },
    desc: '+8 Attack and +8 Strength buff for 3 minutes.'
  },
  {
    id: 'recipe_potion_fire_resist',
    name: 'Fire-Resistant Salve',
    stationType: 'STATION_CAULDRON',
    skill: 'shamanism',
    reqLvl: 18,
    xp: 110,
    inputs: [
      { id: 'mineral_sulfur', qty: 2 },
      { id: 'item_tree_resin', qty: 1 },
      { id: 'item_clay_phial', qty: 1 }
    ],
    output: { id: 'potion_fire_resist', qty: 1 },
    desc: 'Grants 50% immunity to burn and lava damage for 5 minutes.'
  },
  {
    id: 'recipe_potion_spirit',
    name: 'Spirit Surge Potion',
    stationType: 'STATION_CAULDRON',
    skill: 'shamanism',
    reqLvl: 20,
    xp: 125,
    inputs: [
      { id: 'flower_ghost_orchid', qty: 2 },
      { id: 'item_clay_phial', qty: 1 }
    ],
    output: { id: 'potion_spirit', qty: 1 },
    desc: 'Restore +15 Spirit energy for shamanic ritual casting.'
  },
  {
    id: 'recipe_potion_night_eye',
    name: 'Night Eye Elixir',
    stationType: 'STATION_CAULDRON',
    skill: 'shamanism',
    reqLvl: 22,
    xp: 135,
    inputs: [
      { id: 'fungus_glow', qty: 2 },
      { id: 'item_clay_phial', qty: 1 }
    ],
    output: { id: 'potion_night_eye', qty: 1 },
    desc: 'See clearly in dark caves and night cycles for 5 minutes.'
  },
  {
    id: 'recipe_potion_super_strength',
    name: 'Super Strength Brew',
    stationType: 'STATION_CAULDRON',
    skill: 'shamanism',
    reqLvl: 25,
    xp: 160,
    inputs: [
      { id: 'root_ginseng', qty: 2 },
      { id: 'meat_raw', qty: 1 },
      { id: 'item_clay_phial', qty: 1 }
    ],
    output: { id: 'potion_super_strength', qty: 1 },
    desc: 'Boost Strength by +12 for 10 minutes.'
  },
  {
    id: 'recipe_potion_raptor_speed',
    name: 'Raptor Speed Potion',
    stationType: 'STATION_CAULDRON',
    skill: 'shamanism',
    reqLvl: 28,
    xp: 180,
    inputs: [
      { id: 'flower_ghost_orchid', qty: 1 },
      { id: 'berry_sweet', qty: 2 },
      { id: 'item_clay_phial', qty: 1 }
    ],
    output: { id: 'potion_raptor_speed', qty: 1 },
    desc: 'Increase base movement speed by +2 tiles/s for 2 minutes.'
  },
  {
    id: 'recipe_potion_liquid_fire',
    name: 'Liquid Fire Flask',
    stationType: 'STATION_CAULDRON',
    skill: 'shamanism',
    reqLvl: 30,
    xp: 210,
    inputs: [
      { id: 'mineral_sulfur', qty: 2 },
      { id: 'item_tree_resin', qty: 2 },
      { id: 'glass_obsidian', qty: 1 }
    ],
    output: { id: 'potion_liquid_fire', qty: 1 },
    desc: 'Throwable bomb dealing 25 splash damage in a 3x3 area.'
  },

  // =========================================================================
  // 8. Trapping, Husbandry & Snares (Tannery / Bench)
  // =========================================================================
  {
    id: 'recipe_trap_reed_snare',
    name: 'Woven Reed Snare',
    stationType: 'STATION_TANNERY',
    skill: 'trapping',
    reqLvl: 1,
    xp: 20,
    inputs: [
      { id: 'reeds_river', qty: 3 },
      { id: 'wood_cycad', qty: 1 }
    ],
    output: { id: 'trap_reed_snare', qty: 1 },
    desc: 'Set woven reed snare for hares and small game.'
  },
  {
    id: 'recipe_trap_stone_deadfall',
    name: 'Stone Deadfall Trap',
    stationType: 'STATION_TANNERY',
    skill: 'trapping',
    reqLvl: 3,
    xp: 30,
    inputs: [
      { id: 'ore_copper', qty: 2 },
      { id: 'wood_cycad', qty: 1 }
    ],
    output: { id: 'trap_stone_deadfall', qty: 1 },
    desc: 'Construct stone deadfalls for foxes and badgers.'
  },
  {
    id: 'recipe_whistle_primitive',
    name: 'Primitive Beast Whistle',
    stationType: 'STATION_TANNERY',
    skill: 'trapping',
    reqLvl: 5,
    xp: 40,
    inputs: [
      { id: 'wood_willow', qty: 1 },
      { id: 'item_tree_resin', qty: 1 }
    ],
    output: { id: 'whistle_primitive', qty: 1 },
    desc: 'Call tamed animal companions to your side.'
  },
  {
    id: 'recipe_item_animal_feed',
    name: 'Nutrient Animal Feed (x2)',
    stationType: 'STATION_TANNERY',
    skill: 'trapping',
    reqLvl: 8,
    xp: 35,
    inputs: [
      { id: 'grain_wheat', qty: 2 },
      { id: 'berry_sweet', qty: 2 }
    ],
    output: { id: 'item_animal_feed', qty: 2 },
    desc: 'Fodder for taming wild beasts and speeding pet growth.'
  },
  {
    id: 'recipe_trap_pitfall_spike',
    name: 'Pitfall Spike Trap',
    stationType: 'STATION_TANNERY',
    skill: 'trapping',
    reqLvl: 10,
    xp: 60,
    inputs: [
      { id: 'wood_willow', qty: 2 },
      { id: 'ore_tin', qty: 1 }
    ],
    output: { id: 'trap_pitfall_spike', qty: 1 },
    desc: 'Camouflaged pitfall trap for wolves and predators.'
  },
  {
    id: 'recipe_saddle_raptor',
    name: 'Raptor Leather Saddle',
    stationType: 'STATION_TANNERY',
    skill: 'trapping',
    reqLvl: 12,
    xp: 75,
    inputs: [
      { id: 'armor_hide', qty: 2 },
      { id: 'reeds_river', qty: 2 }
    ],
    output: { id: 'saddle_raptor', qty: 1 },
    desc: 'Equip saddles to ride raptors as swift mounts.'
  },
  {
    id: 'recipe_trap_bone_jaw',
    name: 'Bone Jaw Trap',
    stationType: 'STATION_TANNERY',
    skill: 'trapping',
    reqLvl: 12,
    xp: 80,
    inputs: [
      { id: 'meat_raw', qty: 2 },
      { id: 'item_tree_resin', qty: 1 }
    ],
    output: { id: 'trap_bone_jaw', qty: 1 },
    desc: 'Spring-loaded bone jaw trap for medium beasts.'
  },
  {
    id: 'recipe_trap_raptor_cage',
    name: 'Ironwood Raptor Cage',
    stationType: 'STATION_TANNERY',
    skill: 'trapping',
    reqLvl: 18,
    xp: 110,
    inputs: [
      { id: 'wood_ironwood', qty: 3 },
      { id: 'reeds_river', qty: 2 }
    ],
    output: { id: 'trap_raptor_cage', qty: 1 },
    desc: 'Reinforced ironwood cage for live predator capture.'
  },
  {
    id: 'recipe_trap_bronze_bear',
    name: 'Heavy Bronze Bear Trap',
    stationType: 'STATION_TANNERY',
    skill: 'trapping',
    reqLvl: 25,
    xp: 160,
    inputs: [
      { id: 'ingot_bronze', qty: 2 },
      { id: 'mineral_sulfur', qty: 1 }
    ],
    output: { id: 'trap_bronze_bear', qty: 1 },
    desc: 'Bronze teeth trap capable of pinning colossal cave bears.'
  },
  {
    id: 'recipe_trap_mammoth_trench',
    name: 'Mammoth Pitfall Trench Kit',
    stationType: 'STATION_TANNERY',
    skill: 'trapping',
    reqLvl: 30,
    xp: 220,
    inputs: [
      { id: 'wood_ironwood', qty: 4 },
      { id: 'glass_obsidian', qty: 2 }
    ],
    output: { id: 'trap_mammoth_trench', qty: 1 },
    desc: 'Excavate massive trenches to capture woolly mammoths.'
  },

  // =========================================================================
  // 9. Masonry, Lapidary & Jewelry (Lapidary Gem Bench / Loom)
  // =========================================================================
  {
    id: 'recipe_talisman_spark',
    name: 'Spirit Spark Talisman',
    stationType: 'STATION_LAPIDARY',
    skill: 'carving',
    reqLvl: 1,
    xp: 20,
    inputs: [
      { id: 'amber_beads', qty: 10 },
      { id: 'ore_copper', qty: 1 }
    ],
    output: { id: 'talisman_spark', qty: 1 },
    desc: 'Carve spirit spark talisman (+6 Magic Bonus).'
  },
  {
    id: 'recipe_item_sundial_bone',
    name: 'Carved Bone Sundial',
    stationType: 'STATION_LAPIDARY',
    skill: 'carving',
    reqLvl: 3,
    xp: 25,
    inputs: [
      { id: 'meat_raw', qty: 1 },
      { id: 'glass_obsidian', qty: 1 }
    ],
    output: { id: 'item_sundial_bone', qty: 1 },
    desc: 'Portable sundial that tells exact server tick and time.'
  },
  {
    id: 'recipe_brick_clay',
    name: 'Baked Mud Brick (x2)',
    stationType: 'STATION_LAPIDARY',
    skill: 'carving',
    reqLvl: 5,
    xp: 30,
    inputs: [
      { id: 'clay_lump', qty: 2 },
      { id: 'reeds_river', qty: 1 }
    ],
    output: { id: 'brick_clay', qty: 2 },
    desc: 'Bake mud bricks for tribal building and masonry.'
  },
  {
    id: 'recipe_tool_merchant_scales',
    name: 'Bronze Merchant Scales',
    stationType: 'STATION_LAPIDARY',
    skill: 'carving',
    reqLvl: 8,
    xp: 50,
    inputs: [
      { id: 'ingot_bronze', qty: 2 },
      { id: 'reeds_river', qty: 1 }
    ],
    output: { id: 'tool_merchant_scales', qty: 1 },
    desc: 'Accurately weigh bulk ores for fair trade.'
  },
  {
    id: 'recipe_amulet_amber',
    name: 'Carved Amber Talisman',
    stationType: 'STATION_LAPIDARY',
    skill: 'carving',
    reqLvl: 10,
    xp: 65,
    inputs: [
      { id: 'amber_beads', qty: 25 },
      { id: 'reeds_river', qty: 1 }
    ],
    output: { id: 'amulet_amber', qty: 1 },
    desc: 'Protective amber necklace (+5 Atk, +5 Str, +5 Def).'
  },
  {
    id: 'recipe_item_astrolabe',
    name: 'Bronze & Bone Astrolabe',
    stationType: 'STATION_LAPIDARY',
    skill: 'carving',
    reqLvl: 18,
    xp: 120,
    inputs: [
      { id: 'ingot_bronze', qty: 2 },
      { id: 'glass_obsidian', qty: 1 },
      { id: 'amber_beads', qty: 20 }
    ],
    output: { id: 'item_astrolabe', qty: 1 },
    desc: 'Precision celestial measurement tool for astronomy.'
  },
  {
    id: 'recipe_talisman_solar_flare',
    name: 'Solar Flare Talisman',
    stationType: 'STATION_LAPIDARY',
    skill: 'carving',
    reqLvl: 20,
    xp: 140,
    inputs: [
      { id: 'glass_obsidian', qty: 1 },
      { id: 'mineral_sulfur', qty: 2 },
      { id: 'ingot_bronze', qty: 1 }
    ],
    output: { id: 'talisman_solar_flare', qty: 1 },
    desc: 'Harness solar energy to empower magic (+18 Magic Bonus).'
  },
  {
    id: 'recipe_armor_obsidian_plate',
    name: 'Obsidian Plate Armor',
    stationType: 'STATION_LAPIDARY',
    skill: 'carving',
    reqLvl: 30,
    xp: 280,
    inputs: [
      { id: 'glass_obsidian', qty: 6 },
      { id: 'ingot_arsenical', qty: 2 }
    ],
    output: { id: 'armor_obsidian_plate', qty: 1 },
    desc: 'Heat and lava resistant volcanic glass plate armor (+38 Def).'
  },
  {
    id: 'recipe_headdress_feather',
    name: 'Shaman Feather Headdress',
    stationType: 'STATION_LOOM',
    skill: 'weaving',
    reqLvl: 8,
    xp: 75,
    inputs: [
      { id: 'clay_lump', qty: 3 },
      { id: 'amber_beads', qty: 15 }
    ],
    output: { id: 'headdress_feather', qty: 1 },
    desc: 'Weave feathered tribal headwear imbued with spirit defense (+8 Def).'
  }
];

export class CraftingEngine {
  constructor() {
    this.recipes = new Map();
    CRAFTING_RECIPES.forEach(r => this.recipes.set(r.id, r));
  }

  getRecipesForStation(stationType) {
    return CRAFTING_RECIPES.filter(r => r.stationType === stationType);
  }

  canCraft(player, recipeId) {
    const recipe = this.recipes.get(recipeId);
    if (!recipe) return { allowed: false, reason: 'Unknown recipe' };

    // Check level requirement
    const skillLvl = player.skills[recipe.skill]?.lvl || 1;
    if (skillLvl < recipe.reqLvl) {
      return { allowed: false, reason: `Requires ${recipe.skill.toUpperCase()} level ${recipe.reqLvl} (Current: ${skillLvl})` };
    }

    // Check inventory materials
    for (const input of recipe.inputs) {
      let count = 0;
      for (const slot of player.inventory) {
        if (slot && slot.id === input.id) {
          count += (slot.quantity || 1);
        }
      }
      if (count < input.qty) {
        const itemDef = ITEM_DEFINITIONS[input.id] || { name: input.id };
        return { allowed: false, reason: `Missing ${input.qty - count}x ${itemDef.name}` };
      }
    }

    return { allowed: true, recipe };
  }

  craft(player, recipeId) {
    const check = this.canCraft(player, recipeId);
    if (!check.allowed) return { success: false, reason: check.reason };

    const recipe = check.recipe;

    // Deduct inputs
    for (const input of recipe.inputs) {
      player.removeItem(input.id, input.qty);
    }

    // Add output
    player.addItem(recipe.output.id, recipe.output.qty);

    // Award XP
    const xpEv = player.addXp(recipe.skill, recipe.xp);

    return {
      success: true,
      recipe,
      xpEvent: xpEv,
      outputItem: ITEM_DEFINITIONS[recipe.output.id]
    };
  }
}

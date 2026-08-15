/**
 * PRIMA: Age of Bronze - Player Entity (20 Skills, 30 Quests, Inventory, Bank & Crafting)
 */

import { SKILL_DEFINITIONS, getLevelForXp, getXpForLevel } from './skills_data.js';

export { getLevelForXp, getXpForLevel };

export const ITEM_DEFINITIONS = {
  // Currency & Basic Minerals
  amber_beads: { id: 'amber_beads', name: 'Amber Beads', stackable: true, sprite: 'icon_amber_beads', value: 1 },
  ore_copper: { id: 'ore_copper', name: 'Native Copper Ore', stackable: false, sprite: 'icon_ore_copper', value: 5 },
  ore_tin: { id: 'ore_tin', name: 'Cassiterite Tin Ore', stackable: false, sprite: 'icon_ore_tin', value: 5 },
  ore_malachite: { id: 'ore_malachite', name: 'Malachite Ore', stackable: false, sprite: 'icon_ore_malachite', value: 25 },
  glass_obsidian: { id: 'glass_obsidian', name: 'Obsidian Glass Shard', stackable: false, sprite: 'icon_glass_obsidian', value: 60 },
  ore_starfall: { id: 'ore_starfall', name: 'Starfall Meteorite', stackable: false, sprite: 'icon_ore_starfall', value: 300, isNft: true },
  clay_lump: { id: 'clay_lump', name: 'Lump of River Clay', stackable: true, sprite: 'icon_clay_lump', value: 3 },
  mineral_sulfur: { id: 'mineral_sulfur', name: 'Sulfur Crystals', stackable: true, sprite: 'icon_mineral_sulfur', value: 18 },

  // Ingots & Smelted Alloys
  ingot_copper: { id: 'ingot_copper', name: 'Copper Ingot', stackable: false, sprite: 'icon_ingot_copper', value: 12 },
  ingot_tin: { id: 'ingot_tin', name: 'Tin Ingot', stackable: false, sprite: 'icon_ingot_tin', value: 12 },
  ingot_bronze: { id: 'ingot_bronze', name: 'Bronze Ingot', stackable: false, sprite: 'icon_ingot_bronze', value: 25 },
  ingot_arsenical: { id: 'ingot_arsenical', name: 'Arsenical Bronze Ingot', stackable: false, sprite: 'icon_ingot_arsenical', value: 90 },
  ingot_bismuth_bronze: { id: 'ingot_bismuth_bronze', name: 'Bismuth Bronze Ingot', stackable: false, sprite: 'icon_ingot_bismuth_bronze', value: 160 },
  ingot_starfall: { id: 'ingot_starfall', name: 'Starfall Alloy Ingot', stackable: false, sprite: 'icon_ingot_starfall', value: 800, isNft: true },

  // Timbers & Forestry Products
  wood_cycad: { id: 'wood_cycad', name: 'Cycad Wood', stackable: false, sprite: 'icon_wood_cycad', value: 8 },
  wood_willow: { id: 'wood_willow', name: 'River Willow Log', stackable: false, sprite: 'icon_wood_willow', value: 15 },
  wood_acacia: { id: 'wood_acacia', name: 'Savannah Acacia Log', stackable: false, sprite: 'icon_wood_acacia', value: 20 },
  wood_bristlecone: { id: 'wood_bristlecone', name: 'Bristlecone Log', stackable: false, sprite: 'icon_wood_bristlecone', value: 30 },
  wood_ironwood: { id: 'wood_ironwood', name: 'Primeval Ironwood Log', stackable: false, sprite: 'icon_wood_ironwood', value: 90 },
  wood_ebony: { id: 'wood_ebony', name: 'Ebony Swamp Log', stackable: false, sprite: 'icon_wood_ebony', value: 120 },
  wood_ashwood: { id: 'wood_ashwood', name: 'Volcanic Ashwood Log', stackable: false, sprite: 'icon_wood_ashwood', value: 160 },
  item_tree_bark: { id: 'item_tree_bark', name: 'Fibrous Tree Bark', stackable: true, sprite: 'icon_item_tree_bark', value: 4 },
  item_tree_resin: { id: 'item_tree_resin', name: 'Tree Pitch Resin', stackable: true, sprite: 'icon_item_tree_resin', value: 10 },
  plank_hardwood: { id: 'plank_hardwood', name: 'Hardwood Plank', stackable: false, sprite: 'icon_plank_hardwood', value: 25 },

  // Foraged Botanicals & Herbs
  berry_sweet: { id: 'berry_sweet', name: 'Sweet Prairie Berries', stackable: true, heal: 2, sprite: 'icon_berry_sweet', value: 3 },
  root_fever: { id: 'root_fever', name: 'Medicinal Fever Root', stackable: true, sprite: 'icon_root_fever', value: 8 },
  reeds_river: { id: 'reeds_river', name: 'River Reeds', stackable: true, sprite: 'icon_reeds_river', value: 4 },
  fungus_glow: { id: 'fungus_glow', name: 'Cave Glow Fungus', stackable: true, sprite: 'icon_fungus_glow', value: 14 },
  grain_wheat: { id: 'grain_wheat', name: 'Wild Wheat & Spelt', stackable: true, sprite: 'icon_grain_wheat', value: 5 },
  moss_tundra: { id: 'moss_tundra', name: 'Tundra Wound Moss', stackable: true, sprite: 'icon_moss_tundra', value: 12 },
  vine_serpent: { id: 'vine_serpent', name: 'Serpent Vine', stackable: true, sprite: 'icon_vine_serpent', value: 16 },
  flower_ghost_orchid: { id: 'flower_ghost_orchid', name: 'Rainforest Ghost Orchid', stackable: true, sprite: 'icon_flower_ghost_orchid', value: 35 },
  root_ginseng: { id: 'root_ginseng', name: 'Mountain Ginseng Root', stackable: true, sprite: 'icon_root_ginseng', value: 40 },
  fungus_crypt_truffle: { id: 'fungus_crypt_truffle', name: 'Sunken Crypt Truffle', stackable: true, sprite: 'icon_fungus_crypt_truffle', value: 65 },

  // Fish & Aquatic Game
  fish_salmon: { id: 'fish_salmon', name: 'River Salmon', stackable: false, heal: 4, sprite: 'icon_fish_salmon', value: 8 },
  fish_trout: { id: 'fish_trout', name: 'Speckled Trout', stackable: false, heal: 6, sprite: 'icon_fish_trout', value: 14 },
  fish_crayfish: { id: 'fish_crayfish', name: 'Freshwater Crayfish', stackable: false, heal: 5, sprite: 'icon_fish_crayfish', value: 12 },
  fish_sturgeon: { id: 'fish_sturgeon', name: 'Great Lake Sturgeon', stackable: false, heal: 10, sprite: 'icon_fish_sturgeon', value: 28 },
  fish_eel: { id: 'fish_eel', name: 'River Eel', stackable: false, heal: 8, sprite: 'icon_fish_eel', value: 22 },
  fish_arapaima: { id: 'fish_arapaima', name: 'Giant Arapaima', stackable: false, heal: 16, sprite: 'icon_fish_arapaima', value: 60 },
  fish_magma_eel: { id: 'fish_magma_eel', name: 'Volcanic Magma Eel', stackable: false, heal: 20, sprite: 'icon_fish_magma_eel', value: 95 },

  // Prepared Meals & Foods (Cooking)
  meat_raw: { id: 'meat_raw', name: 'Raw Boar Meat', stackable: false, sprite: 'icon_meat_raw', value: 4 },
  meat_cooked: { id: 'meat_cooked', name: 'Roasted Boar Meat', stackable: false, heal: 6, sprite: 'icon_meat_cooked', value: 12 },
  fish_smoked: { id: 'fish_smoked', name: 'Smoked River Fish', stackable: false, heal: 8, sprite: 'icon_fish_smoked', value: 18 },
  food_porridge: { id: 'food_porridge', name: 'Clay Pot Porridge', stackable: false, heal: 10, sprite: 'icon_food_porridge', value: 20 },
  food_berry_tart: { id: 'food_berry_tart', name: 'Wild Berry Tart', stackable: false, heal: 12, sprite: 'icon_food_berry_tart', value: 25 },
  food_wolf_flank: { id: 'food_wolf_flank', name: 'Roasted Wolf Flank', stackable: false, heal: 14, sprite: 'icon_food_wolf_flank', value: 30 },
  food_raptor_omelet: { id: 'food_raptor_omelet', name: 'Raptor Egg Omelet', stackable: false, heal: 16, sprite: 'icon_food_raptor_omelet', value: 38 },
  food_venison_roast: { id: 'food_venison_roast', name: 'Highland Venison Roast', stackable: false, heal: 18, sprite: 'icon_food_venison_roast', value: 45 },
  mammoth_steak: { id: 'mammoth_steak', name: 'Mammoth Tenderloin Steak', stackable: false, heal: 20, sprite: 'icon_mammoth_steak', value: 80 },
  food_herbal_skewers: { id: 'food_herbal_skewers', name: 'Herbal Meat Skewers', stackable: false, heal: 22, curesPoison: true, sprite: 'icon_food_herbal_skewers', value: 65 },
  food_spiced_stew: { id: 'food_spiced_stew', name: 'Savannah Spiced Stew', stackable: false, heal: 24, sprite: 'icon_food_spiced_stew', value: 85 },
  food_salmon_jerky: { id: 'food_salmon_jerky', name: 'Smoked Salmon Jerky', stackable: true, heal: 12, sprite: 'icon_food_salmon_jerky', value: 40 },
  food_bear_ribs: { id: 'food_bear_ribs', name: 'Cave Bear Ribs', stackable: false, heal: 28, sprite: 'icon_food_bear_ribs', value: 120 },

  // Weapons & Hunting Instruments
  knife_flint: { id: 'knife_flint', name: 'Flint Flake Knife', slot: 'weapon', attackBonus: 4, strengthBonus: 3, sprite: 'icon_knife_flint', value: 10 },
  spear_flint: { id: 'spear_flint', name: 'Flint Spear', slot: 'weapon', attackBonus: 6, strengthBonus: 5, sprite: 'icon_spear_flint', value: 15 },
  axe_flint: { id: 'axe_flint', name: 'Flint Handaxe', slot: 'weapon', attackBonus: 8, strengthBonus: 7, sprite: 'icon_axe_flint', value: 20 },
  spear_raptor_harpoon: { id: 'spear_raptor_harpoon', name: 'Saber Raptor Harpoon', slot: 'weapon', attackBonus: 12, strengthBonus: 10, sprite: 'icon_spear_raptor_harpoon', value: 65 },
  bow_hunting: { id: 'bow_hunting', name: 'Hunting Recurve Bow', slot: 'weapon', attackBonus: 18, strengthBonus: 15, sprite: 'icon_bow_hunting', value: 120 },
  bow_bone_recurve: { id: 'bow_bone_recurve', name: 'Bone Recurve Bow', slot: 'weapon', attackBonus: 24, strengthBonus: 20, sprite: 'icon_bow_bone_recurve', value: 220 },
  club_hardwood: { id: 'club_hardwood', name: 'Heavy Hardwood Club', slot: 'weapon', attackBonus: 10, strengthBonus: 14, sprite: 'icon_club_hardwood', value: 45 },
  greataxe_bronze: { id: 'greataxe_bronze', name: 'Bronze Greataxe', slot: 'weapon', attackBonus: 25, strengthBonus: 28, isTwoHanded: true, sprite: 'icon_greataxe_bronze', value: 280 },
  hammer_ironwood_sledge: { id: 'hammer_ironwood_sledge', name: 'Ironwood Sledge', slot: 'weapon', attackBonus: 28, strengthBonus: 32, isTwoHanded: true, sprite: 'icon_hammer_ironwood_sledge', value: 420 },
  maul_obsidian: { id: 'maul_obsidian', name: 'Obsidian War Maul', slot: 'weapon', attackBonus: 42, strengthBonus: 45, isTwoHanded: true, sprite: 'icon_maul_obsidian', value: 950 },
  javelin_obsidian: { id: 'javelin_obsidian', name: 'Obsidian War Javelin', slot: 'weapon', attackBonus: 35, strengthBonus: 30, sprite: 'icon_javelin_obsidian', value: 600 },
  blade_obsidian_razor: { id: 'blade_obsidian_razor', name: 'Obsidian Razor Blade', slot: 'weapon', attackBonus: 16, strengthBonus: 12, sprite: 'icon_blade_obsidian_razor', value: 110 },
  dagger_obsidian: { id: 'dagger_obsidian', name: 'Obsidian Ritual Dagger', slot: 'weapon', attackBonus: 28, strengthBonus: 24, sprite: 'icon_dagger_obsidian', value: 350 },
  scythe_obsidian: { id: 'scythe_obsidian', name: 'Obsidian War Scythe', slot: 'weapon', attackBonus: 38, strengthBonus: 36, isTwoHanded: true, sprite: 'icon_scythe_obsidian', value: 850 },
  knife_copper: { id: 'knife_copper', name: 'Cast Copper Knife', slot: 'weapon', attackBonus: 8, strengthBonus: 6, sprite: 'icon_knife_copper', value: 35 },
  adze_copper: { id: 'adze_copper', name: 'Cast Copper Adze', slot: 'weapon', attackBonus: 9, strengthBonus: 8, sprite: 'icon_adze_copper', value: 40 },
  axe_bronze: { id: 'axe_bronze', name: 'Cast Bronze Axe', slot: 'weapon', attackBonus: 14, strengthBonus: 12, sprite: 'icon_axe_bronze', value: 75 },
  spear_bronze: { id: 'spear_bronze', name: 'Bronze War Spear', slot: 'weapon', attackBonus: 45, strengthBonus: 40, sprite: 'icon_spear_bronze', value: 900 },
  spear_bronze_harpoon: { id: 'spear_bronze_harpoon', name: 'Heavy Bronze Harpoon', slot: 'weapon', attackBonus: 32, strengthBonus: 28, sprite: 'icon_spear_bronze_harpoon', value: 450 },
  sword_bronze: { id: 'sword_bronze', name: 'Cast Bronze Leaf Sword', slot: 'weapon', attackBonus: 34, strengthBonus: 30, sprite: 'icon_sword_bronze', value: 550 },
  spear_starfall: { id: 'spear_starfall', name: 'Starfall God-Spear', slot: 'weapon', attackBonus: 95, strengthBonus: 90, sprite: 'icon_spear_starfall', value: 12000, isNft: true },

  // Armor, Shields & Attire
  armor_hide: { id: 'armor_hide', name: 'Cured Mammoth Hide', slot: 'body', defenseBonus: 10, sprite: 'icon_armor_hide', value: 40 },
  shield_wicker: { id: 'shield_wicker', name: 'Wicker Round Shield', slot: 'shield', defenseBonus: 8, sprite: 'icon_shield_wicker', value: 25 },
  shield_wood: { id: 'shield_wood', name: 'Tribal Wood Buckler', slot: 'shield', defenseBonus: 6, sprite: 'icon_shield_wood', value: 30 },
  armor_bronze: { id: 'armor_bronze', name: 'Cast Bronze Cuirass', slot: 'body', defenseBonus: 28, sprite: 'icon_armor_bronze', value: 300 },
  greaves_bronze: { id: 'greaves_bronze', name: 'Cast Bronze Greaves', slot: 'legs', defenseBonus: 18, sprite: 'icon_greaves_bronze', value: 220 },
  helmet_bronze: { id: 'helmet_bronze', name: 'Bronze Horned Helmet', slot: 'head', defenseBonus: 16, sprite: 'icon_helmet_bronze', value: 240 },
  armor_mammoth_vest: { id: 'armor_mammoth_vest', name: 'Mammoth Carapace Vest', slot: 'body', defenseBonus: 22, sprite: 'icon_armor_mammoth_vest', value: 180 },
  shield_arsenical_bronze: { id: 'shield_arsenical_bronze', name: 'Arsenical Bronze Tower Shield', slot: 'shield', defenseBonus: 24, sprite: 'icon_shield_arsenical_bronze', value: 380 },
  armor_raptor_coat: { id: 'armor_raptor_coat', name: 'Raptor Scale Coat', slot: 'body', defenseBonus: 25, sprite: 'icon_armor_raptor_coat', value: 320 },
  armor_raptor_vest: { id: 'armor_raptor_vest', name: 'Raptor Scale Vest', slot: 'body', defenseBonus: 16, sprite: 'icon_armor_raptor_vest', value: 140 },
  armor_hardened_leather: { id: 'armor_hardened_leather', name: 'Hardened Leather Cuirass', slot: 'body', defenseBonus: 20, sprite: 'icon_armor_hardened_leather', value: 190 },
  armor_obsidian_plate: { id: 'armor_obsidian_plate', name: 'Obsidian Plate Armor', slot: 'body', defenseBonus: 38, sprite: 'icon_armor_obsidian_plate', value: 1100 },
  boots_leather: { id: 'boots_leather', name: 'Leather Footwraps', slot: 'feet', defenseBonus: 4, speedBonus: 1, sprite: 'icon_boots_leather', value: 30 },
  quiver_rawhide: { id: 'quiver_rawhide', name: 'Rawhide Quiver', slot: 'cape', defenseBonus: 2, sprite: 'icon_quiver_rawhide', value: 35 },
  gloves_studded_leather: { id: 'gloves_studded_leather', name: 'Studded Leather Bracers', slot: 'hands', defenseBonus: 5, sprite: 'icon_gloves_studded_leather', value: 45 },
  cape_bear_fur: { id: 'cape_bear_fur', name: 'Cave Bear Fur Cloak', slot: 'cape', defenseBonus: 12, coldResist: true, sprite: 'icon_cape_bear_fur', value: 260 },
  gloves_raptor_gauntlets: { id: 'gloves_raptor_gauntlets', name: 'Reinforced Raptor Gauntlets', slot: 'hands', defenseBonus: 8, attackBonus: 4, sprite: 'icon_gloves_raptor_gauntlets', value: 180 },
  headdress_feather: { id: 'headdress_feather', name: 'Shaman Feather Headdress', slot: 'head', defenseBonus: 8, sprite: 'icon_headdress_feather', value: 150 },
  mammoth_tusk: { id: 'mammoth_tusk', name: 'Great Mammoth Tusk', slot: 'head', defenseBonus: 25, sprite: 'icon_mammoth_tusk', value: 5000, isNft: true },
  amulet_amber: { id: 'amulet_amber', name: 'Carved Amber Talisman', slot: 'neck', attackBonus: 5, strengthBonus: 5, defenseBonus: 5, sprite: 'icon_amulet_amber', value: 200 },

  // Alchemy Tonics, Potions & Bombs
  potion_health: { id: 'potion_health', name: 'Vitality Tonic', stackable: true, heal: 15, sprite: 'icon_potion_health', value: 35 },
  potion_spirit: { id: 'potion_spirit', name: 'Spirit Salve', stackable: true, healSpirit: 15, sprite: 'icon_potion_spirit', value: 45 },
  potion_fever_poultice: { id: 'potion_fever_poultice', name: 'Antiseptic Fever Poultice', stackable: true, heal: 8, curesBleed: true, sprite: 'icon_potion_fever_poultice', value: 25 },
  item_serpent_toxin: { id: 'item_serpent_toxin', name: 'Serpent Toxin Phial', stackable: true, poisonDuration: 6, sprite: 'icon_item_serpent_toxin', value: 40 },
  potion_stamina: { id: 'potion_stamina', name: 'Stamina Tonic', stackable: true, staminaRestore: 100, sprite: 'icon_potion_stamina', value: 30 },
  potion_strength: { id: 'potion_strength', name: 'Hunter Strength Brew', stackable: true, strengthBuff: 5, buffDuration: 300, sprite: 'icon_potion_strength', value: 60 },
  potion_antidote: { id: 'potion_antidote', name: 'Antidote Elixir', stackable: true, curesPoison: true, sprite: 'icon_potion_antidote', value: 50 },
  potion_berserker: { id: 'potion_berserker', name: 'Berserker War Draught', stackable: true, attackBuff: 8, strengthBuff: 8, buffDuration: 180, sprite: 'icon_potion_berserker', value: 120 },
  potion_fire_resist: { id: 'potion_fire_resist', name: 'Fire-Resistant Salve', stackable: true, fireResist: 50, buffDuration: 300, sprite: 'icon_potion_fire_resist', value: 90 },
  potion_night_eye: { id: 'potion_night_eye', name: 'Night Eye Elixir', stackable: true, nightVision: true, buffDuration: 300, sprite: 'icon_potion_night_eye', value: 80 },
  potion_super_strength: { id: 'potion_super_strength', name: 'Super Strength Brew', stackable: true, strengthBuff: 12, buffDuration: 600, sprite: 'icon_potion_super_strength', value: 200 },
  potion_raptor_speed: { id: 'potion_raptor_speed', name: 'Raptor Speed Potion', stackable: true, speedBuff: 2, buffDuration: 120, sprite: 'icon_potion_raptor_speed', value: 150 },
  potion_liquid_fire: { id: 'potion_liquid_fire', name: 'Liquid Fire Flask', stackable: true, splashDamage: 25, sprite: 'icon_potion_liquid_fire', value: 180 },

  // Archaeology Relics & Astrological Tools
  fossil_trilobite: { id: 'fossil_trilobite', name: 'Trilobite Fossil', stackable: false, sprite: 'icon_fossil_trilobite', value: 35 },
  fossil_cleaned_bone: { id: 'fossil_cleaned_bone', name: 'Cleaned Prehistoric Bone', stackable: false, sprite: 'icon_fossil_cleaned_bone', value: 50 },
  tablet_glyph_fragment: { id: 'tablet_glyph_fragment', name: 'Glyph Stone Fragment', stackable: false, sprite: 'icon_tablet_glyph_fragment', value: 65 },
  item_preservation_resin: { id: 'item_preservation_resin', name: 'Relic Preservation Resin', stackable: true, sprite: 'icon_item_preservation_resin', value: 25 },
  relic_crypt_urn: { id: 'relic_crypt_urn', name: 'Sunken Crypt Urn', stackable: false, sprite: 'icon_relic_crypt_urn', value: 140 },
  tablet_cuneiform: { id: 'tablet_cuneiform', name: 'Clay Cuneiform Tablet', stackable: false, sprite: 'icon_tablet_cuneiform', value: 180 },
  relic_starfall_shards: { id: 'relic_starfall_shards', name: 'Starfall Relic Shards', stackable: false, sprite: 'icon_relic_starfall_shards', value: 350 },
  relic_power_conduit: { id: 'relic_power_conduit', name: 'Precursor Power Conduit', stackable: false, sprite: 'icon_relic_power_conduit', value: 500 },
  tablet_astronomical_seal: { id: 'tablet_astronomical_seal', name: 'Astrological Seal Tablet', stackable: false, sprite: 'icon_tablet_astronomical_seal', value: 650 },
  relic_obsidian_idol: { id: 'relic_obsidian_idol', name: 'Obsidian Shaman Idol', stackable: false, sprite: 'icon_relic_obsidian_idol', value: 1200 },
  item_sundial_bone: { id: 'item_sundial_bone', name: 'Carved Bone Sundial', stackable: false, sprite: 'icon_item_sundial_bone', value: 45 },
  item_astrolabe: { id: 'item_astrolabe', name: 'Bronze & Bone Astrolabe', stackable: false, sprite: 'icon_item_astrolabe', value: 320 },
  talisman_spark: { id: 'talisman_spark', name: 'Spirit Spark Talisman', slot: 'neck', magicBonus: 6, sprite: 'icon_talisman_spark', value: 60 },
  talisman_solar_flare: { id: 'talisman_solar_flare', name: 'Solar Flare Talisman', slot: 'neck', magicBonus: 18, sprite: 'icon_talisman_solar_flare', value: 450 },
  tool_merchant_scales: { id: 'tool_merchant_scales', name: 'Bronze Merchant Scales', stackable: false, sprite: 'icon_tool_merchant_scales', value: 110 },

  // Trapping Snares & Pheromones
  trap_reed_snare: { id: 'trap_reed_snare', name: 'Woven Reed Snare', stackable: true, sprite: 'icon_trap_reed_snare', value: 15 },
  trap_stone_deadfall: { id: 'trap_stone_deadfall', name: 'Stone Deadfall Trap', stackable: true, sprite: 'icon_trap_stone_deadfall', value: 30 },
  trap_pitfall_spike: { id: 'trap_pitfall_spike', name: 'Pitfall Spike Trap', stackable: true, sprite: 'icon_trap_pitfall_spike', value: 60 },
  trap_bone_jaw: { id: 'trap_bone_jaw', name: 'Bone Jaw Trap', stackable: true, sprite: 'icon_trap_bone_jaw', value: 85 },
  trap_raptor_cage: { id: 'trap_raptor_cage', name: 'Ironwood Raptor Cage', stackable: false, sprite: 'icon_trap_raptor_cage', value: 180 },
  trap_bronze_bear: { id: 'trap_bronze_bear', name: 'Heavy Bronze Bear Trap', stackable: false, sprite: 'icon_trap_bronze_bear', value: 340 },
  trap_mammoth_trench: { id: 'trap_mammoth_trench', name: 'Mammoth Pitfall Trench Kit', stackable: false, sprite: 'icon_trap_mammoth_trench', value: 750 },
  item_trap_pheromone: { id: 'item_trap_pheromone', name: 'Beast Pheromone Scent', stackable: true, sprite: 'icon_item_trap_pheromone', value: 95 },

  // Watercraft & Sailing Rigs
  boat_reed_raft: { id: 'boat_reed_raft', name: 'Papyrus Reed Raft', stackable: false, waterSpeed: 1, sprite: 'icon_boat_reed_raft', value: 40 },
  boat_dugout_canoe: { id: 'boat_dugout_canoe', name: 'Dugout Pine Canoe', stackable: false, waterSpeed: 2, sprite: 'icon_boat_dugout_canoe', value: 120 },
  boat_wicker_sail: { id: 'boat_wicker_sail', name: 'Wicker-Sail Canoe', stackable: false, waterSpeed: 3, sprite: 'icon_boat_wicker_sail', value: 250 },
  boat_outrigger_canoe: { id: 'boat_outrigger_canoe', name: 'Stabilized Outrigger Canoe', stackable: false, waterSpeed: 4, sprite: 'icon_boat_outrigger_canoe', value: 450 },
  boat_war_canoe: { id: 'boat_war_canoe', name: 'Bronze Age War Canoe', stackable: false, waterSpeed: 5, sprite: 'icon_boat_war_canoe', value: 900 },
  boat_trade_barge: { id: 'boat_trade_barge', name: 'River Trade Barge', stackable: false, waterSpeed: 3, capacityBonus: 50, sprite: 'icon_boat_trade_barge', value: 1200 },
  boat_lake_longboat: { id: 'boat_lake_longboat', name: 'Great Lake Longboat', stackable: false, waterSpeed: 6, sprite: 'icon_boat_lake_longboat', value: 2200 },
  tool_wooden_paddle: { id: 'tool_wooden_paddle', name: 'Carved Wooden Paddle', stackable: false, sprite: 'icon_tool_wooden_paddle', value: 20 },
  tool_punting_pole: { id: 'tool_punting_pole', name: 'Swamp Punting Pole', stackable: false, sprite: 'icon_tool_punting_pole', value: 35 },
  tool_swift_oars: { id: 'tool_swift_oars', name: 'Swift Water Oars', stackable: false, sprite: 'icon_tool_swift_oars', value: 80 },

  // Husbandry Tamed Companions & Mounts
  mount_raptor: { id: 'mount_raptor', name: 'Tamed Saber Raptor', stackable: false, mountSpeed: 3, sprite: 'icon_mount_raptor', value: 800 },
  mount_boar: { id: 'mount_boar', name: 'Tamed Wild Boar', stackable: false, mountSpeed: 2, sprite: 'icon_mount_boar', value: 400 },
  mount_cave_bear: { id: 'mount_cave_bear', name: 'Tamed Cave Bear', stackable: false, mountSpeed: 2, attackBonus: 15, sprite: 'icon_mount_cave_bear', value: 1500 },
  mount_woolly_mammoth: { id: 'mount_woolly_mammoth', name: 'Tamed Woolly Mammoth', stackable: false, mountSpeed: 3, defenseBonus: 30, sprite: 'icon_mount_woolly_mammoth', value: 4000 },
  whistle_primitive: { id: 'whistle_primitive', name: 'Primitive Beast Whistle', stackable: false, sprite: 'icon_whistle_primitive', value: 50 },
  item_animal_feed: { id: 'item_animal_feed', name: 'Nutrient Animal Feed', stackable: true, sprite: 'icon_item_animal_feed', value: 15 },
  saddle_raptor: { id: 'saddle_raptor', name: 'Raptor Leather Saddle', stackable: false, sprite: 'icon_saddle_raptor', value: 180 },
  armor_beast_bone: { id: 'armor_beast_bone', name: 'Beast Bone Armor Plating', stackable: false, sprite: 'icon_armor_beast_bone', value: 220 },

  // Artisan Crafting Tools & Masonry
  pickaxe_flint: { id: 'pickaxe_flint', name: 'Flint Pickaxe', slot: 'weapon', attackBonus: 6, strengthBonus: 6, sprite: 'icon_pickaxe_flint', value: 35 },
  chisel_runestone: { id: 'chisel_runestone', name: 'Runestone Chisel', stackable: false, sprite: 'icon_chisel_runestone', value: 95 },
  chisel_starfall: { id: 'chisel_starfall', name: 'Starfall Chisel', stackable: false, sprite: 'icon_chisel_starfall', value: 850, isNft: true },
  tool_bone_needle: { id: 'tool_bone_needle', name: 'Bone Needle & Awl', stackable: false, sprite: 'icon_tool_bone_needle', value: 18 },
  mold_clay: { id: 'mold_clay', name: 'Clay Ingot Mold', stackable: true, sprite: 'icon_mold_clay', value: 8 },
  item_clay_phial: { id: 'item_clay_phial', name: 'Clay Potion Phial', stackable: true, sprite: 'icon_item_clay_phial', value: 6 },
  brick_clay: { id: 'brick_clay', name: 'Baked Mud Brick', stackable: true, sprite: 'icon_brick_clay', value: 10 }
};

export class Player {
  constructor(options = {}) {
    this.id = options.id || `p_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    this.accountId = options.accountId || null;
    this.username = options.username || 'Tribesman';
    this.address = options.address || null;
    this.isAgent = !!options.isAgent;
    this.agentType = options.agentType || (this.isAgent ? 'Claude-3.5' : 'Human');
    this.badge = this.isAgent ? `Agent: ${this.agentType}` : 'Human';

    this.x = options.x || 90;
    this.y = options.y || 132;
    this.targetX = this.x;
    this.targetY = this.y;
    this.path = [];
    this.facing = options.facing || 'S';

    this.actionState = 'IDLE';
    this.actionTarget = null;
    this.actionTicksRemaining = 0;
    this.inCombat = false;
    this.combatTarget = null;
    this.lastAttackedTick = 0;

    // 20 Prehistoric Skills Initialized
    this.skills = options.skills || {};
    const ALL_SKILL_KEYS = [
      'hunting', 'strength', 'defense', 'hitpoints', 'shamanism',
      'knapping', 'casting', 'woodcutting', 'foraging', 'cooking',
      'leatherworking', 'masonry', 'fishing', 'husbandry', 'archaeology',
      'astronomy', 'bartering', 'alchemy', 'trapping', 'sailing'
    ];

    for (const key of ALL_SKILL_KEYS) {
      if (!this.skills[key]) {
        this.skills[key] = key === 'hitpoints' ? { xp: 1154, lvl: 10 } : { xp: 0, lvl: 1 };
      }
    }

    this.quests = options.quests || {};

    this.hp = options.hp || 10;
    this.maxHp = options.maxHp || 10;
    this.spirit = options.spirit || 10;
    this.maxSpirit = options.maxSpirit || 10;

    this.inventory = options.inventory ? options.inventory.slice(0, 28) : new Array(28).fill(null);
    this.equipment = options.equipment || {
      head: null, cape: null, neck: null, weapon: null, body: null, shield: null, legs: null, hands: null, feet: null, ring: null
    };
    this.bankStorage = options.bankStorage || new Array(50).fill(null);

    // If fresh inventory, seed starter kit
    if (!options.inventory) {
      this.addItem('amber_beads', 50);
      this.addItem('spear_flint', 1);
      this.addItem('axe_bronze', 1);
      this.addItem('meat_cooked', 5);
    }

    this.updateCombatStats();
  }

  addXp(skillName, amount) {
    if (!this.skills[skillName]) {
      this.skills[skillName] = { xp: 0, lvl: 1 };
    }
    const skill = this.skills[skillName];
    const prevLvl = skill.lvl;
    skill.xp += amount;
    skill.lvl = getLevelForXp(skill.xp);

    if (skillName === 'hitpoints') {
      this.maxHp = skill.lvl;
      this.hp = Math.min(this.hp + (skill.lvl - prevLvl), this.maxHp);
    }

    const leveledUp = skill.lvl > prevLvl;
    return {
      leveledUp,
      skillName,
      newLevel: skill.lvl,
      totalXp: skill.xp
    };
  }

  getCombatLevel() {
    const base = 0.25 * (this.skills.defense.lvl + this.skills.hitpoints.lvl + Math.floor(this.spirit / 2));
    const melee = 0.325 * (this.skills.hunting.lvl + this.skills.strength.lvl);
    const shaman = 0.325 * (Math.floor(this.skills.shamanism.lvl / 2) + this.skills.shamanism.lvl);
    return Math.floor(base + Math.max(melee, shaman));
  }

  updateCombatStats() {
    this.maxHp = this.skills.hitpoints.lvl;
    this.hp = Math.min(this.hp, this.maxHp);
  }

  addItem(itemId, quantity = 1) {
    const def = ITEM_DEFINITIONS[itemId];
    if (!def) return false;

    if (def.stackable) {
      for (let i = 0; i < 28; i++) {
        if (this.inventory[i] && this.inventory[i].id === itemId) {
          this.inventory[i].quantity += quantity;
          return true;
        }
      }
    }

    for (let i = 0; i < 28; i++) {
      if (!this.inventory[i]) {
        this.inventory[i] = {
          ...def,
          quantity: def.stackable ? quantity : 1
        };
        if (!def.stackable && quantity > 1) {
          return this.addItem(itemId, quantity - 1);
        }
        return true;
      }
    }
    return false;
  }

  removeItem(itemId, quantity = 1) {
    for (let i = 0; i < 28; i++) {
      const item = this.inventory[i];
      if (item && item.id === itemId) {
        if (item.quantity > quantity) {
          item.quantity -= quantity;
          return true;
        } else {
          const remaining = quantity - item.quantity;
          this.inventory[i] = null;
          if (remaining > 0) {
            return this.removeItem(itemId, remaining);
          }
          return true;
        }
      }
    }
    return false;
  }

  hasItem(itemId, quantity = 1) {
    let count = 0;
    for (let i = 0; i < 28; i++) {
      if (this.inventory[i] && this.inventory[i].id === itemId) {
        count += this.inventory[i].quantity || 1;
      }
    }
    return count >= quantity;
  }

  equipItem(slotIndex) {
    const item = this.inventory[slotIndex];
    if (!item || !item.slot) return false;

    const equipSlot = item.slot;
    const currentEquipped = this.equipment[equipSlot];

    this.equipment[equipSlot] = item;
    this.inventory[slotIndex] = currentEquipped;
    return true;
  }

  unequipItem(equipSlot) {
    const item = this.equipment[equipSlot];
    if (!item) return false;

    if (this.addItem(item.id, item.quantity)) {
      this.equipment[equipSlot] = null;
      return true;
    }
    return false;
  }

  eatFood(slotIndex) {
    const item = this.inventory[slotIndex];
    if (!item) return false;

    let affected = false;
    let healAmount = 0;
    let spiritAmount = 0;

    if (item.heal) {
      healAmount = item.heal;
      this.hp = Math.min(this.hp + healAmount, this.maxHp);
      affected = true;
    }
    if (item.healSpirit) {
      spiritAmount = item.healSpirit;
      this.spirit = Math.min(this.spirit + spiritAmount, this.maxSpirit);
      affected = true;
    }
    if (item.curesPoison) {
      this.isPoisoned = false;
      this.poisonTicks = 0;
      affected = true;
    }
    if (item.curesBleed) {
      this.isBleeding = false;
      this.bleedTicks = 0;
      affected = true;
    }
    if (item.strengthBuff || item.attackBuff || item.speedBuff) {
      this.activeBuffs = this.activeBuffs || {};
      if (item.strengthBuff) this.activeBuffs.strength = { val: item.strengthBuff, duration: item.buffDuration || 300 };
      if (item.attackBuff) this.activeBuffs.attack = { val: item.attackBuff, duration: item.buffDuration || 300 };
      if (item.speedBuff) this.activeBuffs.speed = { val: item.speedBuff, duration: item.buffDuration || 120 };
      affected = true;
    }

    if (!affected) return false;

    if (item.quantity && item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.inventory[slotIndex] = null;
    }

    return {
      healed: healAmount,
      healedSpirit: spiritAmount,
      currentHp: this.hp,
      maxHp: this.maxHp,
      currentSpirit: this.spirit,
      maxSpirit: this.maxSpirit
    };
  }

  // Crafting
  smeltBronzeIngot() {
    if (!this.hasItem('ore_copper', 1) || !this.hasItem('ore_tin', 1)) {
      return { success: false, error: 'Requires 1x Copper Ore and 1x Tin Ore.' };
    }
    this.removeItem('ore_copper', 1);
    this.removeItem('ore_tin', 1);
    this.addItem('ingot_bronze', 1);
    const xpEv = this.addXp('casting', 35);
    return { success: true, item: 'Bronze Ingot', xp: 35, ...xpEv };
  }

  knapFlintSpear() {
    if (!this.hasItem('wood_cycad', 1) || !this.hasItem('ore_copper', 1)) {
      return { success: false, error: 'Requires 1x Cycad Wood and 1x Ore/Flint.' };
    }
    this.removeItem('wood_cycad', 1);
    this.removeItem('ore_copper', 1);
    this.addItem('spear_flint', 1);
    const xpEv = this.addXp('knapping', 25);
    return { success: true, item: 'Flint Spear', xp: 25, ...xpEv };
  }

  cookMeat(slotIndex) {
    const item = this.inventory[slotIndex];
    if (!item || item.id !== 'meat_raw') {
      return { success: false, error: 'Select raw meat to roast.' };
    }
    this.inventory[slotIndex] = null;
    this.addItem('meat_cooked', 1);
    const xpEv = this.addXp('cooking', 20);
    return { success: true, item: 'Roasted Boar Meat', xp: 20, ...xpEv };
  }

  // Tribal Stash Vault (50 Slots, Max 25x Stack per Slot)
  depositToStash(invSlotIndex, quantity = 1) {
    const item = this.inventory[invSlotIndex];
    if (!item) return { success: false, error: 'Slot is empty.' };

    const def = ITEM_DEFINITIONS[item.id] || { name: item.name, sprite: item.sprite };
    const toDeposit = Math.min(item.quantity || 1, quantity);
    let remaining = toDeposit;

    // 1. Try to merge into existing stash slots with the same item id (< 25)
    for (let i = 0; i < 50; i++) {
      const slot = this.bankStorage[i];
      if (slot && slot.id === item.id && slot.quantity < 25) {
        const canTake = 25 - slot.quantity;
        const addAmount = Math.min(canTake, remaining);
        slot.quantity += addAmount;
        remaining -= addAmount;
        if (remaining <= 0) break;
      }
    }

    // 2. If remaining, put into first empty stash slot (up to 25)
    if (remaining > 0) {
      for (let i = 0; i < 50; i++) {
        if (!this.bankStorage[i]) {
          const addAmount = Math.min(25, remaining);
          this.bankStorage[i] = {
            id: item.id,
            name: def.name || item.name,
            sprite: def.sprite || item.sprite,
            quantity: addAmount
          };
          remaining -= addAmount;
          if (remaining <= 0) break;
        }
      }
    }

    const depositedCount = toDeposit - remaining;
    if (depositedCount <= 0) {
      return { success: false, error: 'Stash is full (50 slots reached).' };
    }

    // Remove depositedCount from inventory slot
    if (item.quantity > depositedCount) {
      item.quantity -= depositedCount;
    } else {
      this.inventory[invSlotIndex] = null;
    }

    return { success: true, depositedCount, itemId: item.id };
  }

  withdrawFromStash(stashSlotIndex, quantity = 1) {
    const slot = this.bankStorage[stashSlotIndex];
    if (!slot || slot.quantity <= 0) return { success: false, error: 'Stash slot is empty.' };

    const def = ITEM_DEFINITIONS[slot.id];
    const requested = Math.min(slot.quantity, quantity);

    if (def && def.stackable) {
      const added = this.addItem(slot.id, requested);
      if (added) {
        slot.quantity -= requested;
        if (slot.quantity <= 0) this.bankStorage[stashSlotIndex] = null;
        return { success: true, withdrawnCount: requested };
      }
      return { success: false, error: 'Inventory is full (28 slots).' };
    } else {
      let freeSlots = 0;
      for (let i = 0; i < 28; i++) {
        if (!this.inventory[i]) freeSlots++;
      }
      if (freeSlots === 0) return { success: false, error: 'Inventory is full (28 slots).' };

      const toWithdraw = Math.min(requested, freeSlots);
      for (let w = 0; w < toWithdraw; w++) {
        this.addItem(slot.id, 1);
      }
      slot.quantity -= toWithdraw;
      if (slot.quantity <= 0) this.bankStorage[stashSlotIndex] = null;
      return { success: true, withdrawnCount: toWithdraw };
    }
  }

  depositToBank(invSlotIndex, quantity = 1) {
    const res = this.depositToStash(invSlotIndex, quantity);
    return res.success;
  }

  withdrawFromBank(bankSlotIndex, quantity = 1) {
    const res = this.withdrawFromStash(bankSlotIndex, quantity);
    return res.success;
  }

  toJSON() {
    return {
      id: this.id,
      accountId: this.accountId,
      username: this.username,
      x: this.x,
      y: this.y,
      facing: this.facing,
      hp: this.hp,
      maxHp: this.maxHp,
      spirit: this.spirit,
      skills: this.skills,
      quests: this.quests,
      inventory: this.inventory,
      equipment: this.equipment,
      bankStorage: this.bankStorage
    };
  }

  static fromJSON(data) {
    return new Player(data);
  }
}

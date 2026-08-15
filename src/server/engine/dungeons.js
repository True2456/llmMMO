/**
 * PRIMA: Age of Bronze - 12 Dungeons Engine
 * Manages dungeon layouts, difficulty levels, mob compositions, puzzles, and boss encounters.
 */

export const DUNGEON_DEFINITIONS = {
  dungeon_01_runestone_crypts: {
    id: 'dungeon_01_runestone_crypts',
    name: 'The Sunken Runestone Crypts',
    recLevel: 'Level 5 - 10',
    biome: 'Crypts',
    entrance: { x: 148, y: 55 },
    rooms: 4,
    boss: 'boss_sunken_golem',
    bossName: 'Crypt Guardian Golgoth',
    mobs: ['npc_sunken_zealot_forager', 'npc_sunken_zealot_spearman', 'npc_basalt_golem_lesser'],
    lootChest: { amber: 300, guaranteedDrop: 'spear_flint', bonusXp: 500 }
  },
  dungeon_02_obsidian_magma: {
    id: 'dungeon_02_obsidian_magma',
    name: 'Obsidian Magma Chambers',
    recLevel: 'Level 12 - 18',
    biome: 'Obsidian Crags',
    entrance: { x: 156, y: 132 },
    rooms: 5,
    boss: 'boss_magma_ignis',
    bossName: 'Magma Drake Ignis',
    mobs: ['npc_obsidian_clan_warrior', 'npc_magma_elemental_pebble', 'npc_magma_elemental_formed'],
    lootChest: { amber: 500, guaranteedDrop: 'dagger_obsidian', bonusXp: 800 }
  },
  dungeon_03_frozen_mammoth: {
    id: 'dungeon_03_frozen_mammoth',
    name: 'The Frozen Mammoth Caverns',
    recLevel: 'Level 20 - 25',
    biome: 'Tundra',
    entrance: { x: 61, y: 32 },
    rooms: 6,
    boss: 'boss_frost_matriarch',
    bossName: 'Mammoth Matriarch Ymir',
    mobs: ['woolly_mammoth_stalker', 'woolly_mammoth_pack_hunter', 'npc_frost_sprite_formed'],
    lootChest: { amber: 800, guaranteedDrop: 'armor_hide', bonusXp: 1200 }
  },
  dungeon_04_raptor_catacombs: {
    id: 'dungeon_04_raptor_catacombs',
    name: 'Primeval Raptor Catacombs',
    recLevel: 'Level 15 - 22',
    biome: 'Rainforest',
    entrance: { x: 32, y: 108 },
    rooms: 5,
    boss: 'boss_raptor_patriarch',
    bossName: 'Alpha Sickle Patriarch',
    mobs: ['saber_raptor_pack_hunter', 'saber_raptor_blood_hound', 'npc_cycad_tribe_hunter'],
    lootChest: { amber: 650, guaranteedDrop: 'axe_bronze', bonusXp: 1000 }
  },
  dungeon_05_starfall_core: {
    id: 'dungeon_05_starfall_core',
    name: 'Starfall Meteorite Core',
    recLevel: 'Level 35 - 45',
    biome: 'Starfall Crater (Offshore Isle)',
    entrance: { x: 172, y: 40 },
    rooms: 7,
    boss: 'boss_starfall_overlord',
    bossName: 'Celestial Starfall Automaton',
    mobs: ['npc_starfall_sentinel_guardian', 'npc_starfall_sentinel_monolith'],
    lootChest: { amber: 2500, guaranteedDrop: 'ore_starfall', bonusXp: 3000 }
  },
  dungeon_06_river_abyss: {
    id: 'dungeon_06_river_abyss',
    name: 'The Deep River Abyss',
    recLevel: 'Level 25 - 32',
    biome: 'Primeval River',
    entrance: { x: 96, y: 98 },
    rooms: 6,
    boss: 'boss_kraken_leviathan',
    bossName: 'Primeval River Kraken',
    mobs: ['npc_swamp_mud_effigy_formed', 'npc_swamp_mud_effigy_crag'],
    lootChest: { amber: 1200, guaranteedDrop: 'ingot_bronze', bonusXp: 1800 }
  },
  dungeon_07_stone_colossus: {
    id: 'dungeon_07_stone_colossus',
    name: 'Chamber of the Stone Colossus',
    recLevel: 'Level 30 - 40',
    biome: 'Sol-Megalith',
    entrance: { x: 118, y: 70 },
    rooms: 6,
    boss: 'boss_stone_colossus',
    bossName: 'Mountain Colossus Terra',
    mobs: ['npc_basalt_golem_guardian', 'npc_basalt_golem_monolith'],
    lootChest: { amber: 1800, guaranteedDrop: 'armor_bronze', bonusXp: 2200 }
  },
  dungeon_08_basilisk_mines: {
    id: 'dungeon_08_basilisk_mines',
    name: 'The Basilisk Sulfur Mines',
    recLevel: 'Level 18 - 26',
    biome: 'Obsidian Crags',
    entrance: { x: 140, y: 142 },
    rooms: 5,
    boss: 'boss_basilisk_queen',
    bossName: 'Venom Queen Gorgona',
    mobs: ['cave_bear_stalker', 'npc_obsidian_clan_berserker'],
    lootChest: { amber: 900, guaranteedDrop: 'dagger_obsidian', bonusXp: 1400 }
  },
  dungeon_09_first_shaman_tomb: {
    id: 'dungeon_09_first_shaman_tomb',
    name: 'Tomb of the First Shaman',
    recLevel: 'Level 28 - 36',
    biome: 'Shamanic Mist',
    entrance: { x: 34, y: 135 },
    rooms: 6,
    boss: 'boss_first_shaman_lich',
    bossName: 'First Shaman Malakor',
    mobs: ['npc_cycad_tribe_high_shaman', 'npc_frost_sprite_monolith'],
    lootChest: { amber: 1500, guaranteedDrop: 'headdress_feather', bonusXp: 2000 }
  },
  dungeon_10_fire_drake_caverns: {
    id: 'dungeon_10_fire_drake_caverns',
    name: 'Caverns of the Fire Drake',
    recLevel: 'Level 40 - 48',
    biome: 'Obsidian Crags',
    entrance: { x: 170, y: 155 },
    rooms: 8,
    boss: 'boss_fire_drake_fyr',
    bossName: 'Fire Drake Fyr-Kael',
    mobs: ['npc_magma_elemental_monolith', 'npc_magma_elemental_colossus'],
    lootChest: { amber: 3500, guaranteedDrop: 'ingot_starfall', bonusXp: 4500 }
  },
  dungeon_11_cursed_megalith: {
    id: 'dungeon_11_cursed_megalith',
    name: 'Cursed Megalith Labyrinth',
    recLevel: 'Level 32 - 42',
    biome: 'Sunken Crypts',
    entrance: { x: 155, y: 32 },
    rooms: 7,
    boss: 'boss_megalith_lord',
    bossName: 'Megalith Titan Chronos',
    mobs: ['npc_sunken_zealot_warlord', 'npc_starfall_sentinel_colossus'],
    lootChest: { amber: 2200, guaranteedDrop: 'spear_bronze', bonusXp: 2800 }
  },
  dungeon_12_void_sanctum: {
    id: 'dungeon_12_void_sanctum',
    name: 'The Primordial Void Sanctum',
    recLevel: 'Level 45 - 50 (Endgame Raid)',
    biome: 'Starfall Sanctuary Isle (Offshore)',
    entrance: { x: 168, y: 55 },
    rooms: 10,
    boss: 'boss_void_sanctum_titan',
    bossName: 'Primordial Void Sovereign',
    mobs: ['npc_starfall_sentinel_ancient', 'npc_basalt_golem_ancient', 'npc_magma_elemental_ancient'],
    lootChest: { amber: 10000, guaranteedDrop: 'spear_starfall', bonusXp: 10000 }
  }
};

export class DungeonManager {
  static getDungeon(dungeonId) {
    return DUNGEON_DEFINITIONS[dungeonId] || null;
  }

  static getAllDungeons() {
    return Object.values(DUNGEON_DEFINITIONS);
  }
}

/**
 * PRIMA: Age of Bronze - Master NPC Registry (250 Distinct NPC Types)
 * Organized across 5 Archetypes: Beasts (50), Humanoid Clans (50), Merchants & Elders (50),
 * Elementals & Golems (50), and Dungeon Bosses & Raid Titans (50).
 */

export const NPC_TYPES = {};

// Helper to register an NPC Type
function registerNpc(id, name, category, combatLvl, hp, attack, defense, biome, drops = [], isBoss = false, dialogue = null) {
  NPC_TYPES[id] = {
    id,
    name,
    category,
    combatLvl,
    hp,
    maxHp: hp,
    attackBonus: attack,
    strengthBonus: attack,
    defenseBonus: defense,
    maxHit: Math.max(1, Math.floor(attack / 4) + 1),
    biome,
    drops,
    isBoss,
    dialogue
  };
}

// ============================================================================
// 1. FAUNA & WILD BEASTS (50 DISTINCT NPC TYPES)
// ============================================================================
const BEAST_PREFIXES = [
  { p: 'pup', name: 'Pup', lvl: 1, hp: 6, att: 1, def: 1 },
  { p: 'young', name: 'Young', lvl: 2, hp: 8, att: 2, def: 2 },
  { p: 'scavenger', name: 'Scavenger', lvl: 3, hp: 10, att: 3, def: 3 },
  { p: 'stalker', name: 'Stalker', lvl: 5, hp: 14, att: 5, def: 4 },
  { p: 'pack_hunter', name: 'Pack Hunter', lvl: 7, hp: 18, att: 7, def: 6 },
  { p: 'blood_hound', name: 'Blood', lvl: 9, hp: 22, att: 9, def: 8 },
  { p: 'alpha', name: 'Alpha', lvl: 12, hp: 30, att: 12, def: 10 },
  { p: 'grizzled', name: 'Grizzled', lvl: 15, hp: 38, att: 15, def: 14 },
  { p: 'shadow', name: 'Shadow', lvl: 18, hp: 46, att: 18, def: 16 },
  { p: 'apex', name: 'Apex Primeval', lvl: 22, hp: 58, att: 22, def: 20 }
];

const BEAST_SPECIES = [
  { key: 'dire_wolf', base: 'Dire Wolf', biome: 'Savannah', drop: 'meat_raw' },
  { key: 'saber_raptor', base: 'Saber Raptor', biome: 'Rainforest', drop: 'meat_raw' },
  { key: 'woolly_mammoth', base: 'Woolly Mammoth', biome: 'Tundra', drop: 'mammoth_steak' },
  { key: 'cave_bear', base: 'Cave Bear', biome: 'Crags', drop: 'meat_raw' },
  { key: 'woolly_rhino', base: 'Woolly Rhino', biome: 'Tundra', drop: 'meat_raw' }
];

for (const species of BEAST_SPECIES) {
  for (const p of BEAST_PREFIXES) {
    const id = `${species.key}_${p.p}`;
    const name = `${p.name} ${species.base}`;
    registerNpc(id, name, 'beast', p.lvl, p.hp, p.att, p.def, species.biome, [
      { id: species.drop, chance: 0.8, min: 1, max: 2 },
      { id: 'amber_beads', chance: 0.5, min: 2, max: 10 }
    ]);
  }
}

// ============================================================================
// 2. HUMANOID TRIBES, CLANS & RAIDERS (50 DISTINCT NPC TYPES)
// ============================================================================
const CLANS = [
  { key: 'ash_river', name: 'Ash-River', biome: 'Savannah' },
  { key: 'obsidian_clan', name: 'Obsidian Rift', biome: 'Crags' },
  { key: 'mammoth_tribe', name: 'Skadi Mammoth', biome: 'Tundra' },
  { key: 'cycad_tribe', name: 'Primeval Cycad', biome: 'Rainforest' },
  { key: 'sunken_zealot', name: 'Sunken Crypt', biome: 'Crypts' }
];

const ROLES = [
  { r: 'forager', title: 'Forager', lvl: 2, hp: 8, att: 2, def: 1 },
  { r: 'hunter', title: 'Hunter', lvl: 4, hp: 12, att: 4, def: 3 },
  { r: 'knapper', title: 'Stone Knapper', lvl: 6, hp: 16, att: 5, def: 4 },
  { r: 'spearman', title: 'Spearman', lvl: 8, hp: 20, att: 8, def: 7 },
  { r: 'shield_guard', title: 'Shield Guard', lvl: 11, hp: 26, att: 9, def: 12 },
  { r: 'shaman_initiate', title: 'Shaman Initiate', lvl: 14, hp: 30, att: 14, def: 8 },
  { r: 'warrior', title: 'Bronze Warrior', lvl: 18, hp: 42, att: 18, def: 16 },
  { r: 'berserker', title: 'Berserker', lvl: 22, hp: 55, att: 24, def: 12 },
  { r: 'high_shaman', title: 'High Shaman', lvl: 28, hp: 68, att: 28, def: 20 },
  { r: 'warlord', title: 'Warlord Chieftain', lvl: 35, hp: 90, att: 35, def: 28 }
];

for (const clan of CLANS) {
  for (const r of ROLES) {
    const id = `npc_${clan.key}_${r.r}`;
    const name = `${clan.name} ${r.title}`;
    registerNpc(id, name, 'humanoid', r.lvl, r.hp, r.att, r.def, clan.biome, [
      { id: 'amber_beads', chance: 0.9, min: 5, max: 25 },
      { id: 'spear_flint', chance: 0.15, min: 1, max: 1 }
    ]);
  }
}

// ============================================================================
// 3. SETTLEMENT MERCHANTS, ARTISANS & ELDERS (50 DISTINCT NPC TYPES)
// ============================================================================
const CITIES = [
  'Uruk-Prime', 'Ash-Varr', 'Sol-Megalith', 'Oasis-Al-Totem', 'Skadi-Frost',
  'Rain-Crest', 'Basalt-Watch', 'River-Ford', 'Starfall-Crater', 'Sunken-Crypts'
];

const SETTLEMENT_ROLES = [
  { key: 'elder', title: 'Village Elder', dialogue: 'Welcome, young tribesman. Seek honor in our lands.' },
  { key: 'blacksmith', title: 'Master Smelter', dialogue: 'Bring me copper and tin, and I shall forge bronze.' },
  { key: 'trader', title: 'Exchange Merchant', dialogue: 'Amber beads speak every language in the realm.' },
  { key: 'alchemist', title: 'Apothecary', dialogue: 'Herbs of the earth heal what iron has torn.' },
  { key: 'stargazer', title: 'Celestial Seer', dialogue: 'The constellations foretell a great starfall event.' }
];

for (const city of CITIES) {
  for (const s of SETTLEMENT_ROLES) {
    const slugCity = city.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const id = `npc_merch_${slugCity}_${s.key}`;
    const name = `${s.title} of ${city}`;
    registerNpc(id, name, 'merchant', 10, 100, 5, 20, city, [], false, s.dialogue);
  }
}

// ============================================================================
// 4. ELEMENTALS, GOLEMS, CONSTRUCTS & SPIRITS (50 DISTINCT NPC TYPES)
// ============================================================================
const ELEMENT_TYPES = [
  { key: 'basalt_golem', base: 'Basalt Stone Golem', biome: 'Crags' },
  { key: 'magma_elemental', base: 'Molten Magma Elemental', biome: 'Crags' },
  { key: 'frost_sprite', base: 'Frostbite Spirit', biome: 'Tundra' },
  { key: 'starfall_sentinel', base: 'Starfall Automaton', biome: 'Crypts' },
  { key: 'swamp_mud_effigy', base: 'Swamp Mud Effigy', biome: 'Rainforest' }
];

const CONSTRUCT_TIERS = [
  { t: 'lesser', title: 'Lesser', lvl: 6, hp: 18, att: 6, def: 8 },
  { t: 'pebble', title: 'Fragment', lvl: 9, hp: 24, att: 9, def: 11 },
  { t: 'formed', title: 'Awakened', lvl: 13, hp: 35, att: 13, def: 16 },
  { t: 'crag', title: 'Boulder', lvl: 17, hp: 48, att: 17, def: 22 },
  { t: 'runic', title: 'Rune-Inscribed', lvl: 21, hp: 62, att: 21, def: 28 },
  { t: 'guardian', title: 'Temple Guardian', lvl: 26, hp: 78, att: 26, def: 34 },
  { t: 'molten', title: 'Core Infused', lvl: 31, hp: 95, att: 31, def: 40 },
  { t: 'monolith', title: 'Monolith', lvl: 36, hp: 115, att: 36, def: 48 },
  { t: 'colossus', title: 'Lesser Colossus', lvl: 41, hp: 140, att: 41, def: 55 },
  { t: 'ancient', title: 'Ancient Precursor', lvl: 46, hp: 175, att: 46, def: 65 }
];

for (const el of ELEMENT_TYPES) {
  for (const c of CONSTRUCT_TIERS) {
    const id = `npc_${el.key}_${c.t}`;
    const name = `${c.title} ${el.base}`;
    registerNpc(id, name, 'elemental', c.lvl, c.hp, c.att, c.def, el.biome, [
      { id: 'ore_copper', chance: 0.5, min: 1, max: 2 },
      { id: 'amber_beads', chance: 0.7, min: 10, max: 40 }
    ]);
  }
}

// ============================================================================
// 5. DUNGEON BOSSES, RAID TITANS & ELITES (50 DISTINCT NPC TYPES)
// ============================================================================
const BOSS_NAMES = [
  // 12 Dungeon Main Bosses
  { id: 'boss_sunken_golem', name: 'Crypt Guardian Golgoth', lvl: 12, hp: 120, att: 15, def: 18, biome: 'Dungeon 1' },
  { id: 'boss_magma_ignis', name: 'Magma Drake Ignis', lvl: 18, hp: 200, att: 22, def: 25, biome: 'Dungeon 2' },
  { id: 'boss_frost_matriarch', name: 'Mammoth Matriarch Ymir', lvl: 25, hp: 320, att: 28, def: 32, biome: 'Dungeon 3' },
  { id: 'boss_raptor_patriarch', name: 'Alpha Sickle Patriarch', lvl: 22, hp: 260, att: 30, def: 24, biome: 'Dungeon 4' },
  { id: 'boss_starfall_overlord', name: 'Celestial Starfall Automaton', lvl: 42, hp: 600, att: 48, def: 50, biome: 'Dungeon 5' },
  { id: 'boss_kraken_leviathan', name: 'Primeval River Kraken', lvl: 35, hp: 480, att: 40, def: 38, biome: 'Dungeon 6' },
  { id: 'boss_stone_colossus', name: 'Mountain Colossus Terra', lvl: 38, hp: 550, att: 44, def: 60, biome: 'Dungeon 7' },
  { id: 'boss_basilisk_queen', name: 'Venom Queen Gorgona', lvl: 26, hp: 340, att: 32, def: 30, biome: 'Dungeon 8' },
  { id: 'boss_first_shaman_lich', name: 'First Shaman Malakor', lvl: 36, hp: 500, att: 45, def: 35, biome: 'Dungeon 9' },
  { id: 'boss_fire_drake_fyr', name: 'Fire Drake Fyr-Kael', lvl: 46, hp: 750, att: 54, def: 48, biome: 'Dungeon 10' },
  { id: 'boss_megalith_lord', name: 'Megalith Titan Chronos', lvl: 44, hp: 680, att: 50, def: 58, biome: 'Dungeon 11' },
  { id: 'boss_void_sanctum_titan', name: 'Primordial Void Sovereign', lvl: 50, hp: 1200, att: 65, def: 70, biome: 'Dungeon 12' }
];

// Register the 12 Primary Dungeon Bosses
for (const b of BOSS_NAMES) {
  registerNpc(b.id, b.name, 'boss', b.lvl, b.hp, b.att, b.def, b.biome, [
    { id: 'ore_starfall', chance: 0.8, min: 1, max: 3 },
    { id: 'amber_beads', chance: 1.0, min: 200, max: 1000 }
  ], true);
}

// 38 Elite Dungeon Mini-Bosses & World Champions
const ELITE_TITLES = [
  'Bonecarver', 'Flame-Tongue', 'Frost-Biter', 'Venom-Spit', 'Iron-Hide',
  'Blood-Drinker', 'Storm-Caller', 'Earth-Shaker', 'Soul-Reaper', 'Shadow-Stalker',
  'Stone-Breaker', 'Thunder-Claw', 'Night-Terror', 'Sun-Eater', 'Void-Touched',
  'War-Master', 'Dune-Stalker', 'River-Lurker', 'Ash-Bringer', 'Tusk-Lord',
  'Raptor-King', 'Grizzly-Apex', 'Obsidian-Fang', 'Glacier-Heart', 'Crag-Lord',
  'Swamp-Tyrant', 'Star-Watcher', 'Chieftain-Vengeance', 'Ancient-Sentinel', 'Precursor-Echo',
  'Abyss-Feeder', 'Megalith-Brute', 'Chaos-Spawn', 'Spirit-Crusher', 'Dragon-Spawn',
  'Titan-Scion', 'Eternal-Guardian', 'Sovereign-Specter'
];

ELITE_TITLES.forEach((title, idx) => {
  const lvl = 15 + Math.floor(idx * 0.9);
  const hp = 80 + idx * 12;
  const att = 15 + Math.floor(idx * 0.8);
  const def = 14 + Math.floor(idx * 0.8);
  const id = `npc_elite_${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const name = `Elite Champion ${title}`;

  registerNpc(id, name, 'boss', lvl, hp, att, def, 'Wilderness / Dungeons', [
    { id: 'ingot_bronze', chance: 0.6, min: 1, max: 3 },
    { id: 'amber_beads', chance: 1.0, min: 50, max: 200 }
  ], true);
});

console.log(`[PRIMA NPC Engine] Successfully registered ${Object.keys(NPC_TYPES).length} distinct NPC Types!`);

export function getNpcType(typeId) {
  return NPC_TYPES[typeId] || null;
}

export function getAllNpcTypes() {
  return Object.values(NPC_TYPES);
}

/**
 * PRIMA: Age of Bronze - Beast & Monster Ecosystem
 */

export const NPC_TEMPLATES = {
  prairie_hare: {
    name: 'Prairie Hare',
    combatLvl: 1,
    hp: 2,
    maxHp: 2,
    attackBonus: 0,
    strengthBonus: 0,
    defenseBonus: 0,
    maxHit: 0,
    aggro: false,
    respawnTicks: 6,
    sprite: 'monster_hare',
    drops: [
      { id: 'meat_raw', chance: 1.0, qty: 1 },
      { id: 'amber_beads', chance: 0.5, min: 1, max: 3 }
    ]
  },
  forest_boar: {
    name: 'Wild Forest Boar',
    combatLvl: 1,
    hp: 3,
    maxHp: 3,
    attackBonus: 1,
    strengthBonus: 1,
    defenseBonus: 0,
    maxHit: 1,
    aggro: false,
    respawnTicks: 8,
    sprite: 'monster_boar',
    drops: [
      { id: 'meat_raw', chance: 1.0, qty: 1 },
      { id: 'amber_beads', chance: 0.7, min: 2, max: 6 }
    ]
  },
  river_crab: {
    name: 'River Bank Crab',
    combatLvl: 1,
    hp: 3,
    maxHp: 3,
    attackBonus: 1,
    strengthBonus: 1,
    defenseBonus: 1,
    maxHit: 1,
    aggro: false,
    respawnTicks: 6,
    sprite: 'monster_crab',
    drops: [
      { id: 'meat_raw', chance: 1.0, qty: 1 },
      { id: 'amber_beads', chance: 0.6, min: 2, max: 5 }
    ]
  },
  savannah_fox: {
    name: 'Savannah Fox',
    combatLvl: 1,
    hp: 3,
    maxHp: 3,
    attackBonus: 1,
    strengthBonus: 1,
    defenseBonus: 0,
    maxHit: 1,
    aggro: false,
    respawnTicks: 8,
    sprite: 'monster_fox',
    drops: [
      { id: 'meat_raw', chance: 1.0, qty: 1 },
      { id: 'amber_beads', chance: 0.8, min: 3, max: 8 }
    ]
  },
  elder_kael: {
    name: 'Elder Kael (Chieftain)',
    combatLvl: 25,
    hp: 100,
    maxHp: 100,
    attackBonus: 20,
    strengthBonus: 18,
    defenseBonus: 15,
    maxHit: 6,
    aggro: false,
    isTownNpc: true,
    dialogue: 'Welcome to Ash-River Encampment, young tribesman! Gather river clay and cycad wood to help kindle the sacred fire.',
    respawnTicks: 30,
    sprite: 'npc_elder_kael',
    drops: []
  },
  knapper_urk: {
    name: 'Knapper Urk (Master Artisan)',
    combatLvl: 20,
    hp: 80,
    maxHp: 80,
    attackBonus: 15,
    strengthBonus: 15,
    defenseBonus: 12,
    maxHit: 5,
    aggro: false,
    isTownNpc: true,
    dialogue: 'Looking to shape some tools? Mine copper boulders and harvest cycad timber to knap sturdy spears.',
    respawnTicks: 30,
    sprite: 'npc_knapper_urk',
    drops: []
  },
  scout_tara: {
    name: 'Scout Tara (Hunter Guide)',
    combatLvl: 18,
    hp: 70,
    maxHp: 70,
    attackBonus: 16,
    strengthBonus: 14,
    defenseBonus: 10,
    maxHit: 4,
    aggro: false,
    isTownNpc: true,
    dialogue: 'Start your hunting training on prairie hares and forest boars in the meadows before heading into wolf territory.',
    respawnTicks: 30,
    sprite: 'npc_scout_tara',
    drops: []
  },
  banker_torok: {
    name: 'Banker Torok (Vault Keeper)',
    combatLvl: 30,
    hp: 150,
    maxHp: 150,
    attackBonus: 25,
    strengthBonus: 22,
    defenseBonus: 20,
    maxHit: 8,
    aggro: false,
    isTownNpc: true,
    dialogue: 'Your Amber beads and rare items are safe within our tribe’s Grand Vault.',
    respawnTicks: 30,
    sprite: 'npc_banker_torok',
    drops: []
  },
  dire_wolf: {
    name: 'Dire Wolf',
    combatLvl: 3,
    hp: 10,
    maxHp: 10,
    attackBonus: 4,
    strengthBonus: 3,
    defenseBonus: 2,
    maxHit: 2,
    aggro: true,
    aggroRadius: 4,
    respawnTicks: 10,
    sprite: 'monster_dire_wolf',
    drops: [
      { id: 'meat_raw', chance: 1.0, qty: 1 },
      { id: 'amber_beads', chance: 0.8, min: 5, max: 20 },
      { id: 'spear_flint', chance: 0.2, qty: 1 }
    ]
  },
  saber_raptor: {
    name: 'Saber Raptor',
    combatLvl: 16,
    hp: 26,
    maxHp: 26,
    attackBonus: 16,
    strengthBonus: 14,
    defenseBonus: 10,
    maxHit: 5,
    aggro: true,
    aggroRadius: 5,
    respawnTicks: 15,
    sprite: 'monster_raptor',
    drops: [
      { id: 'meat_raw', chance: 1.0, qty: 2 },
      { id: 'amber_beads', chance: 0.9, min: 25, max: 70 },
      { id: 'glass_obsidian', chance: 0.4, qty: 1 }
    ]
  },
  stone_golem: {
    name: 'Primordial Stone Golem',
    combatLvl: 42,
    hp: 85,
    maxHp: 85,
    attackBonus: 32,
    strengthBonus: 30,
    defenseBonus: 28,
    maxHit: 10,
    aggro: false,
    respawnTicks: 25,
    sprite: 'monster_stone_golem',
    drops: [
      { id: 'ore_malachite', chance: 0.7, min: 1, max: 3 },
      { id: 'amber_beads', chance: 1.0, min: 100, max: 300 },
      { id: 'ore_starfall', chance: 0.15, qty: 1 }
    ]
  },
  woolly_mammoth: {
    name: 'Ancient Woolly Mammoth',
    isBoss: true,
    combatLvl: 115,
    hp: 420,
    maxHp: 420,
    attackBonus: 88,
    strengthBonus: 85,
    defenseBonus: 80,
    maxHit: 22,
    aggro: true,
    aggroRadius: 7,
    respawnTicks: 50,
    sprite: 'monster_mammoth',
    drops: [
      { id: 'mammoth_steak', chance: 1.0, qty: 4 },
      { id: 'mammoth_tusk', chance: 0.35, qty: 1 }, // Rare NFT Trophy
      { id: 'spear_starfall', chance: 0.2, qty: 1 }, // Legendary God-Spear
      { id: 'amber_beads', chance: 1.0, min: 1500, max: 5000 }
    ]
  }
};

export class NPC {
  constructor(id, templateKey, spawnX, spawnY) {
    const template = NPC_TEMPLATES[templateKey];
    this.id = id;
    this.templateKey = templateKey;
    this.name = template.name;
    this.combatLvl = template.combatLvl;
    this.hp = template.hp;
    this.maxHp = template.maxHp;
    this.attackBonus = template.attackBonus;
    this.strengthBonus = template.strengthBonus;
    this.defenseBonus = template.defenseBonus;
    this.maxHit = template.maxHit;
    this.aggro = template.aggro;
    this.aggroRadius = template.aggroRadius || 4;
    this.respawnTicks = template.respawnTicks;
    this.isBoss = !!template.isBoss;
    this.isTownNpc = !!template.isTownNpc;
    this.dialogue = template.dialogue || null;
    this.sprite = template.sprite;
    this.drops = template.drops || [];

    this.spawnX = spawnX;
    this.spawnY = spawnY;
    this.x = spawnX;
    this.y = spawnY;

    this.state = 'IDLE';
    this.target = null;
    this.deadTicks = 0;
    this.lastAttackedTick = 0;
  }

  respawn() {
    this.hp = this.maxHp;
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.state = 'IDLE';
    this.target = null;
    this.deadTicks = 0;
  }
}

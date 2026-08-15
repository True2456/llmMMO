/**
 * PRIMA: Age of Bronze - World Continent Engine
 * 200x200 Vast & Diverse Prehistoric Island Archipelago featuring:
 * - Organic Main Continent with Natural Jagged Coastlines, Bays & Sandy Beaches
 * - Offshore "Starfall Sanctuary Isle" off the Eastern Coast
 * - Winding River of Embers with Stone Fords & Delta Estuary
 * - 6 Organically Blended Biomes
 * - 6 Grand Metropolis Cities, 10 Frontier Towns, 12 Dungeons
 * - Dense Resource Veins (Copper, Tin, Malachite, Obsidian, Starfall, Cycad & Bristlecone Trees)
 */

export const BIOMES = [
  { id: 'savannah', name: 'Savannah & Clay Encampment', bounds: { minX: 65, maxX: 130, minY: 115, maxY: 175 } },
  { id: 'tundra', name: 'Mammoth Steppes & Frost Tundra', bounds: { minX: 30, maxX: 140, minY: 20, maxY: 65 } },
  { id: 'crags', name: 'Obsidian Crags & Volcanic Lava Rifts', bounds: { minX: 125, maxX: 180, minY: 95, maxY: 180 } },
  { id: 'rainforest', name: 'Primeval Cycad Rainforest', bounds: { minX: 20, maxX: 75, minY: 65, maxY: 170 } },
  { id: 'crypts', name: 'Sunken Megalith Crypts & Starfall Isle', bounds: { minX: 130, maxX: 185, minY: 25, maxY: 85 } },
  { id: 'oasis', name: 'Barter Oasis & Grand Dunes', bounds: { minX: 70, maxX: 130, minY: 65, maxY: 115 } }
];

export const CITIES = [
  { id: 'city_uruk_prime', name: 'Uruk-Prime', type: 'Grand Metropolis', x: 101, y: 128, desc: 'The Imperial Bronze Metropolis and seat of the high Chieftains.' },
  { id: 'city_ash_varr', name: 'Ash-Varr', type: 'Grand Metropolis', x: 152, y: 128, desc: 'City of the Smelters and perpetual molten bronze crucibles.' },
  { id: 'city_sol_megalith', name: 'Sol-Megalith', type: 'Grand Metropolis', x: 115, y: 62, desc: 'The City of Astronomy, Sun Temples, and celestial stone steles.' },
  { id: 'city_oasis_al_totem', name: 'Oasis-Al-Totem', type: 'Grand Metropolis', x: 96, y: 88, desc: 'The Grand Realm Trade Emporium and central camel caravan hub.' },
  { id: 'city_skadi_frost', name: 'Skadi-Frost', type: 'Grand Metropolis', x: 69, y: 41, desc: 'The Northern Mammoth Citadel carved out of glacier ice and mammoth bone.' },
  { id: 'city_rain_crest', name: 'Rain-Crest', type: 'Grand Metropolis', x: 38, y: 120, desc: 'The Tree Canopy City built among the giant primeval cycads.' }
];

export const TOWNS = [
  { id: 'town_ash_river', name: 'Ash-River Encampment', type: 'Town', x: 90, y: 132, desc: 'Starting tribal camp on the banks of the River of Embers.' },
  { id: 'town_flint_knappers', name: 'Flint-Knappers Outpost', type: 'Town', x: 78, y: 130, desc: 'Frontier quarry outpost for chipping spears and handaxes.' },
  { id: 'town_basalt_watch', name: 'Basalt Watch', type: 'Town', x: 135, y: 115, desc: 'Fortified stone watchtower guarding the obsidian pass.' },
  { id: 'town_river_ford', name: 'River-Ford Harbor', type: 'Town', x: 98, y: 110, desc: 'River port for papyrus reed rafts and war canoes.' },
  { id: 'town_starfall_crater', name: 'Starfall Crater Village', type: 'Town', x: 164, y: 44, desc: 'Settlement built on the offshore isle around the glowing celestial crater.' },
  { id: 'town_sunken_crypts', name: 'Sunken Crypts Sanctuary', type: 'Town', x: 142, y: 48, desc: 'Archaeological camp studying subterranean burial chambers.' },
  { id: 'town_cycad_grove', name: 'Cycad Grove Hamlet', type: 'Town', x: 45, y: 95, desc: 'Lumber hamlet harvesting fibrous cycad and ironwood timber.' },
  { id: 'town_raptor_ridge', name: 'Raptor-Ridge Camp', type: 'Town', x: 55, y: 122, desc: 'Beast-taming camp perched on the cliffs above raptor nests.' },
  { id: 'town_tundra_hearth', name: 'Tundra Hearth Encampment', type: 'Town', x: 79, y: 33, desc: 'Sheltered thermal springs in the northern mammoth steppes.' },
  { id: 'town_shamanic_mist', name: 'Shamanic Mist Sanctuary', type: 'Town', x: 42, y: 145, desc: 'Sacred grove of the herbalists and weather-chanting shamans.' }
];

export const RESOURCE_TYPES = {
  // Mining & Stoneworking Nodes
  COPPER_BOULDER: { name: 'Native Copper Boulder', skill: 'knapping', reqLvl: 1, xp: 20, item: 'ore_copper', respawn: 12, pool: 2 },
  TIN_ROCK: { name: 'Cassiterite Tin Rock', skill: 'knapping', reqLvl: 1, xp: 20, item: 'ore_tin', respawn: 12, pool: 2 },
  MALACHITE_ROCK: { name: 'Malachite Green Boulder', skill: 'knapping', reqLvl: 10, xp: 50, item: 'ore_malachite', respawn: 16, pool: 2 },
  SULFUR_CRYSTALS: { name: 'Volcanic Sulfur Crystals', skill: 'knapping', reqLvl: 20, xp: 75, item: 'mineral_sulfur', respawn: 18, pool: 2 },
  OBSIDIAN_ROCK: { name: 'Obsidian Glass Spire', skill: 'knapping', reqLvl: 20, xp: 90, item: 'glass_obsidian', respawn: 20, pool: 2 },
  STARFALL_CRAG: { name: 'Celestial Starfall Meteorite', skill: 'knapping', reqLvl: 30, xp: 250, item: 'ore_starfall', respawn: 40, pool: 1 },

  // Woodcutting Trees
  CYCAD_TREE: { name: 'Primeval Cycad Palm', skill: 'woodcutting', reqLvl: 1, xp: 25, item: 'wood_cycad', respawn: 12, pool: 3 },
  WILLOW_TREE: { name: 'River Willow Tree', skill: 'woodcutting', reqLvl: 5, xp: 40, item: 'wood_willow', respawn: 14, pool: 3 },
  ACACIA_TREE: { name: 'Savannah Acacia Tree', skill: 'woodcutting', reqLvl: 10, xp: 50, item: 'wood_acacia', respawn: 15, pool: 3 },
  BRISTLECONE_TREE: { name: 'Frost Bristlecone Pine', skill: 'woodcutting', reqLvl: 15, xp: 60, item: 'wood_bristlecone', respawn: 16, pool: 3 },
  IRONWOOD_TREE: { name: 'Ancient Ironwood Giant', skill: 'woodcutting', reqLvl: 20, xp: 100, item: 'wood_ironwood', respawn: 22, pool: 2 },
  EBONY_TREE: { name: 'Ebony Swamp Hardwood', skill: 'woodcutting', reqLvl: 25, xp: 130, item: 'wood_ebony', respawn: 25, pool: 2 },
  ASHWOOD_TREE: { name: 'Volcanic Ashwood Tree', skill: 'woodcutting', reqLvl: 30, xp: 160, item: 'wood_ashwood', respawn: 30, pool: 2 },

  // Foraging & Botanical Gatherables
  RIVER_CLAY: { name: 'River Clay Bank', skill: 'foraging', reqLvl: 1, xp: 15, item: 'clay_lump', respawn: 10, pool: 3 },
  PRAIRIE_BERRIES: { name: 'Sweet Prairie Berries', skill: 'foraging', reqLvl: 3, xp: 20, item: 'berry_sweet', respawn: 10, pool: 3 },
  FEVER_ROOT: { name: 'Medicinal Fever Root', skill: 'foraging', reqLvl: 5, xp: 25, item: 'root_fever', respawn: 12, pool: 3 },
  RIVER_REEDS: { name: 'River Reed Bed', skill: 'foraging', reqLvl: 8, xp: 35, item: 'reeds_river', respawn: 12, pool: 3 },
  GLOW_FUNGUS: { name: 'Cave Glow Fungus', skill: 'foraging', reqLvl: 10, xp: 45, item: 'fungus_glow', respawn: 14, pool: 2 },
  WILD_WHEAT: { name: 'Wild Wheat & Spelt', skill: 'foraging', reqLvl: 12, xp: 50, item: 'grain_wheat', respawn: 14, pool: 3 },
  TUNDRA_MOSS: { name: 'Tundra Wound Moss', skill: 'foraging', reqLvl: 15, xp: 60, item: 'moss_tundra', respawn: 16, pool: 3 },
  SERPENT_VINE: { name: 'Serpent Poison Vine', skill: 'foraging', reqLvl: 18, xp: 75, item: 'vine_serpent', respawn: 18, pool: 2 },
  GHOST_ORCHID: { name: 'Rainforest Ghost Orchid', skill: 'foraging', reqLvl: 25, xp: 120, item: 'flower_ghost_orchid', respawn: 24, pool: 2 },
  MOUNTAIN_GINSENG: { name: 'Mountain Ginseng Root', skill: 'foraging', reqLvl: 28, xp: 140, item: 'root_ginseng', respawn: 26, pool: 2 },
  CRYPT_TRUFFLE: { name: 'Sunken Crypt Truffle', skill: 'foraging', reqLvl: 30, xp: 180, item: 'fungus_crypt_truffle', respawn: 30, pool: 2 },

  // Freshwater Fishing Spots
  FISHING_SALMON: { name: 'Salmon River Ford', skill: 'fishing', reqLvl: 1, xp: 25, item: 'fish_salmon', respawn: 10, pool: 3 },
  FISHING_TROUT: { name: 'Speckled Trout Stream', skill: 'fishing', reqLvl: 8, xp: 40, item: 'fish_trout', respawn: 12, pool: 3 },
  FISHING_CRAYFISH: { name: 'Crayfish Mud Bank', skill: 'fishing', reqLvl: 10, xp: 50, item: 'fish_crayfish', respawn: 12, pool: 3 },
  FISHING_STURGEON: { name: 'Lake Sturgeon Deep', skill: 'fishing', reqLvl: 15, xp: 75, item: 'fish_sturgeon', respawn: 16, pool: 2 },
  FISHING_EEL: { name: 'Swamp River Eel', skill: 'fishing', reqLvl: 18, xp: 90, item: 'fish_eel', respawn: 18, pool: 2 },
  FISHING_ARAPAIMA: { name: 'Giant Arapaima Basin', skill: 'fishing', reqLvl: 25, xp: 140, item: 'fish_arapaima', respawn: 24, pool: 2 },
  FISHING_MAGMA_EEL: { name: 'Volcanic Magma Eel Pool', skill: 'fishing', reqLvl: 30, xp: 190, item: 'fish_magma_eel', respawn: 30, pool: 2 },

  // Archaeology Digs
  ARCHAEOLOGY_DIG: { name: 'Ancient Archaeological Dig', skill: 'archaeology', reqLvl: 1, xp: 45, item: 'fossil_trilobite', respawn: 20, pool: 2 },

  // Specialized Regional Crafting & Storage Stations
  STASH_CHEST: { name: 'Tribal Stash Chest', skill: 'trading', reqLvl: 1, xp: 0, isStation: true, stationType: 'STATION_STASH' },
  CAMPFIRE_STATION: { name: 'Tribal Roasting Fire', skill: 'cooking', reqLvl: 1, xp: 0, isStation: true, stationType: 'STATION_CAMPFIRE' },
  CRUCIBLE_STATION: { name: 'Clay Smelting Crucible', skill: 'casting', reqLvl: 1, xp: 0, isStation: true, stationType: 'STATION_CRUCIBLE' },
  ANVIL_STATION: { name: 'Basalt Shaping Anvil', skill: 'casting', reqLvl: 1, xp: 0, isStation: true, stationType: 'STATION_ANVIL' },
  KNAPPING_STATION: { name: 'Flint Knapping Bench', skill: 'knapping', reqLvl: 1, xp: 0, isStation: true, stationType: 'STATION_KNAPPING' },
  CARPENTER_STATION: { name: "Carpenter's Workbench", skill: 'woodworking', reqLvl: 1, xp: 0, isStation: true, stationType: 'STATION_CARPENTER' },
  TANNERY_STATION: { name: 'Tanning Rack & Furrier', skill: 'trapping', reqLvl: 1, xp: 0, isStation: true, stationType: 'STATION_TANNERY' },
  CAULDRON_STATION: { name: 'Apothecary Cauldron', skill: 'shamanism', reqLvl: 1, xp: 0, isStation: true, stationType: 'STATION_CAULDRON' },
  LOOM_STATION: { name: 'Loom of the Ancients', skill: 'weaving', reqLvl: 1, xp: 0, isStation: true, stationType: 'STATION_LOOM' },
  LAPIDARY_STATION: { name: 'Lapidary Gem Bench', skill: 'carving', reqLvl: 1, xp: 0, isStation: true, stationType: 'STATION_LAPIDARY' }
};

export class World {
  constructor(width = 200, height = 200) {
    this.width = width;
    this.height = height;
    this.tiles = new Uint8Array(width * height);
    this.collision = new Uint8Array(width * height);
    this.resourceNodes = new Map();
    this.decorations = new Map();
    this.groundItems = new Map();
    this.groundItemCounter = 1;

    this.generateContinent();
  }

  // Smooth harmonic pseudo-noise for organic terrain shapes
  noise(nx, ny, seed = 1) {
    const s1 = Math.sin(nx * 3.1 + ny * 2.7 + seed * 1.3);
    const s2 = Math.sin(nx * 6.7 - ny * 5.3 + seed * 2.9) * 0.5;
    const s3 = Math.sin(nx * 12.3 + ny * 14.1 + seed * 4.7) * 0.25;
    const s4 = Math.cos(nx * 25.1 - ny * 22.7 + seed * 8.1) * 0.125;
    return (s1 + s2 + s3 + s4) / (1 + 0.5 + 0.25 + 0.125);
  }

  generateContinent() {
    const { width, height } = this;
    
    // Main continent and Offshore Starfall Island dimensions
    const c1 = { x: 95, y: 105, rx: 78, ry: 72 };
    const c2 = { x: 165, y: 46, rx: 22, ry: 18 };

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const nx = x / width;
        const ny = y / height;

        // Radial distance from Main Continent center
        const dx1 = (x - c1.x) / c1.rx;
        const dy1 = (y - c1.y) / c1.ry;
        const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

        // Radial distance from Offshore Starfall Island center
        const dx2 = (x - c2.x) / c2.rx;
        const dy2 = (y - c2.y) / c2.ry;
        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        const nVal = this.noise(nx * 3, ny * 3, 42) * 0.28;
        const islandElev1 = 1.0 - dist1 + nVal;
        const islandElev2 = 1.0 - dist2 + this.noise(nx * 6, ny * 6, 99) * 0.2;

        const elevation = Math.max(islandElev1, islandElev2);
        const isOffshore = islandElev2 > islandElev1 && islandElev2 > 0.05;

        // 1. Deep Ocean
        if (elevation < 0.05) {
          this.tiles[idx] = 3; // Ocean Water
          this.collision[idx] = 1;
          continue;
        }

        // 2. Coastal Sandy Beach
        if (elevation < 0.14) {
          this.tiles[idx] = 9; // Beach Sand
          this.collision[idx] = 0;
          continue;
        }

        // 3. Biome Partitioning based on organic regions
        if (isOffshore) {
          // Offshore Starfall Isle: Ancient Craters & Meteorite Ruins
          this.tiles[idx] = 7; // Sunken Crypts / Starfall
          this.collision[idx] = 0;
        } else if (y < 52) {
          // North: Mammoth Steppes & Frost Tundra
          this.tiles[idx] = 4; // Tundra Snow / Ice
          this.collision[idx] = 0;
        } else if (x < 65 && y >= 75) {
          // West & South-West: Primeval Cycad Rainforest
          this.tiles[idx] = 6; // Dense Rainforest
          this.collision[idx] = 0;
        } else if (x > 125 && y >= 95) {
          // East / South-East: Obsidian Crags & Volcanic Lava
          if (elevation > 0.65 && this.noise(nx * 8, ny * 8, 12) > 0.2) {
            this.tiles[idx] = 5; // Molten Lava Fissure
            this.collision[idx] = 1;
          } else if (elevation > 0.8) {
            this.tiles[idx] = 10; // High Mountain Peak
            this.collision[idx] = 1;
          } else {
            this.tiles[idx] = 2; // Basalt Crags
            this.collision[idx] = 0;
          }
        } else if (x > 125 && y < 95) {
          // North-East: Sunken Megalith Marshlands
          this.tiles[idx] = 7; // Sunken Megalith
          this.collision[idx] = 0;
        } else if (y >= 52 && y < 95 && x >= 70 && x <= 130) {
          // Central-North: Barter Oasis Dunes
          this.tiles[idx] = 8; // Oasis Sand Dunes
          this.collision[idx] = 0;
        } else {
          // Central-South: Savannah & Clay Prairie
          this.tiles[idx] = 0; // Savannah Clay Ground
          this.collision[idx] = 0;
        }

        // Mountain Ridges: Only in designated northern/eastern ranges, NEVER in starter or town basins
        const isStarterBasin = (x >= 60 && x <= 125 && y >= 100 && y <= 165);
        const isMountainZone = (y < 35 && x > 40 && x < 120) || (x > 155 && y > 110) || (x < 35 && y < 65);
        if (!isStarterBasin && isMountainZone && elevation > 0.80 && this.tiles[idx] !== 3 && this.tiles[idx] !== 9) {
          this.tiles[idx] = 10; // Mountain Peak
          this.collision[idx] = 1;
        }
      }
    }

    // 4. Carve Natural Winding River of Embers on East flank of town
    const riverBaseX = 114;
    for (let y = 35; y < 185; y++) {
      const meander = Math.floor(Math.sin(y * 0.06) * 4);
      const rx = riverBaseX + meander;
      for (let w = -1; w <= 1; w++) {
        const cx = rx + w;
        if (cx >= 0 && cx < width && y >= 0 && y < height) {
          const idx = y * width + cx;
          this.tiles[idx] = 3; // River Water
          this.collision[idx] = 1;
        }
      }
    }

    // 5. River Stone Crossings (Fords & Timber Bridges at Crossroads)
    [65, 88, 110, 132, 155].forEach(by => {
      const meander = Math.floor(Math.sin(by * 0.06) * 4);
      const rx = riverBaseX + meander;
      for (let w = -2; w <= 2; w++) {
        const cx = rx + w;
        if (cx >= 0 && cx < width && by >= 0 && by < height) {
          const idx = by * width + cx;
          this.tiles[idx] = 11; // Stone Ford / Bridge
          this.collision[idx] = 0;
        }
      }
    });

    // 6. Ash-River Encampment Town Cobblestone Pathways
    for (let py = 127; py <= 137; py++) {
      for (let px = 84; px <= 98; px++) {
        const idx = py * width + px;
        if (this.tiles[idx] !== 3 && this.tiles[idx] !== 10) {
          this.tiles[idx] = 11; // Cobblestone Plaza
          this.collision[idx] = 0;
        }
      }
    }

    // Clear surroundings of starter town to ensure lush flat grassland
    for (let py = 120; py <= 145; py++) {
      for (let px = 72; px <= 108; px++) {
        const idx = py * width + px;
        if (this.tiles[idx] === 10 || this.tiles[idx] === 3) {
          if (px < 110) {
            this.tiles[idx] = 0; // Savannah Clay
            this.collision[idx] = 0;
          }
        }
      }
    }

    // Populate Town Settlements, Structures & World Foliage
    this.seedTownStructures();

    // Populate Resource Nodes across Biomes
    this.seedResourceNodes();
  }

  isResourceAt(x, y) {
    for (const node of this.resourceNodes.values()) {
      if (node.x === x && node.y === y) return true;
    }
    return false;
  }

  seedTownStructures() {
    let decoCount = 1;
    const addDeco = (type, x, y, name, coll = 0) => {
      const idx = y * this.width + x;
      if (this.tiles[idx] === 3 || this.tiles[idx] === 10 || this.tiles[idx] === 5) return;
      const id = `deco_${decoCount++}`;
      this.decorations.set(id, { id, type, x, y, name });
      if (coll) {
        this.collision[idx] = 1;
      }
    };

    // Ash-River Encampment Thatched Huts & Tribal Plaza
    addDeco('struct_thatched_hut', 82, 126, 'Tribal Chieftain Lodge', 1);
    addDeco('struct_thatched_hut', 80, 134, 'Knapper Workshop Hut', 1);
    addDeco('struct_thatched_hut', 98, 126, 'Vault Keeper Yurt', 1);
    addDeco('struct_thatched_hut', 100, 134, 'Hunters Lodge', 1);
    addDeco('struct_totem_pole', 90, 130, 'Sacred Mammoth Totem', 1);

    // Boundary Fences
    [125, 126, 137, 138].forEach(fy => {
      addDeco('struct_fence_wood', 78, fy, 'Wooden Boundary Fence', 1);
      addDeco('struct_fence_wood', 104, fy, 'Wooden Boundary Fence', 1);
    });

    // Riverbank Papyrus Reeds along Eastern River of Embers
    for (let ry = 124; ry <= 142; ry += 2) {
      addDeco('decal_river_reeds', 111, ry, 'River Papyrus Reeds', 0);
      addDeco('decal_river_reeds', 117, ry, 'River Papyrus Reeds', 0);
    }

    // Savannah Bush Tufts & Stone Cairns
    [
      { x: 76, y: 124 }, { x: 74, y: 132 }, { x: 106, y: 124 }, { x: 105, y: 136 },
      { x: 70, y: 128 }, { x: 108, y: 130 }
    ].forEach(p => addDeco('decal_savannah_bush', p.x, p.y, 'Savannah Bush', 0));

    addDeco('decal_cairn', 86, 128, 'Ancestral Stone Cairn', 0);
    addDeco('decal_cairn', 94, 136, 'Trail Marker Cairn', 0);
  }

  seedResourceNodes() {
    let nodeCount = 1;

    const findValidLand = (targetX, targetY) => {
      const idx = targetY * this.width + targetX;
      const tile = this.tiles[idx];
      if (tile !== 3 && tile !== 5 && tile !== 10 && !this.isResourceAt(targetX, targetY)) {
        return { x: targetX, y: targetY };
      }
      for (let r = 1; r <= 6; r++) {
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            const nx = targetX + dx;
            const ny = targetY + dy;
            if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
              const t = this.tiles[ny * this.width + nx];
              if (t !== 3 && t !== 5 && t !== 10 && !this.isResourceAt(nx, ny)) {
                return { x: nx, y: ny };
              }
            }
          }
        }
      }
      return { x: targetX, y: targetY };
    };

    const addNode = (typeKey, targetX, targetY) => {
      const def = RESOURCE_TYPES[typeKey];
      if (!def) return;
      const pos = findValidLand(targetX, targetY);
      const id = `node_${typeKey.toLowerCase()}_${nodeCount++}`;
      this.resourceNodes.set(id, {
        id,
        name: def.name,
        type: typeKey,
        x: pos.x,
        y: pos.y,
        skill: def.skill,
        reqLvl: def.reqLvl || 1,
        xp: def.xp || 0,
        item: def.item || null,
        resourcePool: def.pool || 1,
        maxPool: def.pool || 1,
        maxRespawn: def.respawn || 10,
        respawnTimer: 0,
        available: true,
        isStation: !!def.isStation,
        stationType: def.stationType || null
      });
      if (!def.isStation) {
        this.collision[pos.y * this.width + pos.x] = 1;
      }
    };

    // =========================================================================
    // 1. Town Workshop Hubs & Tribal Stash Chests (10 Towns)
    // =========================================================================
    // 1. Ash-River Encampment (Starter Hub)
    addNode('STASH_CHEST', 92, 131);
    addNode('CAMPFIRE_STATION', 91, 131);
    addNode('CRUCIBLE_STATION', 86, 131);
    addNode('KNAPPING_STATION', 95, 131);

    // 2. Oakhaven Grove / Rain-Crest (Woodworking, Tanning, Herbalism)
    addNode('STASH_CHEST', 44, 120);
    addNode('CARPENTER_STATION', 45, 118);
    addNode('TANNERY_STATION', 43, 122);
    addNode('CAULDRON_STATION', 47, 120);
    addNode('CAMPFIRE_STATION', 45, 124);

    // 3. Sunken Basin Forge / Ash-Varr (Smelting & Smithing)
    addNode('STASH_CHEST', 145, 130);
    addNode('CRUCIBLE_STATION', 142, 128);
    addNode('ANVIL_STATION', 146, 128);
    addNode('CAMPFIRE_STATION', 144, 132);

    // 4. Obsidian Ridge / Basalt Watch (Gem Lapidary & Glass Knapping)
    addNode('STASH_CHEST', 156, 84);
    addNode('LAPIDARY_STATION', 154, 82);
    addNode('KNAPPING_STATION', 158, 82);
    addNode('CAMPFIRE_STATION', 156, 86);

    // 5. Frostbite Hold / Skadi-Frost (Mammoth Loom & Fur Tanning)
    addNode('STASH_CHEST', 76, 40);
    addNode('LOOM_STATION', 74, 38);
    addNode('TANNERY_STATION', 78, 38);
    addNode('ANVIL_STATION', 76, 42);
    addNode('CAMPFIRE_STATION', 76, 36);

    // 6. Starfall Crater / Sol-Megalith (Celestial Metallurgy)
    addNode('STASH_CHEST', 168, 48);
    addNode('CRUCIBLE_STATION', 166, 46);
    addNode('ANVIL_STATION', 170, 46);
    addNode('CAULDRON_STATION', 168, 50);

    // 7. Flint-Knappers Outpost
    addNode('STASH_CHEST', 78, 130);
    addNode('KNAPPING_STATION', 79, 131);

    // 8. River-Ford Harbor
    addNode('STASH_CHEST', 98, 110);
    addNode('CARPENTER_STATION', 99, 111);

    // 9. Raptor-Ridge Camp
    addNode('STASH_CHEST', 55, 122);
    addNode('TANNERY_STATION', 56, 123);

    // 10. Cycad Grove Hamlet
    addNode('STASH_CHEST', 45, 95);
    addNode('CARPENTER_STATION', 46, 96);

    // =========================================================================
    // 2. Landmark Biome Groves & Veins
    // =========================================================================
    // Northern Mammoth Frost Clearing
    addNode('BRISTLECONE_TREE', 82, 24);
    addNode('TUNDRA_MOSS', 84, 25);
    addNode('MOUNTAIN_GINSENG', 80, 26);
    addNode('TUNDRA_MOSS', 75, 28);
    addNode('MOUNTAIN_GINSENG', 88, 22);
    addNode('FISHING_STURGEON', 77, 24);

    // Primeval Cycad Rainforest Sanctuary
    addNode('GHOST_ORCHID', 34, 106);
    addNode('SERPENT_VINE', 36, 108);
    addNode('EBONY_TREE', 32, 104);
    addNode('IRONWOOD_TREE', 38, 110);
    addNode('FISHING_ARAPAIMA', 30, 112);

    // Volcanic Crag Spires & Sulfur Fissures
    addNode('OBSIDIAN_ROCK', 162, 118);
    addNode('SULFUR_CRYSTALS', 164, 120);
    addNode('SULFUR_CRYSTALS', 166, 122);
    addNode('ASHWOOD_TREE', 160, 116);
    addNode('FISHING_MAGMA_EEL', 168, 124);

    // Starfall Isle Ancient Ruins
    addNode('STARFALL_CRAG', 158, 52);
    addNode('CRYPT_TRUFFLE', 156, 54);
    addNode('GLOW_FUNGUS', 160, 56);
    addNode('ARCHAEOLOGY_DIG', 154, 50);

    // =========================================================================
    // 3. Continent-Wide Biome-Specific Organic Seeding (300+ Nodes)
    // =========================================================================
    // Deterministic pseudo-random seed across the full 200x200 continent
    const townCoords = [
      { x: 90, y: 132 }, { x: 78, y: 130 }, { x: 135, y: 115 }, { x: 98, y: 110 },
      { x: 164, y: 44 }, { x: 142, y: 48 }, { x: 45, y: 95 }, { x: 55, y: 122 },
      { x: 79, y: 33 }, { x: 42, y: 145 }, { x: 101, y: 128 }, { x: 152, y: 128 },
      { x: 115, y: 62 }, { x: 96, y: 88 }, { x: 69, y: 41 }, { x: 38, y: 120 }
    ];

    const isNearTownCenter = (x, y) => {
      return townCoords.some(t => Math.hypot(t.x - x, t.y - y) < 7);
    };

    for (let y = 10; y < this.height - 10; y += 3) {
      for (let x = 10; x < this.width - 10; x += 3) {
        // Deterministic hash based on grid coordinates
        const hash = ((x * 37 + y * 73 + (x ^ y) * 19) >>> 0) % 100;

        // 1. Organic coordinate jitter to avoid rigid grid alignments
        const jx = (hash % 3) - 1;
        const jy = (Math.floor(hash / 3) % 3) - 1;
        const targetX = Math.max(10, Math.min(this.width - 11, x + jx));
        const targetY = Math.max(10, Math.min(this.height - 11, y + jy));

        if (isNearTownCenter(targetX, targetY)) continue;

        const idx = targetY * this.width + targetX;
        const tile = this.tiles[idx];
        if (tile === 3 || tile === 5 || tile === 10) continue; // Water, Lava, High Peak impassable

        const typeHash = ((targetX * 31 + targetY * 97) >>> 0);

        // A. Dense Rainforests (Tile 6) - Higher density of primeval trees
        if (tile === 6) {
          if (hash >= 32) continue; // 32% density
          const rTypes = ['CYCAD_TREE', 'IRONWOOD_TREE', 'EBONY_TREE', 'GHOST_ORCHID', 'SERPENT_VINE', 'FISHING_ARAPAIMA', 'RIVER_CLAY'];
          addNode(rTypes[typeHash % rTypes.length], targetX, targetY);
        }
        // B. Savannah & Open Steppe Grasslands (Tile 0 / 1) - Sparse open walking plains
        else if (tile === 0 || tile === 1) {
          if (hash >= 15) continue; // 15% density, wide open trails
          const rTypes = ['CYCAD_TREE', 'WILLOW_TREE', 'ACACIA_TREE', 'PRAIRIE_BERRIES', 'FEVER_ROOT', 'WILD_WHEAT', 'COPPER_BOULDER', 'TIN_ROCK', 'FISHING_TROUT'];
          addNode(rTypes[typeHash % rTypes.length], targetX, targetY);
        }
        // C. Desert Dunes & Barter Wastes (Tile 8) - Ores & Desert vegetation
        else if (tile === 8) {
          if (hash >= 26) continue; // 26% density
          const rTypes = ['COPPER_BOULDER', 'TIN_ROCK', 'MALACHITE_ROCK', 'ACACIA_TREE', 'FEVER_ROOT', 'FISHING_CRAYFISH'];
          addNode(rTypes[typeHash % rTypes.length], targetX, targetY);
        }
        // D. Basalt Crags & Volcanic Passes (Tile 2) - Rich mineral deposits
        else if (tile === 2) {
          if (hash >= 28) continue; // 28% density
          const rTypes = ['OBSIDIAN_ROCK', 'SULFUR_CRYSTALS', 'MALACHITE_ROCK', 'ASHWOOD_TREE', 'COPPER_BOULDER', 'FISHING_MAGMA_EEL'];
          addNode(rTypes[typeHash % rTypes.length], targetX, targetY);
        }
        // E. Frost Tundra & Northern Steppes (Tile 4) - Pines, Moss & Cold resources
        else if (tile === 4) {
          if (hash >= 35) continue; // 35% density in cold north
          const rTypes = ['BRISTLECONE_TREE', 'TUNDRA_MOSS', 'MOUNTAIN_GINSENG', 'COPPER_BOULDER', 'TIN_ROCK', 'FISHING_STURGEON'];
          addNode(rTypes[typeHash % rTypes.length], targetX, targetY);
        }
        // F. Megalith Crypts & Starfall Sanctuary (Tile 7) - Celestial crags & relics
        else if (tile === 7) {
          if (hash >= 28) continue; // 28% density
          const rTypes = ['STARFALL_CRAG', 'OBSIDIAN_ROCK', 'CRYPT_TRUFFLE', 'GLOW_FUNGUS', 'ARCHAEOLOGY_DIG', 'MALACHITE_ROCK'];
          addNode(rTypes[typeHash % rTypes.length], targetX, targetY);
        }
        // G. Coastal Beaches & River Banks (Tile 9) - Riverside clay & reeds
        else if (tile === 9) {
          if (hash >= 20) continue; // 20% density
          const rTypes = ['RIVER_CLAY', 'RIVER_REEDS', 'FISHING_SALMON', 'FISHING_EEL'];
          addNode(rTypes[typeHash % rTypes.length], targetX, targetY);
        }
      }
    }
  }

  isWalkable(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;
    return this.collision[y * this.width + x] === 0;
  }

  findPath(startX, startY, targetX, targetY) {
    if (startX === targetX && startY === targetY) return [];

    // If target itself is blocked (e.g. solid resource boulder, building), find closest walkable neighbor
    if (!this.isWalkable(targetX, targetY)) {
      // If already adjacent to the blocked target, no movement needed!
      if (Math.max(Math.abs(startX - targetX), Math.abs(startY - targetY)) <= 1) {
        return [];
      }

      const neighbors = [
        { x: targetX + 1, y: targetY }, { x: targetX - 1, y: targetY },
        { x: targetX, y: targetY + 1 }, { x: targetX, y: targetY - 1 },
        { x: targetX + 1, y: targetY + 1 }, { x: targetX - 1, y: targetY - 1 },
        { x: targetX + 1, y: targetY - 1 }, { x: targetX - 1, y: targetY + 1 }
      ].filter(n => this.isWalkable(n.x, n.y));

      if (neighbors.length === 0) return [];
      neighbors.sort((a, b) => {
        const distA = Math.hypot(a.x - startX, a.y - startY);
        const distB = Math.hypot(b.x - startX, b.y - startY);
        return distA - distB;
      });

      targetX = neighbors[0].x;
      targetY = neighbors[0].y;
    }

    const openSet = [{ x: startX, y: startY, g: 0, h: Math.abs(startX - targetX) + Math.abs(startY - targetY), parent: null }];
    const closedSet = new Set();

    while (openSet.length > 0) {
      openSet.sort((a, b) => (a.g + a.h) - (b.g + b.h));
      const current = openSet.shift();

      if (current.x === targetX && current.y === targetY) {
        const path = [];
        let curr = current;
        while (curr.parent) {
          path.unshift({ x: curr.x, y: curr.y });
          curr = curr.parent;
        }
        return path;
      }

      closedSet.add(`${current.x},${current.y}`);

      const dirs = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
      for (const d of dirs) {
        const nx = current.x + d.x;
        const ny = current.y + d.y;
        const key = `${nx},${ny}`;

        if (!this.isWalkable(nx, ny) || closedSet.has(key)) continue;

        const g = current.g + 1;
        const h = Math.abs(nx - targetX) + Math.abs(ny - targetY);
        const existing = openSet.find(node => node.x === nx && node.y === ny);

        if (!existing) {
          openSet.push({ x: nx, y: ny, g, h, parent: current });
        } else if (g < existing.g) {
          existing.g = g;
          existing.parent = current;
        }
      }
    }
    return [];
  }

  addGroundItem(item) {
    const id = `gi_${this.groundItemCounter++}`;
    const itemId = item.itemId || item.id;
    const groundItem = {
      id,
      itemId,
      name: item.name || itemId,
      quantity: item.quantity || 1,
      x: item.x,
      y: item.y,
      icon: item.icon || '🎁',
      createdAt: Date.now(),
      despawnTicks: 100
    };
    this.groundItems.set(id, groundItem);
    return groundItem;
  }

  removeGroundItem(id) {
    return this.groundItems.delete(id);
  }
}

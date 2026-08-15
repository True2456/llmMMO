/**
 * Island Procedural Generation Prototype & Visualizer
 */

function generateIsland(width = 200, height = 200) {
  const tiles = new Uint8Array(width * height);
  const collision = new Uint8Array(width * height);

  // Simplex-style pseudo-random smooth noise using sine/cosine harmonics
  function noise(nx, ny, seed = 1) {
    const s1 = Math.sin(nx * 3.1 + ny * 2.7 + seed * 1.3);
    const s2 = Math.sin(nx * 6.7 - ny * 5.3 + seed * 2.9) * 0.5;
    const s3 = Math.sin(nx * 12.3 + ny * 14.1 + seed * 4.7) * 0.25;
    const s4 = Math.cos(nx * 25.1 - ny * 22.7 + seed * 8.1) * 0.125;
    return (s1 + s2 + s3 + s4) / (1 + 0.5 + 0.25 + 0.125);
  }

  // Centers of Main Island and Offshore Starfall Island
  const c1 = { x: 95, y: 105, rx: 78, ry: 72 };
  const c2 = { x: 165, y: 46, rx: 22, ry: 18 };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const nx = x / width;
      const ny = y / height;

      // Distance to Main Island Center
      const dx1 = (x - c1.x) / c1.rx;
      const dy1 = (y - c1.y) / c1.ry;
      const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

      // Distance to Offshore Island Center
      const dx2 = (x - c2.x) / c2.rx;
      const dy2 = (y - c2.y) / c2.ry;
      const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

      const nVal = noise(nx * 3, ny * 3, 42) * 0.28;
      const islandElevation1 = 1.0 - dist1 + nVal;
      const islandElevation2 = 1.0 - dist2 + noise(nx * 6, ny * 6, 99) * 0.2;

      const elevation = Math.max(islandElevation1, islandElevation2);
      const isOffshore = islandElevation2 > islandElevation1 && islandElevation2 > 0.05;

      // 1. Deep Ocean
      if (elevation < 0.05) {
        tiles[idx] = 3; // Ocean
        collision[idx] = 1;
        continue;
      }

      // 2. Coastal Sandy Beach
      if (elevation < 0.14) {
        tiles[idx] = 9; // Beach sand
        collision[idx] = 0;
        continue;
      }

      // 3. Biome Distribution based on coordinates & moisture
      if (isOffshore) {
        // Offshore Starfall Isle: Sunken Crypts & Meteorite Ruin
        tiles[idx] = 7; // Starfall / Crypts
        collision[idx] = 0;
      } else if (y < 52) {
        // North: Mammoth Steppes & Frost Tundra
        tiles[idx] = 4; // Tundra
        collision[idx] = 0;
      } else if (x < 65 && y >= 75) {
        // West: Primeval Cycad Rainforest
        tiles[idx] = 6; // Rainforest
        collision[idx] = 0;
      } else if (x > 125 && y >= 95) {
        // East / South-East: Obsidian Crags & Basalt Volcanic
        if (elevation > 0.65 && noise(nx * 8, ny * 8, 12) > 0.15) {
          tiles[idx] = 5; // Molten Lava Fissure
          collision[idx] = 1;
        } else if (elevation > 0.75) {
          tiles[idx] = 10; // Impassable Mountain Peak
          collision[idx] = 1;
        } else {
          tiles[idx] = 2; // Obsidian Crags
          collision[idx] = 0;
        }
      } else if (x > 125 && y < 95) {
        // North-East: Sunken Megalith Ruins
        tiles[idx] = 7; // Sunken Crypts
        collision[idx] = 0;
      } else if (y >= 52 && y < 95 && x >= 70 && x <= 130) {
        // Central-North: Barter Oasis Dunes
        tiles[idx] = 8; // Oasis Sand Dunes
        collision[idx] = 0;
      } else {
        // Central-South: Savannah & Clay Prairie
        tiles[idx] = 0; // Savannah Clay
        collision[idx] = 0;
      }

      // Mountain Ridges separating biomes
      if (elevation > 0.82 && tiles[idx] !== 3 && tiles[idx] !== 9) {
        tiles[idx] = 10; // Mountain Peak
        collision[idx] = 1;
      }
    }
  }

  // 4. Carve Natural Winding River of Embers
  let riverX = 96;
  for (let y = 35; y < 185; y++) {
    // Slight meander
    const meander = Math.floor(Math.sin(y * 0.08) * 8);
    const rx = riverX + meander;
    for (let w = -1; w <= 1; w++) {
      const cx = rx + w;
      if (cx >= 0 && cx < width && y >= 0 && y < height) {
        const idx = y * width + cx;
        // Don't overwrite if it was deep ocean
        tiles[idx] = 3;
        collision[idx] = 1;
      }
    }
  }

  // 5. River Stone Crossings (Fords at key settlements)
  [65, 88, 110, 132].forEach(by => {
    const meander = Math.floor(Math.sin(by * 0.08) * 8);
    const rx = riverX + meander;
    for (let w = -2; w <= 2; w++) {
      const cx = rx + w;
      if (cx >= 0 && cx < width && by >= 0 && by < height) {
        const idx = by * width + cx;
        tiles[idx] = 11; // Stone Bridge / Ford
        collision[idx] = 0;
      }
    }
  });

  return { width, height, tiles, collision };
}

const res = generateIsland(200, 200);
let walkable = 0;
for (let i = 0; i < res.collision.length; i++) {
  if (res.collision[i] === 0) walkable++;
}
console.log(`Generated 200x200 Island: ${walkable} walkable tiles / ${res.tiles.length} total tiles (${(walkable/res.tiles.length*100).toFixed(1)}% land).`);

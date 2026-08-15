import { World } from '../src/server/engine/world.js';
import { CITIES, TOWNS } from '../src/server/engine/world.js';
import { DUNGEON_DEFINITIONS } from '../src/server/engine/dungeons.js';

const world = new World(200, 200);

function findBestCoord(targetX, targetY, preferredTileType) {
  if (world.isWalkable(targetX, targetY)) {
    return { x: targetX, y: targetY };
  }
  // Spiral outward
  for (let r = 1; r <= 15; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        const x = targetX + dx;
        const y = targetY + dy;
        if (world.isWalkable(x, y)) {
          const tile = world.tiles[y * world.width + x];
          if (preferredTileType === undefined || tile === preferredTileType) {
            return { x, y };
          }
        }
      }
    }
  }
  // Any walkable
  for (let r = 1; r <= 15; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        const x = targetX + dx;
        const y = targetY + dy;
        if (world.isWalkable(x, y)) {
          return { x, y };
        }
      }
    }
  }
  return { x: targetX, y: targetY };
}

console.log('--- REFINED CITIES ---');
CITIES.forEach(c => {
  const coord = findBestCoord(c.x, c.y);
  console.log(`{ id: '${c.id}', name: '${c.name}', type: '${c.type}', x: ${coord.x}, y: ${coord.y}, desc: '${c.desc}' },`);
});

console.log('--- REFINED TOWNS ---');
TOWNS.forEach(t => {
  const coord = findBestCoord(t.x, t.y);
  console.log(`{ id: '${t.id}', name: '${t.name}', type: '${t.type}', x: ${coord.x}, y: ${coord.y}, desc: '${t.desc}' },`);
});

console.log('--- REFINED DUNGEONS ---');
Object.values(DUNGEON_DEFINITIONS).forEach(d => {
  const coord = findBestCoord(d.entrance.x, d.entrance.y);
  console.log(`id: '${d.id}', name: '${d.name}', entrance: { x: ${coord.x}, y: ${coord.y} },`);
});

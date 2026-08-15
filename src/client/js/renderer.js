/**
 * PRIMA: Age of Bronze - 16-Bit Pixel Art Canvas Renderer
 * Renders authentic animated character sprites, beasts, terrain tilesets,
 * resource nodes, hitsplats, and overhead speech bubbles with zero emojis/circles.
 */

import { SpriteEngine } from './sprites.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.spriteEngine = new SpriteEngine();
    this.tileSize = 32;
    this.camera = { x: 90, y: 132 }; // Centered at Ash-River Encampment
    this.interpSpeed = 0.15;
    this.speechBubbles = new Map();
    this.activeHitsplats = [];
    this.clickReticles = []; // { x, y, type, createdAt }
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.ctx.imageSmoothingEnabled = false;
  }

  worldToScreen(worldX, worldY) {
    const screenX = (worldX - this.camera.x) * this.tileSize + this.canvas.width / 2;
    const screenY = (worldY - this.camera.y) * this.tileSize + this.canvas.height / 2;
    return { x: screenX, y: screenY };
  }

  screenToWorld(screenX, screenY) {
    const worldX = Math.floor((screenX - this.canvas.width / 2) / this.tileSize + this.camera.x);
    const worldY = Math.floor((screenY - this.canvas.height / 2) / this.tileSize + this.camera.y);
    return { x: worldX, y: worldY };
  }

  addClickReticle(worldX, worldY, type = 'MOVE') {
    this.clickReticles.push({
      x: worldX,
      y: worldY,
      type, // 'MOVE', 'ATTACK', 'GATHER', 'LOOT'
      createdAt: Date.now()
    });
  }

  findTargetAtScreen(screenX, screenY, gameState) {
    const worldCoord = this.screenToWorld(screenX, screenY);
    const { tileSize } = this;

    // 1. Check Ground Items (Tile match OR Screen bounding box)
    if (gameState.groundItems) {
      for (const item of gameState.groundItems) {
        if (item.x === worldCoord.x && item.y === worldCoord.y) {
          return { type: 'ITEM', target: item, worldX: item.x, worldY: item.y };
        }
        const screen = this.worldToScreen(item.x, item.y);
        const minX = screen.x - 8;
        const maxX = screen.x + tileSize + 8;
        const minY = screen.y - 8;
        const maxY = screen.y + tileSize + 16;

        if (screenX >= minX && screenX <= maxX && screenY >= minY && screenY <= maxY) {
          return { type: 'ITEM', target: item, worldX: item.x, worldY: item.y };
        }
      }
    }

    // 2. Check Monsters / NPCs (Tile match OR Screen sprite bounding box)
    if (gameState.npcs) {
      for (const npc of gameState.npcs) {
        if (npc.hp <= 0) continue;
        if (npc.x === worldCoord.x && npc.y === worldCoord.y) {
          return { type: 'NPC', target: npc, worldX: npc.x, worldY: npc.y };
        }
        const screen = this.worldToScreen(npc.x, npc.y);
        const minX = screen.x - 8;
        const maxX = screen.x + tileSize + 8;
        const minY = screen.y - 28;
        const maxY = screen.y + tileSize + 8;

        if (screenX >= minX && screenX <= maxX && screenY >= minY && screenY <= maxY) {
          return { type: 'NPC', target: npc, worldX: npc.x, worldY: npc.y };
        }
      }
    }

    // 3. Check Resource Nodes (Tile match OR Screen tree canopy & boulder bounding box)
    if (gameState.nodes) {
      for (const node of gameState.nodes) {
        if (!node.available) continue;
        if (node.x === worldCoord.x && node.y === worldCoord.y) {
          return { type: 'NODE', target: node, worldX: node.x, worldY: node.y };
        }
        const screen = this.worldToScreen(node.x, node.y);
        const minX = screen.x - 6;
        const maxX = screen.x + tileSize + 6;
        const minY = screen.y - (node.type.includes('TREE') ? 32 : 10);
        const maxY = screen.y + tileSize + 6;

        if (screenX >= minX && screenX <= maxX && screenY >= minY && screenY <= maxY) {
          return { type: 'NODE', target: node, worldX: node.x, worldY: node.y };
        }
      }
    }

    // 4. Default: Ground Tile
    return { type: 'GROUND', worldX: worldCoord.x, worldY: worldCoord.y };
  }

  addSpeechBubble(id, text, isAgent = false) {
    this.speechBubbles.set(id, {
      text,
      expiresAt: Date.now() + 4500,
      isAgent
    });
  }

  addHitsplat(worldX, worldY, damage, color = 'RED') {
    this.activeHitsplats.push({
      x: worldX,
      y: worldY,
      damage,
      color,
      createdAt: Date.now()
    });
  }

  render(gameState, animTime) {
    const { ctx, canvas, tileSize } = this;
    if (!ctx) return;

    if (gameState.self) {
      this.camera.x += (gameState.self.x - this.camera.x) * this.interpSpeed;
      this.camera.y += (gameState.self.y - this.camera.y) * this.interpSpeed;
    }

    // Clear Screen
    ctx.fillStyle = '#0e0f14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const worldWidth = gameState.world ? gameState.world.width : 200;
    const worldHeight = gameState.world ? gameState.world.height : 200;

    const startTileX = Math.floor(this.camera.x - (canvas.width / 2) / tileSize) - 1;
    const endTileX = Math.ceil(this.camera.x + (canvas.width / 2) / tileSize) + 1;
    const startTileY = Math.floor(this.camera.y - (canvas.height / 2) / tileSize) - 1;
    const endTileY = Math.ceil(this.camera.y + (canvas.height / 2) / tileSize) + 1;

    // 1. Render 16-Bit Tilemap with Procedural Variation & Autotiling Foam
    for (let ty = startTileY; ty <= endTileY; ty++) {
      for (let tx = startTileX; tx <= endTileX; tx++) {
        if (tx < 0 || tx >= worldWidth || ty < 0 || ty >= worldHeight) continue;
        const screen = this.worldToScreen(tx, ty);
        const tileType = gameState.world ? gameState.world.tiles[ty * worldWidth + tx] : 0;
        this.renderTileSprite(screen.x, screen.y, tileType, tx, ty, gameState.world?.tiles, worldWidth, worldHeight);
      }
    }

    // 2. Render World Decorations & Town Structures
    if (gameState.world && gameState.world.decorations) {
      for (const deco of gameState.world.decorations) {
        if (Math.abs(deco.x - this.camera.x) <= 18 && Math.abs(deco.y - this.camera.y) <= 18) {
          const screen = this.worldToScreen(deco.x, deco.y);
          this.renderDecorationSprite(screen.x, screen.y, deco);
        }
      }
    }

    // 3. Render Resource Nodes
    if (gameState.nodes) {
      for (const node of gameState.nodes) {
        const screen = this.worldToScreen(node.x, node.y);
        this.renderResourceSprite(screen.x, screen.y, node);
      }
    }

    // 4. Render Ground Items
    if (gameState.groundItems) {
      for (const item of gameState.groundItems) {
        const screen = this.worldToScreen(item.x, item.y);
        const bob = Math.sin(animTime * 0.005 + item.x) * 3;
        const itemSprite = this.spriteEngine.getSprite(`icon_${item.itemId}`) || this.spriteEngine.getSprite('icon_amber_beads');
        if (itemSprite) {
          ctx.drawImage(itemSprite, screen.x + 4, screen.y + 4 + bob);
        }
        ctx.font = '8px "Press Start 2P"';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeText(item.name, screen.x + tileSize / 2, screen.y + tileSize + 4);
        ctx.fillStyle = '#ffb703';
        ctx.fillText(item.name, screen.x + tileSize / 2, screen.y + tileSize + 4);
      }
    }

    // 5. Render Beasts, Fauna & Town Elders
    if (gameState.npcs) {
      for (const npc of gameState.npcs) {
        const screen = this.worldToScreen(npc.x, npc.y);
        this.renderNPCSprite(screen.x, screen.y, npc, animTime);
      }
    }

    // 6. Render Other Players
    if (gameState.players) {
      for (const player of gameState.players) {
        if (gameState.self && player.id === gameState.self.id) continue;
        const screen = this.worldToScreen(player.x, player.y);
        this.renderPlayerSprite(screen.x, screen.y, player, animTime, false);
      }
    }

    // 7. Render Self Player
    if (gameState.self) {
      const screen = this.worldToScreen(gameState.self.x, gameState.self.y);
      this.renderPlayerSprite(screen.x, screen.y, gameState.self, animTime, true);
    }

    // 8. Render Animated Click Reticles (RuneScape Style Target Feedback)
    const now = Date.now();
    this.clickReticles = this.clickReticles.filter(reticle => {
      const age = now - reticle.createdAt;
      if (age > 600) return false;

      const progress = age / 600;
      const screen = this.worldToScreen(reticle.x, reticle.y);
      const cx = screen.x + tileSize / 2;
      const cy = screen.y + tileSize / 2;
      const alpha = Math.max(0, 1 - progress);

      ctx.save();
      ctx.globalAlpha = alpha;

      if (reticle.type === 'ATTACK') {
        // Red Combat Crosshairs & Corner Brackets
        const size = Math.max(6, 16 - progress * 4);
        ctx.strokeStyle = '#e63946';
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        ctx.moveTo(cx - size, cy - size + 6);
        ctx.lineTo(cx - size, cy - size);
        ctx.lineTo(cx - size + 6, cy - size);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + size, cy - size + 6);
        ctx.lineTo(cx + size, cy - size);
        ctx.lineTo(cx + size - 6, cy - size);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx - size, cy + size - 6);
        ctx.lineTo(cx - size, cy + size);
        ctx.lineTo(cx - size + 6, cy + size);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + size, cy + size - 6);
        ctx.lineTo(cx + size, cy + size);
        ctx.lineTo(cx + size - 6, cy + size);
        ctx.stroke();

        ctx.fillStyle = '#ff4d6d';
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (reticle.type === 'GATHER') {
        // Cyan Diamond Pulse
        const radius = 8 + progress * 14;
        ctx.strokeStyle = '#00f5d4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy - radius);
        ctx.lineTo(cx + radius, cy);
        ctx.lineTo(cx, cy + radius);
        ctx.lineTo(cx - radius, cy);
        ctx.closePath();
        ctx.stroke();
      } else if (reticle.type === 'LOOT') {
        // Gold Expanding Ring
        const radius = 6 + progress * 16;
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Move: Classic Yellow X Marker + Pulse Ring
        const ringRadius = 6 + progress * 14;
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        const arm = Math.max(3, 7 - progress * 2);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx - arm, cy - arm);
        ctx.lineTo(cx + arm, cy + arm);
        ctx.moveTo(cx + arm, cy - arm);
        ctx.lineTo(cx - arm, cy + arm);
        ctx.stroke();
      }

      ctx.restore();
      return true;
    });

    // 9. Render Floating Hitsplats & Gathering Float Text
    this.activeHitsplats = this.activeHitsplats.filter(h => {
      const age = now - h.createdAt;
      if (age > 1400) return false;

      const screen = this.worldToScreen(h.x, h.y);
      const floatY = screen.y - (age * 0.028);
      const alpha = Math.max(0, 1 - age / 1400);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = 'bold 11px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;

      if (h.color === 'RED') {
        ctx.strokeText(`-${h.damage}`, screen.x + tileSize / 2, floatY);
        ctx.fillStyle = '#e74c3c';
        ctx.fillText(`-${h.damage}`, screen.x + tileSize / 2, floatY);
      } else if (h.color === 'BLUE') {
        ctx.strokeText(`BLOCKED`, screen.x + tileSize / 2, floatY);
        ctx.fillStyle = '#3498db';
        ctx.fillText(`BLOCKED`, screen.x + tileSize / 2, floatY);
      } else {
        ctx.strokeText(`+${h.damage}`, screen.x + tileSize / 2, floatY);
        ctx.fillStyle = '#2ecc71';
        ctx.fillText(`+${h.damage}`, screen.x + tileSize / 2, floatY);
      }
      ctx.restore();
      return true;
    });

    // 10. Render Overhead Speech Bubbles
    for (const [id, bubble] of this.speechBubbles.entries()) {
      if (now > bubble.expiresAt) {
        this.speechBubbles.delete(id);
        continue;
      }

      let ent = null;
      if (gameState.self && gameState.self.id === id) ent = gameState.self;
      else if (gameState.players) ent = gameState.players.find(p => p.id === id);

      if (ent) {
        const screen = this.worldToScreen(ent.x, ent.y);
        this.renderSpeechBubble(screen.x + tileSize / 2, screen.y - 18, bubble.text, bubble.isAgent);
      }
    }

    // 11. Render 16-Bit HUD Radar Minimap
    this.renderMinimap(gameState);
  }

  renderTileSprite(x, y, tileType, tx, ty, worldTiles, worldWidth, worldHeight) {
    const { ctx } = this;
    let spriteKey = 'tile_clay';

    if (tileType === 0) {
      // Savannah procedural variation
      const h = (tx * 31 + ty * 17) % 8;
      if (h === 0 || h === 1) spriteKey = 'tile_clay_var1';
      else if (h === 2 || h === 3) spriteKey = 'tile_clay_var2';
      else spriteKey = 'tile_clay';
    } else if (tileType === 1) {
      // Steppe grassland variation
      const h = (tx * 19 + ty * 23) % 6;
      spriteKey = (h === 0) ? 'tile_steppe_var1' : 'tile_steppe';
    } else if (tileType === 2) spriteKey = 'tile_basalt';
    else if (tileType === 3) spriteKey = 'tile_water';
    else if (tileType === 4) spriteKey = 'tile_tundra';
    else if (tileType === 5) spriteKey = 'tile_lava';
    else if (tileType === 6) spriteKey = 'tile_rainforest';
    else if (tileType === 7) spriteKey = 'tile_crypts';
    else if (tileType === 8) spriteKey = 'tile_dunes';
    else if (tileType === 9) spriteKey = 'tile_beach';
    else if (tileType === 10) spriteKey = 'tile_mountain';
    else if (tileType === 11) spriteKey = 'tile_bridge';

    const sprite = this.spriteEngine.getSprite(spriteKey);
    if (sprite) {
      ctx.drawImage(sprite, x, y);
    }

    // Water Shoreline Foam Autotiling
    if (tileType === 3 && worldTiles && worldWidth) {
      const isLand = (nx, ny) => {
        if (nx < 0 || nx >= worldWidth || ny < 0 || ny >= worldHeight) return false;
        return worldTiles[ny * worldWidth + nx] !== 3;
      };
      if (isLand(tx, ty - 1) || isLand(tx, ty + 1) || isLand(tx - 1, ty) || isLand(tx + 1, ty)) {
        const foamSprite = this.spriteEngine.getSprite('tile_water_foam');
        if (foamSprite) ctx.drawImage(foamSprite, x, y);
      }
    }
  }

  renderDecorationSprite(x, y, deco) {
    const { ctx, tileSize } = this;
    const sprite = this.spriteEngine.getSprite(deco.type);
    if (!sprite) return;

    const offsetX = (tileSize - sprite.width) / 2;
    const offsetY = tileSize - sprite.height;
    ctx.drawImage(sprite, x + offsetX, y + offsetY);
  }

  renderResourceSprite(x, y, node) {
    const { ctx } = this;
    if (!node.available) {
      const isTree = node.type && (node.type.includes('TREE') || node.type.includes('CYCAD') || node.type.includes('PINE'));
      const depletedSprite = this.spriteEngine.getSprite(isTree ? 'node_depleted_stump' : 'node_depleted_rock');
      if (depletedSprite) {
        ctx.drawImage(depletedSprite, x, y);
      }
      return;
    }

    let spriteKey = 'node_copper_boulder';
    if (node.isStation) {
      if (node.stationType === 'STATION_STASH' || node.type.includes('STASH')) spriteKey = 'node_stash_chest';
      else if (node.stationType === 'STATION_CRUCIBLE' || node.type.includes('CRUCIBLE')) spriteKey = 'node_crucible_station';
      else if (node.stationType === 'STATION_ANVIL' || node.type.includes('ANVIL')) spriteKey = 'node_anvil_station';
      else if (node.stationType === 'STATION_KNAPPING' || node.type.includes('KNAPPING')) spriteKey = 'node_knapping_station';
      else if (node.stationType === 'STATION_CARPENTER' || node.type.includes('CARPENTER')) spriteKey = 'node_carpenter_station';
      else if (node.stationType === 'STATION_TANNERY' || node.type.includes('TANNERY')) spriteKey = 'node_tannery_station';
      else if (node.stationType === 'STATION_CAULDRON' || node.type.includes('CAULDRON')) spriteKey = 'node_cauldron_station';
      else if (node.stationType === 'STATION_LOOM' || node.type.includes('LOOM')) spriteKey = 'node_loom_station';
      else if (node.stationType === 'STATION_LAPIDARY' || node.type.includes('LAPIDARY')) spriteKey = 'node_lapidary_station';
      else spriteKey = 'node_campfire';
    } else {
      const type = node.type || '';
      if (type.includes('WILLOW')) spriteKey = 'node_willow_tree';
      else if (type.includes('ACACIA')) spriteKey = 'node_acacia_tree';
      else if (type.includes('BRISTLECONE')) spriteKey = 'node_bristlecone_tree';
      else if (type.includes('IRONWOOD')) spriteKey = 'node_ironwood_tree';
      else if (type.includes('EBONY')) spriteKey = 'node_ebony_tree';
      else if (type.includes('ASHWOOD')) spriteKey = 'node_ashwood_tree';
      else if (type.includes('CYCAD') || type.includes('TREE')) spriteKey = 'node_cycad_tree';
      else if (type.includes('BERRIES')) spriteKey = 'node_prairie_berries';
      else if (type.includes('FEVER')) spriteKey = 'node_fever_root';
      else if (type.includes('REEDS')) spriteKey = 'node_river_reeds';
      else if (type.includes('GLOW_FUNGUS')) spriteKey = 'node_glow_fungus';
      else if (type.includes('WHEAT')) spriteKey = 'node_wild_wheat';
      else if (type.includes('MOSS')) spriteKey = 'node_tundra_moss';
      else if (type.includes('VINE')) spriteKey = 'node_serpent_vine';
      else if (type.includes('ORCHID')) spriteKey = 'node_ghost_orchid';
      else if (type.includes('GINSENG')) spriteKey = 'node_mountain_ginseng';
      else if (type.includes('TRUFFLE')) spriteKey = 'node_crypt_truffle';
      else if (type.includes('SULFUR')) spriteKey = 'node_sulfur_crystals';
      else if (type.includes('FISHING')) spriteKey = 'node_fishing_spot';
      else if (type.includes('ARCHAEOLOGY')) spriteKey = 'node_archaeology_dig';
      else if (type.includes('TIN')) spriteKey = 'node_tin_rock';
      else if (type.includes('MALACHITE')) spriteKey = 'node_malachite_rock';
      else if (type.includes('OBSIDIAN') || type.includes('STARFALL')) spriteKey = 'node_obsidian_rock';
      else spriteKey = 'node_copper_boulder';
    }

    const sprite = this.spriteEngine.getSprite(spriteKey) || this.spriteEngine.getSprite('node_copper_boulder');
    if (sprite) {
      ctx.drawImage(sprite, x, y - (sprite.height > 32 ? sprite.height - 32 : 0));
    }
  }

  renderNPCSprite(x, y, npc, animTime) {
    const { ctx, tileSize } = this;
    let spriteKey = npc.sprite;

    const lowerName = (npc.name || '').toLowerCase();
    const lowerKey = (npc.templateKey || '').toLowerCase();

    if (!spriteKey || !this.spriteEngine.sprites.has(spriteKey)) {
      if (lowerKey.includes('hare') || lowerName.includes('hare') || lowerName.includes('rabbit')) spriteKey = 'monster_hare';
      else if (lowerKey.includes('boar') || lowerName.includes('boar') || lowerName.includes('pig')) spriteKey = 'monster_boar';
      else if (lowerKey.includes('crab') || lowerName.includes('crab')) spriteKey = 'monster_crab';
      else if (lowerKey.includes('fox') || lowerName.includes('fox')) spriteKey = 'monster_fox';
      else if (lowerKey.includes('wolf') || lowerName.includes('wolf') || lowerName.includes('hound')) spriteKey = 'monster_dire_wolf';
      else if (lowerKey.includes('raptor') || lowerName.includes('raptor') || lowerName.includes('dino')) spriteKey = 'monster_raptor';
      else if (lowerKey.includes('golem') || lowerName.includes('golem') || lowerName.includes('elemental')) spriteKey = 'monster_stone_golem';
      else if (lowerKey.includes('mammoth') || lowerName.includes('mammoth') || lowerName.includes('mastodon')) spriteKey = 'monster_mammoth';
      else if (lowerKey.includes('bear') || lowerName.includes('bear')) spriteKey = 'monster_bear';
      else if (lowerKey.includes('snake') || lowerKey.includes('viper') || lowerKey.includes('serpent') || lowerName.includes('viper') || lowerName.includes('serpent')) spriteKey = 'monster_serpent';
      else if (lowerKey.includes('scorpion') || lowerName.includes('scorpion')) spriteKey = 'monster_scorpion';
      else if (lowerKey.includes('hyena') || lowerName.includes('hyena')) spriteKey = 'monster_hyena';
      else if (lowerKey.includes('elder_kael') || lowerName.includes('elder kael')) spriteKey = 'npc_elder_kael';
      else if (lowerKey.includes('knapper_urk') || lowerName.includes('knapper urk')) spriteKey = 'npc_knapper_urk';
      else if (lowerKey.includes('scout_tara') || lowerName.includes('scout tara')) spriteKey = 'npc_scout_tara';
      else if (lowerKey.includes('banker_torok') || lowerName.includes('banker torok')) spriteKey = 'npc_banker_torok';
      else if (npc.isTownNpc) spriteKey = `npc_${npc.templateKey || npc.id}`;
      else spriteKey = `monster_${npc.templateKey || npc.id}`;
    }

    const sprite = this.spriteEngine.getSprite(spriteKey);
    if (sprite) {
      const offsetX = (tileSize - sprite.width) / 2;
      const offsetY = (tileSize - sprite.height);
      ctx.drawImage(sprite, x + offsetX, y + offsetY);
    }

    // Health Bar (Don't draw for invulnerable town elders)
    if (!npc.isTownNpc) {
      this.renderHealthBar(x + tileSize / 2, y - 6, npc.hp, npc.maxHp);
    }

    // Nameplate with black stroke outline
    ctx.textAlign = 'center';
    ctx.font = '8px "Press Start 2P"';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;

    const label = npc.isTownNpc ? `${npc.name}` : `${npc.name} (Lv ${npc.combatLvl})`;
    ctx.strokeText(label, x + tileSize / 2, y - 14);
    ctx.fillStyle = npc.isTownNpc ? '#2ecc71' : (npc.isBoss ? '#e63946' : '#ffb703');
    ctx.fillText(label, x + tileSize / 2, y - 14);
  }

  renderPlayerSprite(x, y, player, animTime, isSelf) {
    const { ctx, tileSize } = this;
    const facing = player.facing || 'S';
    const isMoving = player.actionState === 'MOVING';
    const frame = isMoving ? Math.floor((animTime / 180) % 3) : 1;

    const spriteKey = `player_${facing}_${frame}`;
    const sprite = this.spriteEngine.getSprite(spriteKey) || this.spriteEngine.getSprite('player_S_1');

    if (sprite) {
      ctx.drawImage(sprite, x + 4, y + (tileSize - sprite.height));
    }

    // Health Bar
    this.renderHealthBar(x + tileSize / 2, y - 6, player.hp, player.maxHp);

    // Nameplate & Distinct Badges
    ctx.textAlign = 'center';
    ctx.font = '8px "Press Start 2P"';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;

    if (player.isAgent) {
      const nameText = `🤖 ${player.username}`;
      const badgeText = `[${player.badge || 'AI'}]`;
      ctx.strokeText(nameText, x + tileSize / 2, y - 22);
      ctx.fillStyle = '#b5e48c';
      ctx.fillText(nameText, x + tileSize / 2, y - 22);

      ctx.strokeText(badgeText, x + tileSize / 2, y - 12);
      ctx.fillStyle = '#c77dff';
      ctx.fillText(badgeText, x + tileSize / 2, y - 12);
    } else {
      const nameText = isSelf ? `★ ${player.username}` : player.username;
      ctx.strokeText(nameText, x + tileSize / 2, y - 14);
      ctx.fillStyle = '#ffd700';
      ctx.fillText(nameText, x + tileSize / 2, y - 14);
    }
  }

  renderHealthBar(centerX, y, currentHp, maxHp) {
    const { ctx } = this;
    const barWidth = 32;
    const barHeight = 4;
    const pct = Math.max(0, Math.min(1, currentHp / maxHp));

    ctx.fillStyle = '#9d0208';
    ctx.fillRect(centerX - barWidth / 2, y, barWidth, barHeight);
    ctx.fillStyle = '#52b788';
    ctx.fillRect(centerX - barWidth / 2, y, barWidth * pct, barHeight);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(centerX - barWidth / 2, y, barWidth, barHeight);
  }

  renderSpeechBubble(x, y, text, isAgent) {
    const { ctx } = this;
    ctx.save();
    ctx.font = '14px "VT323", monospace';
    const textWidth = ctx.measureText(text).width;
    const padding = 6;
    const bw = textWidth + padding * 2;
    const bh = 22;

    ctx.fillStyle = isAgent ? 'rgba(40, 15, 60, 0.95)' : 'rgba(20, 25, 35, 0.95)';
    ctx.strokeStyle = isAgent ? '#c77dff' : '#ffd700';
    ctx.lineWidth = 1.5;

    ctx.fillRect(x - bw / 2, y - bh, bw, bh);
    ctx.strokeRect(x - bw / 2, y - bh, bw, bh);

    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y - 6);
    ctx.restore();
  }

  // =========================================================================
  // 16-Bit HUD Radar Minimap & Navigation
  // =========================================================================
  renderMinimap(gameState) {
    if (!gameState.self || !gameState.world) return;
    const { ctx, canvas } = this;
    const player = gameState.self;

    const mw = 136;
    const mh = 136;
    const mx = canvas.width - mw - 12;
    const my = 12;

    ctx.save();

    // Frame Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(mx - 2, my - 2, mw + 6, mh + 26);

    // Frame Background & Golden Medieval Border
    ctx.fillStyle = '#14171f';
    ctx.fillRect(mx, my, mw, mh);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(mx, my, mw, mh);

    // Top-down Radar Tiles (26x26 grid around player)
    const range = 13;
    const pixelScale = mw / (range * 2);

    const BIOME_RADAR_COLORS = [
      '#9e6d44', // 0: Savannah
      '#557a2b', // 1: Steppe
      '#34384a', // 2: Basalt
      '#1b5e94', // 3: Water
      '#e5edf2', // 4: Tundra
      '#d90429', // 5: Lava
      '#1c4c34', // 6: Rainforest
      '#3f3a4f', // 7: Crypts
      '#df9e42', // 8: Dunes
      '#e9c46a', // 9: Beach
      '#5c6470', // 10: Mountain
      '#a8a29e'  // 11: Cobblestone Bridge/Plaza
    ];

    const worldWidth = gameState.world.width;
    const worldHeight = gameState.world.height;
    const worldTiles = gameState.world.tiles;

    for (let dy = -range; dy <= range; dy++) {
      for (let dx = -range; dx <= range; dx++) {
        const wx = player.x + dx;
        const wy = player.y + dy;
        if (wx >= 0 && wx < worldWidth && wy >= 0 && wy < worldHeight) {
          const tile = worldTiles[wy * worldWidth + wx];
          ctx.fillStyle = BIOME_RADAR_COLORS[tile] || '#111';
          const px = mx + (dx + range) * pixelScale;
          const py = my + (dy + range) * pixelScale;
          ctx.fillRect(px, py, Math.ceil(pixelScale), Math.ceil(pixelScale));
        }
      }
    }

    // Blip: Resource Nodes (Cyan Dots)
    if (gameState.nodes) {
      for (const node of gameState.nodes) {
        if (!node.available) continue;
        const dx = node.x - player.x;
        const dy = node.y - player.y;
        if (Math.abs(dx) <= range && Math.abs(dy) <= range) {
          ctx.fillStyle = '#00f5d4';
          ctx.fillRect(mx + (dx + range) * pixelScale - 1, my + (dy + range) * pixelScale - 1, 3, 3);
        }
      }
    }

    // Blip: Monsters, Fauna & Town Elders
    if (gameState.npcs) {
      for (const npc of gameState.npcs) {
        if (npc.hp <= 0) continue;
        const dx = npc.x - player.x;
        const dy = npc.y - player.y;
        if (Math.abs(dx) <= range && Math.abs(dy) <= range) {
          ctx.fillStyle = npc.isTownNpc ? '#2ecc71' : (npc.combatLvl === 1 ? '#ffea00' : '#e63946');
          ctx.fillRect(mx + (dx + range) * pixelScale - 1, my + (dy + range) * pixelScale - 1, 3, 3);
        }
      }
    }

    // Blip: Other Players (Purple / Cyan)
    if (gameState.players) {
      for (const other of gameState.players) {
        if (other.id === player.id) continue;
        const dx = other.x - player.x;
        const dy = other.y - player.y;
        if (Math.abs(dx) <= range && Math.abs(dy) <= range) {
          ctx.fillStyle = other.isAgent ? '#c77dff' : '#ffffff';
          ctx.fillRect(mx + (dx + range) * pixelScale - 1, my + (dy + range) * pixelScale - 1, 3, 3);
        }
      }
    }

    // Blip: Self Player (Flashing White Dot with Gold Ring in Center)
    const cx = mx + mw / 2;
    const cy = my + mh / 2;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 2, cy - 2, 4, 4);
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - 3, cy - 3, 6, 6);

    // Compass Rose (North Arrow)
    ctx.fillStyle = '#e63946';
    ctx.beginPath();
    ctx.moveTo(mx + mw / 2, my + 4);
    ctx.lineTo(mx + mw / 2 - 4, my + 11);
    ctx.lineTo(mx + mw / 2 + 4, my + 11);
    ctx.closePath();
    ctx.fill();
    ctx.font = '7px "Press Start 2P"';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('N', mx + mw / 2, my + 18);

    // Coordinates Banner below Minimap
    ctx.fillStyle = '#0b0c10';
    ctx.fillRect(mx, my + mh, mw, 20);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(mx, my + mh, mw, 20);

    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#ffb703';
    ctx.textAlign = 'center';
    ctx.fillText(`(${player.x}, ${player.y})`, mx + mw / 2, my + mh + 14);

    ctx.restore();
  }

  getMinimapWorldCoord(screenX, screenY, player) {
    if (!player) return null;
    const mw = 136;
    const mh = 136;
    const mx = this.canvas.width - mw - 12;
    const my = 12;

    if (screenX >= mx && screenX <= mx + mw && screenY >= my && screenY <= my + mh) {
      const range = 13;
      const pixelScale = mw / (range * 2);
      const dx = Math.round((screenX - (mx + mw / 2)) / pixelScale);
      const dy = Math.round((screenY - (my + mh / 2)) / pixelScale);
      return { worldX: player.x + dx, worldY: player.y + dy };
    }
    return null;
  }
}

/**
 * PRIMA: Age of Bronze - 600ms Master Game Tick Loop
 */

import { NPC } from './npc.js';
import { RESOURCE_TYPES } from './world.js';
import { ITEM_DEFINITIONS } from './player.js';
import { CombatEngine } from './combat.js';

export class TickManager {
  constructor(world, grandExchange) {
    this.world = world;
    this.grandExchange = grandExchange;
    this.combatEngine = new CombatEngine(world);
    this.players = new Map();
    this.npcs = new Map();
    this.currentTick = 0;
    this.intervalId = null;
    this.onBroadcast = null;
    this.chatLog = [];

    this.initVastContinentEntities();
  }

  initVastContinentEntities() {
    let npcCount = 1;

    const findSafeLand = (targetX, targetY) => {
      const idx = targetY * this.world.width + targetX;
      const t = this.world.tiles[idx];
      if (t !== 3 && t !== 5 && t !== 10 && this.world.isWalkable(targetX, targetY)) {
        return { x: targetX, y: targetY };
      }
      for (let r = 1; r <= 8; r++) {
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            const nx = targetX + dx;
            const ny = targetY + dy;
            if (nx >= 0 && nx < this.world.width && ny >= 0 && ny < this.world.height) {
              const tile = this.world.tiles[ny * this.world.width + nx];
              if (tile !== 3 && tile !== 5 && tile !== 10 && this.world.isWalkable(nx, ny)) {
                return { x: nx, y: ny };
              }
            }
          }
        }
      }
      return { x: targetX, y: targetY };
    };

    const spawnNpc = (id, type, x, y) => {
      const safe = findSafeLand(x, y);
      this.npcs.set(id, new NPC(id, type, safe.x, safe.y));
    };

    // 1. Ash-River Encampment Town Elders (Interactive Non-Aggressive Citizens)
    spawnNpc(`npc_elder_1`, 'elder_kael', 90, 131);
    spawnNpc(`npc_knapper_1`, 'knapper_urk', 86, 130);
    spawnNpc(`npc_scout_1`, 'scout_tara', 92, 134);
    spawnNpc(`npc_banker_1`, 'banker_torok', 94, 132);

    // 2. Ash-River Starter Training Fauna (Lv 1 Hares, Boars, Crabs, Foxes)
    const starterFauna = [
      { type: 'prairie_hare', x: 84, y: 126 },
      { type: 'prairie_hare', x: 82, y: 132 },
      { type: 'prairie_hare', x: 96, y: 126 },
      { type: 'prairie_hare', x: 98, y: 132 },
      { type: 'forest_boar', x: 76, y: 128 },
      { type: 'forest_boar', x: 74, y: 134 },
      { type: 'forest_boar', x: 102, y: 128 },
      { type: 'forest_boar', x: 104, y: 134 },
      { type: 'river_crab', x: 110, y: 129 },
      { type: 'river_crab', x: 110, y: 137 },
      { type: 'river_crab', x: 118, y: 129 },
      { type: 'river_crab', x: 118, y: 137 },
      { type: 'savannah_fox', x: 80, y: 138 },
      { type: 'savannah_fox', x: 100, y: 138 }
    ];

    for (const f of starterFauna) {
      const id = `npc_fauna_${npcCount++}`;
      spawnNpc(id, f.type, f.x, f.y);
    }

    // 3. Outer Savannah & Hills Dire Wolves (Lv 3)
    const wolfSpawns = [
      { x: 72, y: 125 }, { x: 70, y: 135 }, { x: 68, y: 142 },
      { x: 122, y: 125 }, { x: 125, y: 135 }, { x: 128, y: 142 }
    ];
    for (const w of wolfSpawns) {
      const id = `npc_wolf_${npcCount++}`;
      spawnNpc(id, 'dire_wolf', w.x, w.y);
    }

    // 4. Obsidian Crags Saber Raptors & Basalt Beasts (Lv 16)
    for (let i = 0; i < 8; i++) {
      const id = `npc_raptor_${npcCount++}`;
      const x = 138 + (i % 4) * 8;
      const y = 118 + Math.floor(i / 4) * 12;
      spawnNpc(id, 'saber_raptor', x, y);
    }

    // 5. Sunken Crypts & Offshore Starfall Isle Golems (Lv 42)
    for (let i = 0; i < 6; i++) {
      const id = `npc_golem_${npcCount++}`;
      const x = 158 + (i % 3) * 8;
      const y = 40 + Math.floor(i / 3) * 10;
      spawnNpc(id, 'stone_golem', x, y);
    }

    // 6. Mammoth Steppes & Frost Tundra Ancient Boss
    const mammothId = `npc_mammoth_${npcCount++}`;
    spawnNpc(mammothId, 'woolly_mammoth', 69, 35);
  }

  start(tickMs = 600) {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => this.tick(), tickMs);
    console.log(`[PRIMA Engine] 600ms Authoritative Tick Loop active.`);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  tick() {
    this.currentTick++;
    const hitsplats = [];
    const levelUpEvents = [];

    // Stage 1: Resource Respawns
    for (const node of this.world.resourceNodes.values()) {
      if (!node.available && node.maxRespawn > 0) {
        node.respawnTimer--;
        if (node.respawnTimer <= 0) {
          node.available = true;
          node.resourcePool = node.maxPool || 1;
          if (!node.isStation) {
            this.world.collision[node.y * this.world.width + node.x] = 1;
          }
        }
      }
    }

    // Stage 2: Ground Items Despawn
    for (const [id, item] of this.world.groundItems.entries()) {
      item.despawnTicks--;
      if (item.despawnTicks <= 0) {
        this.world.groundItems.delete(id);
      }
    }

    // Stage 3: Monster & Fauna AI
    for (const npc of this.npcs.values()) {
      if (npc.state === 'DEAD') {
        npc.deadTicks++;
        if (npc.deadTicks >= npc.respawnTicks) {
          npc.respawn();
        }
        continue;
      }

      // Check aggro if idle
      if (npc.state === 'IDLE' && npc.aggro) {
        for (const player of this.players.values()) {
          const dist = Math.max(Math.abs(player.x - npc.x), Math.abs(player.y - npc.y));
          if (dist <= npc.aggroRadius && !player.inCombat) {
            npc.state = 'COMBAT';
            npc.target = player.id;
            player.combatTarget = npc.id;
            player.inCombat = true;
            player.actionState = 'COMBAT';
            break;
          }
        }
      }

      // Safe land-only wandering
      if (npc.state === 'IDLE' && Math.random() < 0.25) {
        const dx = Math.floor(Math.random() * 3) - 1;
        const dy = Math.floor(Math.random() * 3) - 1;
        const newX = npc.x + dx;
        const newY = npc.y + dy;
        const maxRoam = npc.isTownNpc ? 2 : 6;
        const distFromSpawn = Math.abs(newX - npc.spawnX) + Math.abs(newY - npc.spawnY);

        if (distFromSpawn <= maxRoam && this.world.isWalkable(newX, newY)) {
          const targetTile = this.world.tiles[newY * this.world.width + newX];
          // Strict check: never step into water (3), lava (5), or mountain peaks (10)
          if (targetTile !== 3 && targetTile !== 5 && targetTile !== 10) {
            npc.x = newX;
            npc.y = newY;
          }
        }
      }
    }

    // Stage 4: Movement Resolution & Arrival Checks
    for (const player of this.players.values()) {
      if (player.actionState === 'MOVING' && player.path && player.path.length > 0) {
        const next = player.path.shift();
        if (this.world.isWalkable(next.x, next.y)) {
          player.x = next.x;
          player.y = next.y;
        } else {
          player.path = [];
        }
      }

      // Check if arriving near combat target
      if (player.combatTarget) {
        const npc = this.npcs.get(player.combatTarget);
        if (npc && npc.state !== 'DEAD' && npc.hp > 0) {
          const isNear = Math.max(Math.abs(player.x - npc.x), Math.abs(player.y - npc.y)) <= 1;
          if (isNear) {
            if (!player.inCombat) {
              player.inCombat = true;
              player.actionState = 'COMBAT';
              npc.state = 'COMBAT';
              npc.target = player.id;
              player.path = [];
            }
          } else if (!player.path || player.path.length === 0) {
            player.path = this.world.findPath(player.x, player.y, npc.x, npc.y);
            if (player.path.length > 0) player.actionState = 'MOVING';
          }
        } else {
          player.combatTarget = null;
          player.inCombat = false;
          if (player.actionState === 'COMBAT') player.actionState = 'IDLE';
        }
      }

      // Check if arriving near resource node
      if (player.actionTarget) {
        const node = this.world.resourceNodes.get(player.actionTarget);
        if (node && node.available) {
          const isNear = Math.max(Math.abs(player.x - node.x), Math.abs(player.y - node.y)) <= 1;
          if (isNear) {
            const skillLvl = player.skills[node.skill]?.lvl || 1;
            if (skillLvl >= node.reqLvl) {
              const targetState = node.skill.toUpperCase();
              if (player.actionState !== targetState) {
                player.actionState = targetState;
                player.actionTicksRemaining = 2;
                player.path = [];
              }
            } else {
              player.actionState = 'IDLE';
              player.actionTarget = null;
              player.pendingAction = null;
            }
          }
        } else {
          player.actionTarget = null;
          player.pendingAction = null;
        }
      }

      // Check if arriving near ground item to loot
      if (player.pickupTarget) {
        const groundItem = this.world.groundItems.get(player.pickupTarget);
        if (groundItem) {
          const isNear = Math.max(Math.abs(player.x - groundItem.x), Math.abs(player.y - groundItem.y)) <= 1;
          if (isNear) {
            if (player.addItem(groundItem.itemId, groundItem.quantity)) {
              this.world.removeGroundItem(groundItem.id);
            }
            player.pickupTarget = null;
            if (player.actionState === 'MOVING' && (!player.path || player.path.length === 0)) {
              player.actionState = 'IDLE';
            }
          } else if (!player.path || player.path.length === 0) {
            player.path = this.world.findPath(player.x, player.y, groundItem.x, groundItem.y);
            if (player.path.length > 0) player.actionState = 'MOVING';
            else player.pickupTarget = null; // Unreachable
          }
        } else {
          player.pickupTarget = null;
        }
      }
    }

    // Stage 5: Multi-Tick Gathering Actions with Node Depletion
    for (const player of this.players.values()) {
      if (player.actionTarget) {
        const node = this.world.resourceNodes.get(player.actionTarget);
        if (!node || !node.available || node.isStation) {
          if (player.actionState !== 'COMBAT' && player.actionState !== 'MOVING') {
            player.actionState = 'IDLE';
          }
          player.actionTarget = null;
          continue;
        }

        const isNear = Math.max(Math.abs(player.x - node.x), Math.abs(player.y - node.y)) <= 1;
        if (!isNear) continue;

        player.actionTicksRemaining--;
        if (player.actionTicksRemaining <= 0) {
          const skillLvl = player.skills[node.skill]?.lvl || 1;
          const successChance = Math.max(0.35, Math.min(0.85, 0.45 + (skillLvl - node.reqLvl) * 0.03));

          if (Math.random() <= successChance) {
            if (player.addItem(node.item, 1)) {
              const xpEv = player.addXp(node.skill, node.xp);
              if (xpEv.leveledUp) levelUpEvents.push({ playerId: player.id, ...xpEv });

              hitsplats.push({
                tick: this.currentTick,
                x: node.x,
                y: node.y,
                damage: `+1 ${ITEM_DEFINITIONS[node.item]?.name || 'Resource'} (+${node.xp} XP)`,
                color: 'GREEN',
                isGather: true
              });

              node.resourcePool = (node.resourcePool || 1) - 1;
              if (node.resourcePool <= 0) {
                // Depleted
                node.available = false;
                node.respawnTimer = node.maxRespawn;
                this.world.collision[node.y * this.world.width + node.x] = 0;
                player.actionState = 'IDLE';
                player.actionTarget = null;
              } else {
                // Continue gathering the remaining pool
                player.actionTicksRemaining = 2;
              }
            } else {
              // Inventory is full
              hitsplats.push({
                tick: this.currentTick,
                x: player.x,
                y: player.y,
                damage: 'Inventory Full!',
                color: 'RED'
              });
              player.actionState = 'IDLE';
              player.actionTarget = null;
            }
          } else {
            // Unsuccessful strike; swing/chip again next 2 ticks
            player.actionTicksRemaining = 2;
          }
        }
      }
    }

    // Stage 6: Combat Resolution
    for (const player of this.players.values()) {
      if (player.inCombat && player.combatTarget) {
        const npc = this.npcs.get(player.combatTarget);
        if (!npc || npc.state === 'DEAD' || npc.hp <= 0) {
          player.inCombat = false;
          player.combatTarget = null;
          continue;
        }

        const isNear = Math.max(Math.abs(player.x - npc.x), Math.abs(player.y - npc.y)) <= 1;
        if (isNear) {
          const round = this.combatEngine.resolveRound(player, npc, this.currentTick);
          hitsplats.push(round.hitsplat);
          if (round.xpEvents.length > 0) {
            for (const ev of round.xpEvents) levelUpEvents.push({ playerId: player.id, ...ev });
          }

          if (npc.hp > 0) {
            const counter = this.combatEngine.resolveRound(npc, player, this.currentTick);
            hitsplats.push(counter.hitsplat);
          } else {
            player.inCombat = false;
            player.combatTarget = null;
          }
        }
      }
    }

    // Stage 7: Active Buffs & Status Effects Processing
    for (const player of this.players.values()) {
      // Potion Buffs Countdown
      if (player.activeBuffs) {
        for (const [key, buff] of Object.entries(player.activeBuffs)) {
          buff.duration--;
          if (buff.duration <= 0) {
            delete player.activeBuffs[key];
          }
        }
      }

      // Poison / Bleed Ticks
      if (player.isPoisoned && this.currentTick % 5 === 0) {
        player.hp = Math.max(0, player.hp - 1);
        hitsplats.push({ tick: this.currentTick, targetId: player.id, damage: 1, color: 'GREEN' });
        player.poisonTicks = (player.poisonTicks || 5) - 1;
        if (player.poisonTicks <= 0) player.isPoisoned = false;
      }
      if (player.isBleeding && this.currentTick % 4 === 0) {
        player.hp = Math.max(0, player.hp - 1);
        hitsplats.push({ tick: this.currentTick, targetId: player.id, damage: 1, color: 'RED' });
        player.bleedTicks = (player.bleedTicks || 4) - 1;
        if (player.bleedTicks <= 0) player.isBleeding = false;
      }
    }

    // Process Monster Poison / Bleed Ticks
    for (const npc of this.npcs.values()) {
      if (npc.state !== 'DEAD' && npc.hp > 0) {
        if (npc.isBleeding && this.currentTick % 4 === 0) {
          npc.hp = Math.max(0, npc.hp - 1);
          hitsplats.push({ tick: this.currentTick, targetId: npc.id, damage: 1, color: 'RED' });
          npc.bleedTicks = (npc.bleedTicks || 4) - 1;
          if (npc.bleedTicks <= 0) npc.isBleeding = false;
          if (npc.hp <= 0) npc.state = 'DEAD';
        }
      }
    }

    // Stage 8: Passive Health & Spirit Regeneration
    if (this.currentTick % 10 === 0) { // Every 10 ticks (~6 seconds)
      for (const player of this.players.values()) {
        if (!player.inCombat && player.hp < player.maxHp) {
          player.hp = Math.min(player.maxHp, player.hp + 1);
        }
      }
    }
    if (this.currentTick % 15 === 0) { // Every 15 ticks (~9 seconds)
      for (const player of this.players.values()) {
        if (player.spirit < player.maxSpirit) {
          player.spirit = Math.min(player.maxSpirit, player.spirit + 1);
        }
      }
    }

    // Stage 9: Broadcast Deltas
    if (this.onBroadcast) {
      this.onBroadcast(this.currentTick, hitsplats, levelUpEvents);
    }
  }

  addPlayer(player) {
    this.players.set(player.id, player);
    return player;
  }

  removePlayer(playerId) {
    this.players.delete(playerId);
  }

  addChatMessage(fromPlayer, text) {
    const msg = {
      id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      from: fromPlayer.username,
      badge: fromPlayer.badge,
      isAgent: fromPlayer.isAgent,
      text,
      x: fromPlayer.x,
      y: fromPlayer.y,
      timestamp: Date.now()
    };
    this.chatLog.unshift(msg);
    if (this.chatLog.length > 100) this.chatLog.pop();
    return msg;
  }
}

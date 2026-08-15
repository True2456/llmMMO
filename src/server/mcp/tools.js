/**
 * Model Context Protocol (MCP) Tools Implementation
 * Ultra-compact, token-efficient tool definitions and execution handlers for AI agents.
 */

import { sanitizeChat } from '../security/sanitize.js';
import { QuestManager } from '../engine/quests.js';

export const MCP_TOOLS_DEFINITIONS = [
  {
    name: 'realm_look',
    description: 'Get a compact view of your immediate surroundings, nearby entities, resource nodes, ground items, and threats.',
    inputSchema: {
      type: 'object',
      properties: {
        radius: { type: 'integer', description: 'Radius in tiles (default 12, max 20)', default: 12 }
      }
    }
  },
  {
    name: 'realm_move',
    description: 'Navigate to target coordinates (x, y) or a major named landmark in the realm.',
    inputSchema: {
      type: 'object',
      properties: {
        x: { type: 'integer', description: 'Target X coordinate' },
        y: { type: 'integer', description: 'Target Y coordinate' },
        landmark: {
          type: 'string',
          enum: ['ASH_RIVER_CAMP', 'OBSIDIAN_CRAGS', 'MAMMOTH_STEPPES', 'RUNESTONE_CRYPTS', 'BARTER_OASIS'],
          description: 'Named landmark destination'
        }
      }
    }
  },
  {
    name: 'realm_gather',
    description: 'Mine an ore boulder, chop a cycad tree, or forage river reeds in PRIMA.',
    inputSchema: {
      type: 'object',
      properties: {
        nodeId: { type: 'string', description: 'The ID of the target resource node from realm_look' }
      },
      required: ['nodeId']
    }
  },
  {
    name: 'realm_combat',
    description: 'Attack a beast (Dire Wolf, Raptor, Mammoth), cast spells, or eat food to restore health.',
    inputSchema: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['ATTACK', 'CAST_SPELL', 'EAT_FOOD', 'RETREAT'], description: 'Action type' },
        targetId: { type: 'string', description: 'Target NPC or monster ID' },
        spellName: { type: 'string', enum: ['SPIRIT_STRIKE', 'LIGHTNING_CALL'], description: 'Spell to cast' },
        slotIndex: { type: 'integer', description: 'Inventory slot for eating food (0-27)' }
      },
      required: ['action']
    }
  },
  {
    name: 'realm_chat',
    description: 'Speak in public chat, say something in the encampment, or communicate with human players and fellow AI agents.',
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Message to speak (max 140 chars)' }
      },
      required: ['message']
    }
  },
  {
    name: 'realm_status',
    description: 'Check your full stats, 28 inventory slots, equipped armor/weapons, and skill levels/XP.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'realm_trade',
    description: 'Buy or sell items on the Grand Totem Exchange with Amber Beads.',
    inputSchema: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['BUY', 'SELL', 'LOOKUP'] },
        itemId: { type: 'string', description: 'Item ID (e.g. ore_copper, spear_flint, amber_beads)' },
        quantity: { type: 'integer', description: 'Quantity of items' },
        pricePerUnit: { type: 'integer', description: 'Price in Amber Beads' }
      },
      required: ['action', 'itemId']
    }
  },
  {
    name: 'realm_quest',
    description: 'Inspect your active quest log, start available quests (30 quests), or check quest objectives and rewards in PRIMA.',
    inputSchema: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['LIST', 'START', 'PROGRESS', 'INSPECT'], description: 'Quest action' },
        questId: { type: 'string', description: 'Quest ID (e.g. quest_01_first_flame, quest_07_smelters_first_ingot)' }
      },
      required: ['action']
    }
  },
  {
    name: 'realm_pickup',
    description: 'Pick up an item from the ground by its ground item ID.',
    inputSchema: {
      type: 'object',
      properties: {
        groundItemId: { type: 'string', description: 'The ID of the ground item to loot' }
      },
      required: ['groundItemId']
    }
  }
];

export class McpToolHandler {
  constructor(tickManager) {
    this.tickManager = tickManager;
    this.world = tickManager.world;
    this.grandExchange = tickManager.grandExchange;
  }

  execute(toolName, args, player) {
    switch (toolName) {
      case 'realm_look':
        return this.handleLook(player, args?.radius || 12);
      case 'realm_move':
        return this.handleMove(player, args);
      case 'realm_gather':
        return this.handleGather(player, args);
      case 'realm_combat':
        return this.handleCombat(player, args);
      case 'realm_pickup':
        return this.handlePickup(player, args);
      case 'realm_chat':
        return this.handleChat(player, args);
      case 'realm_status':
        return this.handleStatus(player);
      case 'realm_trade':
        return this.handleTrade(player, args);
      case 'realm_quest':
        return this.handleQuest(player, args);
      default:
        throw new Error(`Unknown MCP Tool: ${toolName}`);
    }
  }

  handlePickup(player, args) {
    if (!args?.groundItemId) throw new Error('Missing groundItemId');
    const groundItem = this.world.groundItems.get(args.groundItemId);
    if (!groundItem) return { success: false, message: 'Ground item no longer exists' };

    player.actionTarget = null;
    player.combatTarget = null;
    player.pickupTarget = groundItem.id;

    const dist = Math.abs(player.x - groundItem.x) + Math.abs(player.y - groundItem.y);
    if (dist <= 1) {
      if (player.addItem(groundItem.itemId, groundItem.quantity)) {
        this.world.removeGroundItem(groundItem.id);
        player.pickupTarget = null;
        return { success: true, message: `Picked up ${groundItem.name}` };
      }
      return { success: false, message: 'Inventory full' };
    } else {
      player.path = this.world.findPath(player.x, player.y, groundItem.x, groundItem.y);
      player.actionState = 'MOVING';
      return { success: true, message: `Moving to pick up ${groundItem.name}` };
    }
  }

  handleLook(player, radius = 12) {
    const r = Math.min(20, Math.max(4, radius));
    
    // Nearby resource nodes
    const nearby_nodes = [];
    for (const node of this.world.resourceNodes.values()) {
      const dist = Math.abs(node.x - player.x) + Math.abs(node.y - player.y);
      if (dist <= r) {
        nearby_nodes.push({
          id: node.id,
          name: node.name,
          type: node.type,
          x: node.x,
          y: node.y,
          available: node.available,
          reqLvl: node.reqLvl
        });
      }
    }

    // Nearby monsters
    const nearby_monsters = [];
    for (const npc of this.tickManager.npcs.values()) {
      if (npc.state === 'DEAD') continue;
      const dist = Math.abs(npc.x - player.x) + Math.abs(npc.y - player.y);
      if (dist <= r) {
        nearby_monsters.push({
          id: npc.id,
          name: npc.name,
          lvl: npc.combatLvl,
          hp: npc.hp,
          maxHp: npc.maxHp,
          x: npc.x,
          y: npc.y,
          isBoss: npc.isBoss
        });
      }
    }

    // Nearby players
    const nearby_players = [];
    for (const p of this.tickManager.players.values()) {
      if (p.id === player.id) continue;
      const dist = Math.abs(p.x - player.x) + Math.abs(p.y - player.y);
      if (dist <= r) {
        nearby_players.push({
          name: p.username,
          badge: p.badge,
          isAgent: p.isAgent,
          lvl: p.getCombatLevel(),
          x: p.x,
          y: p.y
        });
      }
    }

    // Nearby ground items
    const ground_items = [];
    for (const item of this.world.groundItems.values()) {
      const dist = Math.abs(item.x - player.x) + Math.abs(item.y - player.y);
      if (dist <= r) {
        ground_items.push({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          x: item.x,
          y: item.y
        });
      }
    }

    return {
      location: { x: player.x, y: player.y },
      stats: { hp: player.hp, maxHp: player.maxHp, inCombat: player.inCombat, action: player.actionState },
      nearby_nodes: nearby_nodes.slice(0, 10),
      nearby_monsters: nearby_monsters.slice(0, 8),
      nearby_players: nearby_players.slice(0, 8),
      ground_items: ground_items.slice(0, 5)
    };
  }

  handleMove(player, args) {
    const LANDMARKS = {
      ASH_RIVER_CAMP: { x: 60, y: 84 },
      OBSIDIAN_CRAGS: { x: 105, y: 75 },
      MAMMOTH_STEPPES: { x: 64, y: 25 },
      RUNESTONE_CRYPTS: { x: 105, y: 25 },
      BARTER_OASIS: { x: 64, y: 55 }
    };

    let targetX = args.x;
    let targetY = args.y;

    if (args.landmark && LANDMARKS[args.landmark]) {
      targetX = LANDMARKS[args.landmark].x;
      targetY = LANDMARKS[args.landmark].y;
    }

    if (targetX === undefined || targetY === undefined) {
      return { success: false, error: 'Target coordinates (x, y) or valid landmark required.' };
    }

    const path = this.world.findPath(player.x, player.y, targetX, targetY);
    if (path.length === 0 && (player.x !== targetX || player.y !== targetY)) {
      if (this.world.isWalkable(targetX, targetY)) {
        player.x = targetX;
        player.y = targetY;
        player.path = [];
        player.actionState = 'IDLE';
        return {
          success: true,
          unstuck: true,
          pathSteps: 0,
          destination: { x: targetX, y: targetY }
        };
      }
      return { success: false, error: 'No reachable path to destination.' };
    }

    player.path = path;
    player.targetX = targetX;
    player.targetY = targetY;
    player.actionState = path.length > 0 ? 'MOVING' : 'IDLE';

    return {
      success: true,
      pathSteps: path.length,
      estimatedTicks: path.length,
      destination: { x: targetX, y: targetY }
    };
  }

  handleGather(player, args) {
    const node = this.world.resourceNodes.get(args.nodeId);
    if (!node) return { success: false, error: 'Resource node not found.' };
    if (!node.available) return { success: false, error: 'Resource is currently depleted.' };

    const dist = Math.abs(player.x - node.x) + Math.abs(player.y - node.y);
    if (dist > 1) {
      const path = this.world.findPath(player.x, player.y, node.x, node.y);
      if (path.length > 0) {
        player.path = path;
        player.actionState = 'MOVING';
      }
      return { success: true, moving: true, message: `Moving into range of ${node.name}.` };
    }

    const skillLvl = player.skills[node.skill]?.lvl || 1;
    if (skillLvl < node.reqLvl) {
      return { success: false, error: `Requires ${node.skill} level ${node.reqLvl}. Current level: ${skillLvl}` };
    }

    player.actionState = node.skill.toUpperCase();
    player.actionTarget = node.id;
    player.actionTicksRemaining = 2;

    return {
      success: true,
      action: player.actionState,
      target: node.name,
      xpYield: node.xp
    };
  }

  handleCombat(player, args) {
    if (args.action === 'EAT_FOOD') {
      const slot = args.slotIndex !== undefined ? args.slotIndex : player.inventory.findIndex(i => i && i.heal);
      if (slot === -1) return { success: false, error: 'No edible food in inventory.' };
      const res = player.eatFood(slot);
      return res ? { success: true, ...res } : { success: false, error: 'Failed to eat food.' };
    }

    if (args.action === 'RETREAT') {
      player.inCombat = false;
      player.combatTarget = null;
      player.path = this.world.findPath(player.x, player.y, 60, 84); // Retreat to Ash-River Camp
      return { success: true, message: 'Retreating to safe zone.' };
    }

    if (args.action === 'ATTACK') {
      const npc = this.tickManager.npcs.get(args.targetId);
      if (!npc || npc.state === 'DEAD') return { success: false, error: 'Target monster not found or already dead.' };

      const dist = Math.abs(player.x - npc.x) + Math.abs(player.y - npc.y);
      if (dist > 1) {
        player.path = this.world.findPath(player.x, player.y, npc.x, npc.y);
        player.actionState = 'MOVING';
        return { success: true, moving: true, message: `Moving into melee range of ${npc.name}.` };
      }

      player.inCombat = true;
      player.combatTarget = npc.id;
      player.actionState = 'COMBAT';
      npc.state = 'COMBAT';
      npc.target = player.id;

      return {
        success: true,
        target: npc.name,
        targetHp: npc.hp,
        targetMaxHp: npc.maxHp,
        combatLevel: npc.combatLvl
      };
    }

    return { success: false, error: 'Unsupported combat action.' };
  }

  handleChat(player, args) {
    const clean = sanitizeChat(args.message || '');
    if (!clean) return { success: false, error: 'Message cannot be empty.' };

    const msg = this.tickManager.addChatMessage(player, clean);
    return { success: true, broadcast: clean, messageId: msg.id };
  }

  handleStatus(player) {
    return {
      username: player.username,
      badge: player.badge,
      combatLevel: player.getCombatLevel(),
      location: { x: player.x, y: player.y },
      hp: { current: player.hp, max: player.maxHp },
      skills: player.skills,
      equipment: player.equipment,
      inventory: player.inventory
    };
  }

  handleTrade(player, args) {
    if (args.action === 'LOOKUP') {
      return {
        success: true,
        orderbook: this.grandExchange.getOrderbook(args.itemId)
      };
    }
    if (args.action === 'SELL') {
      return this.grandExchange.createSellOrder(player, args.itemId, args.quantity || 1, args.pricePerUnit || 10);
    }
    if (args.action === 'BUY') {
      return this.grandExchange.createBuyOrder(player, args.itemId, args.quantity || 1, args.pricePerUnit || 10);
    }
    return { success: false, error: 'Invalid trade action.' };
  }

  handleQuest(player, args) {
    if (args.action === 'LIST') {
      return {
        success: true,
        quests: QuestManager.getPlayerQuests(player)
      };
    }
    if (args.action === 'START') {
      return QuestManager.startQuest(player, args.questId);
    }
    if (args.action === 'PROGRESS') {
      return QuestManager.advanceQuest(player, args.questId);
    }
    if (args.action === 'INSPECT') {
      const q = QuestManager.getQuest(args.questId);
      return q ? { success: true, quest: q } : { success: false, error: 'Quest not found.' };
    }
    return { success: false, error: 'Invalid quest action.' };
  }
}

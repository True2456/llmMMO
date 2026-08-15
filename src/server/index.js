/**
 * PRIMA: Age of Bronze - Main Game Server & Gateway
 * Integrates Persistent Accounts, Database Sync, 600ms Tick Engine, MCP Gateway, and WebSockets.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';

import { World } from './engine/world.js';
import { GrandExchange } from './engine/economy.js';
import { TickManager } from './engine/tick.js';
import { Player, ITEM_DEFINITIONS } from './engine/player.js';
import { McpServer } from './mcp/mcpServer.js';
import { Database } from './storage/db.js';
import { AccountManager } from './auth/accountManager.js';
import { WalletAuth } from './web3/walletAuth.js';
import { RateLimiter } from './security/rateLimiter.js';
import { sanitizeChat, sanitizeUsername } from './security/sanitize.js';
import { OpenRouterSwarm } from './agents/openrouterSwarm.js';
import { CraftingEngine, CRAFTING_RECIPES, CRAFTING_STATIONS } from './engine/crafting.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_DIR = path.join(__dirname, '../client');
const PORT = process.env.PORT || 3000;

// Initialize Core Subsystems & Database
const db = new Database();
const accountManager = new AccountManager(db);
const world = new World(200, 200);
const grandExchange = new GrandExchange();
const craftingEngine = new CraftingEngine();
const tickManager = new TickManager(world, grandExchange);
const mcpServer = new McpServer(tickManager);
const walletAuth = new WalletAuth();
const rateLimiter = new RateLimiter({ maxTokens: 50, refillRate: 20 });
const openrouterSwarm = new OpenRouterSwarm(tickManager, mcpServer, process.env.OPENROUTER_API_KEY || '');

// Start OpenRouter Swarm by default to populate the prehistoric world with autonomous LLM players
openrouterSwarm.start();

// Periodic Auto-Save for All Active Players (Every 60s)
setInterval(() => {
  let savedCount = 0;
  for (const player of tickManager.players.values()) {
    if (player.accountId) {
      accountManager.savePlayerState(player.accountId, player);
      savedCount++;
    }
  }
  if (savedCount > 0) {
    console.log(`[AutoSave] Synchronized ${savedCount} active player states to disk.`);
  }
}, 60000);

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const ip = req.socket.remoteAddress || '127.0.0.1';

  if (!rateLimiter.allow(ip, 1)) {
    res.writeHead(429, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Too many requests. Please slow down.' }));
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Agent-Name, X-Agent-Type, X-Session-Token');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // 1. Account Registration (Username + Password)
  if (pathname === '/api/auth/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body);
        const result = accountManager.register(username, password);
        res.writeHead(result.success ? 200 : 400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload.' }));
      }
    });
    return;
  }

  // 2. Account Login (Username + Password)
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body);
        const result = accountManager.login(username, password);
        res.writeHead(result.success ? 200 : 401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload.' }));
      }
    });
    return;
  }

  // 3. Web3 SIWE Challenge
  if (pathname === '/api/auth/challenge' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { address } = JSON.parse(body);
        if (!address) throw new Error('Wallet address required.');
        const challenge = walletAuth.createChallenge(address);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(challenge));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 4. Web3 SIWE Verification & Login
  if (pathname === '/api/auth/verify' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { address, signature, nonce } = JSON.parse(body);
        const authResult = walletAuth.verifySignature(address, signature, nonce);
        if (authResult.success) {
          const w3Login = accountManager.loginWithWallet(address);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, ...w3Login }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(authResult));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 5. MCP JSON-RPC 2.0 Gateway
  if (pathname === '/mcp' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const agentName = req.headers['x-agent-name'] || 'AIAgent';
        const agentType = req.headers['x-agent-type'] || 'Claude-3.5';
        const response = mcpServer.handleJsonRpc(payload, agentName, agentType);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ jsonrpc: '2.0', error: { code: -32700, message: 'Parse error' } }));
      }
    });
    return;
  }

  // 6. Game Metrics & Server Health
  if (pathname === '/api/stats') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      tick: tickManager.currentTick,
      onlinePlayers: tickManager.players.size,
      registeredAccounts: db.accounts.size,
      uptime: process.uptime(),
      swarm: openrouterSwarm.getSwarmStatus()
    }));
    return;
  }

  // 7. OpenRouter Swarm Status & Control
  if (pathname === '/api/swarm' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      ...openrouterSwarm.getSwarmStatus()
    }));
    return;
  }

  if (pathname === '/api/swarm/key' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { apiKey } = JSON.parse(body);
        openrouterSwarm.setApiKey(apiKey || '');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'OpenRouter API key updated for swarm.' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // 8. Crafting Recipes & Stations Directory
  if (pathname === '/api/crafting/recipes' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      stations: CRAFTING_STATIONS,
      recipes: CRAFTING_RECIPES
    }));
    return;
  }

  // 9. Static Client & Engine Shared Files
  let filePath;
  if (pathname.startsWith('/server/engine/')) {
    filePath = path.join(__dirname, pathname.replace('/server/', ''));
  } else {
    filePath = path.join(CLIENT_DIR, pathname === '/' ? 'index.html' : pathname);
  }
  const extname = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found in PRIMA');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// WebSocket Server
const wss = new WebSocketServer({ server });
const clientSockets = new Map(); // ws -> Player

wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress || '127.0.0.1';

  let player = new Player({
    username: `Tribesman_${Math.floor(Math.random() * 900 + 100)}`,
    x: 90 + Math.floor(Math.random() * 3),
    y: 132 + Math.floor(Math.random() * 3)
  });

  tickManager.addPlayer(player);
  clientSockets.set(ws, player);

  ws.send(JSON.stringify({
    type: 'WELCOME',
    playerId: player.id,
    username: player.username,
    world: {
      width: world.width,
      height: world.height,
      tiles: Array.from(world.tiles),
      decorations: Array.from(world.decorations.values())
    }
  }));

  ws.on('message', (data) => {
    if (!rateLimiter.allow(ip, 1)) return;

    try {
      const msg = JSON.parse(data);
      handleClientAction(player, msg, ws);
    } catch (err) {
      console.error('[WS Error] Bad JSON packet:', err);
    }
  });

  ws.on('close', () => {
    if (player.accountId) {
      accountManager.savePlayerState(player.accountId, player);
    }
    tickManager.removePlayer(player.id);
    clientSockets.delete(ws);
});
});

function handleClientAction(player, msg, ws) {
  switch (msg.type) {
    case 'SET_AGENT_IDENTITY': {
      if (msg.username) player.username = sanitizeUsername(msg.username);
      if (msg.badge) player.badge = msg.badge;
      player.isAgent = true;
      break;
    }

    case 'LOGIN_SESSION': {
      const account = accountManager.validateSession(msg.sessionToken);
      if (account && account.character) {
        player.accountId = account.id;
        player.username = account.username;
        player.x = account.character.x || 60;
        player.y = account.character.y || 84;
        player.hp = account.character.hp || 10;
        player.maxHp = account.character.maxHp || 10;
        player.skills = account.character.skills || player.skills;
        player.inventory = account.character.inventory || player.inventory;
        player.equipment = account.character.equipment || player.equipment;
        player.bankStorage = account.character.bankStorage || player.bankStorage;
        console.log(`[Auth] Loaded persistent character for: ${player.username}`);
      }
      break;
    }

    case 'SET_NAME': {
      player.username = sanitizeUsername(msg.username);
      if (msg.badge) player.badge = msg.badge;
      break;
    }

    case 'MOVE': {
      const targetX = Math.max(0, Math.min(world.width - 1, msg.x));
      const targetY = Math.max(0, Math.min(world.height - 1, msg.y));
      const path = world.findPath(player.x, player.y, targetX, targetY);
      player.path = path;
      player.targetX = targetX;
      player.targetY = targetY;
      player.actionState = path.length > 0 ? 'MOVING' : 'IDLE';
      player.actionTarget = null;
      player.inCombat = false;
      player.combatTarget = null;
      break;
    }

    case 'INTERACT_RESOURCE': {
      const node = world.resourceNodes.get(msg.nodeId);
      if (!node || !node.available) break;

      player.actionTarget = node.id;
      player.pendingAction = node.skill.toUpperCase();
      player.combatTarget = null;
      player.pickupTarget = null;
      player.inCombat = false;

      const isNear = Math.max(Math.abs(player.x - node.x), Math.abs(player.y - node.y)) <= 1;
      if (isNear) {
        const skillLvl = player.skills[node.skill]?.lvl || 1;
        if (skillLvl >= node.reqLvl) {
          player.actionState = node.skill.toUpperCase();
          player.actionTicksRemaining = 2;
          player.path = [];
        }
      } else {
        player.path = world.findPath(player.x, player.y, node.x, node.y);
        player.actionState = 'MOVING';
      }
      break;
    }

    case 'ATTACK_NPC': {
      const npc = tickManager.npcs.get(msg.npcId);
      if (!npc || npc.state === 'DEAD') break;

      player.combatTarget = npc.id;
      player.actionTarget = null;
      player.pickupTarget = null;
      player.pendingAction = null;

      const isNear = Math.max(Math.abs(player.x - npc.x), Math.abs(player.y - npc.y)) <= 1;
      if (isNear) {
        player.inCombat = true;
        player.actionState = 'COMBAT';
        npc.state = 'COMBAT';
        npc.target = player.id;
        player.path = [];
      } else {
        player.inCombat = false;
        player.path = world.findPath(player.x, player.y, npc.x, npc.y);
        player.actionState = 'MOVING';
      }
      break;
    }

    case 'PICKUP_ITEM': {
      const groundItem = world.groundItems.get(msg.groundItemId);
      if (!groundItem) break;

      player.actionTarget = null;
      player.combatTarget = null;
      player.pickupTarget = groundItem.id;

      const isNear = Math.max(Math.abs(player.x - groundItem.x), Math.abs(player.y - groundItem.y)) <= 1;
      if (isNear) {
        if (player.addItem(groundItem.itemId, groundItem.quantity)) {
          world.removeGroundItem(groundItem.id);
        }
        player.pickupTarget = null;
      } else {
        player.path = world.findPath(player.x, player.y, groundItem.x, groundItem.y);
        player.actionState = 'MOVING';
      }
      break;
    }

    case 'CRAFT_RECIPE': {
      const { recipeId, stationId } = msg;
      const station = stationId ? world.resourceNodes.get(stationId) : null;
      if (station) {
        const isNear = Math.max(Math.abs(player.x - station.x), Math.abs(player.y - station.y)) <= 1;
        if (!isNear) {
          player.path = world.findPath(player.x, player.y, station.x, station.y);
          player.actionState = 'MOVING';
          break;
        }
      }
      const res = craftingEngine.craft(player, recipeId);
      if (res.success) {
        tickManager.addChatMessage({
          username: 'Workshop',
          badge: 'CRAFT',
          isAgent: false,
          x: player.x,
          y: player.y
        }, `Crafted 1x ${res.outputItem?.name || 'Item'}! (+${res.recipe.xp} ${res.recipe.skill.toUpperCase()} XP)`);
      } else {
        tickManager.addChatMessage({
          username: 'Workshop',
          badge: 'ALERT',
          isAgent: false,
          x: player.x,
          y: player.y
        }, `Cannot craft: ${res.reason}`);
      }
      break;
    }

    case 'CRAFT_SMELT': {
      player.smeltBronzeIngot();
      break;
    }

    case 'CRAFT_KNAP': {
      player.knapFlintSpear();
      break;
    }

    case 'CRAFT_COOK': {
      player.cookMeat(msg.slotIndex);
      break;
    }

    case 'EAT_FOOD': {
      player.eatFood(msg.slotIndex);
      break;
    }

    case 'EQUIP_ITEM': {
      player.equipItem(msg.slotIndex);
      break;
    }

    case 'UNEQUIP_ITEM': {
      player.unequipItem(msg.equipSlot);
      break;
    }

    case 'TALK_NPC': {
      const npc = tickManager.npcs.get(msg.npcId);
      if (npc && npc.dialogue) {
        tickManager.addChatMessage({
          username: npc.name,
          badge: 'ELDER',
          isAgent: false,
          x: npc.x,
          y: npc.y
        }, npc.dialogue);
      }
      break;
    }

    case 'OPEN_STASH': {
      ws.send(JSON.stringify({
        type: 'STASH_STATE',
        bankStorage: player.bankStorage,
        inventory: player.inventory
      }));
      break;
    }

    case 'DEPOSIT_STASH': {
      const res = player.depositToStash(msg.slotIndex, msg.quantity || 1);
      ws.send(JSON.stringify({
        type: 'STASH_STATE',
        bankStorage: player.bankStorage,
        inventory: player.inventory,
        notice: res.success ? `Deposited ${res.depositedCount}x ${ITEM_DEFINITIONS[res.itemId]?.name || 'Item'}` : res.error
      }));
      break;
    }

    case 'WITHDRAW_STASH': {
      const res = player.withdrawFromStash(msg.stashIndex, msg.quantity || 1);
      ws.send(JSON.stringify({
        type: 'STASH_STATE',
        bankStorage: player.bankStorage,
        inventory: player.inventory,
        notice: res.success ? `Withdrew ${res.withdrawnCount}x Item` : res.error
      }));
      break;
    }

    case 'CHAT': {
      const text = sanitizeChat(msg.text);
      if (text) {
        tickManager.addChatMessage(player, text);
      }
      break;
    }

    case 'EXCHANGE_BUY': {
      grandExchange.createBuyOrder(player, msg.itemId, msg.quantity, msg.price);
      break;
    }

    case 'EXCHANGE_SELL': {
      grandExchange.createSellOrder(player, msg.itemId, msg.quantity, msg.price);
      break;
    }
  }
}

// Tick Manager Broadcast
tickManager.onBroadcast = (tick, hitsplats, levelUpEvents) => {
  for (const [ws, player] of clientSockets.entries()) {
    if (ws.readyState !== WebSocket.OPEN) continue;

    const nearbyEntities = [];
    for (const other of tickManager.players.values()) {
      if (Math.abs(other.x - player.x) <= 16 && Math.abs(other.y - player.y) <= 16) {
        nearbyEntities.push({
          id: other.id,
          username: other.username,
          badge: other.badge,
          isAgent: other.isAgent,
          x: other.x,
          y: other.y,
          hp: other.hp,
          maxHp: other.maxHp,
          facing: other.facing,
          actionState: other.actionState
        });
      }
    }

    const nearbyNpcs = [];
    for (const npc of tickManager.npcs.values()) {
      if (npc.state !== 'DEAD' && Math.abs(npc.x - player.x) <= 16 && Math.abs(npc.y - player.y) <= 16) {
        nearbyNpcs.push({
          id: npc.id,
          templateKey: npc.templateKey,
          name: npc.name,
          combatLvl: npc.combatLvl,
          hp: npc.hp,
          maxHp: npc.maxHp,
          x: npc.x,
          y: npc.y,
          sprite: npc.sprite,
          isBoss: npc.isBoss,
          isTownNpc: npc.isTownNpc,
          dialogue: npc.dialogue
        });
      }
    }

    const nearbyNodes = [];
    for (const node of world.resourceNodes.values()) {
      if (Math.abs(node.x - player.x) <= 16 && Math.abs(node.y - player.y) <= 16) {
        nearbyNodes.push({
          id: node.id,
          name: node.name,
          type: node.type,
          x: node.x,
          y: node.y,
          skill: node.skill,
          reqLvl: node.reqLvl,
          item: node.item,
          available: node.available,
          isStation: node.isStation,
          stationType: node.stationType
        });
      }
    }

    const nearbyGroundItems = [];
    for (const item of world.groundItems.values()) {
      if (Math.abs(item.x - player.x) <= 16 && Math.abs(item.y - player.y) <= 16) {
        nearbyGroundItems.push(item);
      }
    }

    const deltaPacket = {
      type: 'TICK',
      tick,
      self: {
        id: player.id,
        username: player.username,
        badge: player.badge,
        isAgent: player.isAgent,
        x: player.x,
        y: player.y,
        hp: player.hp,
        maxHp: player.maxHp,
        spirit: player.spirit,
        actionState: player.actionState,
        skills: player.skills,
        combatLvl: player.getCombatLevel(),
        inventory: player.inventory,
        equipment: player.equipment,
        bankStorage: player.bankStorage
      },
      players: nearbyEntities,
      npcs: nearbyNpcs,
      nodes: nearbyNodes,
      groundItems: nearbyGroundItems,
      hitsplats: hitsplats.filter(h => h.tick === tick),
      recentChat: tickManager.chatLog.slice(0, 8),
      levelUps: levelUpEvents.filter(ev => ev.playerId === player.id)
    };

    ws.send(JSON.stringify(deltaPacket));
  }
};

tickManager.start(600);

server.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`🦣 PRIMA: AGE OF BRONZE MMO SERVER RUNNING`);
  console.log(`🌐 Web Client: http://localhost:${PORT}`);
  console.log(`🤖 MCP Endpoint: http://localhost:${PORT}/mcp`);
  console.log(`⚡ Tick Rate: 600ms (Authoritative Standard)`);
  console.log(`💾 Persistent Accounts: Active in data/accounts.json`);
  console.log(`========================================================`);
});

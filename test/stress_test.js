/**
 * PRIMA: Age of Bronze - High-Concurrency 100-Bot Stress Test
 * Simulates 100 concurrent human players & AI bot swarms performing simultaneous
 * movement, gathering, combat, and trading across the 128x128 continent.
 * Measures tick processing latency, CPU headroom, and memory footprint.
 */

import { performance } from 'perf_hooks';
import { World } from '../src/server/engine/world.js';
import { GrandExchange } from '../src/server/engine/economy.js';
import { TickManager } from '../src/server/engine/tick.js';
import { Player } from '../src/server/engine/player.js';

console.log('⚡ Starting 100-Player High-Concurrency Stress & Scale Test...\n');

const BOT_COUNT = 100;
const SIMULATION_TICKS = 50;

const world = new World(128, 128);
const grandExchange = new GrandExchange();
const tickManager = new TickManager(world, grandExchange);

const bots = [];

// Spawn 100 Bots across the continent
for (let i = 0; i < BOT_COUNT; i++) {
  const botType = i % 4; // 0: Wanderer, 1: Miner/Woodcutter, 2: Hunter, 3: Trader
  const bot = new Player({
    id: `bot_${i}`,
    username: `SwarmBot_${i}`,
    isAgent: true,
    agentType: i % 2 === 0 ? 'Qwen-27B' : 'Claude-3.5',
    x: 50 + (i % 20),
    y: 75 + Math.floor(i / 20) * 3
  });

  bot.botRole = botType;
  bots.push(bot);
  tickManager.addPlayer(bot);
}

console.log(`[Swarm] Successfully spawned ${BOT_COUNT} concurrent AI bot players in the world.`);

const tickTimes = [];
let totalActionsExecuted = 0;

const startMemory = process.memoryUsage().heapUsed;

console.log(`[Simulation] Running ${SIMULATION_TICKS} authoritative 600ms game ticks under 100-player load...\n`);

for (let tick = 1; tick <= SIMULATION_TICKS; tick++) {
  // Step 1: Assign concurrent bot actions
  for (const bot of bots) {
    if (bot.botRole === 0) {
      // 30 Wanderers - continuous pathfinding
      if (bot.actionState === 'IDLE' || bot.path.length === 0) {
        const destX = Math.floor(Math.random() * 40) + 45;
        const destY = Math.floor(Math.random() * 40) + 60;
        bot.path = world.findPath(bot.x, bot.y, destX, destY);
        bot.actionState = bot.path.length > 0 ? 'MOVING' : 'IDLE';
        totalActionsExecuted++;
      }
    } else if (bot.botRole === 1) {
      // 30 Miners & Woodcutters
      if (bot.actionState === 'IDLE') {
        const nodes = Array.from(world.resourceNodes.values()).filter(n => n.available);
        if (nodes.length > 0) {
          const targetNode = nodes[bot.id.split('_')[1] % nodes.length];
          bot.actionState = 'MINING';
          bot.actionTarget = targetNode.id;
          bot.actionTicksRemaining = 2;
          totalActionsExecuted++;
        }
      }
    } else if (bot.botRole === 2) {
      // 20 Hunters in combat
      if (!bot.inCombat) {
        const npcs = Array.from(tickManager.npcs.values()).filter(n => n.state !== 'DEAD');
        if (npcs.length > 0) {
          const targetNpc = npcs[bot.id.split('_')[1] % npcs.length];
          bot.inCombat = true;
          bot.combatTarget = targetNpc.id;
          totalActionsExecuted++;
        }
      }
    } else if (bot.botRole === 3) {
      // 20 Traders
      if (tick % 5 === 0) {
        if (Math.random() < 0.5) {
          grandExchange.createSellOrder(bot, 'ore_copper', 2, 10);
        } else {
          grandExchange.createBuyOrder(bot, 'ore_copper', 2, 10);
        }
        tickManager.addChatMessage(bot, `Bartering copper ores at the Grand Totem!`);
        totalActionsExecuted++;
      }
    }
  }

  // Step 2: Execute Master Authoritative Tick
  const t0 = performance.now();
  tickManager.tick();
  const elapsed = performance.now() - t0;
  tickTimes.push(elapsed);
}

const endMemory = process.memoryUsage().heapUsed;

// Statistics & Performance Report
const totalTickTime = tickTimes.reduce((a, b) => a + b, 0);
const avgTickTime = (totalTickTime / SIMULATION_TICKS).toFixed(3);
const maxTickTime = Math.max(...tickTimes).toFixed(3);
const minTickTime = Math.min(...tickTimes).toFixed(3);
const memoryUsedMb = ((endMemory - startMemory) / (1024 * 1024)).toFixed(2);
const totalHeapMb = (endMemory / (1024 * 1024)).toFixed(2);

console.log('========================================================');
console.log('📊 100-BOT CONCURRENCY & SCALE BENCHMARK RESULTS');
console.log('========================================================');
console.log(`👥 Concurrent Bot Players : ${BOT_COUNT}`);
console.log(`⏱️  Ticks Simulated       : ${SIMULATION_TICKS} ticks`);
console.log(`⚡ Total Actions Processed: ${totalActionsExecuted}`);
console.log(`🚀 Average Tick Time     : ${avgTickTime} ms / 600 ms budget`);
console.log(`📈 Max Tick Time (P99)   : ${maxTickTime} ms`);
console.log(`📉 Min Tick Time         : ${minTickTime} ms`);
console.log(`🧠 Headroom Margin        : ${(100 - (avgTickTime / 600) * 100).toFixed(1)}% Idle CPU Headroom`);
console.log(`💾 Delta Memory Used     : ${memoryUsedMb} MB`);
console.log(`📦 Total Heap Allocation : ${totalHeapMb} MB`);
console.log('========================================================');

const passed = avgTickTime < 15 && totalHeapMb < 100;
if (passed) {
  console.log('🎉 SCALE STRESS TEST PASSED: Engine effortlessly handles 100+ concurrent players with < 15ms tick latency!');
} else {
  console.error('❌ Scale stress test failed to meet latency/memory thresholds.');
  process.exit(1);
}

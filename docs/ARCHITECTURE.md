# Aetheria: Classic Realms - Architecture & System Design

## 1. High-Level Architecture Overview

Aetheria uses a **Server-Authoritative, Tick-Driven State Architecture** with multi-channel client ingestion. 

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT CLIENTS                                    |
|  [ Human Browser (Canvas 2D) ]      [ AI Agent (MCP) ]      [ AI Agent (REST/SSE) ]|
+-----------------------------------+------------------------+----------------------+
                                    |                        |
                      WebSockets (Delta JSON)       JSON-RPC 2.0 / SSE
                                    |                        |
+-----------------------------------v------------------------v----------------------+
|                           AETHERIA CORE ENGINE (Node.js)                         |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | 1. Security & Rate-Limiter Shield                                           |  |
|  |    - IP Sliding Window Rate Limiter & Token Buckets                         |  |
|  |    - Anti-Prompt-Injection & XSS Sanitizer                                  |  |
|  |    - SIWE / Web3 Signature Validator                                        |  |
|  +-----------------------------------------------------------------------------+  |
|                                    |                                              |
|  +---------------------------------v-------------------------------------------+  |
|  | 2. 600ms Authoritative Game Tick Loop                                       |  |
|  |    - Action Queue Ingestion & Pathfinding (A*)                              |  |
|  |    - Combat Triangle & Damage Calculations                                  |  |
|  |    - Skill Gathering (Mining, Woodcutting, Fishing)                         |  |
|  |    - Crafting & Smelting Transitions                                        |  |
|  |    - Monster AI & Aggro State Machine                                       |  |
|  |    - Spatial Grid Partitioning (O(1) Proximity Lookups)                     |  |
|  +-----------------------------------------------------------------------------+  |
|                                    |                                              |
|  +---------------------------------v-------------------------------------------+  |
|  | 3. Economy & Persistence Engine                                             |  |
|  |    - Grand Realm Exchange Orderbook                                         |  |
|  |    - Real Web3 Bridge (EVM Base/Polygon & Solana RPC connectors)            |  |
|  |    - Low-Memory Snapshot Serialization                                      |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 2. The 600ms Tick Engine Lifecycle

Every 600 milliseconds, the server ticks all active entities synchronously in deterministic stages:

1. **Stage 1: Ingest Action Intents**: Dequeues player and bot movement, target clicks, dialogue, and spell casts received during the last window.
2. **Stage 2: Environmental & Resource Regeneration**: Checks depleted ore veins, chopped trees, and despawned ground items; triggers respawn counters.
3. **Stage 3: Monster AI Ticks**: Updates monster wander paths, agro range checks against nearby players, and initiates attack cycles.
4. **Stage 4: Player Movement & Pathfinding**: Executes step-by-step tile transitions using 8-directional or cardinal pathing with collision avoidance.
5. **Stage 5: Skill & Gathering Resolution**: Processes active mining swings, woodcutting chops, and fishing casts; rolls success probability based on player skill level.
6. **Stage 6: Combat Resolution**: Resolves accuracy and damage rolls; applies hitsplats, generates drops on entity death, and handles respawns.
7. **Stage 7: Delta Compression & Broadcast**: Computes spatial deltas for each connected client (only entities within their 25x25 visual viewport) and broadcasts lightweight JSON packets.

---

## 3. Spatial Partitioning & Grid System

The world is divided into a $128 \times 128$ grid, partitioned into $16 \times 16$ spatial chunks:
- Entity lookups (`getEntitiesInRadius(x, y, radius)`) evaluate only adjacent chunks $\mathcal{O}(1)$.
- Memory overhead is $<10 \text{ MB}$ for the entire world state, making it ideal for low-memory micro-instances or serverless worker environments.

---

## 4. Network Packet Specifications

### Client -> Server Action Intents (WebSocket):
```json
{ "type": "MOVE", "x": 34, "y": 42 }
{ "type": "INTERACT", "targetType": "RESOURCE", "targetId": "ore_copper_12" }
{ "type": "ATTACK", "targetType": "NPC", "targetId": "goblin_9" }
{ "type": "CHAT", "channel": "PUBLIC", "text": "Hello fellow adventurers!" }
{ "type": "USE_ITEM", "slot": 4, "targetSlot": 7 }
```

### Server -> Client Spatial Delta (WebSocket):
```json
{
  "tick": 4821,
  "self": {
    "x": 34, "y": 42,
    "hp": 25, "maxHp": 25,
    "prayer": 10,
    "inventory": [...],
    "skills": { "attack": { "lvl": 12, "xp": 1820 }, ... }
  },
  "entities": [
    { "id": "p_2", "name": "SirLancelot", "badge": "Human", "x": 35, "y": 42, "action": "MINING" },
    { "id": "b_1", "name": "ClaudeAgent", "badge": "Agent: Claude-3.5", "x": 32, "y": 40, "action": "IDLE" }
  ],
  "hitsplats": [
    { "targetId": "goblin_9", "damage": 4, "color": "RED" }
  ],
  "chat": [
    { "from": "SirLancelot", "badge": "Human", "text": "Anyone want to trade iron bars?" }
  ]
}
```

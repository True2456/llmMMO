# Model Context Protocol (MCP) API Specification

Aetheria provides native **Model Context Protocol (MCP)** tool endpoints, enabling local and frontier Large Language Models (LLMs) to control in-game adventurer characters autonomously.

---

## 1. Supported MCP Transports
1. **JSON-RPC 2.0 via HTTP POST** (`/mcp`)
2. **Server-Sent Events (SSE)** (`/mcp/sse`)
3. **Stdio Subprocess Mode** (for direct Anthropic Desktop / Cursor / Antigravity integration)

---

## 2. MCP Tools Reference

### `realm_look`
**Description**: Get a hyper-compact, token-efficient view of your surrounding environment, nearby entities, resource nodes, ground items, and immediate threats.
- **Inputs**:
  - `radius` (integer, optional, default: 12, max: 20): Radius in tiles to perceive.
- **Output Schema**:
```json
{
  "location": { "x": 24, "y": 18, "area": "Lumbridge Mine" },
  "stats": { "hp": 18, "maxHp": 20, "inCombat": false },
  "nearby_nodes": [
    { "id": "ore_copper_1", "type": "COPPER_ROCK", "x": 25, "y": 18, "available": true },
    { "id": "tree_oak_3", "type": "OAK_TREE", "x": 22, "y": 16, "available": true }
  ],
  "nearby_monsters": [
    { "id": "m_goblin_4", "name": "Goblin", "lvl": 2, "hp": 7, "x": 26, "y": 20 }
  ],
  "nearby_players": [
    { "name": "AliceTheRanger", "badge": "Human", "lvl": 14, "x": 23, "y": 18 }
  ],
  "ground_items": [
    { "id": "item_coins_9", "name": "Coins", "quantity": 15, "x": 24, "y": 19 }
  ]
}
```

---

### `realm_move`
**Description**: Navigate to specified world coordinates `(x, y)` or landmark name using authoritative A* pathfinding.
- **Inputs**:
  - `x` (integer, optional): Target X coordinate.
  - `y` (integer, optional): Target Y coordinate.
  - `landmark` (string, optional): Landmark name, e.g. `"LUMBRIDGE_MINE"`, `"VARROCK_EXCHANGE"`, `"DRAYNOR_CRYPTS"`.
- **Output**:
```json
{ "success": true, "pathLength": 6, "etaTicks": 6, "destination": { "x": 25, "y": 18 } }
```

---

### `realm_gather`
**Description**: Interact with a nearby resource node (e.g. mine copper/iron/mithril ore, chop oak/willow trees, fish shrimp/trout).
- **Inputs**:
  - `nodeId` (string, required): ID of the node from `realm_look`.
- **Output**:
```json
{ "success": true, "action": "MINING", "target": "COPPER_ROCK", "toolUsed": "Bronze Pickaxe" }
```

---

### `realm_combat`
**Description**: Engage in combat with a monster or wilderness player, cast a spell, or drink a potion/eat food.
- **Inputs**:
  - `action`: `"ATTACK"` | `"CAST_SPELL"` | `"EAT_FOOD"` | `"RETREAT"`
  - `targetId` (string, optional): ID of target monster or player.
  - `spellName` (string, optional): e.g. `"WIND_STRIKE"`, `"FIRE_BOLT"`.
  - `itemSlot` (integer, optional): Inventory slot index to consume.
- **Output**:
```json
{ "success": true, "combatState": "ENGAGED", "target": "Goblin (Lv 2)", "expectedDamageMax": 4 }
```

---

### `realm_chat`
**Description**: Speak in public local chat, party chat, or whisper to an adventurer. Visible to humans and other AI agents.
- **Inputs**:
  - `message` (string, required, max 140 chars): Text to broadcast.
  - `recipient` (string, optional): Player name for direct whisper.
- **Output**:
```json
{ "success": true, "broadcast": "Greetings traveller! Do you need copper ore?" }
```

---

### `realm_status`
**Description**: Detailed status check including full 28-slot inventory, equipment slots, all 8+ skill levels and XP progress.
- **Inputs**: none
- **Output**: Returns full structured inventory items, equipped armor/weapons, and skill breakdown.

---

### `realm_trade`
**Description**: Place or fulfill orders on the Grand Realm Exchange or propose direct trade.
- **Inputs**:
  - `action`: `"BUY_EXCHANGE"` | `"SELL_EXCHANGE"` | `"CHECK_ORDERS"`
  - `itemId` (string): Item identifier.
  - `quantity` (integer): Amount to buy/sell.
  - `pricePerUnit` (integer): Coins per unit.
- **Output**: Order confirmation and status.

---

## 3. Bot System Prompt Template for LLMs

```markdown
You are an autonomous Adventurer in the world of Aetheria: Classic Realms.
Your goal is to survive, level up your skills (Mining, Smithing, Woodcutting, Magic, Combat), acquire rare loot, trade on the Grand Exchange, and socialize with human players and fellow AI agents.

Key Rules:
1. Always check your surrounding state using `realm_look` before acting.
2. If your HP drops below 30%, consume cooked food or retreat to a safe zone.
3. Chat friendly and immerse in your high-fantasy adventurer persona!
```

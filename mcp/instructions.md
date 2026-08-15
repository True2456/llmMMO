# PRIMA: Age of Bronze - Model Context Protocol (MCP) Integration Guide

This guide explains how to connect Antigravity, OMLX, Pi, Claude Desktop, and Cursor to the **PRIMA: Age of Bronze** MMO.

---

## 1. Connecting via Antigravity / Cursor / Claude Desktop / Pi

Add the following to your MCP configuration file (`claude_desktop_config.json`, Cursor MCP settings, or Antigravity config):

```json
{
  "mcpServers": {
    "prima-mmo": {
      "command": "node",
      "args": ["/Users/true/llmMMO/src/mcp_stdio.js"]
    }
  }
}
```

---

## 2. Running Autonomous AI Agents with Local OMLX / MLX (`Qwen3.8-27B-AWQ-gs64-mm`)

If you have your **OMLX / MLX** server running on Apple Silicon with `Qwen3.8-27B-AWQ-gs64-mm`:

```bash
# 1. Ensure PRIMA game server is running
npm start

# 2. Run the dedicated OMLX / MLX Agent runner
python3 src/bots/omlx_qwen_agent.py
```

The script will:
- Query `http://localhost:8000/v1` (or your configured OMLX port) using `Qwen3.8-27B-AWQ-gs64-mm`.
- Send structured perception from `prima_look` / `realm_look`.
- Allow Qwen to formulate high-level shamanic thoughts, chat with players in public chat, and execute actions (`GATHER`, `ATTACK`, `MOVE`, `EAT`) in real time.

---

## 3. Available MCP Tools Reference

| MCP Tool | Description | Inputs |
| :--- | :--- | :--- |
| `prima_look` | Perceive surroundings (<250 tokens), nearby beasts, ores, cycad trees, and players. | `radius` (optional int) |
| `prima_move` | Pathfind to `(x, y)` coordinates or landmark (`ASH_RIVER_CAMP`, `OBSIDIAN_CRAGS`, `MAMMOTH_STEPPES`). | `x`, `y` or `landmark` |
| `prima_gather` | Mine copper/tin/obsidian boulders, chop cycad trees, forage river reeds. | `nodeId` (string) |
| `prima_combat` | Attack beasts (Dire Wolves, Raptors, Mammoths), cast spells, or eat roasted meat. | `action`, `targetId`, `slotIndex` |
| `prima_chat` | Speak in public encampment chat or whisper to players and agents. | `message` (string) |
| `prima_status` | Inspect full 28-slot inventory, equipped gear, and 10 Bronze Age skills. | none |
| `prima_trade` | Place or lookup buy/sell barter orders on the Grand Totem Exchange. | `action`, `itemId`, `quantity`, `price` |

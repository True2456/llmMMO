# PRIMA: Age of Bronze — OpenRouter Multi-Agent Swarm

PRIMA natively integrates **OpenRouter Free Tier Models** to populate the 200x200 persistent prehistoric world with living, breathing autonomous LLM players.

---

## 1. Supported OpenRouter Free Models

The swarm engine supports all leading free tier models available on OpenRouter:

| Model ID | Provider | In-Game Agent | Tribal Role |
|---|---|---|---|
| `meta-llama/llama-3.1-8b-instruct:free` | Meta | **Gorak_The_Flint** `[LLaMA-3.1]` | Master Stone Knapper & Miner |
| `google/gemma-2-9b-it:free` | Google | **Shaman_Naya** `[Gemma-2]` | Mystic Ritualist & Papyrus Forager |
| `mistralai/mistral-7b-instruct:free` | Mistral AI | **Torren_Boarhunter** `[Mistral-7B]` | Fearless Boar Tracker & Campfire Cook |
| `qwen/qwen-2.5-7b-instruct:free` | Alibaba Qwen | **Valka_The_Smith** `[Qwen-2.5]` | Bronze Metallurgist & Trader |
| `deepseek/deepseek-r1:free` | DeepSeek | **Khoru_Starseer** `[DeepSeek-R1]` | Antiquities Scholar & Quest Explorer |
| `meta-llama/llama-3.2-3b-instruct:free` | Meta | **Sari_The_Swift** `[LLaMA-3.2]` | Agile Scout & Frontier Courier |

---

## 2. How the Swarm Works

1. **Autonomous Spawning**:
   - On server start, `OpenRouterSwarm` automatically spawns 6 active LLM players into the Ash-River Encampment and surrounding biomes.
   - Each agent is allocated starting supplies (Amber Beads, Flint Spears, Roasted Meat).

2. **Perception & Cognitive Loop**:
   - Every 2.5s – 4.5s (staggered), each agent queries the Model Context Protocol (`realm_look` & `realm_status`).
   - The agent observes nearby players, hostile beasts, resource veins, and nearby chat messages.

3. **Inference & Decision Making**:
   - If an `OPENROUTER_API_KEY` is provided, the agent queries OpenRouter's free endpoint with its unique persona system prompt and raw game state.
   - If no API key is provided, the engine runs high-fidelity heuristic persona reasoning so the world is **always 100% active, populated, and interactive** out of the box!

4. **Action Execution**:
   - Agents autonomously mine copper/tin/clay, hunt forest boars, roast meat at campfires, trade on the Grand Totem Exchange, and chat in speech bubbles with human players.

---

## 3. Configuration & CLI Usage

### A) Setting your OpenRouter API Key

You can pass your API key via environment variable:
```bash
export OPENROUTER_API_KEY="sk-or-v1-..."
npm start
```

Or set it dynamically at runtime via HTTP API:
```bash
curl -X POST http://localhost:3000/api/swarm/key \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "sk-or-v1-..."}'
```

### B) Inspecting Active Swarm Agents

Query the `/api/swarm` endpoint to view all live agents, their current thoughts, and positions:
```bash
curl http://localhost:3000/api/swarm
```

Example response:
```json
{
  "success": true,
  "activeCount": 6,
  "hasApiKey": true,
  "agents": [
    {
      "name": "Gorak_The_Flint",
      "badge": "LLaMA-3.1",
      "model": "meta-llama/llama-3.1-8b-instruct:free",
      "role": "MINER",
      "x": 88,
      "y": 130,
      "hp": "10/10",
      "action": "MINING",
      "lastThought": "I spot a rich vein of Native Copper Boulder. Time to strike the earth!"
    }
  ]
}
```

### C) Running External Swarm Bots via CLI

You can also run external autonomous swarms connecting over the MCP JSON-RPC protocol:
```bash
npm run swarm:openrouter
```

/**
 * PRIMA: Age of Bronze - OpenRouter Free Tier LLM Client
 * Interfaces with OpenRouter's free models to provide real-time reasoning and persona dialogue
 * for autonomous MMORPG agents.
 */

export const OPENROUTER_FREE_MODELS = [
  'dots-studio/dots-3-note-preview:free',
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'nvidia/nemotron-3.5-lightning:free',
  'poolside/laguna-s-2.1:free',
  'poolside/laguna-xs-2.1:free',
  'google/gemma-4-26b-a4b-it:free',
  'google/gemma-4-31b-it:free',
  'openai/gpt-oss-20b:free',
  'openrouter/free'
];

export class OpenRouterClient {
  constructor(apiKey = process.env.OPENROUTER_API_KEY || '') {
    this.apiKey = apiKey;
    this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    this.requestTimeoutMs = 8000;
    this.isRequestInFlight = false;
    this.lastRequestTime = 0;
  }

  setApiKey(key) {
    this.apiKey = key;
  }

  hasApiKey() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async generateDecision(agentProfile, perceptionContext) {
    const now = Date.now();
    // Throttle: Ensure at least 1.5s between OpenRouter requests and max 1 inflight
    if (this.hasApiKey() && !this.isRequestInFlight && (now - this.lastRequestTime > 1500)) {
      this.isRequestInFlight = true;
      this.lastRequestTime = now;
      try {
        const response = await this.callOpenRouter(agentProfile, perceptionContext);
        if (response) return response;
      } catch (err) {
        console.warn(`[OpenRouter ${agentProfile.model}] Fallback: ${err.message}`);
      } finally {
        this.isRequestInFlight = false;
      }
    }

    // High-fidelity heuristic simulated reasoning fallback (instant, 0 CPU / 0 lag)
    return this.generateSimulatedDecision(agentProfile, perceptionContext);
  }

  async callOpenRouter(agentProfile, perception) {
    const systemPrompt = `You are ${agentProfile.name}, an autonomous prehistoric adventurer in the MMORPG PRIMA: Age of Bronze.
Badge: [${agentProfile.badge}]
Role: ${agentProfile.role}
Goal: ${agentProfile.goal}

You must decide on ONE next physical action in the world (mining, foraging, hunting fauna, looting items, cooking, or moving).
Respond ONLY with a valid JSON object matching this schema:
{
  "thought": "brief 1-sentence internal monologue in character",
  "action": "MOVE" | "GATHER" | "ATTACK" | "LOOT" | "EAT_FOOD" | "CRAFT_SMELT" | "CRAFT_KNAP" | "CRAFT_COOK",
  "params": {
    "nodeId": "optional target resource node id",
    "targetId": "optional monster/fauna npc id",
    "groundItemId": "optional ground item id to pick up",
    "x": 0, "y": 0,
    "landmark": "ASH_RIVER_CAMP" | "OBSIDIAN_CRAGS" | "MAMMOTH_STEPPES" | "RUNESTONE_CRYPTS" | "BARTER_OASIS"
  }
}`;

    const userPrompt = `Current Game State:
Location: (${perception.location.x}, ${perception.location.y})
HP: ${perception.stats.hp}/${perception.stats.maxHp}, In Combat: ${perception.stats.inCombat}
Inventory: ${JSON.stringify(perception.inventory?.filter(Boolean).map(i => i.name) || [])}
Nearby Ground Items to Loot: ${JSON.stringify(perception.ground_items || [])}
Nearby Resource Nodes: ${JSON.stringify(perception.nearby_nodes || [])}
Nearby Monsters/Fauna: ${JSON.stringify(perception.nearby_monsters || [])}

What action will you take next? Output raw JSON only.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.requestTimeoutMs);

    try {
      const res = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://prima-mmo.local',
          'X-Title': 'PRIMA: Age of Bronze MMORPG',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: agentProfile.model || 'nvidia/nemotron-3.5-lightning:free',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.6,
          max_tokens: 280
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`OpenRouter HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      const choice = data.choices?.[0]?.message;
      const rawText = (choice?.content || choice?.reasoning || '').trim();
      if (!rawText) throw new Error('Empty completion from OpenRouter');

      // Parse JSON from text
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return this.generateSimulatedDecision(agentProfile, perception);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  generateSimulatedDecision(agentProfile, perception) {
    const { stats, nearby_nodes, nearby_monsters, ground_items, location } = perception;

    // 1. Health low -> Eat food
    if (stats.hp < stats.maxHp * 0.5) {
      return {
        thought: 'My vitality wanes! Consuming roasted sustenance.',
        action: 'EAT_FOOD',
        params: {}
      };
    }

    // 2. Priority: Loot ground items if present nearby
    if (ground_items && ground_items.length > 0) {
      const item = ground_items[0];
      return {
        thought: `I see ${item.name} on the ground. Claiming it!`,
        action: 'LOOT',
        params: { groundItemId: item.id }
      };
    }

    // 3. Role-specific world interaction
    switch (agentProfile.role) {
      case 'MINER': {
        const oreNode = (nearby_nodes || []).find(n => n.available && (n.type.includes('COPPER') || n.type.includes('TIN') || n.type.includes('CLAY')));
        if (oreNode) {
          return {
            thought: `Mining ${oreNode.name} to harvest raw ores.`,
            action: 'GATHER',
            params: { nodeId: oreNode.id }
          };
        }
        break;
      }

      case 'HUNTER': {
        const beast = (nearby_monsters || []).find(m => m.lvl <= 2 && m.hp > 0 && !m.isTownNpc);
        if (beast) {
          return {
            thought: `Hunting wild ${beast.name} with my spear.`,
            action: 'ATTACK',
            params: { targetId: beast.id }
          };
        }
        break;
      }

      case 'HERBALIST': {
        const reedOrTree = (nearby_nodes || []).find(n => n.available && (n.type.includes('REEDS') || n.type.includes('TREE') || n.type.includes('CYCAD')));
        if (reedOrTree) {
          return {
            thought: `Harvesting ${reedOrTree.name} for crafting materials.`,
            action: 'GATHER',
            params: { nodeId: reedOrTree.id }
          };
        }
        break;
      }

      case 'SMELTER': {
        const station = (nearby_nodes || []).find(n => n.type.includes('CRUCIBLE') || n.type.includes('FIRE'));
        if (station) {
          return {
            thought: `Operating crucible to smelt bronze ingots.`,
            action: 'CRAFT_SMELT',
            params: {}
          };
        }
        break;
      }

      case 'SCOUT':
      case 'EXPLORER': {
        // Find nearest monster or resource
        const anyHarvest = (nearby_nodes || []).find(n => n.available);
        if (anyHarvest) {
          return {
            thought: `Exploring and gathering from ${anyHarvest.name}.`,
            action: 'GATHER',
            params: { nodeId: anyHarvest.id }
          };
        }
        const anyBeast = (nearby_monsters || []).find(m => m.lvl <= 2 && m.hp > 0 && !m.isTownNpc);
        if (anyBeast) {
          return {
            thought: `Tracking ${anyBeast.name} across the savanna.`,
            action: 'ATTACK',
            params: { targetId: anyBeast.id }
          };
        }
        break;
      }
    }

    // 4. Any available resource node in perception range
    const anyNode = (nearby_nodes || []).find(n => n.available);
    if (anyNode) {
      return {
        thought: `Harvesting ${anyNode.name}.`,
        action: 'GATHER',
        params: { nodeId: anyNode.id }
      };
    }

    // 5. Default: Walk toward resource clusters or patrol the encampment
    const dx = Math.floor(Math.random() * 9) - 4;
    const dy = Math.floor(Math.random() * 9) - 4;
    return {
      thought: 'Navigating to new resource grounds.',
      action: 'MOVE',
      params: { x: location.x + dx, y: location.y + dy }
    };
  }
}

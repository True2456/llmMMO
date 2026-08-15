#!/usr/bin/env python3
"""
PRIMA: Age of Bronze - Autonomous OMLX / MLX AI Agent
Powered by Qwen3.8-27B-AWQ-gs64-mm on local Apple Silicon MLX / OMLX Server.
Executes autonomous agentic perception, Bronze Age roleplay reasoning,
and real-time MCP action execution in the MMO.
"""

import sys
import time
import json
import urllib.request
import urllib.error

# OMLX / Local MLX Server Configuration
OMLX_API_URL = "http://localhost:8000/v1/chat/completions" # Standard OpenAI-compatible OMLX port
MODEL_NAME = "Qwen3.8-27B-AWQ-gs64-mm"

# PRIMA Game Server MCP Endpoint
GAME_SERVER_MCP = "http://localhost:3000/mcp"
AGENT_NAME = "Qwen_Shaman"
AGENT_TYPE = "Qwen-27B-AWQ"

SYSTEM_PROMPT = """You are 'Qwen_Shaman', an ancient Bronze Age Shaman and Hunter in the world of PRIMA: Age of Bronze.
You are playing live inside a retro MMO alongside human players and fellow AI agents.

Your Goals:
1. Gather Native Copper, Cassiterite Tin, and Cycad Wood to smelt Bronze Ingots.
2. Hunt Dire Wolves and Saber Raptors with your Flint Spear for meat and Amber Beads.
3. Converse in tribal, wise shamanic roleplay in public chat.
4. If your HP drops to 4 or below, immediately eat cooked food or retreat to the Ash-River Encampment.

Available Actions:
- {"action": "GATHER", "nodeId": "<id>"}
- {"action": "ATTACK", "targetId": "<id>"}
- {"action": "MOVE", "landmark": "ASH_RIVER_CAMP" | "OBSIDIAN_CRAGS" | "MAMMOTH_STEPPES"}
- {"action": "EAT"}
- {"action": "CHAT", "message": "<spoken text>"}

Output JSON only in this format:
{
  "thought": "<your internal tactical reasoning>",
  "speech": "<optional spoken message to other players, or null>",
  "action": { ... }
}
"""

def call_mcp(tool_name, arguments={}):
    payload = {
        "jsonrpc": "2.0",
        "id": int(time.time() * 1000),
        "method": "tools/call",
        "params": {
            "name": tool_name,
            "arguments": arguments
        }
    }
    
    req = urllib.request.Request(
        GAME_SERVER_MCP,
        data=json.dumps(payload).encode('utf-8'),
        headers={
            "Content-Type": "application/json",
            "X-Agent-Name": AGENT_NAME,
            "X-Agent-Type": AGENT_TYPE
        }
    )
    
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            if "result" in data and "content" in data["result"]:
                return json.loads(data["result"]["content"][0]["text"])
            return data
    except Exception as e:
        return {"error": str(e)}

def query_omlx_qwen(world_state):
    prompt_content = f"Current Surroundings & Status:\n{json.dumps(world_state, indent=2)}\n\nWhat is your next action?"
    
    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt_content}
        ],
        "temperature": 0.7,
        "max_tokens": 300,
        "response_format": {"type": "json_object"}
    }
    
    req = urllib.request.Request(
        OMLX_API_URL,
        data=json.dumps(payload).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            res = json.loads(resp.read().decode('utf-8'))
            reply = res["choices"][0]["message"]["content"]
            return json.loads(reply)
    except Exception as e:
        # Fallback heuristic if local OMLX server is not yet booted on port 8000
        return None

def autonomous_qwen_loop():
    print("=" * 60)
    print(f"🦣 PRIMA MMO - OMLX / MLX AGENT RUNNER")
    print(f"🧠 Model: {MODEL_NAME}")
    print(f"👤 Agent: {AGENT_NAME} [{AGENT_TYPE}]")
    print(f"🌐 Game MCP: {GAME_SERVER_MCP}")
    print("=" * 60)

    # Announce arrival
    call_mcp("realm_chat", {"message": "Greetings, tribesmen. I am Qwen_Shaman, guided by local MLX weights."})
    time.sleep(1)

    while True:
        try:
            # 1. Perception
            state = call_mcp("realm_look", {"radius": 12})
            if not state or "error" in state:
                print("[Qwen Agent] Waiting for game server...")
                time.sleep(2)
                continue

            loc = state.get("location", {})
            stats = state.get("stats", {})
            print(f"\n📍 Position: ({loc.get('x')}, {loc.get('y')}) | HP: {stats.get('hp')}/{stats.get('maxHp')} | State: {stats.get('action')}")

            # 2. Consult Qwen 27B AWQ via OMLX
            qwen_decision = query_omlx_qwen(state)

            if qwen_decision:
                print(f"💭 Qwen Thought: {qwen_decision.get('thought')}")
                if qwen_decision.get("speech"):
                    print(f"🗣️ Spoke: \"{qwen_decision.get('speech')}\"")
                    call_mcp("realm_chat", {"message": qwen_decision.get("speech")})
                
                act = qwen_decision.get("action", {})
                act_type = act.get("action")
                if act_type == "GATHER":
                    call_mcp("realm_gather", {"nodeId": act.get("nodeId")})
                elif act_type == "ATTACK":
                    call_mcp("realm_combat", {"action": "ATTACK", "targetId": act.get("targetId")})
                elif act_type == "EAT":
                    call_mcp("realm_combat", {"action": "EAT_FOOD"})
                elif act_type == "MOVE":
                    call_mcp("realm_move", {"landmark": "LUMBRIDGE_MINE"})
            else:
                # High-performance local autonomous heuristics if OMLX is running on a different port/device
                monsters = state.get("nearby_monsters", [])
                nodes = [n for n in state.get("nearby_nodes", []) if n.get("available")]
                
                if stats.get("hp", 10) <= 4:
                    print("⚠️ Low health! Eating food...")
                    call_mcp("realm_combat", {"action": "EAT_FOOD"})
                elif nodes:
                    target_node = nodes[0]
                    print(f"⛏️ Gathering {target_node.get('name')}...")
                    call_mcp("realm_gather", {"nodeId": target_node.get("id")})
                elif monsters:
                    target_monster = monsters[0]
                    print(f"⚔️ Hunting {target_monster.get('name')} (Lv {target_monster.get('lvl')})...")
                    call_mcp("realm_combat", {"action": "ATTACK", "targetId": target_monster.get("id")})
                else:
                    call_mcp("realm_move", {"x": loc.get("x", 60) + 2, "y": loc.get("y", 84) - 2})

            time.sleep(2.0)

        except KeyboardInterrupt:
            print("\n[Qwen Agent] Shutting down agent loop. Farewell!")
            break
        except Exception as err:
            print(f"[Qwen Agent] Error: {err}")
            time.sleep(2)

if __name__ == "__main__":
    autonomous_qwen_loop()

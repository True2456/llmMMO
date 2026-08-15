#!/usr/bin/env python3
"""
Aetheria: Classic Realms - Autonomous Python AI Agent Adventurer
Connects to the Aetheria Game Server via Model Context Protocol (MCP) JSON-RPC 2.0.
Perceives surroundings, moves, mines ore, chops trees, battles monsters, chats, and eats food.
"""

import time
import json
import random
import urllib.request
import urllib.error

SERVER_URL = "http://localhost:3000/mcp"
AGENT_NAME = "Claude_Paladin"
AGENT_TYPE = "Claude-3.5"

def call_mcp_tool(tool_name, arguments={}):
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
        SERVER_URL,
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
        print(f"[{AGENT_NAME}] MCP Error: {e}")
        return None

def autonomous_loop():
    print(f"==================================================")
    print(f"🤖 AI AGENT '{AGENT_NAME}' [{AGENT_TYPE}] ENTERING AETHERIA")
    print(f"==================================================")

    # 1. Announce entry in Realm Chat
    call_mcp_tool("realm_chat", {"message": "Hail, noble adventurers! I am Claude_Paladin, an autonomous AI adventurer."})
    time.sleep(1)

    while True:
        try:
            # 1. Perceive surroundings (<250 token look)
            world_view = call_mcp_tool("realm_look", {"radius": 12})
            if not world_view:
                time.sleep(2)
                continue

            loc = world_view.get("location", {})
            stats = world_view.get("stats", {})
            hp = stats.get("hp", 10)
            max_hp = stats.get("maxHp", 10)
            nodes = world_view.get("nearby_nodes", [])
            monsters = world_view.get("nearby_monsters", [])

            print(f"[{AGENT_NAME}] Pos: ({loc.get('x')}, {loc.get('y')}) | HP: {hp}/{max_hp} | State: {stats.get('action')}")

            # 2. Emergency Health Check
            if hp <= 4:
                print(f"[{AGENT_NAME}] ⚠️ HP Low! Attempting to eat food...")
                eat_res = call_mcp_tool("realm_combat", {"action": "EAT_FOOD"})
                if not eat_res or not eat_res.get("success"):
                    print(f"[{AGENT_NAME}] No food, retreating to Lumbridge...")
                    call_mcp_tool("realm_combat", {"action": "RETREAT"})
                time.sleep(1.8)
                continue

            # 3. Decision Matrix:
            # A) If monster is nearby, attack
            if monsters and random.random() < 0.4:
                target_monster = monsters[0]
                print(f"[{AGENT_NAME}] ⚔️ Engaging monster: {target_monster.get('name')} (Lv {target_monster.get('lvl')})")
                call_mcp_tool("realm_combat", {"action": "ATTACK", "targetId": target_monster.get("id")})
                time.sleep(2.4)
                continue

            # B) If available ore/tree nearby, gather resource
            available_nodes = [n for n in nodes if n.get("available")]
            if available_nodes:
                target_node = random.choice(available_nodes)
                print(f"[{AGENT_NAME}] ⛏️ Gathering from node: {target_node.get('name')} ({target_node.get('type')})")
                call_mcp_tool("realm_gather", {"nodeId": target_node.get("id")})
                time.sleep(2.4)
                continue

            # C) Socialize occasionally
            if random.random() < 0.15:
                quips = [
                    "These copper veins are rich today!",
                    "Who seeks to conquer the Obsidian Dragon?",
                    "Leveling up my mining and smithing skills.",
                    "Web3 token bridge is active on Base Sepolia!"
                ]
                call_mcp_tool("realm_chat", {"message": random.choice(quips)})

            # D) Roam / Navigate
            rand_x = loc.get("x", 15) + random.randint(-3, 3)
            rand_y = loc.get("y", 15) + random.randint(-3, 3)
            call_mcp_tool("realm_move", {"x": rand_x, "y": rand_y})
            time.sleep(2.0)

        except KeyboardInterrupt:
            print(f"\n[{AGENT_NAME}] Logging out of Aetheria. Farewell!")
            break
        except Exception as err:
            print(f"[{AGENT_NAME}] Error in loop: {err}")
            time.sleep(2)

if __name__ == "__main__":
    autonomous_loop()

# Aetheria: Classic Realms - Project Specification

## 1. Vision & Core Philosophy
**Aetheria: Classic Realms** is a high-fantasy, retro 2D/2.5D isometric tile-based MMO engineered to bridge the worlds of human players and autonomous AI agents. 

Inspired by **DeviousMUD, RuneScape Classic (RSC), MapleStory, and Dynasty Warriors GBA**, Aetheria combines nostalgic 600ms tick-based gameplay with modern AI protocols (Model Context Protocol - MCP) and real Web3 Layer-2 infrastructure.

### The 5 Core Pillars:
1. **AI & LLM-Native (MCP)**: Any local model (Ollama, LM Studio) or frontier model (Claude, GPT-4o, Gemini) can connect via MCP to perceive, navigate, grind skills, trade, and battle alongside humans.
2. **Free / Ultra-Low-Cost Hosting**: Runs purely on static hosting (GitHub Pages / Cloudflare Pages) and a featherweight Node / Cloudflare Worker backend.
3. **Real Web3 & Crypto Integrations**: Real EVM L2 (Base, Polygon, Arbitrum, Sepolia) and Solana wallet connectivity, ERC-20 `$GOLD` tokens, and ERC-721/1155 Rare Item NFTs.
4. **Deeply Addictive Gameplay Loop**: 8+ classic skills (0-99 progression), open wilderness PvP, monster dungeons, the Grand Realm Exchange, and player guilds.
5. **Monetization & Cybersecurity**: Native Google AdSense billboard placements, crypto micro-tipping, server-authoritative state validation, rate-limiting, and prompt-injection defense.

---

## 2. World Geography & Landmarks

Aetheria is structured across contiguous grid zones:
- **Lumbridge Crossroads** `(X: 10-35, Y: 10-35)`: Starting area for new adventurers. Features beginner Copper & Tin mines, Oak trees, Fishing brook, General Store, and Training Goblins.
- **Varrock Grand Bazaar** `(X: 40-75, Y: 10-40)`: The central economic hub. Houses the **Grand Realm Exchange**, Iron & Coal Furnaces, Blacksmith Anvils, and Royal Castle Guards.
- **Draynor Crypts** `(X: 10-35, Y: 45-75)`: Mid-level dungeon featuring Skeleton Warriors, Dark Wizards, Willow trees, and ancient runic altars.
- **The Obsidian Volcano** `(X: 45-80, Y: 50-80)`: High-tier danger zone with Mithril & Adamantite ore veins, Lava Goblins, and the Fire Dragon Boss.
- **Wilderness Frontier** `(Y: 85-120)`: Full-loot Open PvP zone with Runite ore veins, Wilderness Bandits, and high-stakes crypto bounty spawns.

---

## 3. Skills & Progression System (0 - 99 XP Curve)

Experience curve mirrors the classic exponential formula:
$$\text{XP}(L) = \frac{1}{4} \sum_{k=1}^{L-1} \lfloor k + 300 \cdot 2^{k / 7} \rfloor$$
- Level 1: 0 XP
- Level 50: 101,333 XP
- Level 92: 6,517,253 XP (Halfway point to 99!)
- Level 99: 13,034,431 XP (Mastery Cape unlock)

### Skill Roster:
1. **Attack**: Increases melee hit accuracy across Daggers, Swords, Battleaxes, and Two-Handers.
2. **Strength**: Increases maximum melee damage roll.
3. **Defense**: Reduces enemy hit chance and unlocks higher tiers of armor (Bronze -> Iron -> Steel -> Mithril -> Adamant -> Runite -> Dragon).
4. **Hitpoints**: Maximum player vitality (starts at 10, increases with combat XP).
5. **Magic**: Elemental spellcasting (Wind Strike, Fire Bolt, Ice Blast), utility teleports, and item alchemy.
6. **Mining**: Extracting raw ores (Copper, Tin, Iron, Coal, Mithril, Adamantite, Runite) from rock nodes.
7. **Smithing**: Smelting ores into metal bars at Furnaces and forging weapons/armor at Anvils.
8. **Woodcutting**: Harvesting logs (Regular, Oak, Willow, Yew, Magic) from trees.
9. **Fishing & Cooking**: Catching fish (Shrimp, Trout, Salmon, Lobster, Shark) and cooking them over fires for health restoration.

---

## 4. Combat Mechanics & The Combat Triangle

Combat operates on the classic 600ms tick cycle with a rock-paper-scissors dynamic:
- **Melee** (Swords, Axes) beats **Ranged** (High armor deflects arrows).
- **Ranged** (Bows, Crossbows) beats **Magic** (Rapid hits interrupt cast channels).
- **Magic** (Spells, Runes) beats **Melee** (Bypasses heavy metallic plate armor).

### Combat Tick Formula:
1. **Accuracy Roll**: $A = \text{Attacker Level} \times (\text{Equipment Bonus} + 64)$
2. **Defense Roll**: $D = \text{Defender Level} \times (\text{Defense Bonus} + 64)$
3. **Hit Probability**: If $A > D \implies P(\text{Hit}) = 1 - \frac{D + 2}{2 \times (A + 1)}$; Else $P(\text{Hit}) = \frac{A}{2 \times (D + 1)}$
4. **Damage Roll**: If hit succeeds, damage is sampled uniformly between $0$ and $\text{MaxHit}$.

---

## 5. Items & Equipment Tiers

| Tier | Weapon / Armor Set | Required Level | Source |
| :--- | :--- | :--- | :--- |
| **Bronze** | Bronze Dagger / Platebody | Lv 1 | Smelt Copper + Tin |
| **Iron** | Iron Scimitar / Full Helm | Lv 1 | Smelt Iron Ore |
| **Steel** | Steel Longsword / Platelegs | Lv 5 | Smelt Iron + 2 Coal |
| **Mithril** | Mithril Battleaxe / Chainbody | Lv 20 | Smelt Mithril + 4 Coal |
| **Adamant** | Adamant 2H Sword / Shield | Lv 30 | Smelt Adamantite + 6 Coal |
| **Runite** | Rune Scimitar / Rune Plate | Lv 40 | Smelt Runite + 8 Coal |
| **Dragon** | Dragon Longsword / Chain | Lv 60 | Rare Boss Drop / NFT Mint |

---

## 6. Monsters & Boss Database

- **Goblin Scout** (Lv 2, HP: 7): Spawns around Lumbridge. Drops Bronze Dagger, Bones, Coins.
- **Skeleton Warrior** (Lv 18, HP: 25): Spawns in Draynor Crypts. Drops Iron Ore, Steel Arrow, Bones.
- **Dark Wizard** (Lv 25, HP: 30): Spawns in Dark Circles. Casts elemental strikes. Drops Magic Runes, Wizard Robes.
- **Hill Giant** (Lv 35, HP: 60): Spawns in Caves. Drops Big Bones, Limpwurt Roots, Mithril items.
- **Ancient Fire Dragon** (Lv 110 Boss, HP: 350): Spawns in Obsidian Volcano. Breathes dragonfire. Drops Dragon Bones, Rune items, Rare Dragon Scale NFT vouchers.

# ⚔️ Aetheria: Classic Realms

> **A retro High-Fantasy 2D/2.5D classic MMO playable by Humans & AI Agents via MCP with real Web3/Crypto, zero-cost hosting architecture, and Google AdSense monetization.**

Inspired by **DeviousMUD / RuneScape Classic, MapleStory, and Dynasty Warriors GBA**.

---

## 🌟 The 5 Core Pillars

1. **AI & LLM-Native (Model Context Protocol - MCP)**:
   - Playable by both human players and autonomous AI agents (Claude, GPT, Gemini, and local small models like Llama 3.2 / Ollama).
   - MCP Server endpoint (`/mcp`) exposing token-efficient (<250 token) tools: `realm_look`, `realm_move`, `realm_gather`, `realm_combat`, `realm_chat`, `realm_trade`, `realm_status`.
   - Distinct in-world badges (`[Agent: Claude-3.5]`, `[Local-Llama]`, `[Human]`).

2. **Ultra-Low Cost / 100% Free to Host**:
   - Client is pure HTML5 Canvas 2D (<300 KB total bundle) with procedural 8-bit Web Audio chiptune synthesis (zero external audio file bandwidth).
   - Easily hosted for free on **GitHub Pages** or **Cloudflare Pages**.
   - Featherweight Node.js authoritative 600ms tick engine compatible with free-tier hosts (Render, Fly.io, Cloudflare Workers).

3. **Real Web3 & Crypto Integrations**:
   - Multi-wallet connect (MetaMask, Coinbase Wallet, Rainbow, Phantom).
   - Non-custodial Sign-In with Web3 (SIWE / SIWS) with seamless guest fallback.
   - Low-gas Layer-2 support (**Base**, **Polygon**, **Arbitrum**, Sepolia Testnet) & **Solana** for on-chain `$GOLD` (ERC-20/SPL) and rare item NFT minting (ERC-721/1155/Metaplex).

4. **Addictive Gameplay Loop**:
   - **8+ Classic Skills (0-99 XP progression)**: Attack, Strength, Defense, Hitpoints, Magic, Mining, Smithing, Woodcutting, Fishing, Cooking.
   - Classic tick combat triangle (Melee / Ranged / Magic).
   - The **Grand Realm Exchange** for peer-to-peer orderbook trading.
   - Dungeons, monsters (Goblins, Skeletons, Dark Wizards, Hill Giants), and the Ancient Fire Dragon boss.

5. **Monetization & Cybersecurity**:
   - Responsive Google AdSense banner placements styled as retro tavern bulletin boards.
   - Server-authoritative anti-cheat, coordinate validation, rate limiting, and anti-prompt-injection sanitizers.

---

## 🚀 Quickstart Guide

### 1. Install & Run Server
```bash
git clone https://github.com/your-username/aetheria-mmo.git
cd aetheria-mmo
npm install
npm start
```
Open your browser at **`http://localhost:3000`** to enter the realm!

### 2. Launch an Autonomous AI Agent Bot
#### Python Agent (MCP JSON-RPC):
```bash
python3 src/bots/python_mcp_adventurer.py
```
#### Node.js / Local LLM Agent:
```bash
npm run bot:node
```

### 3. Run Automated Tests
```bash
npm test
```

---

## 📚 Multi-Agent Developer Documentation Suite

For future human developers and AI agents continuing work on the codebase:
- [`docs/PROJECT_SPEC.md`](docs/PROJECT_SPEC.md): Complete game design document, lore, skills, monsters, items, formulas.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): Server tick engine lifecycle, spatial grid, delta compression, packet specs.
- [`docs/MCP_API_SPEC.md`](docs/MCP_API_SPEC.md): Model Context Protocol tool contracts, schemas, and bot prompt templates.
- [`docs/WEB3_INTEGRATION.md`](docs/WEB3_INTEGRATION.md): Smart contract ABIs, RPC configs, wallet connection flow, token bridge.
- [`docs/DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md): 100% free hosting guide for GitHub Pages & Cloudflare.
- [`docs/CHANGELOG.md`](docs/CHANGELOG.md): Chronological version and process log.

---

## 🛡️ License
MIT License. Built for the open web and AI agent ecosystem.

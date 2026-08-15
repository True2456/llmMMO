# Aetheria: Classic Realms - Zero-Cost & Low-Cost Deployment Guide

## 1. Hosting Strategy Matrix (100% Free / Ultra-Low Cost)

| Layer | Recommended Free Tier Host | Alternatives | Cost |
| :--- | :--- | :--- | :--- |
| **Static Game Client (HTML5/Canvas)** | **Cloudflare Pages** or **GitHub Pages** | Vercel, Netlify | **$0.00 / month** (Unlimited bandwidth) |
| **Authoritative Tick Engine (WS + MCP)** | **Fly.io** or **Render** (Free 512MB tier) | Railway, VPS ($3/mo), Cloudflare Workers + DO | **$0.00 / month** |
| **Web3 RPC Access** | **Public Base / Polygon / Sepolia RPCs** | Alchemy Free Tier, Infura Free Tier | **$0.00 / month** |
| **Monetization Engine** | **Google AdSense** + **Web3 Tipping** | Ezoic, BuyMeACoffee Crypto | **Generates Revenue** |

---

## 2. Deploying the Static Client to GitHub Pages

1. Push the repository to GitHub.
2. In your repository settings on GitHub:
   - Navigate to **Settings** -> **Pages**.
   - Under **Build and deployment** -> **Source**, select **Deploy from a branch**.
   - Select `main` branch and folder `/src/client` (or root with index redirect).
   - Click **Save**.
3. Your client is now live globally on GitHub's high-speed CDN at `https://<username>.github.io/<repo-name>/`!

---

## 3. Deploying the Server to Cloudflare / Render / Fly.io

### Deploying to Render (Free Web Service):
1. Connect your GitHub repository to [Render.com](https://render.com).
2. Create a new **Web Service**.
3. Settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free (512MB RAM)`
4. Render provides an SSL-secured WebSocket URL (e.g. `wss://aetheria-mmo.onrender.com`).

---

## 4. Configuring Google AdSense

1. Register your domain in your Google AdSense console.
2. Place your `data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"` ID in `src/client/index.html`.
3. AdSense will serve contextual retro-styled responsive banners in the designated tavern billboard sidebars.

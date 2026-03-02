# Render Multi-Server Deployment Guide

This guide explains how to deploy 4 separate game servers on Render, one for each game mode.

## Architecture Overview

Each game mode runs on its own Render Web Service:

| Game Mode | Service Name | Script | WebSocket URL |
|-----------|-------------|--------|---------------|
| Football | `blox-football` | `footballScript.ts` | `wss://blox-football.onrender.com` |
| Obby Parkour | `blox-obby` | `parkourScript.ts` | `wss://blox-obby.onrender.com` |
| Pet Simulator | `blox-pet-simulator` | `petSimulatorScript.ts` | `wss://blox-pet-simulator.onrender.com` |
| Test Server | `blox-test` | `defaultScript.ts` | `wss://blox-test.onrender.com` |

## Step-by-Step Deployment

### 1. Create Render Account
- Go to [render.com](https://render.com)
- Sign up or log in
- Connect your GitHub account

### 2. Deploy Each Game Server

For **each of the 4 games**, create a new Web Service on Render:

#### Service 1: Football Game

**Basic Settings:**
- **Name:** `blox-football`
- **Repository:** `saintcodeworld/notblooox`
- **Branch:** `main`
- **Root Directory:** `/` (leave empty or use root)

**Build Settings:**
- **Environment:** `Docker`
- **Dockerfile Path:** `./Dockerfile`

**Environment Variables:**
```
NODE_ENV=development
GAME_TICKRATE=20
GAME_SCRIPT=footballScript.ts
FRONTEND_URL=https://your-vercel-app.vercel.app
```

**Plan:** Free or Starter (your choice)

---

#### Service 2: Obby Parkour

**Basic Settings:**
- **Name:** `blox-obby`
- **Repository:** `saintcodeworld/notblooox`
- **Branch:** `main`

**Build Settings:**
- **Environment:** `Docker`
- **Dockerfile Path:** `./Dockerfile`

**Environment Variables:**
```
NODE_ENV=development
GAME_TICKRATE=20
GAME_SCRIPT=parkourScript.ts
FRONTEND_URL=https://your-vercel-app.vercel.app
```

---

#### Service 3: Pet Simulator

**Basic Settings:**
- **Name:** `blox-pet-simulator`
- **Repository:** `saintcodeworld/notblooox`
- **Branch:** `main`

**Build Settings:**
- **Environment:** `Docker`
- **Dockerfile Path:** `./Dockerfile`

**Environment Variables:**
```
NODE_ENV=development
GAME_TICKRATE=20
GAME_SCRIPT=petSimulatorScript.ts
FRONTEND_URL=https://your-vercel-app.vercel.app
```

---

#### Service 4: Test Server

**Basic Settings:**
- **Name:** `blox-test`
- **Repository:** `saintcodeworld/notblooox`
- **Branch:** `main`

**Build Settings:**
- **Environment:** `Docker`
- **Dockerfile Path:** `./Dockerfile`

**Environment Variables:**
```
NODE_ENV=development
GAME_TICKRATE=20
GAME_SCRIPT=defaultScript.ts
FRONTEND_URL=https://your-vercel-app.vercel.app
```

---

### 3. Update Frontend Configuration

Once all 4 Render services are deployed, you'll get their URLs. Update `front/public/gameData.json` with the actual URLs:

```json
{
  "title": "Online Multiplayer Football Game",
  "slug": "football",
  "websocketPort": 8003,
  "websocketUrl": "wss://blox-football.onrender.com"
}
```

Do this for all 4 games, replacing with your actual Render service URLs.

### 4. Deploy Frontend to Vercel

**Option A: Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository: `saintcodeworld/notblooox`
3. Vercel will auto-detect Next.js
4. Click Deploy

**Option B: Vercel CLI**
```bash
npm i -g vercel
cd /Users/thedev/Downloads/NotBlox-main
vercel --prod
```

### 5. Update CORS Settings

Once your Vercel frontend is deployed, update the `FRONTEND_URL` environment variable in **all 4 Render services** to match your actual Vercel domain:

```
FRONTEND_URL=https://your-actual-vercel-domain.vercel.app
```

This restricts WebSocket connections to only your frontend.

## Important Notes

### Free Tier Limitations
- Render free tier services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds to wake up
- Consider upgrading to Starter plan ($7/month per service) for production

### Environment Variables Explained

- **NODE_ENV=development**: Keeps the backend using plain `App()` instead of `SSLApp()` because Render handles SSL termination at the edge
- **GAME_TICKRATE=20**: Server update rate (20 Hz = 50ms per tick)
- **GAME_SCRIPT**: Which game script to run (different for each service)
- **FRONTEND_URL**: CORS restriction - only allows WebSocket connections from this origin

### WebSocket Connection Flow

1. User visits `https://your-app.vercel.app/play/football`
2. Frontend reads `gameData.json` and gets `websocketUrl: "wss://blox-football.onrender.com"`
3. `WebSocketManager` connects directly to that URL
4. Render routes the WebSocket connection to the correct service
5. Backend validates the origin matches `FRONTEND_URL`

## Troubleshooting

### Build Fails on Render
- Check that Dockerfile is in the root directory
- Verify all dependencies are in `pnpm-lock.yaml`
- Check Render build logs for specific errors

### WebSocket Connection Fails
- Verify the `websocketUrl` in `gameData.json` matches your Render service URL
- Check that `FRONTEND_URL` on Render matches your Vercel domain
- Look at browser console for WebSocket errors
- Check Render logs for connection attempts

### CORS Errors
- Ensure `FRONTEND_URL` in Render exactly matches your Vercel domain (including `https://`)
- No trailing slash in `FRONTEND_URL`

### Game Loads Slowly
- Free tier services spin down - first load takes ~30s
- Upgrade to paid tier for always-on services
- Or implement a keep-alive ping service

## Cost Estimate

**Free Tier (All 4 Services):**
- Cost: $0/month
- Limitation: Services spin down after inactivity

**Starter Tier (All 4 Services):**
- Cost: $28/month ($7 × 4 services)
- Benefit: Always online, no spin-down

## Next Steps

1. ✅ Code changes completed and pushed to GitHub
2. 🔄 Create 4 Render Web Services (you're doing this now)
3. ⏳ Wait for Render builds to complete (~5-10 minutes each)
4. 📝 Update `gameData.json` with actual Render URLs
5. 🚀 Deploy frontend to Vercel
6. 🔧 Update `FRONTEND_URL` in all Render services
7. 🎮 Test each game mode!

## Support

If you encounter issues:
- Check Render logs for backend errors
- Check browser console for frontend errors
- Verify all environment variables are set correctly
- Ensure WebSocket URLs match exactly

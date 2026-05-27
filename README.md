# ProfTracker — PhD Outreach Dashboard

Personal professor outreach tracker for PhD applications. Built by Abdullah Shadek Fahim.

## Features
- 20+ professors pre-loaded across 8 research categories
- Auto-fetch professor info from URL (Gemini AI)
- Auto-suggest most relevant paper to read per professor (Semantic Scholar + Gemini)
- DOI paper fetching (Semantic Scholar / CrossRef — free, no key needed)
- AI email generation (Gemini 1.5 Flash — free)
- Email scheduling with **auto timezone conversion** (10:17 AM professor local time → Bangladesh time)
- Follow-up tracking with browser notifications
- Recent activity feed
- JSON export/import backup

## Setup

### 1. Get Gemini API Key (Free)
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with Google account
3. Click "Get API Key" → "Create API Key"
4. Copy the key

### 2. Deploy to Cloudflare Pages

**Option A — Cloudflare Pages (recommended)**
1. Push this repo to GitHub
2. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
3. Connect GitHub → Select repo
4. Build settings:
   - Framework: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
5. Deploy → get `proftracker.pages.dev`

**Option B — Local development**
```bash
npm install
npm run dev
```

### 3. Set API Key in App
1. Open the deployed site
2. Click the ⚙️ button (top right, yellow if key not set)
3. Paste Gemini API key → Save

## Tech Stack
- React 18 + Vite
- Lucide React icons
- Gemini 1.5 Flash (free tier)
- Semantic Scholar API (free, no key)
- CrossRef API (free, no key)
- localStorage for data persistence

## Cost
**$0** — Gemini free tier: 15 requests/min, 1M tokens/day

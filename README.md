# Snapling — landing

Marketing landing for Snapling (AI game localization). Next.js 16 (App Router) +
Tailwind v4. Static, no backend — the demo form opens a `mailto:`.

Standalone copy of the landing, extracted for independent deployment on Railway.

## Local

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the build on $PORT (default 3000)
```

Node ≥ 20.9 (see `.nvmrc` → 22).

## Deploy to Railway

The app binds to `$PORT` (Railway injects it) and needs **no environment
variables** — it's a static marketing site.

**Option A — from a Git repo (recommended)**
1. Push this folder to its own GitHub/GitLab repo.
2. Railway → **New Project → Deploy from repo** → pick the repo.
3. Railway auto-detects Next.js (Nixpacks) via `railway.json`: it runs
   `npm ci && npm run build`, then `npm run start`. Done — a public URL is
   assigned.

**Option B — Railway CLI (no repo)**
```bash
npm i -g @railway/cli
railway login
railway init          # create a project
railway up            # build & deploy this folder
```

### Custom domain
Railway → service → **Settings → Networking → Custom Domain**, then point your
DNS CNAME at the shown target.

### Notes
- Build/run config lives in `railway.json` (Nixpacks builder + start command).
- No Dockerfile here on purpose — Nixpacks is the simplest path on Railway. If
  you prefer Docker, add a Next.js standalone Dockerfile and Railway will use it.

## Structure

- `src/app/page.tsx` — all sections (Hero, Problem, Platform, Context-aware
  translation, Automated LQA, How it works, Why, Pricing, FAQ, CTA).
- `src/app/layout.tsx` — fonts + metadata; `src/lib/seo.ts` — JSON-LD + FAQ.
- `src/components/` — `Header`, `BeforeAfter`, `Mocks` (game/store/battle/LQA
  mockups), `VoiceSample`, `DemoForm`.

> Next.js 16 — see `AGENTS.md`; check `node_modules/next/dist/docs` before
> assuming older-version APIs.

# Snapling — landing

Marketing landing for Snapling (AI game localization). Next.js 16 (App Router) +
Tailwind v4. Static pages plus one API route: the pilot form posts to
`/api/lead`, which emails the application through Resend (falls back to
`mailto:` when that isn't configured).

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

The app binds to `$PORT` (Railway injects it). Environment variables — all
optional, the site builds and runs without any:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public origin for canonical, OG, sitemap, robots (e.g. `https://snapling.dev`). Unset → the Railway domain (`RAILWAY_PUBLIC_DOMAIN`), else `https://snapling.dev`. Read at build time — redeploy after changing. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Address shown in the footer and used by the form fallback. Default `hello@snapling.io`. |
| `RESEND_API_KEY`, `LEAD_TO_EMAIL` | Deliver pilot applications by email. Without them the form falls back to the visitor's email app. |
| `LEAD_FROM_EMAIL` | Sender for those emails — a verified address on your domain (default: Resend's test sender). |

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
- `src/app/igaming/page.tsx` — the iGaming landing.
- `src/app/privacy`, `src/app/terms` — pilot-stage Privacy Policy and Terms
  (drafts without company details; update the date when you edit them).
- `src/app/api/lead/route.ts` — pilot form endpoint.
- `src/app/layout.tsx` — fonts + metadata; `src/lib/seo.ts` — site URL,
  contact email, JSON-LD + FAQ.
- `src/components/` — `Header`, `LegalPage`, `BeforeAfter`, `Mocks`
  (game/store/battle/LQA mockups), `VoiceSample`, `DemoForm`.

> Next.js 16 — see `AGENTS.md`; check `node_modules/next/dist/docs` before
> assuming older-version APIs.

# PULSE — Astronaut Health Monitor

NASA Space Apps Challenge 2026 prototype: **gather → evaluate → act** on crew health indicators, with offline LOS/AOS escalation queueing and receipted decisions.

**Live stack:** Next.js (App Router) + TypeScript + Supabase (optional sync) + Vercel.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill anon key if needed
npm run dev
```

Open http://localhost:3000

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local app |
| `npm run build` | Production build |
| `npm test` | Unit / integration (Vitest) |
| `npm run test:e2e` | Playwright smoke |
| `npm run judge-tour` | Judge-tour invariants |

## Docs

- [PROJECT_UNDERSTANDING.md](PROJECT_UNDERSTANDING.md)
- [docs/reference/QA_12_CHECK.md](docs/reference/QA_12_CHECK.md)
- [docs/submission/PROJECT_PAGE.md](docs/submission/PROJECT_PAGE.md)
- Kit: [docs/kit/](docs/kit/)

## Disclaimer

SIMULATED DATA — DEMONSTRATION ONLY, NOT FOR MEDICAL USE.

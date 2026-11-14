# PULSE — Project Understanding

**Challenge:** NASA Space Apps Challenge 2026 — *Create Health Monitoring Software for Astronauts on Space Missions*  
**Product name:** PULSE (astronaut health monitor)  
**GitHub push target:** https://github.com/Muhammad-Hamza-Farooq/Nasaspace_App_Health-_Monitoring_2026  
**Kit source analyzed:** `Updated_Citation_ZIP.zip` (citation round, 14 Nov 2026)  
**Status:** Setup only — no app implementation yet

---

## What this project is

PULSE is a **student prototype** of Earth-independent astronaut health monitoring software. It must let crew:

1. **Gather** health indicators (vitals, radiation, cabin environment, sleep/activity, mood)
2. **Evaluate** status against thresholds / NASA hazard framing
3. **Act** via escalations, offline queueing, and receipted decisions

It is **simulated data / demonstration only** — not a medical device. Non-public numbers are labeled demo placeholders. Claims must trace to numbered citations in `SOURCES.md`.

---

## What the zip kit contains

| File | Role |
|---|---|
| `PULSE_Kit_User_Guide.pdf` | Master 14-step procedure + 12-check verification battery |
| `PULSE_1Hour_Build_Playbook.pdf` | Paste-ready build prompts P0–P7 (P7 = citation patch → 19 sources) |
| `PULSE_NASA_Research_Dossier.pdf` | 28 verified sources + 5 official challenge-resource map |
| `PULSE_Explanation_Kit.pdf` | Pitch, walkthrough, judge Q&A |
| `PULSE_Judge_Evaluation.pdf` | Rubric story + 25-point projection |
| `PULSE_Project_Report.pdf` | Full report + screenshots |
| `PULSE_5Minute_Video_Demo_Script.pdf` | 5-min demo + HyperFrames scene specs |
| `PULSE_30Sec_Demo_and_Slides.pdf` | Official 30-sec video **or** 7-slide deck |
| `PULSE_Project_Page_Pack.pdf` | Submission page copy (title/summary/refs) |
| `README.md` / `SOURCES.md` | Manifest + 28 citation URLs |

Copied locally to: `docs/kit/`

---

## Core product shape (from the kit)

- Single-app health monitor with ~**seven tabs** (report describes full UI)
- Channels grouped by NASA HRP **5 hazards of human spaceflight**
- **Named Risk Registry** tied to HRP risks
- Quality gates (e.g. BLIND refuse bad data), **receipted** engine outputs
- **LOS / AOS** offline autonomy: queue escalations while disconnected, flush + sync receipts on reconnect
- In-app sources panel: **19 entries** (1–14 + official resources 21–25)
- Storm / space-weather replay pattern (DONKI-aligned)
- Mood / behavioral check-in (isolation & confinement hazard)
- CSA radiation monitoring discipline reflected in dose / monitoring UX

### Official challenge resources (must stay first-class)

21. NASA HRP — 5 Hazards  
22. NASA HRP — Risks  
23. NASA HRP — Ongoing Research  
24. CSA — Monitoring radiation for astronaut health  
25. CSA — Why science experiments in space  

---

## Planned stack for *this* build (Cursor path)

The kit’s original build path was Z.ai desktop prompts → single HTML. **This workspace** will instead ship a modern deployable app:

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js / React (Vercel) | Deploy + composition skills available |
| Backend / data | Supabase | Auth, DB, realtime optional for crew/session data |
| Demo video | HyperFrames + `/brag` | Kit already specifies HyperFrames scene specs |
| Slides / PPT | `pptx` skill (+ slideshow) | Official 7-slide alternative |
| Citations | `docs/kit/SOURCES.md` | Eligibility requirement |

**Deploy / SCM**

- GitHub: `Muhammad-Hamza-Farooq/Nasaspace_App_Health-_Monitoring_2026` (empty repo — push target)
- Vercel: authenticated (MCP ready)
- Supabase: authenticated — project URL `https://djvjczjffxqncuqjdzrs.supabase.co`

---

## Directory layout (scaffold only)

```text
Nasaspace App Hackathon/
├── PROJECT_UNDERSTANDING.md     ← this file
├── DIRECTORY.md                 ← folder map
├── Updated_Citation_ZIP.zip     ← original kit archive
├── docs/
│   ├── kit/                     ← extracted PDFs + README + SOURCES
│   └── reference/               ← assumptions / open questions
├── src/                         ← future app source (empty)
├── public/                      ← static assets
├── supabase/
│   └── migrations/              ← future schema
├── demo/
│   ├── video/                   ← HyperFrames / brag outputs
│   └── slides/                  ← 7-slide / pptx outputs
├── citation/                    ← citation working copies
├── scripts/                     ← tooling
└── .cursor/
    ├── rules/                   ← project rules (later)
    └── skills/                  ← project-local skills (later)
```

---

## Skills installed for this project

### Explicitly requested

| Skill | Source | Purpose |
|---|---|---|
| HyperFrames suite | `heygen-com/hyperframes` | Demo / motion video per kit script |
| `/brag` + `/brag-slim` | `latent-spaces/brag` | Short launch / share video |
| `/pptx` | `anthropics/skills@pptx` | PPT creation (best install count for decks) |

### Required by stack + kit

| Skill | Purpose |
|---|---|
| `supabase` + `supabase-postgres-best-practices` | Schema, RLS, migrations |
| `frontend-design` / `web-design-guidelines` / composition patterns | UI quality |
| `slideshow` / `product-launch-video` | Deck + launch video adjacent |

Global skills live under `~\.agents\skills\` and are mirrored for Cursor under `~\.cursor\skills\`.

---

## Success criteria (from kit — not implemented yet)

Build “works” when the **12-check battery** passes with zero console errors, including:

- BLIND quality gate refuses bad data  
- Engine outputs are receipted  
- Threshold edits are receipted  
- LOS queues escalations (`QUEUED-FS`); AOS flushes with sync receipts  
- Judge tour completes unattended  

Submission needs: project page copy, References field, and **30-second video or 7-slide deck**.

---

## Explicit non-goals right now

- No app UI implementation  
- No schema migrations applied  
- No Vercel project created for PULSE yet  
- No demo video rendered yet  

Next step after you confirm auth + skills: implement PULSE against the playbook (P0→P7 concepts) on the GitHub → Vercel → Supabase path.

# SOURCES — PULSE: Astronaut Health Monitor

All URLs below were opened/verified on **13 November 2026**; the challenge-page official resources (entries 21–25, plus supporting 26–28) were fetched and read on **14 November 2026** (web search + page fetches). No citation in this project is invented. Where a numeric limit could not be verified publicly, the application and the documents say so instead of quoting a number.

## Deliverables citing these sources

| File | Role |
|---|---|
| `PULSE_Health_Monitor.html` | The runnable deliverable (single file, zero dependencies). Sources are listed in its RULE SET & SOURCES tab (items 1–14 below, live links). |
| `PULSE_1Hour_Build_Playbook.pdf` | Timed construction kit: rebuild the whole project in the Z.ai desktop app in 60 minutes — six paste-ready prompts, rescue template, one-shot master prompt, 12-check QA battery. |
| `PULSE_NASA_Research_Dossier.pdf` | All 28 verified sources with roles; the five-official-resource map (§5: hazard-to-channel traceability, Named Risk Registry, CSA dose discipline, Earth payback); design lineage; offline-mode evidence base; the honesty register. |
| `PULSE_Explanation_Kit.pdf` | Professional explanation pack: 30-second pitch, 2-minute script, 5-minute screen-by-screen walkthrough, ten judge Q&As, glossary, demo-day checklist. |
| `PULSE_Judge_Evaluation.pdf` | Judge-perspective rubric evaluation, visual edition: 76/100 before, 99.5/100 after, with per-criterion charts and screenshot evidence; plus the official 25-point rubric projection (17/25 → 24/25) and the 2023–2025 global-winner evidence. |
| `PULSE_Project_Report.pdf` | Full project report (references 1–25) with six embedded app screenshots. |
| `PULSE_30Sec_Demo_and_Slides.pdf` | The official submission demo: a 30-second shot list (54 words of verbatim voice-over) or the 7-slide deck, plus the verified 2023–2025 global-winner pattern analysis. |
| `PULSE_Project_Page_Pack.pdf` | Copy-paste project-page text: title, summary, description, the ten-entry References-field block, submission-day checklist. |
| `cover_html/hm_cover_*.html` | Editable HTML sources of the PDF covers. |
| `PULSE_Sol143_Demo.html` | Optional creativity annex (crew-walking simulation) — not part of the core answer to the challenge. |
| `archive/` | Superseded earlier drafts, kept for provenance. |

Note on source counts: the dossier lists **28 sources**. The app's in-app list is **nineteen entries** — items 1–14 plus the five official challenge resources (21–25, labeled "Challenge resource"; the Build Playbook's P7 prompt patches an existing build to this state). Sources 15–20 and 26 support the documents and the offline design; 27–28 are the judging-evidence sources.

## The assigned challenge

**“Create Health Monitoring Software for Astronauts on Space Missions”** (NASA Space Apps Challenge 2026): build software that *gathers* health indicators and enables astronauts to *evaluate* and *act* on the status of their health. `PULSE_Health_Monitor.html` implements exactly those three verbs; every screen maps to one of them.

## Verified sources (nineteen are listed inside the app: 1–14 plus the challenge resources 21–25)

1. **Challenge statement** — https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software
2. **NASA Human Research Program (HRP)** — https://www.nasa.gov/hrp
3. **NASA-STD-3001 Vol 2 — Spaceflight Human-System Standard** — https://standards.nasa.gov/standard/NASA/NASA-STD-3001_VOL_2
4. **NASA — Astronaut Exercise (ISS countermeasures)** — https://www.nasa.gov/missions/station/iss-research/astronaut-exercise
5. **NASA OCHMO-TB-031 — Exercise Overview (technical brief)** — https://www.nasa.gov/ochmo-tb-031-exercise-overview-2
6. **NASA Open Science Data Repository (OSDR)** — https://osdr.nasa.gov/bio/
7. **NASA Life Sciences Data Archive (LSDA)** — https://lsda.jsc.nasa.gov/
8. **NASA DONKI — Space Weather Knowledge Database** — https://ccmc.gsfc.nasa.gov/DONKI/ (migrated to the CCMC portal 30 September 2026; the legacy kauai host is deprecated)
9. **NASA ExMC / Ames — A Clinical Decision Support System for Earth-Independent Medical Operations** — https://www.nasa.gov/centers-and-facilities/ames/ames-science/ames-space-biosciences/a-clinical-decision-support-system-for-earth-independent-medical-operations (quote verified on-page: “Deep space exploration requires a paradigm shift in astronaut medical support toward Earth-independent medical operations.”)
10. **Russell et al., npj Microgravity 9:46 (2023) — value of a spaceflight CDSS** — https://www.nature.com/articles/s41526-023-00284-1
11. **CHeCS — Crew Health Care Systems (ISS)** — https://ntrs.nasa.gov/citations/20110022379
12. **NTRS 20220013418 — Communication Delays, Disruptions, and Blackouts for Crewed Mars Missions** — https://ntrs.nasa.gov/citations/20220013418
13. **NASA HRP — Hazard: Distance From Earth** — https://www.nasa.gov/hrp/hazard-distance-from-earth
14. **SOMA / Inspiration4 — molecular & physiological changes (Nature 2024)** — https://www.nature.com/articles/s41586-024-07648-x
15. **NASA OCHMO-TB-020 — Design for Ionizing Radiation Protection** — https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-020-radiation-protection.pdf
16. **NTRS 20150019624 — CO2 on the ISS: An Operations Perspective** — https://ntrs.nasa.gov/api/citations/20150019624/downloads/20150019624.pdf
17. **Mars Communications Disruption and Delay (M2M ACR 2023)** — https://www.lpi.usra.edu/lunar/strategies/resources/M2M-ACR2023_MarsCommunicationDisruptionDelay.pdf
18. **Space Apps judging**: 2020 Judging & Awards Guide — https://sa-2019.s3.amazonaws.com/media/documents/Space_Apps_2020_Judging_and_Awards_Guide.docx.pdf (PDF not machine-fetchable this session; existence verified via search) · 2013 judging page (opened; names seven unweighted factors: impact, creativity, complexity, collaboration, product, sustainability, presentation) — https://2013.spaceappschallenge.org/about/judging
19. **NASA SCaN — Delay/Disruption Tolerant Networking** — https://www.nasa.gov/communicating-with-missions/delay-disruption-tolerant-networking
20. **NASA JPL — ION-DTN (Interplanetary Overlay Network)** — https://github.com/nasa-jpl/ION-DTN
21. **NASA HRP — 5 Hazards of Human Spaceflight** (official challenge resource) — https://www.nasa.gov/hrp/hazards — fetched 14 Nov 2026; the five hazards verbatim (space radiation, isolation and confinement, distance from Earth, gravity fields, hostile/closed environments) structure the app's channel grouping; Mars facts: ~140 million miles, ~3 years, three-eighths gravity.
22. **NASA HRP — Risks of Human Spaceflight** (official challenge resource) — https://www.nasa.gov/hrp/risks — 17 named risks in 3 categories (11 physiology, 5 behavioral, 1 radiation); 10 traced end-to-end in the Named Risk Registry.
23. **NASA HRP — Ongoing HRP Research in Space** (official challenge resource) — https://www.nasa.gov/hrp/ongoing-hrp-research — ARCHeR (Artemis II sleep/activity), Immune Biomarkers, CIPHER, Standard Measures, Tempus Pro (telemedicine vitals integration), Space Gardening.
24. **Canadian Space Agency — Monitoring radiation for astronaut health** (official challenge resource) — https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp — CANS ("compact and autonomous"), neutron radiation ≈30% of ISS dose, $5.5M Bubble Technology Industries contract; heritage: bubble detectors, MOSFET, EVARM, Radi-N2.
25. **Canadian Space Agency — Why do we conduct science experiments in space?** (official challenge resource) — https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp — "accelerated aging" baseline argument; Moon/Mars risk list incl. "less ability to rely on Earth for ... emergency medical assistance"; Earth benefits: osteoporosis, seniors' balance, cardiovascular, Type-2 diabetes.
26. **Canadian Space Agency — Radiation projects** (supporting) — https://www.asc-csa.gc.ca/eng/astronauts/space-medicine/projects-radiation.asp — personal + area dosimetry practice; a typical ISS day ≈ a full Earth-year of natural background; CSA works with NASA SRAG on NOAA solar-activity forecasts (the pattern the DONKI storm replay mirrors).
27. **Space Apps — Judging & Awards Guide (official)** — https://www.spaceappschallenge.org/resources/judging-awards-guide — fetched 14 Nov 2026: five criteria (Impact, Creativity, Validity, Relevance, Presentation, each 1–5); demo format = 30-second video or 7-slide deck; References field is an eligibility requirement.
28. **Space Apps Global Winners 2023–2025 (official announcements)** — https://science.nasa.gov/directorates/smd/2023-nasa-international-space-apps-challenge-announces-10-global-winners · https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-international-space-apps-challenge-announces-2024-global-winners · https://www.spaceappschallenge.org/2025/awards/global-winners — winner-pattern evidence (Storm Prophet/DSCOVR, WMPGang/NEO data, SpaceGenes+/radiation data, Earth-side winners Waterwise, 2plant, G.R.O.W.).

## Explicit non-citations (honesty notes)

- **Clinical thresholds** (resting HR 40–100, SpO₂ 90/94% bands, fever ≥38.0 °C, BP 90/140 mmHg, sleep 7–9 h): widely taught clinical/public-health defaults. Labeled “default, configurable” in-app; **no fake URL is attached**. A real deployment takes limits from the flight surgeon and NASA-STD-3001-derived program requirements.
- **Radiation daily limit (1.0 mSv/day in-app)**: explicitly a demo placeholder — real limits are career PELs defined by NASA-STD-3001 Vol 2 (3) with protection practice per OCHMO-TB-020 (15); daily numeric values are not public.
- **Cabin CO₂ ≈ 4 mmHg 24-h average**: labeled “commonly cited ISS guideline (demo default — verify against current flight rules)”, with NTRS 20150019624 (16) attached as the research anchor.
- **HRmax = 220 − age (Karvonen %HRR zones)**: common exercise-physiology default, labeled as such in-app.
- **Judging criteria/weights**: criteria have varied by year (see 18). The current official Judging & Awards Guide was fetched on 14 November 2026 and names five criteria scored 1–5 each (27); the evaluation PDF's 100-point rubric weights remain **declared as the evaluator's own mapping**, not presented as official.

## Design-lineage statement (the “check what NASA already has” rule)

NASA already operates CHeCS on ISS (11) and its Exploration Medical Capability element is researching a clinical decision support system for Earth-independent operations (9, 10); commercial crews already fly continuous wearables (14). PULSE claims to be a **student prototype of that published direction** — complementary software, not a replacement, and not a claim of novelty.

## Fictional-content disclosure

The four crew members (Nova Reyes, Cass Okonkwo, Ravi Sharma, Dr. Amara Diallo) are fictional. Vital streams are synthesized deterministically (seeded); manual entry and CSV import exist so judges can feed real data in. Every screen carries: *SIMULATED DATA — DEMONSTRATION ONLY, NOT FOR MEDICAL USE*.

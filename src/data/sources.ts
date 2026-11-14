export type SourceEntry = {
  id: number;
  title: string;
  url: string;
  officialChallenge?: boolean;
};

/** Nineteen in-app citations: 1–14 + official challenge resources 21–25. */
export const APP_SOURCES: SourceEntry[] = [
  {
    id: 1,
    title: "Challenge statement — Health Monitoring Software",
    url: "https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software",
  },
  {
    id: 2,
    title: "NASA Human Research Program (HRP)",
    url: "https://www.nasa.gov/hrp",
  },
  {
    id: 3,
    title: "NASA-STD-3001 Vol 2 — Spaceflight Human-System Standard",
    url: "https://standards.nasa.gov/standard/NASA/NASA-STD-3001_VOL_2",
  },
  {
    id: 4,
    title: "NASA — Astronaut Exercise (ISS countermeasures)",
    url: "https://www.nasa.gov/missions/station/iss-research/astronaut-exercise",
  },
  {
    id: 5,
    title: "NASA OCHMO-TB-031 — Exercise Overview",
    url: "https://www.nasa.gov/ochmo-tb-031-exercise-overview-2",
  },
  {
    id: 6,
    title: "NASA Open Science Data Repository (OSDR)",
    url: "https://osdr.nasa.gov/bio/",
  },
  {
    id: 7,
    title: "NASA Life Sciences Data Archive (LSDA)",
    url: "https://lsda.jsc.nasa.gov/",
  },
  {
    id: 8,
    title: "NASA DONKI — Space Weather Knowledge Database",
    url: "https://ccmc.gsfc.nasa.gov/DONKI/",
  },
  {
    id: 9,
    title:
      "NASA ExMC / Ames — Clinical Decision Support for Earth-Independent Medical Operations",
    url: "https://www.nasa.gov/centers-and-facilities/ames/ames-science/ames-space-biosciences/a-clinical-decision-support-system-for-earth-independent-medical-operations",
  },
  {
    id: 10,
    title: "Russell et al., npj Microgravity 9:46 (2023) — spaceflight CDSS",
    url: "https://www.nature.com/articles/s41526-023-00284-1",
  },
  {
    id: 11,
    title: "CHeCS — Crew Health Care Systems (ISS)",
    url: "https://ntrs.nasa.gov/citations/20110022379",
  },
  {
    id: 12,
    title: "NTRS 20220013418 — Mars comms delays / blackouts",
    url: "https://ntrs.nasa.gov/citations/20220013418",
  },
  {
    id: 13,
    title: "NASA HRP — Hazard: Distance From Earth",
    url: "https://www.nasa.gov/hrp/hazard-distance-from-earth",
  },
  {
    id: 14,
    title: "SOMA / Inspiration4 — molecular & physiological changes (Nature 2024)",
    url: "https://www.nature.com/articles/s41586-024-07648-x",
  },
  {
    id: 21,
    title: "NASA HRP — 5 Hazards of Human Spaceflight",
    url: "https://www.nasa.gov/hrp/hazards",
    officialChallenge: true,
  },
  {
    id: 22,
    title: "NASA HRP — Risks of Human Spaceflight",
    url: "https://www.nasa.gov/hrp/risks",
    officialChallenge: true,
  },
  {
    id: 23,
    title: "NASA HRP — Ongoing HRP Research in Space",
    url: "https://www.nasa.gov/hrp/ongoing-hrp-research",
    officialChallenge: true,
  },
  {
    id: 24,
    title: "CSA — Monitoring radiation for astronaut health",
    url: "https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp",
    officialChallenge: true,
  },
  {
    id: 25,
    title: "CSA — Why do we conduct science experiments in space?",
    url: "https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp",
    officialChallenge: true,
  },
];

export const OFFICIAL_SOURCE_IDS = [21, 22, 23, 24, 25] as const;

export function getOfficialSources() {
  return APP_SOURCES.filter((s) => s.officialChallenge);
}

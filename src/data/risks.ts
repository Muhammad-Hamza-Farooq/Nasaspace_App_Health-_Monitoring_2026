export type NamedRisk = {
  id: string;
  name: string;
  category: "physiology" | "behavioral" | "radiation";
  channels: string[];
  sourceId: number;
};

/** Named Risk Registry subset traced end-to-end in PULSE (source 22). */
export const NAMED_RISKS: NamedRisk[] = [
  {
    id: "CVD",
    name: "Cardiovascular adaptation",
    category: "physiology",
    channels: ["hr", "bp"],
    sourceId: 22,
  },
  {
    id: "BMD",
    name: "Bone mineral density loss",
    category: "physiology",
    channels: ["exercise"],
    sourceId: 22,
  },
  {
    id: "SLEEP",
    name: "Sleep disruption",
    category: "physiology",
    channels: ["sleep"],
    sourceId: 22,
  },
  {
    id: "IMMUNE",
    name: "Immune dysregulation",
    category: "physiology",
    channels: ["vitals"],
    sourceId: 22,
  },
  {
    id: "CO2",
    name: "Elevated CO₂ exposure",
    category: "physiology",
    channels: ["co2"],
    sourceId: 22,
  },
  {
    id: "BEH-ISO",
    name: "Behavioral / isolation stress",
    category: "behavioral",
    channels: ["mood"],
    sourceId: 22,
  },
  {
    id: "TEAM",
    name: "Team cohesion risk",
    category: "behavioral",
    channels: ["mood"],
    sourceId: 22,
  },
  {
    id: "RAD-SPE",
    name: "Solar particle event exposure",
    category: "radiation",
    channels: ["radiation", "storm"],
    sourceId: 22,
  },
  {
    id: "RAD-GCR",
    name: "Galactic cosmic ray dose",
    category: "radiation",
    channels: ["radiation"],
    sourceId: 22,
  },
  {
    id: "COMMS",
    name: "Delayed / disrupted medical support",
    category: "behavioral",
    channels: ["los"],
    sourceId: 22,
  },
];

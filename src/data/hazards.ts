export type HazardId =
  | "radiation"
  | "isolation"
  | "distance"
  | "gravity"
  | "closed_env";

export type Hazard = {
  id: HazardId;
  name: string;
  channels: string[];
  sourceId: number;
};

/** NASA HRP 5 hazards → PULSE channel grouping (source 21). */
export const HAZARDS: Hazard[] = [
  {
    id: "radiation",
    name: "Space radiation",
    channels: ["radiation", "storm"],
    sourceId: 21,
  },
  {
    id: "isolation",
    name: "Isolation and confinement",
    channels: ["mood", "behavioral"],
    sourceId: 21,
  },
  {
    id: "distance",
    name: "Distance from Earth",
    channels: ["los", "escalations"],
    sourceId: 21,
  },
  {
    id: "gravity",
    name: "Gravity fields",
    channels: ["exercise", "sleep", "vitals"],
    sourceId: 21,
  },
  {
    id: "closed_env",
    name: "Hostile/closed environments",
    channels: ["co2", "cabin"],
    sourceId: 21,
  },
];

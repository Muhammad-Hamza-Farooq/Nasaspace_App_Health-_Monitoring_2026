export type CrewMember = {
  id: string;
  name: string;
  role: string;
  age: number;
  seed: number;
};

/** Fictional demo crew from the citation kit. */
export const CREW: CrewMember[] = [
  { id: "nova", name: "Nova Reyes", role: "Commander", age: 42, seed: 101 },
  { id: "cass", name: "Cass Okonkwo", role: "Flight Engineer", age: 35, seed: 202 },
  { id: "ravi", name: "Ravi Sharma", role: "Science Officer", age: 38, seed: 303 },
  {
    id: "amara",
    name: "Amara Diallo",
    role: "Mission Specialist",
    age: 44,
    seed: 404,
  },
];

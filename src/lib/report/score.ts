export type HealthScore = {
  overall: number;
  structural: number;
  formulas: number;
  integrity: number;
  scalability: number;
  busFactor: number;
};

export function createEmptyScore(): HealthScore {
  return {
    overall: 0,
    structural: 0,
    formulas: 0,
    integrity: 0,
    scalability: 0,
    busFactor: 0,
  };
}

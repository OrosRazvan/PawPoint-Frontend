export const kgToLb = (kg: number) => kg * 2.2046226218;
export const lbToKg = (lb: number) => lb / 2.2046226218;

export const formatWeightByUnit = (
  valueInKg?: number | null,
  unit: "kg" | "lb" = "kg"
) => {
  if (valueInKg == null) return "—";

  if (unit === "lb") {
    return `${kgToLb(valueInKg).toFixed(1)} lb`;
  }

  return `${valueInKg.toFixed(1)} kg`;
};
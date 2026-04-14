import type { AppTextSize } from "../theme/theme";

export const scaleFont = (
  px: number,
  textSize: AppTextSize = "Medium"
) => {
  const scale =
    textSize === "Small" ? 0.9 :
    textSize === "Large" ? 1.1 :
    1;

  return `${px * scale}px`;
};
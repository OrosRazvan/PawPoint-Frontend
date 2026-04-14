export type AppTextSize = "Small" | "Medium" | "Large";

export const getTextScale = (textSize?: AppTextSize) => {
  switch (textSize) {
    case "Small":
      return 0.9;
    case "Large":
      return 1.1;
    case "Medium":
    default:
      return 1;
  }
};
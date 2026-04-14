import { createTheme } from "@mui/material/styles";

export type AppTextSize = "Small" | "Medium" | "Large";

const getTextScale = (textSize: AppTextSize = "Medium") => {
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

export const createAppTheme = (textSize: AppTextSize = "Medium") => {
  const scale = getTextScale(textSize);

  return createTheme({
    palette: {
      mode: "light",
      background: {
        default: "#f8f4ef",
      },
      primary: {
        main: "#f5a623",
      },
    },
    typography: {
      fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,

      h1: {
        fontSize: `${2.5 * scale}rem`,
      },
      h2: {
        fontSize: `${2 * scale}rem`,
      },
      h3: {
        fontSize: `${1.75 * scale}rem`,
      },
      h4: {
        fontSize: `${1.5 * scale}rem`,
      },
      h5: {
        fontSize: `${1.25 * scale}rem`,
      },
      h6: {
        fontSize: `${1.1 * scale}rem`,
      },
      body1: {
        fontSize: `${1 * scale}rem`,
      },
      body2: {
        fontSize: `${0.875 * scale}rem`,
      },
      subtitle1: {
        fontSize: `${1 * scale}rem`,
      },
      subtitle2: {
        fontSize: `${0.875 * scale}rem`,
      },
      button: {
        fontSize: `${0.95 * scale}rem`,
        textTransform: "none",
      },
      caption: {
        fontSize: `${0.75 * scale}rem`,
      },
      overline: {
        fontSize: `${0.75 * scale}rem`,
      },
    },
    shape: {
      borderRadius: 12,
    },
  });
};
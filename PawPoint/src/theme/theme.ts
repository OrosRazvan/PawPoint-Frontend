import { alpha, createTheme } from "@mui/material/styles";

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

export const createAppTheme = (
  textSize: AppTextSize = "Medium",
  darkMode = false
) => {
  const scale = getTextScale(textSize);

  const palette = darkMode
    ? {
        mode: "dark" as const,
        primary: {
          main: "#f5a623",
          light: "#ffbf47",
          dark: "#d48806",
          contrastText: "#111827",
        },
        secondary: {
          main: "#60a5fa",
        },
        background: {
          default: "#11161f",
          paper: "#18202b",
        },
        text: {
          primary: "#f7f4ef",
          secondary: "#c8d1dc",
        },
        divider: "rgba(255,255,255,0.08)",
        success: {
          main: "#34d399",
        },
        error: {
          main: "#f87171",
        },
        warning: {
          main: "#f5a623",
        },
        info: {
          main: "#60a5fa",
        },
      }
    : {
        mode: "light" as const,
        primary: {
          main: "#f5a623",
          light: "#ffbf47",
          dark: "#d48806",
          contrastText: "#111827",
        },
        secondary: {
          main: "#2563eb",
        },
        background: {
          default: "#f8f4ef",
          paper: "#fffdfb",
        },
        text: {
          primary: "#111827",
          secondary: "#5f7087",
        },
        divider: "#ebe3da",
        success: {
          main: "#16a34a",
        },
        error: {
          main: "#d92d20",
        },
        warning: {
          main: "#f5a623",
        },
        info: {
          main: "#2563eb",
        },
      };

  return createTheme({
    palette,
    typography: {
      fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,

      h1: { fontSize: `${2.5 * scale}rem` },
      h2: { fontSize: `${2 * scale}rem` },
      h3: { fontSize: `${1.75 * scale}rem` },
      h4: { fontSize: `${1.5 * scale}rem` },
      h5: { fontSize: `${1.25 * scale}rem` },
      h6: { fontSize: `${1.1 * scale}rem` },

      body1: { fontSize: `${1 * scale}rem` },
      body2: { fontSize: `${0.875 * scale}rem` },

      subtitle1: { fontSize: `${1 * scale}rem` },
      subtitle2: { fontSize: `${0.875 * scale}rem` },

      button: {
        fontSize: `${0.95 * scale}rem`,
        textTransform: "none",
      },

      caption: { fontSize: `${0.75 * scale}rem` },
      overline: { fontSize: `${0.75 * scale}rem` },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: palette.background.default,
            color: palette.text.primary,
            transition: "background-color 0.2s ease, color 0.2s ease",
          },
          "#root": {
            backgroundColor: palette.background.default,
            minHeight: "100vh",
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: darkMode ? "#111926" : "#ffffff",
            borderBottom: `1px solid ${palette.divider}`,
            color: palette.text.primary,
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? alpha("#ffffff", 0.03) : "#ffffff",
            transition:
              "border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
            "& fieldset": {
              borderColor: darkMode ? alpha("#ffffff", 0.12) : "#ded8cf",
            },
            "&:hover fieldset": {
              borderColor: palette.primary.main,
            },
            "&.Mui-focused fieldset": {
              borderColor: palette.primary.main,
              borderWidth: 1.5,
            },
          },
          input: {
            color: palette.text.primary,
          },
        },
      },

      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundImage: "none",
            backgroundColor: palette.background.paper,
            border: `1px solid ${palette.divider}`,
          },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundImage: "none",
            backgroundColor: palette.background.paper,
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
          },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: palette.divider,
          },
        },
      },

      MuiSwitch: {
        styleOverrides: {
          track: {
            opacity: 1,
            backgroundColor: darkMode
              ? alpha("#ffffff", 0.22)
              : "#d1d5db",
          },
        },
      },
    },
  });
};
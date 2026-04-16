import { useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useSettings } from "../hooks/useSettings";
import { createAppTheme } from "./theme";

type Props = {
  children: React.ReactNode;
};

export const AppThemeProvider = ({ children }: Props) => {
  const { data: settings } = useSettings();

  const theme = useMemo(() => {
    return createAppTheme(
      settings?.textSize ?? "Medium",
      settings?.darkMode ?? false
    );
  }, [settings?.textSize, settings?.darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
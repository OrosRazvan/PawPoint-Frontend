import { Paper, Typography, Stack } from "@mui/material";
import { useSettings } from "../../../../hooks/useSettings";
import { scaleFont } from "../../../../utils/fontScale";

type Props = {
  title: string;
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
};

export const SectionCard = ({ title, children, rightSlot }: Props) => {
  const { data: settings } = useSettings();

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        p: 3,
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 10px 24px rgba(0,0,0,0.24)"
            : "0 10px 24px rgba(0,0,0,0.05)",
      })}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Typography
          sx={(theme) => ({
            fontSize: scaleFont(22, settings?.textSize),
            fontWeight: 700,
            color: theme.palette.text.primary,
          })}
        >
          {title}
        </Typography>

        {rightSlot}
      </Stack>

      {children}
    </Paper>
  );
};
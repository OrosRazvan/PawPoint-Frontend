import { Paper, Typography, Stack, Box } from "@mui/material";
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
        p: { xs: 2.5, sm: 3 },
        borderRadius: 5,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 1px 3px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.2)"
            : "0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(7,28,66,0.06)",
        height: "100%",
      })}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={(theme) => ({
              width: 4,
              height: 22,
              borderRadius: 99,
              background: "linear-gradient(180deg, #1657ff 0%, #4f83ff 100%)",
              opacity: theme.palette.mode === "dark" ? 0.85 : 1,
            })}
          />
          <Typography
            sx={(theme) => ({
              fontSize: scaleFont(20, settings?.textSize),
              fontWeight: 700,
              letterSpacing: "-0.4px",
              color: theme.palette.text.primary,
            })}
          >
            {title}
          </Typography>
        </Stack>

        {rightSlot}
      </Stack>

      {children}
    </Paper>
  );
};
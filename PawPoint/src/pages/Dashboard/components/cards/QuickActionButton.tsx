import { Button, Stack, Typography, Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ReactNode } from "react";
import { useSettings } from "../../../../hooks/useSettings";
import { scaleFont } from "../../../../utils/fontScale";

type Props = {
  label: string;
  icon: ReactNode;
  textColor: string;
  backgroundColor: string;
  onClick?: () => void;
};

export const QuickActionButton = ({
  label,
  icon,
  textColor,
  backgroundColor,
  onClick,
}: Props) => {
  const { data: settings } = useSettings();

  return (
    <Button
      fullWidth
      onClick={onClick}
      variant="text"
      sx={(theme) => ({
        justifyContent: "flex-start",
        px: 2.5,
        py: 1.75,
        borderRadius: 3.5,
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha(textColor, 0.1)
            : backgroundColor,
        textTransform: "none",
        border:
          theme.palette.mode === "dark"
            ? `1px solid ${alpha(textColor, 0.18)}`
            : `1px solid ${alpha(textColor, 0.1)}`,
        transition: "all 0.18s ease",
        "&:hover": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(textColor, 0.18)
              : alpha(textColor, 0.12),
          transform: "translateX(3px)",
          boxShadow: `0 4px 16px ${alpha(textColor, 0.18)}`,
        },
      })}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: 2,
            backgroundColor: alpha(textColor, 0.12),
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Typography
          sx={{
            fontSize: scaleFont(15, settings?.textSize),
            fontWeight: 600,
            color: textColor,
            letterSpacing: "-0.1px",
          }}
        >
          {label}
        </Typography>
      </Stack>
    </Button>
  );
};
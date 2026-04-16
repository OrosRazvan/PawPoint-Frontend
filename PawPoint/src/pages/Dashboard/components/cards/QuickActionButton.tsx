import { Button, Stack, Typography } from "@mui/material";
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
        px: 2,
        py: 2,
        borderRadius: 3,
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha(textColor, 0.14)
            : backgroundColor,
        textTransform: "none",
        border:
          theme.palette.mode === "dark"
            ? `1px solid ${alpha(textColor, 0.2)}`
            : "none",
        "&:hover": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(textColor, 0.2)
              : backgroundColor,
          opacity: 0.95,
        },
      })}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        {icon}
        <Typography
          sx={{
            fontSize: scaleFont(18, settings?.textSize),
            fontWeight: 600,
            color: textColor,
          }}
        >
          {label}
        </Typography>
      </Stack>
    </Button>
  );
};
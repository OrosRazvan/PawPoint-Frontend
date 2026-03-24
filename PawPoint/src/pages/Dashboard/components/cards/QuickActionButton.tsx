import { Button, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

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
  return (
    <Button
      fullWidth
      onClick={onClick}
      variant="text"
      sx={{
        justifyContent: "flex-start",
        px: 2,
        py: 2,
        borderRadius: 3,
        backgroundColor,
        textTransform: "none",
        "&:hover": {
          backgroundColor,
          opacity: 0.92,
        },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        {icon}
        <Typography
          sx={{
            fontSize: 18,
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
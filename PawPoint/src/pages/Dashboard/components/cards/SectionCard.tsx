import { Paper, Typography, Stack } from "@mui/material";

type Props = {
  title: string;
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
};

export const SectionCard = ({ title, children, rightSlot }: Props) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid #dedede",
        backgroundColor: "#fcfcfc",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 700,
            color: "#071c42",
          }}
        >
          {title}
        </Typography>

        {rightSlot}
      </Stack>

      {children}
    </Paper>
  );
};
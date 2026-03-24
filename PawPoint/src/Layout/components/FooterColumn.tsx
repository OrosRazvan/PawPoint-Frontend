import { Stack, Typography } from "@mui/material";

type Props = {
  title: string;
  items: string[];
};

export const FooterColumn = ({ title, items }: Props) => {
  return (
    <Stack spacing={2}>
      <Typography
        sx={{
          fontSize: 20,
          fontWeight: 700,
          color: "#071c42",
        }}
      >
        {title}
      </Typography>

      <Stack spacing={1.5}>
        {items.map((item) => (
          <Typography
            key={item}
            sx={{
              fontSize: 16,
              color: "#4c5c73",
            }}
          >
            {item}
          </Typography>
        ))}
      </Stack>
    </Stack>
  );
};
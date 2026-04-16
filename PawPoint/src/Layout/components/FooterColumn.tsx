import { Stack, Typography } from "@mui/material";
import { useSettings } from "../../hooks/useSettings";
import { scaleFont } from "../../utils/fontScale";

type Props = {
  title: string;
  items: string[];
};

export const FooterColumn = ({ title, items }: Props) => {
  const { data: settings } = useSettings();

  return (
    <Stack spacing={2}>
      <Typography
        sx={(theme) => ({
          fontSize: scaleFont(20, settings?.textSize),
          fontWeight: 700,
          color: theme.palette.text.primary,
        })}
      >
        {title}
      </Typography>

      <Stack spacing={1.5}>
        {items.map((item) => (
          <Typography
            key={item}
            sx={(theme) => ({
              fontSize: scaleFont(16, settings?.textSize),
              color: theme.palette.text.secondary,
            })}
          >
            {item}
          </Typography>
        ))}
      </Stack>
    </Stack>
  );
};
import { MenuItem, TextField } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useSettings } from "../hooks/useSettings";
import { scaleFont } from "../utils/fontScale";

export type CompletedFilterMonths = 3 | 6 | 12;

type Props = {
  value: CompletedFilterMonths;
  onChange: (value: CompletedFilterMonths) => void;
  namespace: "vaccination" | "deworming" | "appointment";
};

export const CompletedPeriodFilter = ({
  value,
  onChange,
  namespace,
}: Props) => {
  const { t } = useTranslation([namespace]);
  const { data: settings } = useSettings();

  return (
    <TextField
      select
      size="small"
      value={value}
      onChange={(e) => onChange(Number(e.target.value) as CompletedFilterMonths)}
      sx={(theme) => ({
        minWidth: 170,
        "& .MuiOutlinedInput-root": {
          borderRadius: 2.5,
          backgroundColor: theme.palette.background.paper,
          fontSize: scaleFont(13, settings?.textSize),
          fontWeight: 600,
          "& fieldset": {
            borderColor: theme.palette.divider,
            borderWidth: "0.5px",
          },
          "&:hover fieldset": {
            borderColor: theme.palette.action.active,
          },
        },
        "& .MuiSelect-icon": {
          color: theme.palette.text.secondary,
        },
      })}
      SelectProps={{
        MenuProps: {
          PaperProps: {
            sx: (theme) => ({
              borderRadius: 2.5,
              border: `0.5px solid ${theme.palette.divider}`,
              boxShadow: "none",
              mt: 0.5,
              "& .MuiMenuItem-root": {
                fontSize: scaleFont(13, settings?.textSize),
                fontWeight: 500,
                borderRadius: 1.5,
                mx: 0.5,
                "&.Mui-selected": {
                  color: theme.palette.success.main,
                  fontWeight: 700,
                  backgroundColor: alpha(theme.palette.success.main, 0.08),
                },
              },
            }),
          },
        },
      }}
    >
      <MenuItem value={3}>{t(`${namespace}:filters.last3Months`)}</MenuItem>
      <MenuItem value={6}>{t(`${namespace}:filters.last6Months`)}</MenuItem>
      <MenuItem value={12}>{t(`${namespace}:filters.lastYear`)}</MenuItem>
    </TextField>
  );
};
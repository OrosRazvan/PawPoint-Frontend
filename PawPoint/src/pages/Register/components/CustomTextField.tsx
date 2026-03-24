import TextField from "@mui/material/TextField";
import type { TextFieldProps } from "@mui/material/TextField";
import { alpha, useTheme } from "@mui/material/styles";

export const CustomTextField = (props: TextFieldProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <TextField
      {...props}
      variant={props.variant ?? "outlined"}
      size={props.size ?? "small"}
      fullWidth={props.fullWidth ?? true}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2.5,
          backgroundColor: isDark
            ? alpha(theme.palette.common.white, 0.04)
            : alpha(theme.palette.common.black, 0.03),
        },
        ...(props.sx || {}),
      }}
    />
  );
};
import { Box } from "@mui/material";
import { LanguageSwitcher } from "./LanguageSwitcher";
import logo from "../assets/react.svg";

export const AuthTopBar = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 2,
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="PawPoint"
        sx={{
          height: 36,
          objectFit: "contain",
          display: "block",
        }}
      />

      <LanguageSwitcher />
    </Box>
  );
};
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { Button, IconButton, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

export const NavbarActions = () => {
  const { t } = useTranslation(["layout"]);

  return (
    <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
      <IconButton sx={{ color: "#6b7280", display: { xs: "none", md: "inline-flex" } }}>
        <DarkModeOutlinedIcon />
      </IconButton>

      <IconButton sx={{ color: "#6b7280", display: { xs: "none", md: "inline-flex" } }}>
        <SettingsOutlinedIcon />
      </IconButton>

      <IconButton sx={{ color: "#6b7280", display: { xs: "none", md: "inline-flex" } }}>
        <MailOutlineOutlinedIcon />
      </IconButton>

      <IconButton sx={{ color: "#6b7280", display: { xs: "none", md: "inline-flex" } }}>
        <PersonOutlineOutlinedIcon />
      </IconButton>

      <Button
        startIcon={<LogoutOutlinedIcon />}
        sx={{
          ml: { xs: 0, md: 1 },
          px: 2.5,
          py: 1.25,
          borderRadius: 2.5,
          textTransform: "none",
          fontSize: 16,
          fontWeight: 700,
          color: "#ff6b63",
          backgroundColor: "#fde8e8",
          "&:hover": {
            backgroundColor: "#fbdede",
          },
        }}
      >
        {t("layout:navbar.logout")}
      </Button>
    </Stack>
  );
};
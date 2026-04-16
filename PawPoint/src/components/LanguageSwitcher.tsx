import { useState } from "react";
import {
  Box,
  Button,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { useTranslation } from "react-i18next";

import roFlag from "../assets/flags/ro.svg";
import enFlag from "../assets/flags/en.svg";

const languages = [
  {
    code: "en",
    shortLabel: "EN",
    fullLabel: "English",
    flag: enFlag,
  },
  {
    code: "ro",
    shortLabel: "RO",
    fullLabel: "Română",
    flag: roFlag,
  },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const currentLanguage = i18n.language?.startsWith("ro")
    ? languages[1]
    : languages[0];

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeLanguage = (lng: "en" | "ro") => {
    i18n.changeLanguage(lng);
    handleClose();
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        endIcon={<KeyboardArrowDownRoundedIcon />}
        sx={(theme) => ({
          minWidth: "unset",
          px: 1.6,
          py: 0.9,
          borderRadius: "999px",
          textTransform: "none",
          fontWeight: 700,
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 22px rgba(0,0,0,0.28)"
              : "0 6px 18px rgba(0,0,0,0.06)",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? alpha("#ffffff", 0.04)
                : "#faf8f4",
          },
        })}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            component="img"
            src={currentLanguage.flag}
            alt={currentLanguage.shortLabel}
            sx={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              objectFit: "cover",
              display: "block",
            }}
          />
          <Typography
            component="span"
            sx={{ fontWeight: 800, fontSize: 15 }}
          >
            {currentLanguage.shortLabel}
          </Typography>
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: (theme) => ({
            mt: 1,
            p: 0.8,
            minWidth: 220,
            borderRadius: "32px",
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 18px 42px rgba(0,0,0,0.36)"
                : "0 16px 40px rgba(0,0,0,0.12)",
            overflow: "hidden",
          }),
        }}
      >
        {languages.map((lang) => {
          const selected = currentLanguage.code === lang.code;

          return (
            <MenuItem
              key={lang.code}
              selected={selected}
              onClick={() => handleChangeLanguage(lang.code as "en" | "ro")}
              sx={(theme) => ({
                px: 1.3,
                py: 1.2,
                borderRadius: "24px",
                mb: 0.4,
                backgroundColor: selected
                  ? alpha(theme.palette.primary.main, 0.16)
                  : "transparent",
              })}
            >
              <Box
                component="img"
                src={lang.flag}
                alt={lang.shortLabel}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  objectFit: "cover",
                  mr: 1.4,
                }}
              />
              <ListItemText
                primary={lang.fullLabel}
                secondary={lang.shortLabel}
                primaryTypographyProps={{
                  fontWeight: selected ? 800 : 700,
                  color: "inherit",
                }}
                secondaryTypographyProps={{
                  sx: (theme) => ({
                    color: theme.palette.text.secondary,
                  }),
                }}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
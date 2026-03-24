import { useState } from "react";
import {
  Box,
  Button,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
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
        sx={{
          minWidth: "unset",
          px: 1.6,
          py: 0.9,
          borderRadius: "999px",
          textTransform: "none",
          fontWeight: 700,
          color: "#1f2a37",
          backgroundColor: "#fff",
          border: "1px solid #ece7df",
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          "&:hover": {
            backgroundColor: "#faf8f4",
          },
        }}
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
          <Typography component="span" sx={{ fontWeight: 800, fontSize: 15 }}>
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
          sx: {
            mt: 1,
            p: 0.8,
            minWidth: 220,
            borderRadius: "32px",
            backgroundColor: "#fff",
            boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
            overflow: "hidden",
          },
        }}
      >
        {languages.map((lang) => {
          const selected = currentLanguage.code === lang.code;

          return (
            <MenuItem
              key={lang.code}
              onClick={() => handleChangeLanguage(lang.code as "en" | "ro")}
              selected={selected}
              sx={{
                minHeight: 64,
                px: 2,
                py: 1.2,
                my: 0.4,
                borderRadius: "999px",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                backgroundColor: selected ? "#f7f1e7" : "transparent",
                "&:hover": {
                  backgroundColor: selected ? "#f7f1e7" : "#faf8f4",
                },
                "&.Mui-selected": {
                  backgroundColor: "#f7f1e7",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "#f7f1e7",
                },
              }}
            >
              <Box
                component="img"
                src={lang.flag}
                alt={lang.shortLabel}
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                  display: "block",
                }}
              />

              <ListItemText
                primary={lang.fullLabel}
                secondary={lang.shortLabel}
                primaryTypographyProps={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#2a2a2a",
                }}
                secondaryTypographyProps={{
                  fontSize: 13,
                  color: "#7b7b7b",
                }}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
import {
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";

import { useSettings } from "../../../../hooks/useSettings";
import { scaleFont } from "../../../../utils/fontScale";
import { formatWeightByUnit } from "../../../../utils/weight";
import { useTranslation } from "react-i18next";

type Props = {
  name: string;
  breed: string;
  weight?: string;
  weightKg?: number | null;
  imageLetter: string;
  imageUrl?: string | null;
  imagePositionY?: number | null;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export const PetCard = ({
  name,
  breed,
  weight,
  weightKg,
  imageLetter,
  imageUrl,
  imagePositionY,
  onView,
  onEdit,
  onDelete,
}: Props) => {
  const { data: settings } = useSettings();
  const { t } = useTranslation("dashboard");

  const weightUnit: "kg" | "lb" =
    settings?.weightUnit === "lb" ? "lb" : "kg";

  const displayWeight =
    typeof weightKg === "number"
      ? formatWeightByUnit(weightKg, weightUnit)
      : weight ?? "—";

  return (
    <Box
      sx={(theme) => ({
        position: "relative",
        overflow: "hidden",
        borderRadius: "32px",
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${
          theme.palette.mode === "dark"
            ? alpha("#fff", 0.08)
            : "rgba(0,0,0,0.06)"
        }`,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 14px 38px rgba(0,0,0,0.34)"
            : "0 20px 52px rgba(7,28,66,0.08)",
        transition: "all 0.25s ease",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(12px)",
        minHeight: 260,
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 24px 58px rgba(0,0,0,0.46)"
              : "0 28px 70px rgba(245,166,35,0.16)",
        },
      })}
    >
      {/* Background Glow */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -90,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "rgba(245,166,35,0.12)",
          filter: "blur(24px)",
          pointerEvents: "none",
        }}
      />

      {/* Top Content */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3.2,
          p: 3.2,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Pet Image */}
        <Box
          sx={(theme) => ({
            position: "relative",
            width: 132,
            height: 132,
            minWidth: 132,
            borderRadius: "32px",
            overflow: "hidden",
            flexShrink: 0,
            background:
              theme.palette.mode === "dark"
                ? `linear-gradient(145deg, ${alpha(
                    theme.palette.primary.main,
                    0.24
                  )}, ${alpha(theme.palette.primary.light, 0.3)})`
                : "linear-gradient(145deg, #fff2d8, #ffe2a8)",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 12px 28px rgba(0,0,0,0.34)"
                : "0 14px 32px rgba(245,166,35,0.22)",
          })}
        >
          {imageUrl ? (
            <Box
              component="img"
              src={imageUrl}
              alt={name}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: `center ${imagePositionY ?? 22}%`,
                transform: "scale(1.08)",
                transition: "all 0.35s ease",
                display: "block",
                "&:hover": {
                  transform: "scale(1.12)",
                },
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={(theme) => ({
                  fontSize: scaleFont(50, settings?.textSize),
                  fontWeight: 900,
                  color: theme.palette.primary.main,
                  lineHeight: 1,
                  letterSpacing: "-2px",
                  userSelect: "none",
                })}
              >
                {imageLetter}
              </Typography>
            </Box>
          )}

          {/* Floating Paw */}
          <Box
            sx={{
              position: "absolute",
              bottom: 10,
              right: 10,
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 16px rgba(0,0,0,0.14)",
            }}
          >
            <PetsRoundedIcon
              sx={{
                fontSize: 18,
                color: "#f5a623",
              }}
            />
          </Box>
        </Box>

        {/* Pet Info */}
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            noWrap
            sx={(theme) => ({
              fontSize: scaleFont(34, settings?.textSize),
              fontWeight: 900,
              color: theme.palette.text.primary,
              letterSpacing: "-1px",
              lineHeight: 1.05,
            })}
          >
            {name}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              mt: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                px: 1.6,
                py: 0.7,
                borderRadius: 999,
                background: "rgba(245,166,35,0.12)",
                border: "1px solid rgba(245,166,35,0.18)",
              }}
            >
              <Typography
                sx={{
                  fontSize: scaleFont(14, settings?.textSize),
                  fontWeight: 800,
                  color: "#c77900",
                  lineHeight: 1,
                }}
              >
                {breed}
              </Typography>
            </Box>

            <Box
              sx={(theme) => ({
                px: 1.4,
                py: 0.7,
                borderRadius: 999,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha("#fff", 0.06)
                    : "#f4f6f9",
              })}
            >
              <Typography
                sx={(theme) => ({
                  fontSize: scaleFont(14, settings?.textSize),
                  color: theme.palette.text.secondary,
                  fontWeight: 800,
                  lineHeight: 1,
                })}
              >
                {displayWeight}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Divider */}
      <Box
        sx={(theme) => ({
          height: "1px",
          mx: 3.2,
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha("#fff", 0.06)
              : "rgba(0,0,0,0.06)",
        })}
      />

      {/* Actions */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.4,
          p: 2.8,
          pt: 2.4,
        }}
      >
        <Button
          fullWidth
          startIcon={
            <VisibilityOutlinedIcon
              sx={{ fontSize: "18px !important" }}
            />
          }
          onClick={onView}
          sx={{
            py: 1.45,
            borderRadius: "18px",
            background:
              "linear-gradient(135deg, #f5a623 0%, #f09015 100%)",
            color: "#fff",
            textTransform: "none",
            fontWeight: 800,
            fontSize: scaleFont(15, settings?.textSize),
            letterSpacing: "-0.2px",
            boxShadow: "0 8px 20px rgba(245,166,35,0.28)",
            transition: "all 0.18s ease",
            "&:hover": {
              background:
                "linear-gradient(135deg, #f0981a 0%, #e88510 100%)",
              boxShadow: "0 12px 28px rgba(245,166,35,0.42)",
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          }}
        >
          {t("view")}
        </Button>

        <IconButton
          onClick={onEdit}
          sx={(theme) => ({
            width: 54,
            height: 54,
            flexShrink: 0,
            borderRadius: "18px",
            backgroundColor:
              theme.palette.mode === "dark"
                ? alpha("#fff", 0.07)
                : "#f4f6f8",
            color: theme.palette.text.secondary,
            border: `1px solid ${theme.palette.divider}`,
            transition: "all 0.18s ease",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? alpha("#fff", 0.12)
                  : "#e8edf4",
              color: theme.palette.text.primary,
              transform: "translateY(-1px)",
            },
          })}
        >
          <EditOutlinedIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <IconButton
          onClick={onDelete}
          sx={(theme) => ({
            width: 54,
            height: 54,
            flexShrink: 0,
            borderRadius: "18px",
            backgroundColor:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.error.main, 0.12)
                : "#fff1f1",
            color: theme.palette.error.main,
            border: `1px solid ${alpha(
              theme.palette.error.main,
              0.15
            )}`,
            transition: "all 0.18s ease",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.error.main, 0.22)
                  : "#ffe4e4",
              transform: "translateY(-1px)",
            },
          })}
        >
          <DeleteOutlineOutlinedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
    </Box>
  );
};
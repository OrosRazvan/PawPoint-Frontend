import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useSettings } from "../../../../hooks/useSettings";
import { scaleFont } from "../../../../utils/fontScale";
import { useTranslation } from "react-i18next";

type Props = {
  name: string;
  breed: string;
  weight: string;
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
  imageLetter,
  imageUrl,
  imagePositionY,
  onView,
  onEdit,
  onDelete,
}: Props) => {
  const { data: settings } = useSettings();
  const { t } = useTranslation("dashboard");

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        borderRadius: 5,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        overflow: "hidden",
        transition: "box-shadow 0.22s ease, transform 0.22s ease",
        "&:hover": {
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 16px 40px rgba(0,0,0,0.32), 0 2px 8px rgba(0,0,0,0.2)"
              : "0 16px 40px rgba(7,28,66,0.1), 0 2px 8px rgba(7,28,66,0.05)",
          transform: "translateY(-3px)",
        },
      })}
    >
      {/* Image area */}
      <Box
        sx={(theme) => ({
          height: 190,
          background: imageUrl
            ? "transparent"
            : theme.palette.mode === "dark"
            ? `linear-gradient(140deg, ${alpha(theme.palette.primary.main, 0.18)} 0%, ${alpha(
                theme.palette.primary.light,
                0.26
              )} 100%)`
            : "linear-gradient(140deg, #fff8f0 0%, #fde8c8 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        })}
      >
        {!imageUrl && (
          <>
            <Box
              sx={(theme) => ({
                position: "absolute",
                width: 160,
                height: 160,
                borderRadius: "50%",
                background:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.primary.main, 0.1)
                    : "rgba(245,166,35,0.1)",
                top: -30,
                right: -20,
              })}
            />
            <Box
              sx={(theme) => ({
                position: "absolute",
                width: 80,
                height: 80,
                borderRadius: "50%",
                background:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.primary.main, 0.08)
                    : "rgba(245,166,35,0.08)",
                bottom: -10,
                left: 10,
              })}
            />
          </>
        )}

        {imageUrl ? (
          <Box
            component="img"
            src={imageUrl}
            alt={name}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: `center ${imagePositionY ?? 50}%`,
            }}
          />
        ) : (
          <Typography
            sx={(theme) => ({
              fontSize: scaleFont(56, settings?.textSize),
              fontWeight: 900,
              color: theme.palette.primary.main,
              lineHeight: 1,
              position: "relative",
              zIndex: 1,
              letterSpacing: "-2px",
            })}
          >
            {imageLetter}
          </Typography>
        )}
      </Box>

      {/* Content area */}
      <Box sx={{ p: 2.5 }}>
        <Stack spacing={0.3} sx={{ mb: 2.5 }}>
          <Typography
            sx={(theme) => ({
              fontSize: scaleFont(18, settings?.textSize),
              fontWeight: 800,
              color: theme.palette.text.primary,
              letterSpacing: "-0.4px",
              lineHeight: 1.2,
            })}
          >
            {name}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              sx={(theme) => ({
                fontSize: scaleFont(13, settings?.textSize),
                color: theme.palette.text.secondary,
                fontWeight: 500,
              })}
            >
              {breed}
            </Typography>
            <Box
              sx={(theme) => ({
                width: 3,
                height: 3,
                borderRadius: "50%",
                backgroundColor: alpha(theme.palette.text.secondary, 0.4),
              })}
            />
            <Typography
              sx={(theme) => ({
                fontSize: scaleFont(13, settings?.textSize),
                color: theme.palette.text.secondary,
                fontWeight: 500,
              })}
            >
              {weight}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            fullWidth
            startIcon={<VisibilityOutlinedIcon sx={{ fontSize: "17px !important" }} />}
            onClick={onView}
            sx={{
              py: 1.25,
              borderRadius: 3,
              background: "linear-gradient(135deg, #f5a623 0%, #f09015 100%)",
              color: "#fff",
              textTransform: "none",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "-0.1px",
              boxShadow: "0 4px 14px rgba(245,166,35,0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #f0981a 0%, #e88510 100%)",
                boxShadow: "0 6px 20px rgba(245,166,35,0.4)",
              },
            }}
          >
            {t("view")}
          </Button>

          <IconButton
            onClick={onEdit}
            sx={(theme) => ({
              width: 50,
              height: 50,
              borderRadius: 3,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? alpha("#ffffff", 0.06)
                  : "#f0f3f8",
              color: theme.palette.text.secondary,
              border: `1px solid ${theme.palette.divider}`,
              transition: "all 0.15s ease",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha("#ffffff", 0.1)
                    : "#e4eaf2",
              },
            })}
          >
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>

          <IconButton
            onClick={onDelete}
            sx={(theme) => ({
              width: 50,
              height: 50,
              borderRadius: 3,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.error.main, 0.12)
                  : "#fef0f0",
              color: theme.palette.error.main,
              border: `1px solid ${alpha(theme.palette.error.main, 0.15)}`,
              transition: "all 0.15s ease",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.error.main, 0.2)
                    : alpha(theme.palette.error.main, 0.1),
              },
            })}
          >
            <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
      </Box>
    </Paper>
  );
};
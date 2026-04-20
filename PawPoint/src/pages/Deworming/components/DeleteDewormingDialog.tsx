import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  Box,
  Divider,
  Button,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import { useSettings } from "../../../hooks/useSettings";
import { scaleFont } from "../../../utils/fontScale";
import type { DewormingCardItem } from "../types/deworming";
import { DewormingTypeLabels } from "../types/deworming";

type Props = {
  open: boolean;
  item: DewormingCardItem | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
};

const formatDewormingType = (
  value: number,
  t: (key: string) => string
) => {
  const label = DewormingTypeLabels[value];

  switch (label) {
    case "Internal":
      return t("deworming:typeInternal");
    case "External":
      return t("deworming:typeExternal");
    case "Combined":
      return t("deworming:typeCombined");
    case "Control":
      return t("deworming:typeControl");
    default:
      return t("deworming:unknown");
  }
};

export const DeleteDewormingDialog = ({
  open,
  item,
  onClose,
  onConfirm,
  isLoading,
}: Props) => {
  const { t } = useTranslation(["deworming"]);
  const { data: settings } = useSettings();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: (theme) => ({
          borderRadius: 4,
          overflow: "hidden",
          backgroundColor: theme.palette.background.paper,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 24px 64px rgba(0,0,0,0.38), 0 4px 12px rgba(0,0,0,0.24)"
              : "0 24px 64px rgba(7,28,66,0.14), 0 4px 12px rgba(7,28,66,0.06)",
        }),
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box
          sx={(theme) => ({
            px: 3.5,
            pt: 3,
            pb: 2.5,
            background:
              theme.palette.mode === "dark"
                ? `linear-gradient(135deg, ${alpha(
                    theme.palette.error.main,
                    0.14
                  )} 0%, ${alpha(theme.palette.background.paper, 0.96)} 100%)`
                : "linear-gradient(135deg, #fff5f5 0%, #fff0f0 100%)",
            position: "relative",
            overflow: "hidden",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -24,
              right: -24,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.error.main, 0.12)
                  : "rgba(229,53,53,0.07)",
              pointerEvents: "none",
            },
          })}
        >
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, #e53535 0%, #c72b2b 100%)",
                  color: "#fff",
                  flexShrink: 0,
                  boxShadow: "0 4px 12px rgba(229,53,53,0.35)",
                }}
              >
                <DeleteOutlineRoundedIcon sx={{ fontSize: 22 }} />
              </Box>

              <Box>
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(19, settings?.textSize),
                    fontWeight: 800,
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                    letterSpacing: "-0.3px",
                  })}
                >
                  {t("deworming:deleteDialogTitle")}
                </Typography>
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(13, settings?.textSize),
                    color: theme.palette.text.secondary,
                    mt: 0.4,
                    fontWeight: 400,
                  })}
                >
                  {t("deworming:deleteDialogSubtitle")}
                </Typography>
              </Box>
            </Stack>

            <IconButton
              onClick={onClose}
              size="small"
              sx={(theme) => ({
                color: theme.palette.text.secondary,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha("#ffffff", 0.06)
                    : "rgba(0,0,0,0.04)",
                borderRadius: 2,
                width: 32,
                height: 32,
                mt: 0.5,
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha("#ffffff", 0.1)
                      : "rgba(0,0,0,0.08)",
                  color: theme.palette.text.primary,
                },
              })}
            >
              <CloseRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        </Box>

        <Divider />
      </DialogTitle>

      <DialogContent
        sx={{
          px: 3.5,
          pb: 3.5,
          "&.MuiDialogContent-root": {
            pt: 5,
          },
          "&.MuiDialogContent-root:first-of-type": {
            pt: 2,
          },
        }}
      >
        <Stack spacing={3}>
          {item && (
            <Box
              sx={(theme) => ({
                mt: 1,
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 2.5,
                py: 2,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha("#ffffff", 0.03)
                    : theme.palette.background.paper,
              })}
            >
              <Box
                sx={(theme) => ({
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  flexShrink: 0,
                  background:
                    theme.palette.mode === "dark"
                      ? `linear-gradient(135deg, ${alpha(
                          theme.palette.primary.main,
                          0.14
                        )} 0%, ${alpha(theme.palette.primary.light, 0.22)} 100%)`
                      : "linear-gradient(135deg, #fbf2ea 0%, #fde8c8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: scaleFont(22, settings?.textSize),
                  fontWeight: 800,
                  color: theme.palette.primary.main,
                  overflow: "hidden",
                })}
              >
                {item.animalName?.charAt(0)?.toUpperCase() ?? "D"}
              </Box>

              <Box>
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(15, settings?.textSize),
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    letterSpacing: "-0.2px",
                  })}
                >
                  {item.animalName}
                </Typography>
                <Typography
                  sx={(theme) => ({
                    fontSize: scaleFont(13, settings?.textSize),
                    color: theme.palette.text.secondary,
                    mt: 0.2,
                  })}
                >
                  {formatDewormingType(item.type, t)}
                </Typography>
              </Box>
            </Box>
          )}

          <Box
            sx={(theme) => ({
              px: 2,
              py: 1.75,
              borderRadius: 3,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.error.main, 0.1)
                  : "#fff5f5",
              border: `1px solid ${
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.error.main, 0.24)
                  : "#fcd9d9"
              }`,
            })}
          >
            <Typography
              sx={(theme) => ({
                fontSize: scaleFont(13.5, settings?.textSize),
                color:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.error.main, 0.95)
                    : "#7a3030",
                lineHeight: 1.65,
              })}
            >
              {t("deworming:deleteConfirmMessage")}
            </Typography>
          </Box>

          <Divider />

          <Stack direction="row" spacing={1.5}>
            <Button
              fullWidth
              onClick={onClose}
              sx={(theme) => ({
                py: 1.35,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 600,
                fontSize: scaleFont(14, settings?.textSize),
                color: theme.palette.text.secondary,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha("#ffffff", 0.06)
                    : "#f0f2f7",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha("#ffffff", 0.1)
                      : "#e8ecf3",
                },
              })}
            >
              {t("deworming:cancel")}
            </Button>

            <LoadingButton
              fullWidth
              loading={isLoading}
              onClick={onConfirm}
              variant="contained"
              sx={{
                py: 1.35,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 700,
                fontSize: scaleFont(14, settings?.textSize),
                background: "linear-gradient(135deg, #e53535 0%, #c72b2b 100%)",
                color: "#fff",
                boxShadow: "0 8px 18px rgba(229,53,53,0.28)",
                "&:hover": {
                  background: "linear-gradient(135deg, #d92d2d 0%, #b92525 100%)",
                  boxShadow: "0 10px 22px rgba(229,53,53,0.34)",
                },
              }}
            >
              {t("deworming:deleteConfirm")}
            </LoadingButton>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
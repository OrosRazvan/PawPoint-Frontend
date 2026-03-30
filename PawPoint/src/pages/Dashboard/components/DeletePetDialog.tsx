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
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import type { DashboardPet } from "../types/dashboard";

type Props = {
  open: boolean;
  pet: DashboardPet | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
};

export const DeletePetDialog = ({
  open,
  pet,
  onClose,
  onConfirm,
  isLoading,
}: Props) => {
  const { t } = useTranslation(["dashboard"]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          backgroundColor: "#faf8f5",
          boxShadow:
            "0 24px 64px rgba(7,28,66,0.14), 0 4px 12px rgba(7,28,66,0.06)",
        },
      }}
    >
      {/* ── Header ── */}
      <DialogTitle sx={{ p: 0 }}>
        <Box
          sx={{
            px: 3.5,
            pt: 3,
            pb: 2.5,
            background: "linear-gradient(135deg, #fff5f5 0%, #fff0f0 100%)",
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
              background: "rgba(229,53,53,0.07)",
              pointerEvents: "none",
            },
          }}
        >
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              {/* Icon badge */}
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
                  sx={{
                    fontSize: 19,
                    fontWeight: 800,
                    color: "#071c42",
                    lineHeight: 1.2,
                    letterSpacing: "-0.3px",
                  }}
                >
                  {t("dashboard:deletePetTitle")}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#8a95a3",
                    mt: 0.4,
                    fontWeight: 400,
                  }}
                >
                  {t("dashboard:deletePetSubtitle")}
                </Typography>
              </Box>
            </Stack>

            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: "#9ca3af",
                backgroundColor: "rgba(0,0,0,0.04)",
                borderRadius: 2,
                width: 32,
                height: 32,
                mt: 0.5,
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.08)",
                  color: "#4b5563",
                },
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: "#ede8e0" }} />
      </DialogTitle>

      {/* ── Body ── */}
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
          {/* Pet preview pill */}
          {pet && (
            <Box
                sx={{
                mt: 1,
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 2.5,
                py: 2,
                borderRadius: 3,
                border: "1px solid #ede8e0",
                backgroundColor: "#fff",
                }}
            >
              {/* Avatar */}
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  flexShrink: 0,
                  background: "linear-gradient(135deg, #fbf2ea 0%, #fde8c8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#f5a623",
                  overflow: "hidden",
                }}
              >
                {pet.imageUrl ? (
                  <Box
                    component="img"
                    src={pet.imageUrl}
                    alt={pet.name}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  pet.imageLetter
                )}
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#071c42",
                    letterSpacing: "-0.2px",
                  }}
                >
                  {pet.name}
                </Typography>
                <Typography sx={{ fontSize: 13, color: "#8a95a3", mt: 0.2 }}>
                  {pet.breed} · {pet.weight}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Warning message */}
          <Box
            sx={{
              px: 2,
              py: 1.75,
              borderRadius: 3,
              backgroundColor: "#fff5f5",
              border: "1px solid #fcd9d9",
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#e53535",
                flexShrink: 0,
                mt: 0.7,
              }}
            />
            <Typography
              sx={{
                fontSize: 13.5,
                color: "#7a3030",
                lineHeight: 1.65,
              }}
            >
              {t("dashboard:deletePetConfirmMessage") ??
                t("dashboard:deletePetConfirmMessage")}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: "#ede8e0" }} />

          {/* Buttons */}
          <Stack direction="row" spacing={1.5}>
            <Button
              fullWidth
              onClick={onClose}
              sx={{
                py: 1.35,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 600,
                fontSize: 14,
                color: "#4b5563",
                backgroundColor: "#f0f2f7",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#e4e8f0",
                },
              }}
            >
              {t("dashboard:cancel")}
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
                fontSize: 14,
                letterSpacing: "-0.1px",
                background: "linear-gradient(135deg, #e53535 0%, #c72b2b 100%)",
                color: "#fff",
                boxShadow: "0 4px 14px rgba(229,53,53,0.35)",
                transition: "all 0.2s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #d42e2e 0%, #b82525 100%)",
                  boxShadow: "0 6px 18px rgba(229,53,53,0.4)",
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  transform: "translateY(0)",
                  boxShadow: "0 2px 8px rgba(229,53,53,0.3)",
                },
              }}
            >
              {t("dashboard:deletePetConfirm")}
            </LoadingButton>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
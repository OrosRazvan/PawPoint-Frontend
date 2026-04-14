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

const formatDewormingType = (value: number) => {
  return DewormingTypeLabels[value] ?? "Unknown";
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
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          backgroundColor: "#faf8f5",
        },
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box
          sx={{
            px: 3.5,
            pt: 3,
            pb: 2.5,
            background: "linear-gradient(135deg, #fff5f5 0%, #fff0f0 100%)",
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #e53535 0%, #c72b2b 100%)",
                  color: "#fff",
                }}
              >
                <DeleteOutlineRoundedIcon sx={{ fontSize: 22 }} />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: scaleFont(19, settings?.textSize),
                    fontWeight: 800,
                    color: "#071c42",
                  }}
                >
                  {t("deworming:deleteDialogTitle")}
                </Typography>
                <Typography
                  sx={{
                    fontSize: scaleFont(13, settings?.textSize),
                    color: "#8a95a3",
                    mt: 0.4,
                  }}
                >
                  {t("deworming:deleteDialogSubtitle")}
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
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: "#ede8e0" }} />
      </DialogTitle>

      <DialogContent sx={{ px: 3.5, pt: 3, pb: 3.5 }}>
        <Stack spacing={3}>
          {item && (
            <Box
              sx={{
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
              <Box>
                <Typography
                  sx={{
                    fontSize: scaleFont(15, settings?.textSize),
                    fontWeight: 700,
                    color: "#071c42",
                  }}
                >
                  {item.animalName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: scaleFont(13, settings?.textSize),
                    color: "#8a95a3",
                    mt: 0.2,
                  }}
                >
                  {formatDewormingType(item.type)}
                </Typography>
              </Box>
            </Box>
          )}

          <Box
            sx={{
              px: 2,
              py: 1.75,
              borderRadius: 3,
              backgroundColor: "#fff5f5",
              border: "1px solid #fcd9d9",
            }}
          >
            <Typography
              sx={{
                fontSize: scaleFont(13.5, settings?.textSize),
                color: "#7a3030",
                lineHeight: 1.65,
              }}
            >
              {t("deworming:deleteConfirmMessage")}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: "#ede8e0" }} />

          <Stack direction="row" spacing={1.5}>
            <Button
              fullWidth
              onClick={onClose}
              sx={{
                py: 1.35,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 600,
                fontSize: scaleFont(14, settings?.textSize),
                color: "#4b5563",
                backgroundColor: "#f0f2f7",
              }}
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
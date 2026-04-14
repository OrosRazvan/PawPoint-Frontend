import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useSettings } from "../../../../hooks/useSettings";
import { scaleFont } from "../../../../utils/fontScale";

type Props = {
  name: string;
  breed: string;
  weight: string;
  imageLetter: string;
  imageUrl?: string | null;
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
  onView,
  onEdit,
  onDelete,
}: Props) => {
  const { data: settings } = useSettings();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 4,
        border: "1px solid #ede8e0",
        backgroundColor: "#faf8f5",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        "&:hover": {
          boxShadow:
            "0 12px 32px rgba(7,28,66,0.09), 0 2px 8px rgba(7,28,66,0.04)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          height: 200,
          borderRadius: 3,
          background: imageUrl
            ? "transparent"
            : "linear-gradient(135deg, #fbf2ea 0%, #fde8c8 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {!imageUrl && (
          <Box
            sx={{
              position: "absolute",
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "rgba(245,166,35,0.15)",
            }}
          />
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
            }}
          />
        ) : (
          <Typography
            sx={{
              fontSize: scaleFont(52, settings?.textSize),
              fontWeight: 800,
              color: "#f5a623",
              lineHeight: 1,
              position: "relative",
              zIndex: 1,
              textShadow: "0 2px 8px rgba(245,166,35,0.25)",
            }}
          >
            {imageLetter}
          </Typography>
        )}
      </Box>

      <Stack spacing={0.4} sx={{ mb: 2 }}>
        <Typography
          sx={{
            fontSize: scaleFont(18, settings?.textSize),
            fontWeight: 800,
            color: "#071c42",
            letterSpacing: "-0.3px",
            lineHeight: 1.2,
          }}
        >
          {name}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={0.8}>
          <Typography
            sx={{
              fontSize: scaleFont(13, settings?.textSize),
              color: "#8a95a3",
              fontWeight: 500,
            }}
          >
            {breed}
          </Typography>
          <Box
            sx={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              backgroundColor: "#c9d0da",
            }}
          />
          <Typography
            sx={{
              fontSize: scaleFont(13, settings?.textSize),
              color: "#8a95a3",
              fontWeight: 500,
            }}
          >
            {weight}
          </Typography>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
        <Button
          fullWidth
          startIcon={
            <VisibilityOutlinedIcon sx={{ fontSize: "18px !important" }} />
          }
          onClick={onView}
          sx={{
            py: 1.2,
            borderRadius: 2.5,
            background: "linear-gradient(135deg, #f5a623 0%, #f09015 100%)",
            color: "#fff",
            textTransform: "none",
            fontSize: scaleFont(14, settings?.textSize),
            fontWeight: 700,
            letterSpacing: "-0.1px",
            boxShadow: "0 4px 12px rgba(245,166,35,0.35)",
            transition: "all 0.2s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #f0981a 0%, #e88510 100%)",
              boxShadow: "0 6px 16px rgba(245,166,35,0.45)",
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0)",
              boxShadow: "0 2px 6px rgba(245,166,35,0.3)",
            },
          }}
        >
          View
        </Button>

        <IconButton
          onClick={onEdit}
          sx={{
            width: 46,
            height: 46,
            borderRadius: 2.5,
            backgroundColor: "#f0f2f7",
            color: "#4b5563",
            flexShrink: 0,
            transition: "all 0.15s ease",
            "&:hover": {
              backgroundColor: "#e4e8f0",
              color: "#071c42",
            },
          }}
        >
          <EditOutlinedIcon sx={{ fontSize: 19 }} />
        </IconButton>

        <IconButton
          onClick={onDelete}
          sx={{
            width: 46,
            height: 46,
            borderRadius: 2.5,
            backgroundColor: "#fff0f0",
            color: "#e53535",
            flexShrink: 0,
            transition: "all 0.15s ease",
            "&:hover": {
              backgroundColor: "#ffe4e4",
              color: "#c72b2b",
            },
          }}
        >
          <DeleteOutlineOutlinedIcon sx={{ fontSize: 19 }} />
        </IconButton>
      </Stack>
    </Paper>
  );
};
import { Box, IconButton, Paper, Stack, Typography, Button } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

type Props = {
  name: string;
  breed: string;
  weight: string;
  imageLetter: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export const PetCard = ({
  name,
  breed,
  weight,
  imageLetter,
  onView,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid #dddddd",
        backgroundColor: "#fcfcfc",
      }}
    >
      <Box
        sx={{
          height: 240,
          borderRadius: 3,
          backgroundColor: "#e7e8fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#2457ea",
          fontSize: 48,
          fontWeight: 800,
          mb: 2,
        }}
      >
        {imageLetter}
      </Box>

      <Stack spacing={0.75}>
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 700,
            color: "#071c42",
          }}
        >
          {name}
        </Typography>

        <Typography
          sx={{
            fontSize: 16,
            color: "#43556f",
          }}
        >
          {breed} • {weight}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
        <Button
          fullWidth
          startIcon={<VisibilityOutlinedIcon />}
          onClick={onView}
          sx={{
            py: 1.25,
            borderRadius: 3,
            backgroundColor: "#edf3fb",
            color: "#1657ff",
            textTransform: "none",
            fontSize: 16,
            "&:hover": {
              backgroundColor: "#e4edf9",
            },
          }}
        >
          View
        </Button>

        <IconButton
          onClick={onEdit}
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2.5,
            backgroundColor: "#eceff4",
            color: "#374151",
          }}
        >
          <EditOutlinedIcon />
        </IconButton>

        <IconButton
          onClick={onDelete}
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2.5,
            backgroundColor: "#faeded",
            color: "#ff1e1e",
          }}
        >
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </Stack>
    </Paper>
  );
};
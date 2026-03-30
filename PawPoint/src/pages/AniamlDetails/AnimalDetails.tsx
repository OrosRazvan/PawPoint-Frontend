import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ScaleOutlinedIcon from "@mui/icons-material/ScaleOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import TransgenderOutlinedIcon from "@mui/icons-material/TransgenderOutlined";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import { useAnimalById } from "../../hooks/useAnimalById";
import { useDeleteAnimal } from "../../hooks/useDeleteAnimal";
import { EditPetDialog } from "../Dashboard/components/EditPetDialog";
import { DeletePetDialog } from "../Dashboard/components/DeletePetDialog";
import type { DashboardPet } from "../Dashboard/types/dashboard";

const formatBirthDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("ro-RO");
};

const getInitial = (name?: string) => name?.charAt(0)?.toUpperCase() ?? "?";

export const AnimalDetails = () => {
  const navigate = useNavigate();
  const { animalId } = useParams();
  const parsedAnimalId = animalId ? Number(animalId) : undefined;

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const deleteAnimalMutation = useDeleteAnimal();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data, isLoading, isError } = useAnimalById(parsedAnimalId);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const dashboardPet: DashboardPet | null = useMemo(() => {
    if (!data) return null;
    return {
      id: String(data.id),
      name: data.name,
      breed: data.breed ?? data.species ?? "Unknown",
      weight:
        typeof data.weightKg === "number"
          ? `${data.weightKg} kg`
          : typeof data.weight === "number"
          ? `${data.weight} kg`
          : "—",
      imageLetter: getInitial(data.name),
      imageUrl: data.profilePictureUrl ?? null,
      species: data.species ?? "",
      weightKg:
        typeof data.weightKg === "number"
          ? data.weightKg
          : typeof data.weight === "number"
          ? data.weight
          : undefined,
      birthDate: data.birthDate ?? null,
      sex: data.sex ?? "",
      microchipNumber: data.microchipNumber ?? "",
    };
  }, [data]);

  const handleDelete = () => {
    if (!dashboardPet) return;
    deleteAnimalMutation.mutate(Number(dashboardPet.id), {
      onSuccess: () => {
        enqueueSnackbar("Pet deleted successfully.", { variant: "success" });
        queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
        navigate("/dashboard");
      },
      onError: () => {
        enqueueSnackbar("An error occurred while deleting the pet.", {
          variant: "error",
        });
      },
    });
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f4ef", display: "flex", flexDirection: "column" }}>
      {isLoading ? (
        <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
          <CircularProgress sx={{ color: "#f5a623" }} />
        </Box>
      ) : isError || !data || !dashboardPet ? (
        <Box sx={{ px: 6, py: 8 }}>
          <Typography color="error">Failed to load pet details.</Typography>
        </Box>
      ) : (
        <Grid container sx={{ flex: 1, minHeight: "100vh" }}>

          {/* ══ LEFT — hero panel ══ */}
          <Grid
            size={{ xs: 12, md: 4, lg: 3.5 }}
            sx={{
              background: "linear-gradient(170deg, #fbf2ea 0%, #fde8c8 50%, #faf6f0 100%)",
              borderRight: { md: "1px solid #ede8e0" },
              borderBottom: { xs: "1px solid #ede8e0", md: "none" },
              display: "flex",
              flexDirection: "column",
              px: { xs: 4, md: 5 },
              py: { xs: 4, md: 5 },
              position: "relative",
              overflow: "hidden",
              minHeight: { md: "100vh" },
            }}
          >
            {/* Decorative blobs */}
            <Box sx={{ position: "absolute", top: -70, right: -70, width: 240, height: 240, borderRadius: "50%", background: "rgba(245,166,35,0.09)", pointerEvents: "none" }} />
            <Box sx={{ position: "absolute", bottom: -50, left: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(245,166,35,0.07)", pointerEvents: "none" }} />
            <Box sx={{ position: "absolute", top: "40%", left: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(245,166,35,0.05)", pointerEvents: "none" }} />

            {/* ── Back button ── */}
            <Box sx={{ position: "relative", zIndex: 1, mb: { xs: 4, md: 6 } }}>
              <Button
                startIcon={<ArrowBackRoundedIcon sx={{ fontSize: "16px !important" }} />}
                onClick={() => navigate("/dashboard")}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 13,
                  color: "#b07830",
                  px: 0,
                  "&:hover": { color: "#071c42", backgroundColor: "transparent" },
                }}
              >
                Back to dashboard
              </Button>
            </Box>

            {/* ── Avatar + name (centered, takes remaining space) ── */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Avatar */}
              <Box
                sx={{
                  width: { xs: 110, md: 148 },
                  height: { xs: 110, md: 148 },
                  borderRadius: 5,
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: { xs: 48, md: 62 },
                  fontWeight: 800,
                  color: "#f5a623",
                  overflow: "hidden",
                  flexShrink: 0,
                  boxShadow: "0 20px 56px rgba(245,166,35,0.2), 0 4px 16px rgba(7,28,66,0.08)",
                  border: "4px solid #fff",
                  mb: 3,
                }}
              >
                {data.profilePictureUrl ? (
                  <Box
                    component="img"
                    src={data.profilePictureUrl}
                    alt={data.name}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  getInitial(data.name)
                )}
              </Box>

              <Typography
                sx={{
                  fontSize: { xs: 30, md: 38 },
                  fontWeight: 800,
                  color: "#071c42",
                  lineHeight: 1.1,
                  letterSpacing: "-0.6px",
                  textAlign: "center",
                }}
              >
                {data.name}
              </Typography>

              <Stack
                direction="row"
                sx={{ mt: 1.5, flexWrap: "wrap", justifyContent: "center", gap: 0.8 }}
              >
                <Chip
                  icon={<PetsRoundedIcon sx={{ fontSize: "13px !important", color: "#f5a623 !important" }} />}
                  label={data.breed ?? data.species ?? "—"}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(245,166,35,0.13)",
                    color: "#b87010",
                    fontWeight: 700,
                    fontSize: 12,
                    border: "1px solid rgba(245,166,35,0.28)",
                    borderRadius: 2,
                    height: 28,
                    "& .MuiChip-label": { px: 1.2 },
                  }}
                />
                {data.sex && (
                  <Chip
                    label={data.sex}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(7,28,66,0.06)",
                      color: "#4b5563",
                      fontWeight: 700,
                      fontSize: 12,
                      borderRadius: 2,
                      height: 28,
                      "& .MuiChip-label": { px: 1.2 },
                    }}
                  />
                )}
              </Stack>

              {/* Stat pills */}
              <Stack spacing={1.2} sx={{ mt: 4, width: "100%" }}>
                <StatPill
                  icon={<ScaleOutlinedIcon sx={{ fontSize: 15 }} />}
                  label="Weight"
                  value={
                    typeof data.weightKg === "number"
                      ? `${data.weightKg} kg`
                      : typeof data.weight === "number"
                      ? `${data.weight} kg`
                      : "—"
                  }
                />
                <StatPill
                  icon={<CakeOutlinedIcon sx={{ fontSize: 15 }} />}
                  label="Born"
                  value={formatBirthDate(data.birthDate)}
                />
                {data.species && (
                  <StatPill
                    icon={<PetsRoundedIcon sx={{ fontSize: 15 }} />}
                    label="Species"
                    value={data.species}
                  />
                )}
              </Stack>
            </Box>

            {/* ── Edit / Delete buttons at bottom ── */}
            <Stack
              spacing={1.2}
              sx={{ position: "relative", zIndex: 1, mt: { xs: 4, md: 6 } }}
            >
              <Button
                fullWidth
                startIcon={<EditOutlinedIcon sx={{ fontSize: "17px !important" }} />}
                onClick={() => setIsEditOpen(true)}
                sx={{
                  py: 1.4,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#fff",
                  background: "linear-gradient(135deg, #f5a623 0%, #f09015 100%)",
                  boxShadow: "0 4px 14px rgba(245,166,35,0.35)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: "linear-gradient(135deg, #f0981a 0%, #e88510 100%)",
                    boxShadow: "0 6px 18px rgba(245,166,35,0.45)",
                    transform: "translateY(-1px)",
                  },
                  "&:active": { transform: "translateY(0)" },
                }}
              >
                Edit pet
              </Button>

              <Button
                fullWidth
                startIcon={<DeleteOutlineOutlinedIcon sx={{ fontSize: "17px !important" }} />}
                onClick={() => setIsDeleteOpen(true)}
                sx={{
                  py: 1.4,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#e53535",
                  backgroundColor: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(229,53,53,0.2)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#fff0f0",
                    border: "1px solid rgba(229,53,53,0.35)",
                  },
                }}
              >
                Delete pet
              </Button>
            </Stack>
          </Grid>

          {/* ══ RIGHT — details panel ══ */}
          <Grid
            size={{ xs: 12, md: 8, lg: 8.5 }}
            sx={{
              px: { xs: 3, sm: 5, md: 8 },
              py: { xs: 4, md: 7 },
              backgroundColor: "#f8f4ef",
            }}
          >
            <Typography
              sx={{
                fontSize: 22,
                fontWeight: 800,
                color: "#071c42",
                letterSpacing: "-0.4px",
                mb: 3,
              }}
            >
              All details
            </Typography>

            <Box
              sx={{
                borderRadius: 4,
                border: "1px solid #ede8e0",
                backgroundColor: "#faf8f5",
                overflow: "hidden",
                boxShadow: "0 2px 16px rgba(7,28,66,0.05)",
              }}
            >
              <DetailRow
                icon={<PetsRoundedIcon sx={{ fontSize: 16 }} />}
                label="Species"
                value={data.species ?? "—"}
              />
              <DetailRow
                icon={<PetsRoundedIcon sx={{ fontSize: 16 }} />}
                label="Breed"
                value={data.breed ?? "—"}
              />
              <DetailRow
                icon={<ScaleOutlinedIcon sx={{ fontSize: 16 }} />}
                label="Weight"
                value={
                  typeof data.weightKg === "number"
                    ? `${data.weightKg} kg`
                    : typeof data.weight === "number"
                    ? `${data.weight} kg`
                    : "—"
                }
              />
              <DetailRow
                icon={<CakeOutlinedIcon sx={{ fontSize: 16 }} />}
                label="Birth date"
                value={formatBirthDate(data.birthDate)}
              />
              <DetailRow
                icon={<TransgenderOutlinedIcon sx={{ fontSize: 16 }} />}
                label="Sex"
                value={data.sex ?? "—"}
              />
              <DetailRow
                icon={<FingerprintOutlinedIcon sx={{ fontSize: 16 }} />}
                label="Microchip number"
                value={data.microchipNumber ?? "—"}
                isLast
              />
            </Box>
          </Grid>
        </Grid>
      )}

      {dashboardPet && (
        <>
          <EditPetDialog
            open={isEditOpen}
            onClose={() => {
              setIsEditOpen(false);
              queryClient.invalidateQueries({ queryKey: ["animalById", parsedAnimalId] });
              queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
            }}
            pet={dashboardPet}
          />
          <DeletePetDialog
            open={isDeleteOpen}
            pet={dashboardPet}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={handleDelete}
            isLoading={deleteAnimalMutation.isPending}
          />
        </>
      )}
    </Box>
  );
};

// ── StatPill ──
type StatPillProps = { icon: React.ReactNode; label: string; value: string };
const StatPill = ({ icon, label, value }: StatPillProps) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      px: 2,
      py: 1.4,
      borderRadius: 3,
      backgroundColor: "rgba(255,255,255,0.75)",
      border: "1px solid rgba(245,166,35,0.2)",
    }}
  >
    <Stack direction="row" spacing={1.2} alignItems="center">
      <Box sx={{ color: "#f5a623" }}>{icon}</Box>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#8a95a3" }}>
        {label}
      </Typography>
    </Stack>
    <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#071c42" }}>
      {value}
    </Typography>
  </Box>
);

// ── DetailRow ──
type DetailRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLast?: boolean;
};
const DetailRow = ({ icon, label, value, isLast }: DetailRowProps) => (
  <>
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        py: 2.2,
        px: 3,
        transition: "background 0.15s",
        "&:hover": { backgroundColor: "rgba(245,166,35,0.035)" },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2.5,
            backgroundColor: "#f0f2f7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#8a95a3",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#6b7280" }}>
          {label}
        </Typography>
      </Stack>
      <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#071c42" }}>
        {value}
      </Typography>
    </Stack>
    {!isLast && <Divider sx={{ borderColor: "#f0ece6", mx: 3 }} />}
  </>
);
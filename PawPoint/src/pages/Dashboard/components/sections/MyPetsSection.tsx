import { useState } from "react";
import { Button, Grid } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { SectionCard } from "../cards/SectionCard";
import { PetCard } from "../cards/PetCard";
import { DeletePetDialog } from "../DeletePetDialog";
import type { DashboardPet } from "../../types/dashboard";

type Props = {
  title: string;
  addPetLabel: string;
  pets: DashboardPet[];
  onAddPet?: () => void;
  onViewPet: (pet: DashboardPet) => void;
  onEditPet: (pet: DashboardPet) => void;
  onDeletePet: (pet: DashboardPet) => void;
  isDeleting?: boolean;
};

export const MyPetsSection = ({
  title,
  addPetLabel,
  pets,
  onAddPet,
  onViewPet,
  onEditPet,
  onDeletePet,
  isDeleting,
}: Props) => {
  const [petToDelete, setPetToDelete] = useState<DashboardPet | null>(null);

  const handleDeleteConfirm = () => {
    if (petToDelete) {
      onDeletePet(petToDelete);
      setPetToDelete(null);
    }
  };

  return (
    <>
      <SectionCard
        title={title}
        rightSlot={
          <Button
            startIcon={<AddOutlinedIcon />}
            onClick={onAddPet}
            sx={{
              px: 2.5,
              py: 1.2,
              borderRadius: 2.5,
              color: "#fff",
              textTransform: "none",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "-0.1px",
              background: "linear-gradient(135deg, #f5a623 0%, #f09015 100%)",
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
            {addPetLabel}
          </Button>
        }
      >
        <Grid container spacing={3}>
          {pets.map((pet) => (
            <Grid key={pet.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <PetCard
                name={pet.name}
                breed={pet.breed}
                weight={pet.weight}
                imageLetter={pet.imageLetter}
                imageUrl={pet.imageUrl}
                onView={() => onViewPet(pet)}
                onEdit={() => onEditPet(pet)}
                onDelete={() => setPetToDelete(pet)}
              />
            </Grid>
          ))}
        </Grid>
      </SectionCard>

      <DeletePetDialog
        open={!!petToDelete}
        pet={petToDelete}
        onClose={() => setPetToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </>
  );
};
import { Button, Grid } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { SectionCard } from "../cards/SectionCard";
import { PetCard } from "../cards/PetCard";
import type { PetItem } from "../../data/dashboardMockData";

type Props = {
  title: string;
  addPetLabel: string;
  pets: PetItem[];
};

export const MyPetsSection = ({ title, addPetLabel, pets }: Props) => {
  return (
    <SectionCard
      title={title}
      rightSlot={
        <Button
          startIcon={<AddOutlinedIcon />}
          sx={{
            px: 2.5,
            py: 1.2,
            borderRadius: 3,
            color: "white",
            textTransform: "none",
            fontSize: 16,
            fontWeight: 700,
            background: "linear-gradient(90deg, #3b82f6 0%, #9333ea 100%)",
            "&:hover": {
              opacity: 0.95,
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
              onView={pet.onView}
              onEdit={pet.onEdit}
              onDelete={pet.onDelete}
            />
          </Grid>
        ))}
      </Grid>
    </SectionCard>
  );
};
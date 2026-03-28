import { z } from "zod";

export const createAnimalSchema = z.object({
  name: z.string().trim().min(1, { message: "nameRequired" }),
  species: z.string().trim().min(1, { message: "speciesRequired" }),
  breed: z.string().trim().optional(),
  weightKg: z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return undefined;
      }

      const parsed = Number(value);
      return Number.isNaN(parsed) ? undefined : parsed;
    },
    z.number().optional()
  ),
  birthDate: z.string().optional(),
  sex: z.string().optional(),
  microchipNumber: z.string().trim().optional(),
});

export type CreateAnimalFormInput = z.input<typeof createAnimalSchema>;
export type CreateAnimalFormValues = z.output<typeof createAnimalSchema>;
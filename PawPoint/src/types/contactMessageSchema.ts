import { z } from "zod";

export const contactMessageSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(4000, "Description is too long"),
});

export type ContactMessageFormValues = z.infer<typeof contactMessageSchema>;
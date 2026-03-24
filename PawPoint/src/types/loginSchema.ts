import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email({ message: "emailInvalid" }),

  password: z
    .string()
    .min(1, { message: "passwordRequired" })
    .min(8, { message: "passwordMin8" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
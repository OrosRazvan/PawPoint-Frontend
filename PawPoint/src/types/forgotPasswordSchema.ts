import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Email format is invalid"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
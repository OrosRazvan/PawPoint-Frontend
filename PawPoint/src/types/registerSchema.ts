import { z } from "zod";
import { t } from "i18next";

export const registerSchema = z
    .object({
        fullname: z.string().trim().min(3, { message: "fullname"}),

        email: z.string().trim().email({ message: "emailInvalid"}),

        password: z.string().min(8, { message: "passwordMin8"}),

        confirmPassword: z
            .string()
            .min(1, { message: "confirmPassword"}),
    })
    .superRefine((data, ctx) => {
        const p = data.password;

        if (!/[a-z]/.test(p)) {
            ctx.addIssue({
                code: "custom",
                path: ["password"],
                message: "passwordLowerCase",
            });
        }

        if (!/\d/.test(p)) {
            ctx.addIssue({
                code: "custom",
                path: ["password"],
                message: "passwordNumber",
            });
        }

        if(!/[A-Z]/.test(p)) {
            ctx.addIssue({
                code: "custom",
                path: ["password"],
                message: "passwordUpperCase",
            });
        }

        if(!/[^A-Za-z0-9]/.test(p)) {
            ctx.addIssue({
                code: "custom",
                path: ["password"],
                message: "passwordSpecial",
            });
        }

        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["password"],
                message: "passwordsDontMatch",
            });
        }
    });

export type RegisterFormValues = z.infer<typeof registerSchema>;

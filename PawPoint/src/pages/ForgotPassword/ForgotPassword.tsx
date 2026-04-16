import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../../types/forgotPasswordSchema";
import { useForgotPassword } from "../../hooks/useForgotPassword";

import { ForgotPasswordShell } from "./components/ForgotPasswordShell";
import { ForgotPasswordCard } from "./components/ForgotPasswordCard";
import { ForgotPasswordHeader } from "./components/ForgotPasswordHeader";
import { ForgotPasswordDivider } from "./components/ForgotPasswordDivider";
import { ForgotPasswordForm } from "./components/ForgotPasswordForm";
import { ForgotPasswordFooter } from "./components/ForgotPasswordFooter";
import { AuthTopBar } from "../../components/AuthTopBar";

type BackendErrorResponse = {
  message?: string;
  title?: string;
  errors?: Record<string, string[]>;
};

export const ForgotPassword = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation(["auth", "messages"]);
  const forgotPasswordMutation = useForgotPassword();

  const methods = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await forgotPasswordMutation.mutateAsync({
        email: values.email,
      });

      enqueueSnackbar(t("messages:forgotPasswordEmailSent"), {
        variant: "success",
      });
    } catch (error) {
      const axiosError = error as AxiosError<BackendErrorResponse>;

      const backendMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.title ||
        "";

      const fieldErrors = axiosError.response?.data?.errors;

      if (fieldErrors?.Email?.[0]) {
        setError("email", {
          type: "server",
          message: fieldErrors.Email[0],
        });
        return;
      }

      enqueueSnackbar(
        backendMessage || t("messages:forgotPasswordFailed"),
        {
          variant: "error",
        }
      );
    }
  };

  return (
    <ForgotPasswordShell>
      <ForgotPasswordCard>
        <AuthTopBar />

        <ForgotPasswordHeader />
        <ForgotPasswordDivider />

        <FormProvider {...methods}>
          <ForgotPasswordForm
            onSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting || forgotPasswordMutation.isPending}
          />
        </FormProvider>

        <ForgotPasswordFooter />
      </ForgotPasswordCard>
    </ForgotPasswordShell>
  );
};
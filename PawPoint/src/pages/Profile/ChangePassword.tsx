import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";

import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../../types/changePasswordSchema";
import { useChangePassword } from "../../hooks/useChangePassword";
import { clearTokens } from "../../auth/tokenStorage";

import { LoginBackground } from "../Login/components/LoginBackground";
import { LoginContainer } from "../Login/components/LoginContainer";
import { LoginCard } from "../Login/components/LoginCard";
import { LoginDivider } from "../Login/components/LoginDivider";

import { ChangePasswordHeader } from "./components/ChangePasswordHeader";
import { ChangePasswordForm } from "./components/ChangePasswordForm";
import { ChangePasswordFooter } from "./components/ChangePasswordFooter";

type BackendErrorResponse = {
  message?: string;
  title?: string;
  errors?: Record<string, string[]>;
};

export const ChangePassword = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation(["profile", "messages"]);
  const changePasswordMutation = useChangePassword();

  const methods = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    setError,
    clearErrors,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (values: ChangePasswordFormValues) => {
    clearErrors("currentPassword");

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      enqueueSnackbar(t("messages:passwordChangedSuccess"), {
        variant: "success",
      });

      clearTokens();
      window.location.replace("/login");
    } catch (error) {
      const axiosError = error as AxiosError<BackendErrorResponse>;

      const backendMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.title ||
        "";

      const statusCode = axiosError.response?.status;

      // Dacă requestul a ajuns la backend și a picat,
      // la flow-ul tău tratăm asta ca eroare pe parola curentă.
      if (statusCode && statusCode >= 400) {
        setError("currentPassword", {
          type: "server",
          message:
            backendMessage ||
            t("messages:currentPasswordIncorrect"),
        });
        return;
      }

      enqueueSnackbar(
        backendMessage || t("messages:passwordChangedFailed"),
        {
          variant: "error",
        }
      );
    }
  };

  return (
    <LoginBackground>
      <LoginContainer>
        <LoginCard>
          <ChangePasswordHeader />
          <LoginDivider />
          <FormProvider {...methods}>
            <ChangePasswordForm
              onSubmit={handleSubmit(onSubmit)}
              isSubmitting={isSubmitting || changePasswordMutation.isPending}
            />
          </FormProvider>
          <ChangePasswordFooter />
        </LoginCard>
      </LoginContainer>
    </LoginBackground>
  );
};
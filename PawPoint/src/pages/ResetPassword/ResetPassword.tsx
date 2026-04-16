import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../../types/resetPasswordSchema";
import { useResetPassword } from "../../hooks/useResetPassword";

import { LoginBackground } from "../Login/components/LoginBackground";
import { LoginContainer } from "../Login/components/LoginContainer";
import { LoginCard } from "../Login/components/LoginCard";
import { LoginDivider } from "../Login/components/LoginDivider";

import { ResetPasswordHeader } from "./components/ResetPasswordHeader";
import { ResetPasswordForm } from "./components/ResetPasswordForm";
import { ResetPasswordFooter } from "./components/ResetPasswordFooter";
import { AuthTopBar } from "../../components/AuthTopBar";

type BackendErrorResponse = {
  message?: string;
  title?: string;
  errors?: Record<string, string[]>;
};

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation(["auth", "messages"]);
  const resetPasswordMutation = useResetPassword();

  const token = searchParams.get("token") ?? "";

  const methods = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) {
      enqueueSnackbar(t("messages:resetPasswordInvalidToken"), {
        variant: "error",
      });
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        token,
        newPassword: values.newPassword,
      });

      enqueueSnackbar(t("messages:resetPasswordSuccess"), {
        variant: "success",
      });

      navigate("/login", {
        replace: true,
        state: {
          resetPasswordSuccess: true,
        },
      });
    } catch (error) {
      const axiosError = error as AxiosError<BackendErrorResponse>;

      const backendMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.title ||
        "";

      const fieldErrors = axiosError.response?.data?.errors;

      if (fieldErrors?.NewPassword?.[0]) {
        setError("newPassword", {
          type: "server",
          message: fieldErrors.NewPassword[0],
        });
        return;
      }

      enqueueSnackbar(
        backendMessage || t("messages:resetPasswordFailed"),
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
          <AuthTopBar />

          <ResetPasswordHeader />
          <LoginDivider />

          <FormProvider {...methods}>
            <ResetPasswordForm
              onSubmit={handleSubmit(onSubmit)}
              isSubmitting={isSubmitting || resetPasswordMutation.isPending}
            />
          </FormProvider>

          <ResetPasswordFooter />
        </LoginCard>
      </LoginContainer>
    </LoginBackground>
  );
};
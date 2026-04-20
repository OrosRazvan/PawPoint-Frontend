import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Stack, Typography } from "@mui/material";

import {
  type LoginFormValues,
  loginSchema,
} from "../../types/loginSchema";
import { useLogin } from "../../hooks/useLogin";
import { setTokens } from "../../auth/tokenStorage";
import { LoginBackground } from "./components/LoginBackground";
import { LoginContainer } from "./components/LoginContainer";
import { LoginCard } from "./components/LoginCard";
import { LoginHeader } from "./components/LoginHeader";
import { LoginDivider } from "./components/LoginDivider";
import { LoginForm } from "./components/LoginForm";
import { LoginFooter } from "./components/LoginFooter";
import { AuthTopBar } from "../../components/AuthTopBar";

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const loginMutation = useLogin();
  const { t } = useTranslation();

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const state = location.state as
      | {
          email?: string;
          justRegistered?: boolean;
          emailVerified?: boolean;
          verifyError?: boolean;
          forgotPasswordSent?: boolean;
          resetPasswordSuccess?: boolean;
        }
      | undefined;

    if (state?.email) {
      setValue("email", state.email);
    }

    if (state?.justRegistered) {
      enqueueSnackbar(t("messages:checkEmailVerification"), {
        variant: "info",
      });
    }

    if (state?.emailVerified) {
      enqueueSnackbar(t("messages:emailVerified"), {
        variant: "success",
      });
    }

    if (state?.verifyError) {
      enqueueSnackbar(t("messages:emailVerificationFailed"), {
        variant: "error",
      });
    }

    if (state?.forgotPasswordSent) {
      enqueueSnackbar(t("messages:forgotPasswordEmailSent"), {
        variant: "success",
      });
    }

    if (state?.resetPasswordSuccess) {
      enqueueSnackbar(t("messages:resetPasswordSuccess"), {
        variant: "success",
      });
    }
  }, [location.state, setValue, enqueueSnackbar, t]);

  const onSubmit = async (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        setTokens({
          accessToken: data.tokens.accessToken,
          refreshToken: data.tokens.refreshToken,
        });

        enqueueSnackbar(t("messages:loginSuccess"), {
          variant: "success",
        });

        const token = data.tokens.accessToken;

        let role: string | null = null;

        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          role =
            payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
            payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"] ??
            payload.role ??
            null;
        } catch {
          role = null;
        }

        navigate(role === "Admin" ? "/admin" : "/dashboard", { replace: true });
      },
      onError: () => {
        enqueueSnackbar(t("messages:loginFailed"), {
          variant: "error",
        });
      },
    });
  };

  return (
    <LoginBackground>
      <LoginContainer>
        <LoginCard>
          <AuthTopBar />

          <LoginHeader />
          <LoginDivider />

          <FormProvider {...methods}>
            <LoginForm
              onSubmit={handleSubmit(onSubmit)}
              isSubmitting={isSubmitting || loginMutation.isPending}
              textFieldProps={{}}
            />
          </FormProvider>

          <Stack alignItems="flex-end" sx={{ mt: 1 }}>
            <Typography
              onClick={() => navigate("/forgot-password")}
              sx={{
                fontSize: 14,
                fontWeight: 700,
                color: "#f5a623",
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {t("auth.forgotPasswordLink")}
            </Typography>
          </Stack>

          <LoginFooter />
        </LoginCard>
      </LoginContainer>
    </LoginBackground>
  );
};
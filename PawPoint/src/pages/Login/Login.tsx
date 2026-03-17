import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useEffect } from "react";

import {
  type LoginFormValues,
  loginSchema,
} from "../../types/loginSchema";
import { useLogin } from "../../hooks/useLogin";
import { tokenStorage } from "../../utils/tokenStorage";

import { LoginBackground } from "./components/LoginBackground";
import { LoginContainer } from "./components/LoginContainer";
import { LoginCard } from "./components/LoginCard";
import { LoginHeader } from "./components/LoginHeader";
import { LoginDivider } from "./components/LoginDivider";
import { LoginForm } from "./components/LoginForm";
import { LoginFooter } from "./components/LoginFooter";

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const loginMutation = useLogin();

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
        }
      | undefined;

    if (state?.email) {
      setValue("email", state.email);
    }

    if (state?.justRegistered) {
      enqueueSnackbar("Check your email to verify your account.", {
        variant: "info",
      });
    }

    if (state?.emailVerified) {
      enqueueSnackbar("Email verified successfully.", {
        variant: "success",
      });
    }

    if (state?.verifyError) {
      enqueueSnackbar("Email verification failed.", {
        variant: "error",
      });
    }
  }, [location.state, setValue, enqueueSnackbar]);

  const onSubmit = async (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        tokenStorage.setTokens(
          data.tokens.accessToken,
          data.tokens.refreshToken
        );

        enqueueSnackbar("Logged in successfully.", {
          variant: "success",
        });

        navigate("/dashboard", { replace: true });
      },
      onError: () => {
        enqueueSnackbar("Login failed.", {
          variant: "error",
        });
      },
    });
  };

  return (
    <LoginBackground>
      <LoginContainer>
        <LoginCard>
          <LoginHeader />
          <LoginDivider />
          <FormProvider {...methods}>
            <LoginForm
              onSubmit={handleSubmit(onSubmit)}
              isSubmitting={isSubmitting || loginMutation.isPending}
              textFieldProps={{}}
            />
          </FormProvider>
          <LoginFooter />
        </LoginCard>
      </LoginContainer>
    </LoginBackground>
  );
};
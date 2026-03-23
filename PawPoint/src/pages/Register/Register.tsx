import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

import {
  type RegisterFormValues,
  registerSchema,
} from "../../types/registerSchema";
import { useRegister } from "../../hooks/useRegister";

import { RegisterBackground } from "./components/RegisterBackground";
import { RegisterContainer } from "./components/RegisterContainer";
import { RegisterCard } from "./components/RegisterCard";
import { RegisterHeader } from "./components/RegisterHeader";
import { RegisterDivider } from "./components/RegisterDivider";
import { RegisterForm } from "./components/RegisterForm";
import { RegisterFooter } from "./components/RegisterFooter";

export const Register = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const registerMutation = useRegister();
  const { t } = useTranslation("register");

  const methods = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (values: RegisterFormValues) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        enqueueSnackbar(t("messages.registerSuccess"), {
          variant: "success",
        });

        navigate("/login", {
          replace: true,
          state: {
            email: values.email,
            justRegistered: true,
          },
        });
      },
      onError: () => {
        enqueueSnackbar(t("messages.registerFailed"), {
          variant: "error",
        });
      },
    });
  };

  return (
    <RegisterBackground>
      <RegisterContainer>
        <RegisterCard>
          <RegisterHeader />
          <RegisterDivider />

          <FormProvider {...methods}>
            <RegisterForm
              onSubmit={handleSubmit(onSubmit)}
              isSubmitting={isSubmitting || registerMutation.isPending}
              textFieldProps={{}}
            />
          </FormProvider>

          <RegisterFooter />
        </RegisterCard>
      </RegisterContainer>
    </RegisterBackground>
  );
};
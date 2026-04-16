import { apiClient } from "./client";
import {
  FORGOT_PASSWORD_ENDPOINT,
  LOGIN_ENDPOINT,
  REFRESH_ENDPOINT,
  REGISTER_ENDPOINT,
  RESET_PASSWORD_ENDPOINT,
  VERIFY_EMAIL_ENDPOINT,
} from "./endpoints/endpoints";

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type VerifyEmailRequest = {
  token: string;
};

export type RefreshRequest = {
  refreshToken: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  success: boolean;
};

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
};

export type ResetPasswordResponse = {
  success: boolean;
};

export type BackendTokens = {
  accessToken: string;
  refreshToken: string;
  accessExpiresAtUtc?: string;
  refreshExpiresAtUtc?: string;
};

export type AuthUserResponse = {
  userId: number;
  fullName: string;
  email: string;
  tokens: BackendTokens;
};

export type VerifyEmailResponse = {
  redirectUrl?: string;
  message?: string;
};

export const authApi = {
  register: async (payload: RegisterRequest) => {
    const { data } = await apiClient.post<AuthUserResponse>(
      REGISTER_ENDPOINT,
      payload
    );
    return data;
  },

  login: async (payload: LoginRequest) => {
    const { data } = await apiClient.post<AuthUserResponse>(
      LOGIN_ENDPOINT,
      payload
    );
    return data;
  },

  verifyEmail: async (payload: VerifyEmailRequest) => {
    const { data } = await apiClient.post<VerifyEmailResponse>(
      VERIFY_EMAIL_ENDPOINT,
      payload
    );
    return data;
  },

  refresh: async (payload: RefreshRequest) => {
    const { data } = await apiClient.post<BackendTokens>(
      REFRESH_ENDPOINT,
      payload
    );
    return data;
  },

  forgotPassword: async (payload: ForgotPasswordRequest) => {
    const { data } = await apiClient.post<ForgotPasswordResponse>(
      FORGOT_PASSWORD_ENDPOINT,
      payload
    );
    return data;
  },

  resetPassword: async (payload: ResetPasswordRequest) => {
    const { data } = await apiClient.post<ResetPasswordResponse>(
      RESET_PASSWORD_ENDPOINT,
      payload
    );
    return data;
  },
};
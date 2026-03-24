export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegisterResponse = {
  message?: string;
};

export type VerifyEmailRequest = {
  token: string;
};

export type VerifyEmailResponse = {
  redirectUrl?: string;
  message?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresAt?: string;
};

export type RefreshRequest = {
  refreshToken: string;
};
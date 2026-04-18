import { apiClient } from "./client";
import {
  ADMIN_DASHBOARD_ENDPOINT,
  ADMIN_USERS_ENDPOINT,
} from "./endpoints/endpoints";

export type AdminDashboardResponse = {
  totalUsers: number;
  activeUsers: number;
  deletedUsers: number;
  totalAnimals: number;
  totalAppointments: number;
  totalVetCabinets: number;
};

export type AdminUserItem = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  isEmailConfirmed: boolean;
  isDeleted: boolean;
  createdAt: string;
};

export type AdminUserDetailsResponse = {
  user: Record<string, unknown>;
  settings: Record<string, unknown> | null;
  animals: {
    animal: Record<string, unknown>;
    vaccinations: Record<string, unknown>[];
    dewormings: Record<string, unknown>[];
    feedings: Record<string, unknown>[];
    appointments: Record<string, unknown>[];
  }[];
};

export type AdminUpdateUserProfileRequest = {
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  isEmailConfirmed: boolean;
};

export type AdminSetUserPasswordRequest = {
  newPassword: string;
};

export type AdminUpdateUserSettingsRequest = {
  darkMode: boolean;
  textSize: string;
  weightUnit: string;
  dateFormat: string;
  notificationPreferenceId: number;
  enableNotifications: boolean;
  vaccinationNotifications: boolean;
  appointmentNotifications: boolean;
  dewormingNotifications: boolean;
  notificationBadgeMode: string;
};

export const adminApi = {
  getDashboard: async () => {
    const { data } = await apiClient.get<AdminDashboardResponse>(
      ADMIN_DASHBOARD_ENDPOINT
    );
    return data;
  },

  getUsers: async () => {
    const { data } = await apiClient.get<AdminUserItem[]>(
      ADMIN_USERS_ENDPOINT
    );
    return data;
  },

  getUserDetails: async (userId: number) => {
    const { data } = await apiClient.get<AdminUserDetailsResponse>(
      `${ADMIN_USERS_ENDPOINT}/${userId}`
    );
    return data;
  },

  updateUserProfile: async (
    userId: number,
    payload: AdminUpdateUserProfileRequest
  ) => {
    const { data } = await apiClient.put(
      `${ADMIN_USERS_ENDPOINT}/${userId}/profile`,
      payload
    );
    return data;
  },

  setUserPassword: async (
    userId: number,
    payload: AdminSetUserPasswordRequest
  ) => {
    const { data } = await apiClient.put(
      `${ADMIN_USERS_ENDPOINT}/${userId}/password`,
      payload
    );
    return data;
  },

  updateUserSettings: async (
    userId: number,
    payload: AdminUpdateUserSettingsRequest
  ) => {
    const { data } = await apiClient.put(
      `${ADMIN_USERS_ENDPOINT}/${userId}/settings`,
      payload
    );
    return data;
  },

  restoreUser: async (userId: number) => {
    const { data } = await apiClient.put(
      `${ADMIN_USERS_ENDPOINT}/${userId}/restore`
    );
    return data;
  },

  deactivateUser: async (userId: number) => {
    const { data } = await apiClient.delete(
      `${ADMIN_USERS_ENDPOINT}/${userId}`
    );
    return data;
  },
};
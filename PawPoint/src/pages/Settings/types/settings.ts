export type UserSettingsDto = {
  userId: number;
  darkMode: boolean;
  textSize: "Small" | "Medium" | "Large";
  weightUnit: "kg" | "lb";
  dateFormat: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
  notificationPreferenceId: number;
  notificationPreference: string;
  enableNotifications: boolean;
  vaccinationNotifications: boolean;
  appointmentNotifications: boolean;
  dewormingNotifications: boolean;
  notificationBadgeMode: "count" | "dot";
};

export type UpdateUserSettingsDto = {
  darkMode?: boolean;
  textSize?: "Small" | "Medium" | "Large";
  weightUnit?: "kg" | "lb";
  dateFormat?: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
  enableNotifications?: boolean;
  vaccinationNotifications?: boolean;
  appointmentNotifications?: boolean;
  dewormingNotifications?: boolean;
  notificationBadgeMode?: "count" | "dot";
};
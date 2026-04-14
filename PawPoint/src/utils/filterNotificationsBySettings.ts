import type { NotificationDto } from "../pages/Notifications/types/notification";
import type { UserSettingsDto } from "../pages/Settings/types/settings";

const isVaccinationType = (typeName: string) =>
  typeName.toLowerCase().includes("vaccination");

const isAppointmentType = (typeName: string) =>
  typeName.toLowerCase().includes("appointment");

const isDewormingType = (typeName: string) =>
  typeName.toLowerCase().includes("deworming");

export const filterNotificationsForNavbar = (
  notifications: NotificationDto[],
  settings?: UserSettingsDto
) => {
  if (!settings?.enableNotifications) {
    return [];
  }

  return notifications.filter((n) => {
    const type = n.typeName ?? "";

    if (isVaccinationType(type)) {
      return settings.vaccinationNotifications;
    }

    if (isAppointmentType(type)) {
      return settings.appointmentNotifications;
    }

    if (isDewormingType(type)) {
      return settings.dewormingNotifications;
    }

    return false;
  });
};
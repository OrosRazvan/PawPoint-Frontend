const KEY = "notification_badge_mode";

export type NotificationBadgeMode = "count" | "dot";

export const getNotificationBadgeMode = (): NotificationBadgeMode => {
  const value = localStorage.getItem(KEY);
  return value === "dot" ? "dot" : "count";
};

export const setNotificationBadgeMode = (mode: NotificationBadgeMode) => {
  localStorage.setItem(KEY, mode);
};
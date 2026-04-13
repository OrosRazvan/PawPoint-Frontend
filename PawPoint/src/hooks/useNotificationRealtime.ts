import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getNotificationConnection } from "../api/notificationRealtime";

export const useNotificationRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const connection = getNotificationConnection();

    const handler = () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };

    connection.on("notification", handler);

    if (connection.state === "Disconnected") {
      connection.start().catch(console.error);
    }

    return () => {
      connection.off("notification", handler);
    };
  }, [queryClient]);
};
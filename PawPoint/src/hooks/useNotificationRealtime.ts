import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getNotificationConnection } from "../api/notificationRealtime";
import { getAccessToken } from "../auth/tokenStorage";

export const useNotificationRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    const connection = getNotificationConnection();
    let isActive = true;

    const handler = () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };

    connection.on("notification", handler);

    const startConnection = async () => {
      try {
        if (
          connection.state === "Disconnected" &&
          isActive
        ) {
          await connection.start();
        }
      } catch (error) {
        // ignoră abort-ul care apare în dev când effect-ul se curăță în timpul negocierii
        const message =
          error instanceof Error ? error.message : String(error);

        if (!message.toLowerCase().includes("stopped during negotiation")) {
          console.error(
            "Failed to start notification realtime connection:",
            error
          );
        }
      }
    };

    startConnection();

    return () => {
      isActive = false;
      connection.off("notification", handler);

      // nu mai opri conexiunea aici în dev, fiindcă StrictMode face mount/unmount rapid
      // și îți întrerupe negocierea
    };
  }, [queryClient]);
};
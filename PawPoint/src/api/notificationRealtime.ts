import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { getAccessToken } from "../auth/tokenStorage";

let connection: HubConnection | null = null;

const baseUrl = import.meta.env.VITE_API_URL;

export const getNotificationConnection = () => {
  if (connection) {
    return connection;
  }

  connection = new HubConnectionBuilder()
    .withUrl(`${baseUrl}/hubs/notifications`, {
      accessTokenFactory: () => getAccessToken() ?? "",
      withCredentials: false,
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  return connection;
};
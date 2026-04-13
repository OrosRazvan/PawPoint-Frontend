import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { getAccessToken } from "../auth/tokenStorage";

let connection: HubConnection | null = null;

export const getNotificationConnection = () => {
  if (connection) {
    return connection;
  }

  connection = new HubConnectionBuilder()
    .withUrl("https://localhost:7168/hub", {
      accessTokenFactory: () => getAccessToken() ?? "",
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  return connection;
};
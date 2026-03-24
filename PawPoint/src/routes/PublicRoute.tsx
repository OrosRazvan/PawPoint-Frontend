import { Navigate } from "react-router-dom";
import { getAccessToken } from "../auth/tokenStorage";
import { isTokenExpired } from "../auth/isTokenExpired";

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = getAccessToken();
  const isAuthenticated = !!token && !isTokenExpired(token);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
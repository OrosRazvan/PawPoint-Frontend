import { Navigate } from "react-router-dom";
import { getAccessToken } from "../auth/tokenStorage";
import { isAdmin } from "../auth/getUserRole";

type Props = {
  children: React.ReactNode;
};

export const AdminRoute = ({ children }: Props) => {
  const token = getAccessToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
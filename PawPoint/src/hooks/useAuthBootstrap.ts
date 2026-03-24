import { useEffect, useState } from "react";
import { authApi } from "../api/authApi";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "../auth/tokenStorage";
import { isTokenExpired } from "../auth/isTokenExpired";

export const useAuthBootstrap = () => {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (accessToken && !isTokenExpired(accessToken)) {
        setIsAuthenticated(true);
        setIsReady(true);
        return;
      }

      if (!refreshToken) {
        clearTokens();
        setIsAuthenticated(false);
        setIsReady(true);
        return;
      }

      try {
        const data = await authApi.refresh({ refreshToken });

        setTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });

        setIsAuthenticated(true);
      } catch {
        clearTokens();
        setIsAuthenticated(false);
      } finally {
        setIsReady(true);
      }
    };

    bootstrap();
  }, []);

  return { isReady, isAuthenticated };
};
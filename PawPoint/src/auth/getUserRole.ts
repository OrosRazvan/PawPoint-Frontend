import { getAccessToken } from "./tokenStorage";

type JwtPayload = {
  role?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"?: string;
};

const parseJwt = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join("")
    );

    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
};

export const getUserRole = (): string | null => {
  const token = getAccessToken();
  if (!token) return null;

  const payload = parseJwt(token);
  if (!payload) return null;

  return (
    payload.role ||
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"] ||
    null
  );
};

export const isAdmin = (): boolean => getUserRole() === "Admin";
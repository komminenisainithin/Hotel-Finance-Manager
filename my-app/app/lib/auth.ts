export const AUTH_TOKEN_KEY = "token";
export const AUTH_USER_KEY = "user";

type JwtPayload = {
  exp?: number;
  userId?: string;
};

export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token || token === "undefined" || token === "null") return null;
  return token;
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1]),
    ) as JwtPayload;
    if (!payload.exp) return true;
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const clearAuthStorage = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

export const getValidToken = (): string | null => {
  const token = getStoredToken();
  if (!token || isTokenExpired(token)) {
    clearAuthStorage();
    return null;
  }
  return token;
};

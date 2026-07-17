const ACCESS_TOKEN_KEY = "rbac_access_token";
const REFRESH_TOKEN_KEY = "rbac_refresh_token";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const getAccessToken = (): string => sessionStorage.getItem(ACCESS_TOKEN_KEY) || "";
export const getRefreshToken = (): string => sessionStorage.getItem(REFRESH_TOKEN_KEY) || "";

export const setAccessToken = (token: string): void => {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const setRefreshToken = (token: string): void => {
  sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const setAuthTokens = (tokens: AuthTokens): void => {
  setAccessToken(tokens.accessToken);
  setRefreshToken(tokens.refreshToken);
};

export const clearAuthTokens = (): void => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const formatToken = (token: string): string => `Bearer ${token}`;

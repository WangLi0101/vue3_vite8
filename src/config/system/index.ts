const DEFAULT_ADMIN_URL_MAP: Record<string, string> = {
  development: "http://localhost:5173",
  staging: "http://sys.example.com:60000",
  production: "http://sys.example.com:60000",
};

const removeTrailingSlash = (url: string): string => url.replace(/\/+$/, "");

const getCurrentAppUrl = (): string => {
  const configuredUrl = import.meta.env.VITE_APP_EXTERNAL_URL?.trim();
  if (configuredUrl) {
    return removeTrailingSlash(configuredUrl);
  }

  return `${window.location.origin}${import.meta.env.BASE_URL}`;
};

/**
 * Returns the external administration system's login URL. The login system redirects
 * back to this app with `accessToken` and `refreshToken` query parameters.
 */
export const getAdminLoginUrl = (): string => {
  const configuredUrl = import.meta.env.VITE_ADMIN_APP_URL?.trim();
  const adminUrl = configuredUrl || DEFAULT_ADMIN_URL_MAP[import.meta.env.MODE];
  const redirectUrl = getCurrentAppUrl();

  return `${removeTrailingSlash(adminUrl)}/#/login?redirect=${encodeURIComponent(redirectUrl)}`;
};

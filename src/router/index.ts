import type { App } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import type { LocationQueryRaw } from "vue-router";
import { store } from "@/stores";
import { useAuthStore } from "@/stores/modules/auth";
import { getAccessToken, setAccessToken, setAuthTokens } from "@/utils/token";
import { staticRoutes } from "./routes";

const omitAuthTokenQuery = (query: LocationQueryRaw): LocationQueryRaw => {
  const {
    accessToken: _accessToken,
    refreshToken: _refreshToken,
    token: _token,
    ...restQuery
  } = query;
  return restQuery;
};

const getQueryValue = (value: unknown): string | null => {
  if (typeof value === "string" && value) {
    return value;
  }

  return null;
};

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: staticRoutes,
});

router.beforeEach(async (to) => {
  const accessToken = getQueryValue(to.query.accessToken) ?? getQueryValue(to.query.token);
  const refreshToken = getQueryValue(to.query.refreshToken);

  // Tokens arriving from the external login system are persisted once, then removed
  // from the address bar to prevent accidental exposure through copied URLs or history.
  if (accessToken) {
    if (refreshToken) {
      setAuthTokens({ accessToken, refreshToken });
    } else {
      setAccessToken(accessToken);
    }

    return {
      path: to.path,
      query: omitAuthTokenQuery(to.query),
      hash: to.hash,
      replace: true,
    };
  }

  const authStore = useAuthStore(store);
  if (!getAccessToken()) {
    await authStore.logoutLocal();
    return false;
  }

  if (!authStore.isInitialized) {
    try {
      await authStore.initializeSession();
    } catch {
      await authStore.logoutLocal();
      return false;
    }
  }

  return true;
});

export const setupRouter = (app: App<Element>) => {
  app.use(router);
};
export default router;

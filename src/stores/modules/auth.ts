import { defineStore } from "pinia";
import { ref } from "vue";

import { getCurrentUserApi, refreshTokenApi } from "@/api/auth";
import { getAdminLoginUrl } from "@/config/system";
import { ApiRequestError } from "@/types/http";
import { clearAuthTokens, getAccessToken, getRefreshToken, setAuthTokens } from "@/utils/token";

export const useAuthStore = defineStore("auth", () => {
  const isInitialized = ref(false);

  const refreshToken = async (): Promise<string> => {
    const token = getRefreshToken();
    if (!token) {
      throw new ApiRequestError("缺少刷新令牌", 40102);
    }

    const response = await refreshTokenApi({ refreshToken: token });
    if (response.code !== 0) {
      throw new ApiRequestError(response.message, response.code);
    }

    setAuthTokens(response.data);
    return response.data.accessToken;
  };

  const logoutLocal = async (): Promise<void> => {
    isInitialized.value = false;
    clearAuthTokens();
    window.location.replace(getAdminLoginUrl());
  };

  const initializeSession = async (): Promise<boolean> => {
    if (!getAccessToken()) {
      throw new Error("缺少登录态");
    }

    const response = await getCurrentUserApi();
    if (response.code !== 0) {
      throw new ApiRequestError(response.message, response.code);
    }

    isInitialized.value = true;
    return true;
  };

  return { isInitialized, refreshToken, logoutLocal, initializeSession };
});

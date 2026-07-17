import { request } from "@/utils/http";
import type {
  CaptchaResponse,
  CurrentUserResponse,
  LoginPayload,
  LoginResponse,
  RefreshTokenPayload,
  RefreshTokenResponse,
} from "./types";

export function loginApi(payload: LoginPayload) {
  return request<LoginResponse>("/auth/login", "SYSTEM", {
    method: "post",
    data: payload,
    isPublic: true,
  });
}

export function refreshTokenApi(payload: RefreshTokenPayload) {
  return request<RefreshTokenResponse>("/auth/refresh", "SYSTEM", {
    method: "post",
    data: payload,
    isPublic: true,
    skipErrorToast: true,
  });
}

export function getCurrentUserApi() {
  return request<CurrentUserResponse>("/users/my", "SYSTEM", { method: "get" });
}

export function getCaptchaApi() {
  return request<CaptchaResponse>("/auth/captcha", "SYSTEM", {
    method: "get",
    isPublic: true,
  });
}

export function switchOrgApi(orgId: string) {
  return request<RefreshTokenResponse>(`/auth/switch-org/${orgId}`, "SYSTEM", { method: "get" });
}

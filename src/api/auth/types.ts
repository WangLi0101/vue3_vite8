/** 系统登录请求 */
export interface LoginPayload {
  loginName: string;
  password: string;
  captchaId: string;
  captchaCode: string;
}

/** 登录和刷新令牌接口的响应体。 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  orgId: string;
  deptId: string;
  orgList: OrgItem[];
  roles: string[];
  permissions: string[];
  expiresAt: string;
  refreshExpiresAt: string;
}

export type RefreshTokenResponse = LoginResponse;

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface OrgItem {
  orgId: string;
  name: string;
}

export interface CaptchaResponse {
  captchaId: string;
  bizType: string;
  imageBase64: string;
}

export interface CurrentUserResponse {
  user: Record<string, unknown>;
  orgId: string;
  deptId: string;
  roleCodes: string[];
  permissionCodes: string[];
  roles: unknown[];
  permissions: unknown[];
  menus: unknown[];
}

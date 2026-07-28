import { showErrorToast } from "@/utils/toast";

import type { ApiResponse } from "@/types/http";
interface HandlerErrorOptions {
  silent?: boolean;
}

export const CODE = {
  TOKEN_EXPIRED: 401002,
} as const;

// 逻辑状态码
export const handlerError = <T>(payload: ApiResponse<T>, options?: HandlerErrorOptions) => {
  if (options?.silent) {
    return;
  }

  switch (payload.code) {
    default:
      showErrorToast(payload.message);
      break;
  }
};

import axios, { AxiosHeaders } from "axios";
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { SERVICE_URL_MAP } from "@/config/api";
import type { ServiceName } from "@/config/api";
import { store } from "@/stores";
import { useAuthStore } from "@/stores/modules/auth";
import type { ApiResponse } from "@/types/http";
import { ApiRequestError } from "@/types/http";
import { showErrorToast } from "@/utils/toast";
import { formatToken, getAccessToken, getRefreshToken } from "@/utils/token";
import { CODE, handlerError } from "./code";
import type {
  DownloadDataMap,
  DownloadRequestConfig,
  DownloadResponseType,
  RequestMeta,
  RequestConfig,
} from "./types";
import { isDownloadResponseType } from "./types";

interface InternalRequestConfig<D = unknown> extends InternalAxiosRequestConfig<D>, RequestMeta {
  // 标记当前请求是否已经完成过一次自动重试，避免 token 过期时重复刷新。
  _retry?: boolean;
}

class HttpClient {
  // 多个请求同时遇到 token 失效时，共用同一个刷新任务，避免重复刷新。
  private refreshAccessTokenPromise: Promise<string> | null = null;
  private readonly axiosInstance: AxiosInstance;

  // 创建 Axios 实例并在初始化时挂载统一拦截器。
  constructor() {
    this.axiosInstance = axios.create({
      timeout: 30 * 1000,
    });
    this.setupInterceptors();
  }

  public requestByService<D = unknown, R extends DownloadResponseType = DownloadResponseType>(
    url: string,
    serviceName: ServiceName,
    config: DownloadRequestConfig<D, R>,
  ): Promise<DownloadDataMap[R]>;

  public requestByService<T, D = unknown>(
    url: string,
    serviceName: ServiceName,
    config?: RequestConfig<D>,
  ): Promise<ApiResponse<T>>;

  public requestByService<T, D = unknown, R extends DownloadResponseType = DownloadResponseType>(
    url: string,
    serviceName: ServiceName,
    config: RequestConfig<D> | DownloadRequestConfig<D, R> = {},
  ): Promise<ApiResponse<T> | DownloadDataMap[R]> {
    // 对外统一请求入口：业务层只传 serviceName，底层负责映射 baseURL 并发起请求。
    const baseURL = SERVICE_URL_MAP[serviceName];

    return this.axiosInstance
      .request<
        ApiResponse<T> | DownloadDataMap[R],
        AxiosResponse<ApiResponse<T> | DownloadDataMap[R]>,
        D
      >({
        ...config,
        url,
        baseURL,
      })
      .then((response) => {
        if (isDownloadResponseType(response.config.responseType)) {
          return response.data as DownloadDataMap[R];
        }

        return response.data as ApiResponse<T>;
      });
  }

  // 挂载请求/响应拦截器，统一处理鉴权头、业务错误和 HTTP 异常。
  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(this.attachAuthorization);
    this.axiosInstance.interceptors.response.use(
      this.handleResponseSuccess,
      this.handleResponseError,
    );
  }

  // 请求发出前自动补充 accessToken，公开接口则跳过鉴权头注入。
  private attachAuthorization = (
    config: InternalAxiosRequestConfig,
  ): InternalAxiosRequestConfig => {
    if (this.isPublicRequest(config as InternalRequestConfig)) {
      return config;
    }

    const token = getAccessToken();
    if (!token) {
      return config;
    }

    return this.applyAuthorizationHeader(config, token);
  };

  // 成功响应统一入口：先区分普通 JSON 与下载响应，再进入各自处理分支。
  private handleResponseSuccess = async <T>(
    response: AxiosResponse<ApiResponse<T> | Blob | ArrayBuffer>,
  ): Promise<AxiosResponse<ApiResponse<T> | Blob | ArrayBuffer>> => {
    const originalRequest = response.config as InternalRequestConfig | undefined;

    if (isDownloadResponseType(response.config.responseType)) {
      return this.handleDownloadResponseSuccess(response, originalRequest);
    }

    return this.handleJsonResponseSuccess(response, originalRequest);
  };

  // HTTP 层异常兜底处理：统一提示通用错误，并包装成业务侧可识别的异常对象。
  private handleResponseError = (error: AxiosError<ApiResponse<unknown> | Blob | ArrayBuffer>) => {
    const httpStatus = error.response?.status ?? 0;
    const message = "服务繁忙，请稍后重试";
    const requestConfig = error.config as InternalRequestConfig | undefined;
    if (!this.shouldSkipErrorToast(requestConfig)) {
      showErrorToast(message);
    }

    return Promise.reject(new ApiRequestError(message, -1, httpStatus));
  };

  // 处理普通 JSON 成功响应：code 为 0 直接放行，非 0 继续走统一业务错误链路。
  private async handleJsonResponseSuccess<T>(
    response: AxiosResponse<ApiResponse<T> | Blob | ArrayBuffer>,
    config?: InternalRequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T> | Blob | ArrayBuffer>> {
    const payload = response.data;
    if (payload instanceof Blob || payload instanceof ArrayBuffer) {
      return response;
    }

    if (payload.code === 0) {
      return response;
    }

    const replayedResponse = await this.handleNonSuccessPayload(payload, response, config);
    if (replayedResponse) {
      return replayedResponse;
    }

    return response;
  }

  // 处理下载响应：如果下载接口实际返回的是 JSON 错误体，则转入业务错误处理链路。
  private async handleDownloadResponseSuccess<T>(
    response: AxiosResponse<ApiResponse<T> | Blob | ArrayBuffer>,
    config?: InternalRequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T> | Blob | ArrayBuffer>> {
    const jsonPayload = await this.tryExtractJsonFromDownload<T>(response);
    if (!jsonPayload) {
      return response;
    }

    const replayedResponse = await this.handleNonSuccessPayload(jsonPayload, response, config);
    if (replayedResponse) {
      return replayedResponse;
    }

    throw new ApiRequestError(jsonPayload.message, jsonPayload.code, response.status);
  }

  // 尝试从下载响应中提取 JSON 业务体；Content-Type 非 JSON 或解析失败时返回 null。
  private async tryExtractJsonFromDownload<T>(
    response: AxiosResponse<ApiResponse<T> | Blob | ArrayBuffer>,
  ): Promise<ApiResponse<T> | null> {
    if (!this.isJsonContentType(this.getContentType(response.headers))) {
      return null;
    }

    const { data } = response;
    if (!(data instanceof Blob) && !(data instanceof ArrayBuffer)) {
      return data as ApiResponse<T>;
    }

    try {
      const text =
        data instanceof Blob ? await data.text() : new TextDecoder().decode(new Uint8Array(data));

      return JSON.parse(text) as ApiResponse<T>;
    } catch {
      return null;
    }
  }

  // 所有非成功业务响应的统一入口：先尝试刷新并重放，再决定是否提示和登出。
  private async handleNonSuccessPayload<T>(
    payload: ApiResponse<T>,
    response: AxiosResponse<ApiResponse<T> | Blob | ArrayBuffer>,
    config?: InternalRequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T> | Blob | ArrayBuffer> | null> {
    const replayedResponse = await this.tryRefreshAndReplay(
      {
        ...response,
        data: payload,
      },
      config,
    );
    if (replayedResponse) {
      return replayedResponse;
    }

    await this.notifyBusinessError(payload, config);
    return null;
  }

  // 命中 token 失效业务码后，尝试刷新 accessToken 并自动重放原请求。
  private async tryRefreshAndReplay<T>(
    response: AxiosResponse<ApiResponse<T> | Blob | ArrayBuffer>,
    config?: InternalRequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T> | Blob | ArrayBuffer> | null> {
    if (!config || !this.shouldRefreshByCode((response.data as ApiResponse<T>).code, config)) {
      return null;
    }

    try {
      const nextAccessToken = await this.refreshAccessToken();
      config._retry = true;
      // 刷新成功后，给原请求补上新 token 并重放一次。
      this.applyAuthorizationHeader(config, nextAccessToken);
    } catch (_refreshError) {
      // refreshToken 也失效时，统一清理会话并回到登录态。
      await this.logoutByStore();
      return null;
    }

    return (await this.axiosInstance.request(config)) as AxiosResponse<
      ApiResponse<T> | Blob | ArrayBuffer
    >;
  }

  // 在无法重放时统一执行业务错误副作用，例如登出和错误提示。
  private async notifyBusinessError<T>(
    payload: ApiResponse<T>,
    config?: InternalRequestConfig,
  ): Promise<void> {
    if (payload.code === CODE.TOKEN_EXPIRED && !this.isPublicRequest(config)) {
      await this.logoutByStore();
    }

    handlerError(payload, {
      silent: this.shouldSkipErrorToast(config),
    });
  }

  // 统一写入 Authorization 请求头，避免调用方关心 headers 的具体实现形态。
  private applyAuthorizationHeader(
    config: InternalAxiosRequestConfig,
    token: string,
  ): InternalAxiosRequestConfig {
    config.headers = AxiosHeaders.from(config.headers);
    config.headers.set("Authorization", formatToken(token));
    return config;
  }

  // 判断当前业务响应是否满足“可以自动刷新 token”的条件。
  private shouldRefreshByCode(code: number, config?: InternalRequestConfig): boolean {
    return (
      code === CODE.TOKEN_EXPIRED &&
      !config?._retry &&
      !this.isPublicRequest(config) &&
      Boolean(getRefreshToken())
    );
  }

  // 复用同一轮刷新任务，避免并发请求在 token 失效时重复调用刷新接口。
  private refreshAccessToken(): Promise<string> {
    if (!this.refreshAccessTokenPromise) {
      this.refreshAccessTokenPromise = this.refreshTokenByStore().finally(() => {
        this.refreshAccessTokenPromise = null;
      });
    }

    return this.refreshAccessTokenPromise;
  }

  // 通过 auth store 调用刷新接口，并由 store 统一维护最新 token。
  private async refreshTokenByStore(): Promise<string> {
    return useAuthStore(store).refreshToken();
  }

  // 通过 auth store 执行本地登出，统一清理会话和路由状态。
  private async logoutByStore(): Promise<void> {
    await useAuthStore(store).logoutLocal();
  }

  // 判断当前请求是否为公开接口，公开接口不参与鉴权头和自动刷新逻辑。
  private isPublicRequest(config?: Pick<RequestMeta, "isPublic">): boolean {
    return Boolean(config?.isPublic);
  }

  // 从响应头中读取 content-type，供下载响应识别 JSON 错误体时使用。
  private getContentType(headers?: AxiosResponse["headers"]): string {
    const contentType = headers?.["content-type"];
    return typeof contentType === "string" ? contentType : "";
  }

  // 显式控制是否跳过统一错误提示，避免依赖 URL 约定。
  private shouldSkipErrorToast(config?: Pick<RequestMeta, "skipErrorToast">): boolean {
    return Boolean(config?.skipErrorToast);
  }

  // 判断 content-type 是否属于 JSON，兼容标准 JSON、text/json 和 +json 变体。
  private isJsonContentType(contentType: string): boolean {
    const normalizedContentType = contentType.toLowerCase();
    return (
      normalizedContentType.includes("application/json") ||
      normalizedContentType.includes("text/json") ||
      normalizedContentType.includes("+json")
    );
  }
}

export const http = new HttpClient();

export function request<T, D = unknown>(
  url: string,
  serviceName: ServiceName,
  config?: RequestConfig<D>,
): Promise<ApiResponse<T>>;

export function request<D = unknown, R extends DownloadResponseType = DownloadResponseType>(
  url: string,
  serviceName: ServiceName,
  config: DownloadRequestConfig<D, R>,
): Promise<DownloadDataMap[R]>;

export function request<T, D = unknown, R extends DownloadResponseType = DownloadResponseType>(
  url: string,
  serviceName: ServiceName,
  config: RequestConfig<D> | DownloadRequestConfig<D, R> = {},
): Promise<ApiResponse<T> | DownloadDataMap[R]> {
  return http.requestByService(
    url,
    serviceName,
    config as RequestConfig<D> & DownloadRequestConfig<D, R>,
  ) as Promise<ApiResponse<T> | DownloadDataMap[R]>;
}

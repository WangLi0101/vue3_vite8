import axios from "axios";

import { handlerError } from "./code";
import { isDownloadResponseType } from "./types";
import { SERVICE_URL_MAP } from "@/config/api";
import { ApiRequestError } from "@/types/http";
import { showErrorToast } from "@/utils/toast";

import type {
  DownloadDataMap,
  DownloadRequestConfig,
  DownloadResponseType,
  RequestConfig,
} from "./types";
import type { ServiceName } from "@/config/api";
import type { ApiResponse } from "@/types/http";
import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";

class HttpClient {
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

  // 挂载请求/响应拦截器，统一处理业务错误和 HTTP 异常。
  private setupInterceptors(): void {
    this.axiosInstance.interceptors.response.use(
      this.handleResponseSuccess,
      this.handleResponseError,
    );
  }

  // 成功响应统一入口：先区分普通 JSON 与下载响应，再进入各自处理分支。
  private handleResponseSuccess = async <T>(
    response: AxiosResponse<ApiResponse<T> | Blob | ArrayBuffer>,
  ): Promise<AxiosResponse<ApiResponse<T> | Blob | ArrayBuffer>> => {
    if (isDownloadResponseType(response.config.responseType)) {
      return this.handleDownloadResponseSuccess(response);
    }

    return this.handleJsonResponseSuccess(response);
  };

  // HTTP 层异常兜底处理：主动取消直接透传，其余异常统一提示并包装。
  private handleResponseError = (error: AxiosError<ApiResponse<unknown> | Blob | ArrayBuffer>) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const httpStatus = error.response?.status ?? 0;
    const message = "服务繁忙，请稍后重试";
    const requestConfig = error.config as RequestConfig<unknown> | undefined;
    if (!this.shouldSkipErrorToast(requestConfig)) {
      showErrorToast(message);
    }

    return Promise.reject(new ApiRequestError(message, -1, httpStatus));
  };

  // 处理普通 JSON 成功响应：code 为 0 直接放行，非 0 继续走统一业务错误链路。
  private async handleJsonResponseSuccess<T>(
    response: AxiosResponse<ApiResponse<T> | Blob | ArrayBuffer>,
  ): Promise<AxiosResponse<ApiResponse<T> | Blob | ArrayBuffer>> {
    const payload = response.data;
    if (payload instanceof Blob || payload instanceof ArrayBuffer) {
      return response;
    }

    if (payload.code === 0) {
      return response;
    }

    this.notifyBusinessError(payload);
    return response;
  }

  // 处理下载响应：如果下载接口实际返回的是 JSON 错误体，则转入业务错误处理链路。
  private async handleDownloadResponseSuccess<T>(
    response: AxiosResponse<ApiResponse<T> | Blob | ArrayBuffer>,
  ): Promise<AxiosResponse<ApiResponse<T> | Blob | ArrayBuffer>> {
    const jsonPayload = await this.tryExtractJsonFromDownload<T>(response);
    if (!jsonPayload) {
      return response;
    }

    this.notifyBusinessError(jsonPayload);
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

  // 业务错误统一入口：负责错误提示。
  private notifyBusinessError<T>(payload: ApiResponse<T>): void {
    handlerError(payload);
  }

  // 从响应头中读取 content-type，供下载响应识别 JSON 错误体时使用。
  private getContentType(headers?: AxiosResponse["headers"]): string {
    const contentType = headers?.["content-type"];
    return typeof contentType === "string" ? contentType : "";
  }

  // 显式控制是否跳过统一错误提示，避免依赖 URL 约定。
  private shouldSkipErrorToast(config?: Pick<RequestConfig<unknown>, "skipErrorToast">): boolean {
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

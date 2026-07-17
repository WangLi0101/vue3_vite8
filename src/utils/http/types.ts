import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/http";

export type HttpResponse<T> = AxiosResponse<ApiResponse<T>>;
export type DownloadResponseType = "blob" | "arraybuffer";
type NonDownloadResponseType = Exclude<AxiosRequestConfig["responseType"], DownloadResponseType>;

export interface RequestMeta {
  isPublic?: boolean;
  skipErrorToast?: boolean;
}

export interface RequestConfig<D>
  extends Omit<AxiosRequestConfig<D>, "url" | "baseURL" | "responseType">, RequestMeta {
  responseType?: NonDownloadResponseType;
}

export type DownloadDataMap = {
  blob: Blob;
  arraybuffer: ArrayBuffer;
};

export type DownloadRequestConfig<D, R extends DownloadResponseType> = Omit<
  RequestConfig<D>,
  "responseType"
> & {
  responseType: R;
};

export const isDownloadResponseType = (
  responseType: AxiosRequestConfig["responseType"],
): responseType is DownloadResponseType => {
  return responseType === "blob" || responseType === "arraybuffer";
};

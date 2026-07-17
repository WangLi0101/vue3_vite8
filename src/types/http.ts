export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

export class ApiRequestError extends Error {
  code: number;
  httpStatus: number;

  constructor(message: string, code: number, httpStatus = 0) {
    super(message);
    this.name = "ApiRequestError";
    this.code = code;
    this.httpStatus = httpStatus;
  }
}

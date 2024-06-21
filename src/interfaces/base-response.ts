export interface BaseResponse<T> {
  message?: string;
  status?: number;
  data?: T;
}

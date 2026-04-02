export interface BaseResponse<T = undefined> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse {
  total?: number;
  pages?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface UploadImageResponse extends BaseResponse {
  imageUrl: string;
}

import type { BaseResponse, PaginatedResponse } from "./common";

export interface NewsItem {
  _id: string;
  title: string;
  category: string;
  date: Date;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetNewsParams {
  page?: number;
  limit?: number;
}

export interface CreateNewsData {
  title: string;
  category: string;
  date: string | Date;
  content: string;
  imageUrl?: string;
}

export type UpdateNewsData = Partial<CreateNewsData>;

export interface NewsResponse extends BaseResponse, PaginatedResponse {
  news: NewsItem[];
}

export interface NewsDetailResponse extends BaseResponse {
  newsItem: NewsItem;
}

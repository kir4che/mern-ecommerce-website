import type { Product } from "./product";
import type { NewsItem } from "./news";
import type { Order } from "./order";

export interface ProductsResponse {
  success: boolean;
  message: string;
  products: Product[];
  total?: number;
  pages?: number;
  page?: number;
}

export interface ProductDetailResponse {
  success: boolean;
  message: string;
  product: Product;
}

export interface NewsResponse {
  success: boolean;
  message: string;
  news: NewsItem[];
  total?: number;
  limit?: number;
  page?: number;
  totalPages?: number;
}

export interface NewsDetailResponse {
  success: boolean;
  message: string;
  newsItem: NewsItem;
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  orders: Order[];
  totalOrders: number;
  totalPages: number;
  currentPage: number;
}

export interface UploadImageResponse {
  success: boolean;
  message: string;
  imageUrl: string;
}

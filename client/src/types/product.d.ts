import type { BaseResponse, PaginatedResponse } from "./common";

export interface Product {
  _id: string;
  title: string;
  tagline: string;
  categories: string[];
  description: string;
  price: number;
  content: string;
  expiryDate: string;
  allergens: string[];
  delivery: string;
  storage: string;
  ingredients: string;
  nutrition: string;
  countInStock: number;
  salesCount: number;
  tags: string[];
  imageUrl: string;
}

export interface GetProductsParams {
  category?: string;
  tag?: string;
  limit?: number;
  page?: number;
  sort?: string;
  search?: string;
}

export type CreateProductData = Required<Pick<Product, "title" | "price">> &
  Partial<Omit<Product, "_id" | "salesCount" | "title" | "price">>;

export type UpdateProductData = Partial<Omit<Product, "_id" | "salesCount">>;

export interface ProductsResponse extends BaseResponse, PaginatedResponse {
  products: Product[];
}

export interface ProductDetailResponse extends BaseResponse {
  product: Product;
}

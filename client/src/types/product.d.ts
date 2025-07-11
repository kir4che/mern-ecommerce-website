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

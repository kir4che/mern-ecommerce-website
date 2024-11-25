interface ProductType {
  _id: number;
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
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export default ProductType;

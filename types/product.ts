import { Category } from "./category";

export interface ProductVariant {
  _id: string;
  size?: string;
  color?: string;
  stock: number;
  sku?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  brand?: string;
  price: number;
  discountPercent: number; // Backend defaults to 0
  discountedPrice?: number; // Virtual
  categories?: Category[]; // Populated
  stock: number;
  variants: ProductVariant[];
  averageRating: number; // Backend defaults to 0
  reviewCount: number; // Backend defaults to 0
  createdAt: string;
  updatedAt: string;
}

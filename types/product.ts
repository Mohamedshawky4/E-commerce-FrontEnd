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
  description: string;
  images?: string[];
  price: number;
  discountPercent?: number;
  discountedPrice?: number;
  averageRating?: number;
  slug?: string;
  categories?: { _id: string; name: string; slug: string }[];
  stock: number;
  variants?: ProductVariant[];
  brand?: string;
}
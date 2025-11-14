export interface Product {
  _id: string;
  name: string;
  images?: string[];
  price: number;
  discountPercent?: number;
  discountedPrice?: number;
  averageRating?: number;
  slug?: string;
  categories?: { _id: string; name: string; slug: string }[];
}
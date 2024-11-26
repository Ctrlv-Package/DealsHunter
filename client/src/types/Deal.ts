export interface Deal {
  _id: string;
  title: string;
  price: string;
  originalPrice: string;
  description?: string;
  image: string;
  productUrl: string;
  productId: string;
  retailer: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  price: number;
  images?: SanityImage[];
  category: Category;
  variants?: ProductVariant[];
  stock: number;
  isActive: boolean;
  brand?: string;
  tags?: string[];
  featured?: boolean;
  createdAt: string;
}

export interface ProductListItem {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  stock: number;
  images?: SanityImage;
  category: { name: string; slug: { current: string } };
  brand?: string;
  featured?: boolean;
  createdAt: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  sort?: ProductSort;
  page?: number;
  limit?: number;
}

export type ProductSort = "newest" | "price-asc" | "price-desc" | "relevance";

export interface PaginatedProducts {
  products: ProductListItem[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  image?: SanityImage;
  parent?: Category;
}

export interface ProductVariant {
  name: string;
  price: number;
  stock: number;
  options?: {
    size?: string;
    color?: string;
  };
}

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

export interface Order {
  _id: string;
  customerEmail: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: "paypal" | "pagomovil";
  paypalOrderId?: string;
  createdAt: string;
}

export interface OrderItem {
  product: Product;
  productName: string;
  quantity: number;
  price: number;
  variant?: string;
}

export type OrderStatus =
  | "pending"
  | "pending_confirmation"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface User {
  _id: string;
  email: string;
  name?: string;
  image?: string;
  role: "user" | "admin";
  emailVerified?: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  quantity: number;
  variant?: string;
  stock: number;
}

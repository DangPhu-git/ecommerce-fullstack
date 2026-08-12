export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  imageUrl: string;
  isFeatured: boolean;
  category?: Category;
  createdAt?: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'COD' | 'BANK_TRANSFER' | 'CREDIT_CARD';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: number;
  product: Product;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  totalAmount: number;
  shippingAddress: string;
  phone: string;
  recipientName: string;
  note?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

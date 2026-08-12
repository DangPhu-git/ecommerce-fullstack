import type { Cart, Category, Order, Product, User } from '../types';

const API_BASE = 'http://localhost:8080/api';

const getHeaders = (token?: string | null): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const authToken = token || localStorage.getItem('token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok || (data.success !== undefined && !data.success)) {
    throw new Error(data.message || 'Có lỗi xảy ra!');
  }
  return data.data !== undefined ? data.data : data;
}

export const api = {
  // Auth
  async login(username: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, password }),
    });
    return handleResponse<{ accessToken: string; user: User }>(res);
  },

  async register(data: { username: string; email: string; password: string; fullName: string; phone: string; address: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<User>(res);
  },

  async getCurrentUser() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse<User>(res);
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`, {
      headers: getHeaders(),
    });
    return handleResponse<Category[]>(res);
  },

  async createCategory(data: Partial<Category>) {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Category>(res);
  },

  // Products
  async getProducts(keyword?: string, categoryId?: number) {
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (categoryId) params.append('categoryId', categoryId.toString());

    const res = await fetch(`${API_BASE}/products?${params.toString()}`, {
      headers: getHeaders(),
    });
    return handleResponse<Product[]>(res);
  },

  async getFeaturedProducts() {
    const res = await fetch(`${API_BASE}/products/featured`, {
      headers: getHeaders(),
    });
    return handleResponse<Product[]>(res);
  },

  async createProduct(data: Partial<Product> & { categoryId?: number }) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Product>(res);
  },

  async updateProduct(id: number, data: Partial<Product> & { categoryId?: number }) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Product>(res);
  },

  async deleteProduct(id: number) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse<void>(res);
  },

  // Cart
  async getCart() {
    const res = await fetch(`${API_BASE}/cart`, {
      headers: getHeaders(),
    });
    return handleResponse<Cart>(res);
  },

  async addToCart(productId: number, quantity: number = 1) {
    const res = await fetch(`${API_BASE}/cart/items`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    return handleResponse<Cart>(res);
  },

  async updateCartItem(itemId: number, quantity: number) {
    const res = await fetch(`${API_BASE}/cart/items/${itemId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ quantity }),
    });
    return handleResponse<Cart>(res);
  },

  async removeCartItem(itemId: number) {
    const res = await fetch(`${API_BASE}/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse<Cart>(res);
  },

  // Orders
  async checkout(orderData: { shippingAddress: string; phone: string; recipientName: string; note?: string; paymentMethod: string }) {
    const res = await fetch(`${API_BASE}/orders/checkout`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });
    return handleResponse<Order>(res);
  },

  async getMyOrders() {
    const res = await fetch(`${API_BASE}/orders/my-orders`, {
      headers: getHeaders(),
    });
    return handleResponse<Order[]>(res);
  },

  async getAllOrders() {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: getHeaders(),
    });
    return handleResponse<Order[]>(res);
  },

  async updateOrderStatus(id: number, status: string, paymentStatus?: string) {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, paymentStatus }),
    });
    return handleResponse<Order>(res);
  }
};

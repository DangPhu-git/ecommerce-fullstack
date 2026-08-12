import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Cart } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  totalPrice: number;
  loading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  fetchCart: () => Promise<void>;
  toastMessage: string | null;
  clearToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchCart = async () => {
    if (!user) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const data = await api.getCart();
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId: number, quantity: number = 1) => {
    if (!user) {
      showToast('⚠️ Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      return;
    }
    try {
      const updatedCart = await api.addToCart(productId, quantity);
      setCart(updatedCart);
      showToast('🛍️ Đã thêm sản phẩm vào giỏ hàng!');
    } catch (err: any) {
      showToast('❌ ' + (err.message || 'Không thể thêm vào giỏ hàng'));
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const updatedCart = await api.updateCartItem(itemId, quantity);
      setCart(updatedCart);
    } catch (err: any) {
      showToast('❌ ' + err.message);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const updatedCart = await api.removeCartItem(itemId);
      setCart(updatedCart);
      showToast('🗑️ Đã xóa sản phẩm khỏi giỏ hàng!');
    } catch (err: any) {
      showToast('❌ ' + err.message);
    }
  };

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const totalPrice = cart?.items?.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        totalPrice,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        fetchCart,
        toastMessage,
        clearToast: () => setToastMessage(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

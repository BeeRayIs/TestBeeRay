import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';
import api from '../utils/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }

    try {
      const response = await api.get('/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId: number, quantity: number) => {
    await api.post('/cart/add', { product_id: productId, quantity });
    await fetchCart();
  };

  const removeFromCart = async (itemId: number) => {
    await api.delete(`/cart/${itemId}`);
    await fetchCart();
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    await api.put(`/cart/${itemId}`, { quantity });
    await fetchCart();
  };

  const clearCart = async () => {
    await api.delete('/cart');
    await fetchCart();
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, fetchCart, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

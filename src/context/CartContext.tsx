import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';
import { Product, CartItem } from '../types/index.js';

interface AppliedCoupon {
  code: string;
  discountPercent: number;
  discountAmount: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'interwood_cart_v1';
const FREE_DELIVERY_THRESHOLD = 100000;
const STANDARD_DELIVERY_FEE = 3500;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Error saving cart to storage', err);
    }
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1, selectedColor?: string) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product._id === product._id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        if (selectedColor) next[existingIndex].selectedColor = selectedColor;
        return next;
      }
      return [...prev, { product, quantity, selectedColor: selectedColor || product.color }];
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.post('/coupons/validate', { code, subtotal });
      setAppliedCoupon({
        code: res.data.code,
        discountPercent: res.data.discountPercent,
        discountAmount: res.data.discountAmount
      });
      return { success: true, message: res.data.message };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Invalid or expired promo code';
      return { success: false, message };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        deliveryFee,
        discount,
        total,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCartDrawerOpen,
        setIsCartDrawerOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

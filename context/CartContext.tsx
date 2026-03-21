"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Product {
  name: string;
  price: string;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = typeof window !== 'undefined' ? useRouter() : null;

  // Initialize cart from localStorage on first client render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('moiz_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error("Error initializing cart", e);
    }
    setIsInitialized(true);

    // Sync across multiple tabs in real time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'moiz_cart' && e.newValue) {
        setCart(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save cart to localStorage on change, ONLY after initialization
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('moiz_cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.name);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      const numericPrice = parseInt(product.price.replace(/[^0-9]/g, ''), 10);
      return [...prevCart, {
        id: product.name,
        name: product.name,
        price: numericPrice,
        image: product.image,
        quantity: 1
      }];
    });

    const formatName = (name: string) => /\d$/.test(name) ? `${name} Kg` : name;
    
    toast.success(`${formatName(product.name)} enganchado 🐈`, {
      description: "¡Agregado exitosamente al carrito!",
      action: {
        label: "Ir al Carrito",
        onClick: () => {
          if (router) {
            router.push("/carrito");
          } else {
            window.location.href = "/carrito";
          }
        }
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart.reduce((acc, item) => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty >= 1) {
            acc.push({ ...item, quantity: newQty });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[])
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

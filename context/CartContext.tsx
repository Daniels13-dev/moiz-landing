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
  price: number | string;
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
    const numericPrice = typeof product.price === 'number' ? product.price : parseInt(product.price.replace(/[^0-9]/g, ''), 10);
    
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.name);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, {
        id: product.name,
        name: product.name,
        price: numericPrice,
        image: product.image,
        quantity: 1
      }];
    });

    const formatName = (name: string) => /\d$/.test(name) ? `${name} Kg` : name;
    
    toast.custom((id) => (
      <div className="max-w-md w-full bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl pointer-events-auto flex overflow-hidden border border-white/10">
        <div className="flex-1 w-0 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 pt-0.5">
              <img
                className="h-12 w-12 rounded-xl object-contain bg-white/5 p-1"
                src={product.image}
                alt={product.name}
              />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-black text-white">
                {formatName(product.name)} enganchado 🐈
              </p>
              <p className="mt-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Agregado • ${numericPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-white/10">
          <button
            onClick={() => {
              toast.dismiss(id);
              if (router) router.push("/carrito");
            }}
            className="w-full border border-transparent rounded-none rounded-r-3xl p-4 flex items-center justify-center text-sm font-black text-[var(--moiz-green)] hover:bg-white/5 active:bg-white/10 transition-colors"
          >
            Pagar
          </button>
        </div>
      </div>
    ), { duration: 3000 });
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

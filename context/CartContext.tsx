"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

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
    
    toast.dismiss();
    toast.custom((id) => (
      <div className="max-w-md md:w-80 w-full bg-zinc-900 md:bg-zinc-950 shadow-[0_30px_70px_rgba(0,0,0,0.5)] md:shadow-[0_40px_100px_rgba(106,142,42,0.1)] rounded-[2.5rem] md:rounded-[4rem] pointer-events-auto flex flex-col overflow-hidden border border-white/10 group">
        <div className="flex-1 p-6 md:p-10 flex flex-col items-center">
            {/* Success Icon or Product Image */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-[var(--moiz-green)]/20 blur-2xl rounded-full scale-150 animate-pulse" />
                <div className="relative h-20 w-20 md:h-32 md:w-32 bg-white/5 md:bg-white rounded-3xl md:rounded-[2.5rem] flex items-center justify-center p-3 border border-white/10">
                    <img
                    className="h-full w-full object-contain"
                    src={product.image}
                    alt={product.name}
                    />
                </div>
            </div>

            <div className="text-center">
              <h4 className="text-lg md:text-2xl font-black text-white tracking-tighter leading-tight mb-2">
                ¡{product.name} Listo!
              </h4>
              <p className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">
                Agregado • ${numericPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
              </p>
            </div>
        </div>
        
        <div className="p-4 md:p-8 md:pt-0">
          <button
            onClick={() => {
              toast.dismiss(id);
              if (router) router.push("/carrito");
            }}
            className="w-full py-4 md:py-5 bg-[var(--moiz-green)] text-zinc-950 rounded-2xl md:rounded-[2rem] font-black text-xs md:text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_30px_rgba(106,142,42,0.3)] hover:shadow-[0_15px_40px_rgba(106,142,42,0.5)]"
          >
            Ver Carrito <ArrowRight size={16} />
          </button>
        </div>
      </div>
    ), { duration: 4500 });
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

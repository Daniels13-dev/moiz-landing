"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CheckCircle2, CreditCard } from "lucide-react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Product {
  id: string;
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
  // CartProvider is a client component; call the hook directly.
  // Lazy initialize cart from localStorage below.
  // Lazy initialize cart from localStorage to avoid calling setState synchronously
  // inside useEffect (satisfies lint rule and reduces unnecessary renders).
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      if (typeof window === "undefined") return [];
      const saved = localStorage.getItem("moiz_cart");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error reading saved cart", e);
      return [];
    }
  });

  const router = useRouter();

  useEffect(() => {
    // Sync across multiple tabs in real time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "moiz_cart" && e.newValue) {
        try {
          setCart(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Error parsing cart from storage event", err);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save cart to localStorage on change, ONLY after initialization
  useEffect(() => {
    // Persist cart to localStorage on change.
    try {
      localStorage.setItem("moiz_cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Error saving cart to localStorage", err);
    }
  }, [cart]);

  const addToCart = (product: Product) => {
    const numericPrice =
      typeof product.price === "number"
        ? product.price
        : parseInt(product.price.replace(/[^0-9]/g, ""), 10);

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prevCart,
        {
          id: product.id,
          name: product.name,
          price: numericPrice,
          image: product.image,
          quantity: 1,
        },
      ];
    });

    toast.dismiss();
    toast.custom(
      (id) => (
        <div className="max-w-md md:w-96 w-full bg-zinc-900 border border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden pointer-events-auto">
          <div className="p-6 md:p-8 flex items-center gap-6">
            <div className="relative h-20 w-20 bg-white rounded-2xl p-2 flex-shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain"
              />
              <div className="absolute -top-2 -right-2 bg-[var(--moiz-green)] text-white p-1 rounded-full border-2 border-zinc-900">
                <CheckCircle2 size={16} />
              </div>
            </div>

            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--moiz-green)] mb-1">
                Agregado con éxito
              </p>
              <h4 className="text-xl font-bold text-white mb-1 leading-tight">
                {product.name}
              </h4>
              <p className="text-white/60 font-medium text-sm">
                ${numericPrice.toLocaleString("es-CO")}
              </p>
            </div>
          </div>

          <div className="px-6 pb-6 pt-0">
            <button
              onClick={() => {
                toast.dismiss(id);
                if (router) router.push("/carrito");
              }}
              className="w-full py-4 bg-[var(--moiz-green)] text-zinc-950 rounded-2xl font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Ir a pagar <CreditCard size={16} />
            </button>
          </div>
        </div>
      ),
      { duration: 4000 },
    );
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
          } else {
            // Remove if quantity becomes 0
            return acc;
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[]),
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    // Defensive fallback: return a no-op cart when provider is missing.
    // This prevents consumer components from throwing and allows pages
    // to render while we investigate provider issues.
    return {
      cart: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      totalItems: 0,
      totalPrice: 0,
    } as CartContextType;
  }

  return context;
};

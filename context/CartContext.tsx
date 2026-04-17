"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CheckCircle2, CreditCard } from "lucide-react";

export interface CartItem {
  id: string; // Puede ser productId o productId-variantId
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variantId?: string;
  variantName?: string;
  isSubscription?: boolean;
  subscriptionInterval?: string;
}

export interface CartProductVariant {
  id: string;
  name: string;
  price?: number | null;
  image?: string | null;
  stock: number;
  productId?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number | string;
  image: string;
  variants?: CartProductVariant[];
}

export interface AppliedCoupon {
  code: string;
  discountPercentage: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    selectedVariant?: CartProductVariant | null,
    isSubscription?: boolean,
    subscriptionInterval?: string,
    coords?: { x: number; y: number }
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  totalItems: number;
  totalPrice: number;
  discountAmount: number;
  finalPrice: number;
  appliedCoupon: AppliedCoupon | null;
  lastAddedItem: {
    id: string;
    image: string;
    x: number;
    y: number;
  } | null;
  setLastAddedItem: (item: { id: string; image: string; x: number; y: number } | null) => void;
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
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(() => {
    try {
      if (typeof window === "undefined") return null;
      const saved = localStorage.getItem("moiz_coupon");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [lastAddedItem, setLastAddedItem] = useState<{
    id: string;
    image: string;
    x: number;
    y: number;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Sync coupon across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "moiz_coupon") {
        setAppliedCoupon(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save cart and coupon to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("moiz_cart", JSON.stringify(cart));
      if (appliedCoupon) {
        localStorage.setItem("moiz_coupon", JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem("moiz_coupon");
      }
    } catch (err) {
      console.error("Error saving to localStorage", err);
    }
  }, [cart, appliedCoupon]);

  const addToCart = (
    product: Product,
    selectedVariant?: CartProductVariant | null,
    isSubscription: boolean = false,
    subscriptionInterval: string = "Cada mes",
    coords?: { x: number; y: number },
  ) => {
    let numericPrice =
      typeof product.price === "number"
        ? product.price
        : parseInt(product.price.replace(/[^0-9]/g, ""), 10);

    // Si hay variante, usamos su precio si existe
    if (selectedVariant && selectedVariant.price) {
      numericPrice = selectedVariant.price;
    }

    // Aplicar descuento de suscripción (5%)
    if (isSubscription) {
      numericPrice = numericPrice * 0.95;
    }

    const cartItemId = `${product.id}${selectedVariant ? `-${selectedVariant.id}` : ""}${isSubscription ? "-sub" : ""}`;
    const finalImage = selectedVariant?.image || product.image;
    let finalName = selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name;

    if (isSubscription) {
      finalName += " - Suscripción";
    }

    if (coords) {
      setLastAddedItem({
        id: product.id,
        image: finalImage,
        x: coords.x,
        y: coords.y,
      });
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === cartItemId);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [
        ...prevCart,
        {
          id: cartItemId,
          productId: product.id,
          name: finalName,
          price: numericPrice,
          image: finalImage,
          quantity: 1,
          variantId: selectedVariant?.id,
          variantName: selectedVariant?.name,
          isSubscription: isSubscription,
          subscriptionInterval: isSubscription ? subscriptionInterval : undefined,
        },
      ];
    });

    toast.dismiss();
    toast.custom(
      (id) => (
        <div className="max-w-md md:w-96 w-full bg-zinc-900 border border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden pointer-events-auto">
          <div className="p-6 md:p-8 flex items-center gap-6">
            <div className="relative h-20 w-20 bg-white rounded-2xl p-2 flex-shrink-0">
              <Image src={finalImage} alt={finalName} fill className="object-contain" />
              <div className="absolute -top-2 -right-2 bg-[var(--moiz-green)] text-white p-1 rounded-full border-2 border-zinc-900">
                <CheckCircle2 size={16} />
              </div>
            </div>

            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--moiz-green)] mb-1">
                Agregado con éxito
              </p>
              <h4 className="text-xl font-bold text-white mb-1 leading-tight">{finalName}</h4>
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
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== productId);
      if (newCart.length === 0 && appliedCoupon) {
        setAppliedCoupon(null);
      }
      return newCart;
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) => {
      const newCart = prevCart.reduce((acc, item) => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty >= 1) {
            acc.push({ ...item, quantity: newQty });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[]);

      if (newCart.length === 0 && appliedCoupon) {
        setAppliedCoupon(null);
      }
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (coupon: AppliedCoupon) => setAppliedCoupon(coupon);
  const removeCoupon = () => setAppliedCoupon(null);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discountAmount = appliedCoupon ? (totalPrice * appliedCoupon.discountPercentage) / 100 : 0;
  const finalPrice = totalPrice - discountAmount;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        totalItems,
        totalPrice,
        discountAmount,
        finalPrice,
        appliedCoupon,
        lastAddedItem,
        setLastAddedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    return {
      cart: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      applyCoupon: () => {},
      removeCoupon: () => {},
      totalItems: 0,
      totalPrice: 0,
      discountAmount: 0,
      finalPrice: 0,
      appliedCoupon: null,
      lastAddedItem: null,
      setLastAddedItem: () => {},
    } as CartContextType;
  }

  return context;
};

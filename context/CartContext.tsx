"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CartUtils } from "@/lib/cart-utils";
import AddToCartToast from "@/components/cart/AddToCartToast";

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

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (coupon: AppliedCoupon) => setAppliedCoupon(coupon);
  const removeCoupon = () => setAppliedCoupon(null);

  const addToCart = (
    product: Product,
    selectedVariant?: CartProductVariant | null,
    isSubscription: boolean = false,
    subscriptionInterval: string = "Cada mes",
    coords?: { x: number; y: number },
  ) => {
    const numericPrice = CartUtils.calculateItemPrice(
      product.price, 
      selectedVariant?.price, 
      isSubscription
    );

    const cartItemId = CartUtils.generateCartItemId(product.id, selectedVariant?.id, isSubscription);
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
        <AddToCartToast 
          id={id}
          name={finalName}
          price={numericPrice}
          image={finalImage}
          onCheckout={() => router.push("/carrito")}
        />
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

  // Sync cart status with server (in case of successful payment in another tab/window)
  useEffect(() => {
    async function syncCartWithServer() {
      if (cart.length > 0) {
        const { checkAndResetCartClear } = await import("@/app/actions/profile");
        const result = await checkAndResetCartClear();
        if (result.clear) {
          clearCart();
        }
      }
    }
    syncCartWithServer();
  }, [cart.length, clearCart]);

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

  const summary = CartUtils.calculateSummary(cart, appliedCoupon?.discountPercentage || 0);
  const { totalItems, totalPrice, discountAmount, finalPrice } = summary;

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

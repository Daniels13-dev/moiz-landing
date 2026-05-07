"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import CartCrossSelling from "@/components/CartCrossSelling";
import CartItem from "./components/CartItem";
import CartSummary from "./components/CartSummary";

export default function CarritoPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    finalPrice,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponInput || cart.length === 0) return;
    setIsValidating(true);
    try {
      const { validateCoupon } = await import("@/app/actions/coupons");
      const result = await validateCoupon(couponInput);
      if (result.success && result.coupon) {
        applyCoupon(result.coupon);
        setCouponInput("");
        toast.success("¡Cupón aplicado!", {
          description: `Se ha aplicado un ${result.coupon.discountPercentage}% de descuento.`,
        });
      } else {
        toast.error(result.message || "No se pudo aplicar el cupón.");
      }
    } catch {
      toast.error("Error al aplicar cupón");
    } finally {
      setIsValidating(false);
    }
  };

  const handleCheckoutClick = () => {
    router.push("/checkout");
  };

  return (
    <main className="bg-[#FAF9F6] min-h-screen flex flex-col selection:bg-[var(--moiz-green)] selection:text-white overflow-x-hidden">
      <Navbar />

      <div className="flex-1 pt-12 md:pt-16 px-6 max-w-5xl mx-auto pb-40 md:pb-24">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tighter">
              {siteConfig.ui.cart.title}
            </h1>
            <p className="text-zinc-500 font-medium text-sm">
              {totalItems} {totalItems === 1 ? "producto" : "productos"}
            </p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-zinc-400 hover:text-red-500 transition-colors p-2"
              title={siteConfig.ui.cart.clearCart}
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="md:bg-white md:p-10 md:rounded-[3rem] md:shadow-2xl md:border md:border-zinc-100 min-h-full flex flex-col">
              <h2 className="hidden md:block text-3xl font-black mb-10 tracking-tight text-zinc-900">
                {siteConfig.ui.cart.selectedProducts}
              </h2>
              <div className="flex flex-col gap-4 md:gap-6">
                <AnimatePresence mode="popLayout">
                  {cart.length > 0 ? (
                    cart.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        removeFromCart={removeFromCart}
                        updateQuantity={updateQuantity}
                      />
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-20 flex flex-col items-center justify-center gap-6"
                    >
                      <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300">
                        <ShoppingBag size={48} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-zinc-900 mb-2">{siteConfig.ui.cart.empty}</h3>
                        <p className="text-zinc-500 max-w-xs mx-auto mb-8 text-sm">
                          Agrega productos a tu carrito para verlos aquí.
                        </p>
                        <Link
                          href="/productos"
                          className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white rounded-full font-bold hover:scale-105 transition-all shadow-xl"
                        >
                          Ir a Productos <ArrowRight size={18} />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <CartCrossSelling />
            </div>
          </div>

          {/* Checkout Summary Sidebar (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-4 h-fit sticky top-48">
            <CartSummary
              totalItems={totalItems}
              totalPrice={totalPrice}
              finalPrice={finalPrice}
              discountAmount={discountAmount}
              appliedCoupon={appliedCoupon}
              removeCoupon={removeCoupon}
              couponInput={couponInput}
              setCouponInput={setCouponInput}
              handleApplyCoupon={handleApplyCoupon}
              isValidating={isValidating}
              handleCheckoutClick={handleCheckoutClick}
              cartLength={cart.length}
            />
          </div>
        </div>
      </div>

      {/* Mobile Checkout Bar (Sleek Floating Style) */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 left-6 right-6 z-50 lg:hidden"
          >
            <div className="bg-zinc-900 text-white p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/5 flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">
                  Total
                </span>
                <span className="text-xl font-black">
                  ${finalPrice.toLocaleString("es-CO")}
                </span>
              </div>
              <button
                onClick={handleCheckoutClick}
                className="flex-1 py-3 px-6 bg-[var(--moiz-green)] text-zinc-950 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
              >
                Ir a pagar <CreditCard size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

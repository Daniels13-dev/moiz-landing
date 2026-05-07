"use client";

import { motion } from "framer-motion";
import { X, CreditCard, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { BUSINESS_CONFIG } from "@/config/business";
import FreeShippingProgress from "./FreeShippingProgress";

interface CartSummaryProps {
  totalItems: number;
  totalPrice: number;
  finalPrice: number;
  discountAmount: number;
  appliedCoupon: any;
  removeCoupon: () => void;
  couponInput: string;
  setCouponInput: (val: string) => void;
  handleApplyCoupon: () => void;
  isValidating: boolean;
  handleCheckoutClick: () => void;
  cartLength: number;
}

export default function CartSummary({
  totalItems,
  totalPrice,
  finalPrice,
  discountAmount,
  appliedCoupon,
  removeCoupon,
  couponInput,
  setCouponInput,
  handleApplyCoupon,
  isValidating,
  handleCheckoutClick,
  cartLength,
}: CartSummaryProps) {
  return (
    <div className="bg-zinc-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-[var(--moiz-green)]/20 blur-[50px] rounded-full" />

      <h2 className="text-3xl font-black mb-10 tracking-tight">{siteConfig.ui.cart.summary}</h2>

      <div className="space-y-6 pb-8 border-b border-white/10 mb-8">
        <div className="flex justify-between text-white/60 font-medium">
          <span>{siteConfig.ui.cart.products} ({totalItems})</span>
          <span>${totalPrice.toLocaleString("es-CO")}</span>
        </div>

        {appliedCoupon && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex justify-between text-[var(--moiz-green)] font-bold text-sm"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14} /> Descuento ({appliedCoupon.code})
            </span>
            <span>-${discountAmount.toLocaleString("es-CO")}</span>
          </motion.div>
        )}

        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-white/60">{siteConfig.ui.order.shipping}</span>
          {totalPrice >= BUSINESS_CONFIG.shipping.freeThreshold ? (
            <span className="text-[var(--moiz-green)] font-black">{siteConfig.ui.cart.free}</span>
          ) : (
            <span className="text-white/30 italic text-[11px]">{siteConfig.ui.cart.calculatedByZone}</span>
          )}
        </div>
      </div>

      {/* Coupon Section */}
      <div className="mb-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">
          ¿Tienes un cupón?
        </p>
        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-2xl group transition-all">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">
                {siteConfig.ui.cart.activeCoupon}
              </span>
              <span className="text-[var(--moiz-green)] font-black uppercase text-sm">
                {appliedCoupon.code}
              </span>
            </div>
            <button
              onClick={removeCoupon}
              className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
              title={siteConfig.ui.cart.removeCoupon}
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="relative flex-1 group">
              <input
                type="text"
                placeholder="CÓDIGO"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-black text-sm outline-none focus:border-[var(--moiz-green)]/40 focus:ring-4 focus:ring-[var(--moiz-green)]/5 transition-all uppercase placeholder:text-white/20"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
              />
            </div>
            <button
              onClick={handleApplyCoupon}
              disabled={isValidating || !couponInput || cartLength === 0}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 rounded-2xl font-black text-xs uppercase transition-all disabled:opacity-50"
            >
              {isValidating ? "..." : siteConfig.ui.cart.apply}
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar de Envío Gratis */}
      <FreeShippingProgress totalPrice={totalPrice} />

      <div className="flex flex-col gap-2 mb-10">
        <span className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px]">
          {siteConfig.ui.cart.orderTotal}
        </span>
        <span className="text-3xl font-black text-white">
          ${finalPrice.toLocaleString("es-CO")}
        </span>
      </div>

      <button
        onClick={handleCheckoutClick}
        disabled={cartLength === 0}
        className="w-full py-4 bg-[var(--moiz-green)] text-zinc-950 rounded-full font-black text-lg shadow-[0_15px_40px_rgba(106,142,42,0.3)] hover:shadow-[0_20px_50px_rgba(106,142,42,0.6)] transition-all duration-300 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:pointer-events-none group flex items-center justify-center gap-3"
      >
        {siteConfig.ui.cart.checkout} <CreditCard size={20} />
      </button>
    </div>
  );
}

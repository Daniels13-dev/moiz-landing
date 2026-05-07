"use client";

import { motion } from "framer-motion";
import { BUSINESS_CONFIG } from "@/config/business";
import { siteConfig } from "@/config/site";

interface FreeShippingProgressProps {
  totalPrice: number;
}

export default function FreeShippingProgress({ totalPrice }: FreeShippingProgressProps) {
  const threshold = BUSINESS_CONFIG.shipping.freeThreshold;
  const isFree = totalPrice >= threshold;
  const missing = threshold - totalPrice;
  const percentage = Math.min((totalPrice / threshold) * 100, 100);

  return (
    <div className="mb-10 bg-white/5 p-4 rounded-2xl border border-white/10">
      <div className="flex justify-between text-xs font-bold mb-3">
        <span className="text-white/70 tracking-wider uppercase">
          {siteConfig.ui.badges.freeShipping}
        </span>
        {isFree ? (
          <span className="text-[var(--moiz-green)] flex items-center gap-1">
            {siteConfig.ui.cart.unlockShipping}
          </span>
        ) : (
          <span className="text-white/50">
            {siteConfig.ui.cart.missingForShipping}
            {missing.toLocaleString("es-CO")}
          </span>
        )}
      </div>
      <div className="w-full bg-black/40 rounded-full h-3 overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "circOut" }}
          className="h-full bg-gradient-to-r from-[var(--moiz-green)] to-[#E6B800] rounded-full relative"
        >
          {isFree && (
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          )}
        </motion.div>
      </div>
    </div>
  );
}

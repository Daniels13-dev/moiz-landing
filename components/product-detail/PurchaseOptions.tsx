"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";
import { siteConfig } from "@/config/site";

interface PurchaseOptionsProps {
  allowSubscription: boolean;
  purchaseType: "once" | "subscription";
  setPurchaseType: (type: "once" | "subscription") => void;
  activePrice: number;
  oldPrice?: number | null;
  showSubInfo: boolean;
  setShowSubInfo: (show: boolean) => void;
}

export default function PurchaseOptions({
  allowSubscription,
  purchaseType,
  setPurchaseType,
  activePrice,
  oldPrice,
  showSubInfo,
  setShowSubInfo,
}: PurchaseOptionsProps) {
  if (allowSubscription) {
    return (
      <div className="flex flex-col gap-3 mb-10">
        <button
          onClick={() => setPurchaseType("once")}
          className={`p-5 rounded-[2rem] border-2 transition-all flex items-center justify-between text-left group ${purchaseType === "once" ? "border-zinc-900 bg-zinc-50" : "border-zinc-100 hover:border-zinc-200"}`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${purchaseType === "once" ? "border-zinc-900" : "border-zinc-300 group-hover:border-zinc-400"}`}
            >
              {purchaseType === "once" && (
                <motion.div layoutId="activeCircle" className="w-3 h-3 bg-zinc-900 rounded-full" />
              )}
            </div>
            <div>
              <h3 className="font-black text-zinc-900 leading-tight">{siteConfig.ui.purchase.once}</h3>
              <p className="text-xs text-zinc-500 font-medium">{siteConfig.ui.purchase.onceDesc}</p>
            </div>
          </div>
          <span className="font-black text-xl text-zinc-900">
            ${activePrice.toLocaleString("es-CO")}
          </span>
        </button>

        <div
          role="button"
          tabIndex={0}
          onClick={() => setPurchaseType("subscription")}
          onKeyDown={(e) => e.key === "Enter" && setPurchaseType("subscription")}
          className={`p-5 rounded-[2rem] border-2 transition-all flex items-center justify-between text-left relative group cursor-pointer ${purchaseType === "subscription" ? "border-[var(--moiz-green)] bg-[var(--moiz-green)]/5" : "border-zinc-100 hover:border-zinc-200"}`}
        >
          <div className="absolute -top-3 right-6 bg-[var(--moiz-green)] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-[var(--moiz-green)]/20">
            {siteConfig.ui.purchase.save}
          </div>
          <div className="flex items-center gap-4">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${purchaseType === "subscription" ? "border-[var(--moiz-green)]" : "border-zinc-300 group-hover:border-zinc-400"}`}
            >
              {purchaseType === "subscription" && (
                <motion.div layoutId="activeCircle" className="w-3 h-3 bg-[var(--moiz-green)] rounded-full" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-zinc-900 leading-tight">{siteConfig.ui.purchase.subscription}</h3>
                <div className="relative">
                  <button
                    type="button"
                    onMouseEnter={() => setShowSubInfo(true)}
                    onMouseLeave={() => setShowSubInfo(false)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSubInfo(!showSubInfo);
                    }}
                    className="text-zinc-400 hover:text-[var(--moiz-green)] transition-colors p-1"
                  >
                    <Info size={14} />
                  </button>
                  <AnimatePresence>
                    {showSubInfo && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute bottom-full left-0 mb-3 w-64 bg-zinc-900 text-white p-5 rounded-3xl shadow-2xl z-50 text-[10px] leading-relaxed font-medium pointer-events-none"
                      >
                        <div className="space-y-3">
                          <p className="font-black uppercase tracking-widest text-[var(--moiz-green)] border-b border-white/10 pb-2">
                            {siteConfig.ui.purchase.termsTitle}
                          </p>
                          <p>• {siteConfig.ui.purchase.termsCommitment}</p>
                          <p>• <b>Sin cobros anticipados:</b> {siteConfig.ui.purchase.termsNoPrepayment}</p>
                          <p>• {siteConfig.ui.purchase.termsCancellation}</p>
                        </div>
                        <div className="absolute top-full left-4 border-[8px] border-transparent border-t-zinc-900" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <p className="text-xs text-[var(--moiz-green)] font-bold italic">
                {siteConfig.ui.purchase.subscriptionDesc}
              </p>
            </div>
          </div>
          <span className="font-black text-2xl text-[var(--moiz-green)]">
            ${(activePrice * 0.95).toLocaleString("es-CO")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10 p-8 bg-zinc-900 rounded-[2.5rem] text-white flex items-center justify-between">
      <div>
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-1">
          {siteConfig.ui.purchase.price}
        </label>
        <h3 className="text-4xl font-black">${activePrice.toLocaleString("es-CO")}</h3>
      </div>
      {oldPrice && (
        <div className="text-right">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-1">
            {siteConfig.ui.purchase.before}
          </label>
          <span className="text-lg text-white/40 line-through font-bold">
            ${oldPrice.toLocaleString("es-CO")}
          </span>
        </div>
      )}
    </div>
  );
}

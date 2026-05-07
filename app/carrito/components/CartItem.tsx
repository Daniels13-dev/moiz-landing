"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Minus, Plus, Info } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useState } from "react";

interface CartItemProps {
  item: any;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
}

export default function CartItem({ item, removeFromCart, updateQuantity }: CartItemProps) {
  const [showSubInfo, setShowSubInfo] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white md:bg-zinc-50/50 p-4 md:p-6 rounded-[2rem] flex items-center gap-4 md:gap-6 border border-zinc-100 group transition-all"
    >
      <div className="w-20 md:w-24 h-20 md:h-24 bg-[#FAF9F6] md:bg-white rounded-2xl flex-shrink-0 flex items-center justify-center p-2 overflow-hidden border border-zinc-100/50">
        <Image
          src={item.image}
          alt={item.name}
          width={100}
          height={100}
          className="object-contain"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-base md:text-xl font-black text-zinc-900 truncate mb-0.5">
          {item.name}
        </h3>
        {item.isSubscription && (
          <div className="flex flex-col gap-1 mb-2">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest w-fit">
                Suscripción (Ahorro 5%)
              </div>
              <div className="relative">
                <button
                  onMouseEnter={() => setShowSubInfo(true)}
                  onMouseLeave={() => setShowSubInfo(false)}
                  className="text-zinc-400 hover:text-[var(--moiz-green)] transition-colors"
                >
                  <Info size={12} />
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
                          Permanencia de 3 Meses
                        </p>
                        <p>• {siteConfig.ui.cart.subscriptionNotice.commitment}</p>
                        <p>• <b>Sin cobros anticipados:</b> {siteConfig.ui.cart.subscriptionNotice.noPrepayment}</p>
                        <p>• {siteConfig.ui.cart.subscriptionNotice.cancellation}</p>
                      </div>
                      <div className="absolute top-full left-4 border-[8px] border-transparent border-t-zinc-900" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-bold pl-1">
              <span className="w-1 h-1 bg-zinc-300 rounded-full" />
              {item.subscriptionInterval}
            </div>
          </div>
        )}
        <p className="text-[var(--moiz-green)] font-black text-sm md:text-lg">
          ${(item.price * item.quantity).toLocaleString("es-CO")}
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => removeFromCart(item.id)}
          className="p-1 text-zinc-300 hover:text-red-500 transition-all ml-auto"
          aria-label="Eliminar"
        >
          <X size={16} />
        </button>
        <div className="flex items-center gap-2 bg-zinc-50 md:bg-white p-1 rounded-full border border-zinc-200">
          <button
            onClick={() => updateQuantity(item.id, -1)}
            className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-white text-zinc-600 hover:bg-zinc-900 hover:text-white transition-all shadow-sm"
          >
            <Minus size={12} />
          </button>
          <span className="w-4 text-center font-black text-zinc-900 text-xs md:text-base">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, 1)}
            className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-white text-zinc-600 hover:bg-zinc-900 hover:text-white transition-all shadow-sm"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

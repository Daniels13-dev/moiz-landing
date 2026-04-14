"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Info, ShieldCheck, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";
import { useCart } from "@/context/CartContext";

export default function OrderSummary() {
  const { cart, totalPrice, finalPrice, appliedCoupon, discountAmount } = useCart();
  const [showSubInfo, setShowSubInfo] = useState<string | null>(null);

  return (
    <div className="lg:col-span-4 space-y-8 sticky top-32">
      <div className="bg-zinc-900 rounded-[3rem] p-10 text-white shadow-3xl relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-[var(--moiz-green)]/10 blur-[80px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-32 h-32 bg-white/5 blur-[50px] rounded-full" />

        <h2 className="text-3xl font-black mb-10 tracking-tight flex items-center gap-3">
          <ShoppingBag className="text-[var(--moiz-green)]" /> Tu Pedido
        </h2>

        <div className="space-y-6 max-h-[300px] overflow-y-auto pr-4 mb-10 custom-scrollbar">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 items-center group">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex-shrink-0 flex items-center justify-center p-2 border border-white/10 group-hover:border-[var(--moiz-green)]/30 transition-colors">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="object-contain h-full w-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{item.name}</p>
                <div className="flex flex-col gap-1">
                  <p className="text-white/40 text-xs font-medium">Cantidad: {item.quantity}</p>
                  {item.isSubscription && (
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--moiz-green)] text-[8px] font-black uppercase tracking-widest border border-[var(--moiz-green)]/30 px-1.5 py-0.5 rounded-md">
                        Suscripción
                      </span>
                      <div className="relative">
                        <button
                          onMouseEnter={() => setShowSubInfo(item.id)}
                          onMouseLeave={() => setShowSubInfo(null)}
                          className="text-white/20 hover:text-[var(--moiz-green)] transition-colors"
                        >
                          <Info size={10} />
                        </button>
                        <AnimatePresence>
                          {showSubInfo === item.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: 10 }}
                              className="absolute bottom-full left-0 mb-3 w-64 bg-zinc-900 border border-white/10 text-white p-5 rounded-3xl shadow-2xl z-50 text-[10px] leading-relaxed font-medium pointer-events-none"
                            >
                              <div className="space-y-3">
                                <p className="font-black uppercase tracking-widest text-[var(--moiz-green)] border-b border-white/10 pb-2">
                                  Compromisó de Suscripción
                                </p>
                                <p>• Mínimo de 3 meses de permanencia.</p>
                                <p>• Sin cobros anticipados.</p>
                                <p>• Flexibilidad tras la 3ra entrega.</p>
                              </div>
                              <div className="absolute top-full left-4 border-[8px] border-transparent border-t-zinc-900" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <p className="font-black text-[var(--moiz-green)] text-sm">
                ${(item.price * item.quantity).toLocaleString("es-CO")}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-4 pb-8 border-b border-white/10 mb-8">
          <div className="flex justify-between text-white/60 font-medium">
            <span>Subtotal</span>
            <span>${totalPrice.toLocaleString("es-CO")}</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between text-[var(--moiz-green)] font-black text-sm">
              <span>Descuento ({appliedCoupon.code})</span>
              <span>-${discountAmount.toLocaleString("es-CO")}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-white/60">Envío Estándar</span>
            {totalPrice >= 400000 ? (
              <span className="text-[var(--moiz-green)] font-black">GRATIS</span>
            ) : (
              <span className="text-zinc-500 italic text-[11px]">Por calcular</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-10">
          <span className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px]">
            Total a pagar
          </span>
          <span className="text-5xl font-black text-white leading-none">
            ${finalPrice.toLocaleString("es-CO")}
          </span>
        </div>

        <div className="space-y-4 bg-white/5 p-6 rounded-[2.5rem] border border-white/10">
          <div className="flex items-center gap-3 text-xs font-bold text-white/50">
            <ShieldCheck className="text-[var(--moiz-green)]" size={16} /> Pago 100% Protegido
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-white/50">
            <Truck className="text-[var(--moiz-green)]" size={16} /> Despacho en 24-48h
          </div>
        </div>
      </div>

      <div className="bg-[var(--moiz-green)]/5 border-2 border-[var(--moiz-green)]/10 p-8 rounded-[3rem] items-center gap-4 flex flex-col text-center">
        <div className="w-12 h-12 bg-[var(--moiz-green)] text-zinc-950 rounded-full flex items-center justify-center">
          <Info size={24} />
        </div>
        <div>
          <p className="font-black text-zinc-900 leading-tight">¿Tienes dudas?</p>
          <p className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-widest text-[9px] mb-3">
            Escríbenos por WhatsApp
          </p>
          <a
            href={`https://wa.me/${siteConfig.links.whatsappNumber || "573218515161"}`}
            target="_blank"
            className="inline-flex py-3 px-6 bg-zinc-900 text-white rounded-full font-bold text-xs"
          >
            Hablar con un asesor
          </a>
        </div>
      </div>
    </div>
  );
}

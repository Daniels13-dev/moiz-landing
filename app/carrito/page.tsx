"use client";

// react imports removed (no hooks used in this component)
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  X,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CarritoPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
    clearCart,
  } = useCart();

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
              Tu Carrito
            </h1>
            <p className="text-zinc-500 font-medium text-sm">
              {totalItems} {totalItems === 1 ? "producto" : "productos"}
            </p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-zinc-400 hover:text-red-500 transition-colors p-2"
              title="Vaciar carrito"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="md:bg-white md:p-10 md:rounded-[3rem] md:shadow-2xl md:border md:border-zinc-100 min-h-full flex flex-col">
              <h2 className="hidden md:block text-3xl font-black mb-10 tracking-tight text-zinc-900">
                Productos Seleccionados
              </h2>
              <div className="flex flex-col gap-4 md:gap-6">
                <AnimatePresence mode="popLayout">
                  {cart.length > 0 ? (
                    cart.map((item) => (
                      <motion.div
                        key={item.id}
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
                          <p className="text-[var(--moiz-green)] font-black text-sm md:text-lg">
                            $
                            {(item.price * item.quantity)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
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
                        <h3 className="text-2xl font-black text-zinc-900 mb-2">
                          Carrito Vacío
                        </h3>
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
            </div>
          </div>

          {/* Checkout Summary Sidebar (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-4 h-fit sticky top-48">
            <div className="bg-zinc-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-[var(--moiz-green)]/20 blur-[50px] rounded-full" />

              <h2 className="text-3xl font-black mb-10 tracking-tight">
                Resumen
              </h2>

              <div className="space-y-6 pb-8 border-b border-white/10 mb-8">
                <div className="flex justify-between text-white/60 font-medium">
                  <span>Productos ({totalItems})</span>
                  <span>
                    $
                    {totalPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-white/60">Envío</span>
                  {totalPrice >= 400000 ? (
                    <span className="text-[var(--moiz-green)] font-black">
                      ¡Gratis!
                    </span>
                  ) : (
                    <span className="text-white/30 italic text-[11px]">
                      Calculado por zona
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar de Envío Gratis */}
              <div className="mb-10 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex justify-between text-xs font-bold mb-3">
                  <span className="text-white/70 tracking-wider uppercase">
                    Envío Gratis
                  </span>
                  {totalPrice >= 400000 ? (
                    <span className="text-[var(--moiz-green)] flex items-center gap-1">
                      ¡Desbloqueado! 🎉
                    </span>
                  ) : (
                    <span className="text-white/50">
                      Faltan $
                      {(400000 - totalPrice)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </span>
                  )}
                </div>
                <div className="w-full bg-black/40 rounded-full h-3 overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min((totalPrice / 400000) * 100, 100)}%`,
                    }}
                    transition={{ duration: 1, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-[var(--moiz-green)] to-[#E6B800] rounded-full relative"
                  >
                    {totalPrice >= 400000 && (
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    )}
                  </motion.div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-10">
                <span className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px]">
                  Total del pedido
                </span>
                <span className="text-3xl font-black text-white">
                  ${totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                </span>
              </div>

              <button
                onClick={handleCheckoutClick}
                disabled={cart.length === 0}
                className="w-full py-4 bg-[var(--moiz-green)] text-zinc-950 rounded-full font-black text-lg shadow-[0_15px_40px_rgba(106,142,42,0.3)] hover:shadow-[0_20px_50px_rgba(106,142,42,0.6)] transition-all duration-300 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:pointer-events-none group flex items-center justify-center gap-3"
              >
                Ir a pagar <CreditCard size={20} />
              </button>
            </div>
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
                  ${totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
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

"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useRouter } from "next/navigation";

export default function CarritoPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } =
    useCart();

  const handleWhatsAppCheckout = () => {
    const phoneNumber = siteConfig.links.whatsappNumber || "573218515161";
    // Using more standard characters to avoid encoding issues on some devices
    let message = "Hola Möiz! 🛒 Quiero realizar el siguiente pedido:\n\n";

    const isFreeShipping = totalPrice >= 400000;

    cart.forEach((item) => {
      message += `- ${item.name} x${item.quantity}: $${(item.price * item.quantity).toLocaleString("es-CO")}\n`;
    });

    message += `\n*TOTAL: $${totalPrice.toLocaleString("es-CO")}*`;
    message += isFreeShipping
      ? "\n📦 *Envío: GRATIS*"
      : "\n📦 *Envío: Por calcular (según zona)*";
    message += `\n\nPor favor, confírmenme disponibilidad y pasos para el pago.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
    clearCart();
    router.push("/gracias");
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
                            ${(item.price * item.quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
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
                          Agrega arena Möiz para ver tus productos aquí.
                        </p>
                        <a
                          href="/productos"
                          className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white rounded-full font-bold hover:scale-105 transition-all shadow-xl"
                        >
                          Ir a Productos <ArrowRight size={18} />
                        </a>
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
                    ${totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
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
                  <span className="text-white/70 tracking-wider uppercase">Envío Gratis</span>
                  {totalPrice >= 400000 ? (
                    <span className="text-[var(--moiz-green)] flex items-center gap-1">¡Desbloqueado! 🎉</span>
                  ) : (
                    <span className="text-white/50">
                      Faltan{" "}
                      ${(400000 - totalPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </span>
                  )}
                </div>
                <div className="w-full bg-black/40 rounded-full h-3 overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((totalPrice / 400000) * 100, 100)}%` }}
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
                onClick={handleWhatsAppCheckout}
                disabled={cart.length === 0}
                className="w-full py-4 bg-[var(--moiz-green)] text-zinc-950 rounded-full font-black text-lg shadow-[0_15px_40px_rgba(106,142,42,0.3)] hover:shadow-[0_20px_50px_rgba(106,142,42,0.6)] transition-all duration-300 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:pointer-events-none group flex items-center justify-center gap-3"
              >
                Finalizar Pedido
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </button>
              <p className="mt-6 text-center text-white/40 text-[10px] uppercase font-black tracking-widest leading-none">
                Pago seguro contra entrega
              </p>
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
                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Total</span>
                <span className="text-xl font-black">
                  ${totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                </span>
              </div>
              <button
                onClick={handleWhatsAppCheckout}
                className="flex-1 py-3 px-6 bg-[var(--moiz-green)] text-zinc-950 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
              >
                Comprar <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

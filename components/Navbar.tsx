"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, MessageCircle } from "lucide-react";
import { WhatsAppIcon } from "./WhatsappButton";
import { siteConfig } from "@/config/site";
import { useCart } from "@/context/CartContext";
import { useFooterVisibility } from "@/hooks/useFooterVisibility";

import { usePathname } from "next/navigation";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const isFooterIntersecting = useFooterVisibility();
  const pathname = usePathname();
  const [hubOpen, setHubOpen] = useState(false);

  // Close hub when navigating
  useEffect(() => {
    setHubOpen(false);
  }, [pathname]);

  // Only hide the navbar on the homepage where the dramatic footer takes over.
  // On utility pages like carrito or productos, always keep it visible.
  const isFooterVisible = pathname === "/" ? isFooterIntersecting : false;

  return (
    <>
      {/* Desktop Navbar (Hidden on Mobile) */}
      <motion.nav
        initial={{ y: 150, opacity: 0 }}
        animate={{
          y: isFooterVisible ? 150 : 0,
          opacity: isFooterVisible ? 0 : 1,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="hidden md:flex fixed bottom-8 left-1/2 -translate-x-1/2 z-50 justify-center w-max"
      >
        <div className="flex items-center gap-2 p-2.5 bg-white/70 backdrop-blur-2xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-full">
          {/* Logo Button */}
          <Link
            href="/"
            className="flex items-center justify-center px-3 hover:scale-110 hover:-rotate-3 transition-transform duration-300"
          >
            <Image
              src="/logo/logo.png"
              alt="Möiz"
              width={32}
              height={32}
              className="object-contain"
            />
          </Link>

          <div className="w-px h-8 bg-zinc-300/60 mx-2" />

          {/* Products Link */}
          <Link
            href="/productos"
            className="px-4 py-2 font-bold text-base text-zinc-700 hover:text-[var(--moiz-green)] transition-colors"
          >
            Productos
          </Link>

          <div className="w-px h-8 bg-zinc-300/60 mx-2" />

          {/* Cart Trigger */}
          <Link
            href="/carrito"
            className="group relative px-8 py-3 bg-[var(--moiz-green)] text-white text-base font-extrabold rounded-full shadow-[0_8px_20px_rgba(106,142,42,0.3)] hover:shadow-[0_12px_30px_rgba(106,142,42,0.5)] transition-all duration-300 hover:-translate-y-1 overflow-hidden flex items-center gap-2"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite] ease-out" />
            <span className="relative flex items-center gap-2">
              <ShoppingBag size={18} />
              <span>Carrito</span>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center justify-center bg-white text-[var(--moiz-green)] text-xs font-black min-w-[20px] h-[20px] px-1.5 rounded-full ml-1"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </Link>
        </div>
      </motion.nav>

      {/* Mobile Action Hub (Hidden on Desktop) */}
      <div className="md:hidden fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {hubOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="flex flex-col items-end gap-3 mb-2"
            >
              {/* WhatsApp Option */}
              <motion.a
                href={siteConfig.links.whatsapp}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-3 pr-2"
              >
                <span className="bg-white/90 backdrop-blur-lg px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-600 shadow-xl border border-white">WhatsApp</span>
                <div className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg">
                  <WhatsAppIcon className="w-6 h-6" />
                </div>
              </motion.a>

              {/* Shopping Cart Option */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <Link
                  href="/carrito"
                  className="flex items-center gap-3 pr-2"
                >
                  <span className="bg-white/90 backdrop-blur-lg px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-600 shadow-xl border border-white">Carrito</span>
                  <div className="w-12 h-12 bg-[var(--moiz-green)] text-white rounded-full flex items-center justify-center shadow-lg relative">
                    <ShoppingBag size={20} />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                        {totalItems}
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>

              {/* Menu Option */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <button
                  onClick={() => {
                    setMobileMenuOpen(true);
                    setHubOpen(false);
                  }}
                  className="flex items-center gap-3 pr-2 outline-none"
                >
                  <span className="bg-white/90 backdrop-blur-lg px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-600 shadow-xl border border-white">Menú</span>
                  <div className="w-12 h-12 bg-zinc-900 text-white rounded-full flex items-center justify-center shadow-lg">
                    <Menu size={20} />
                  </div>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trigger Button: Möiz Logo */}
        <motion.button
          onClick={() => setHubOpen(!hubOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(106,142,42,0.3)] transition-all duration-300 border-2 overflow-hidden ${
            hubOpen ? "bg-zinc-100 border-zinc-200" : "bg-white border-white"
          }`}
        >
          {hubOpen ? (
            <X size={24} className="text-zinc-500" />
          ) : (
            <Image
              src="/logo/logo.png"
              alt="Möiz"
              width={34}
              height={34}
              className="object-contain"
            />
          )}
        </motion.button>
      </div>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-zinc-900/95 backdrop-blur-3xl flex flex-col items-center justify-center pointer-events-auto"
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-8 right-8 text-white/50 hover:text-white p-2 rounded-full bg-white/10"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col gap-6 text-center text-3xl font-black text-white">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[var(--moiz-green)] transition-colors"
              >
                Inicio
              </Link>
              <Link
                href="/productos"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[var(--moiz-green)] transition-colors text-2xl"
              >
                Productos
              </Link>
              <Link
                href="/#comparativa"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[var(--moiz-green)] transition-colors text-2xl"
              >
                Comparativa
              </Link>
              <Link
                href="/#calculadora"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[var(--moiz-green)] transition-colors text-2xl"
              >
                Impacto Económico
              </Link>
              <Link
                href="/#beneficios"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[var(--moiz-green)] transition-colors text-2xl"
              >
                Beneficios
              </Link>
              <Link
                href="/#transicion"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[var(--moiz-green)] transition-colors text-2xl"
              >
                Transición
              </Link>
              <Link
                href="/#clientes"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[var(--moiz-green)] transition-colors text-2xl"
              >
                Reseñas
              </Link>
              <Link
                href="/#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[var(--moiz-green)] transition-colors text-2xl"
              >
                Preguntas
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useFooterVisibility } from "@/hooks/useFooterVisibility";

import { usePathname } from "next/navigation";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const isFooterIntersecting = useFooterVisibility();
  const pathname = usePathname();

  // Only hide the navbar on the homepage where the dramatic footer takes over.
  // On utility pages like carrito or productos, always keep it visible.
  const isFooterVisible = pathname === "/" ? isFooterIntersecting : false;

  return (
    <>
      <motion.nav
        initial={{ y: 150, opacity: 0 }}
        animate={{
          y: isFooterVisible ? 150 : 0,
          opacity: isFooterVisible ? 0 : 1,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 flex justify-center w-max"
      >
        <div className="flex items-center gap-1 sm:gap-2 p-2 sm:p-2.5 bg-white/70 backdrop-blur-2xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-full">
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

          <div className="w-px h-8 bg-zinc-300/60 mx-1 sm:mx-2" />

          {/* Products Link */}
          <Link
            href="/productos"
            className="px-4 py-2 font-bold text-sm sm:text-base text-zinc-700 hover:text-[var(--moiz-green)] transition-colors"
          >
            Productos
          </Link>

          <div className="w-px h-8 bg-zinc-300/60 mx-1 sm:mx-2 md:hidden" />

          {/* Mobile hamburger trigger - kept for future links but simplified for now */}
          <div className="md:hidden flex items-center px-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="px-4 py-2 font-bold text-sm text-zinc-700 bg-white/50 rounded-full"
            >
              Menú
            </button>
          </div>

          <div className="w-px h-8 bg-zinc-300/60 mx-1 sm:mx-2" />

          {/* Call to Action -> Now Cart Trigger */}
          <Link
            href="/carrito"
            className="group relative px-6 sm:px-8 py-3 bg-[var(--moiz-green)] text-white text-sm sm:text-base font-extrabold rounded-full shadow-[0_8px_20px_rgba(106,142,42,0.3)] hover:shadow-[0_12px_30px_rgba(106,142,42,0.5)] transition-all duration-300 hover:-translate-y-1 overflow-hidden flex items-center gap-2"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite] ease-out" />
            <span className="relative flex items-center gap-2">
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Carrito</span>
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
                href="/#comparativa"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[var(--moiz-green)] transition-colors text-2xl"
              >
                Comparativa
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
                href="/#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[var(--moiz-green)] transition-colors text-2xl"
              >
                Preguntas
              </Link>
              <Link
                href="/carrito"
                onClick={() => setMobileMenuOpen(false)}
                className="group mt-4 px-10 py-4 bg-[var(--moiz-green)] text-white rounded-full text-xl hover:scale-110 transition-transform flex items-center justify-center gap-3"
              >
                <ShoppingBag size={24} />
                Ver Carrito {totalItems > 0 && `(${totalItems})`}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

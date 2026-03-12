"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="backdrop-blur-md bg-white/60 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

          {/* logo */}
          <a href="#" className="flex items-center gap-3">
            <Image src="/logo/logo.png" alt="Möiz" width={44} height={40} className="rounded-md" loading="eager" style={{ width: 'auto', height: 'auto' }} />
            <span className="font-bold text-lg text-[var(--moiz-pink)]">Möiz</span>
          </a>

          {/* desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6 font-medium text-zinc-700">
              <a href="#producto" className="hover:text-[var(--moiz-text)] transition">Producto</a>
              <a href="#beneficios" className="hover:text-[var(--moiz-text)] transition">Beneficios</a>
              <a href="#contacto" className="hover:text-[var(--moiz-text)] transition">Contacto</a>
            </div>

            <a href="#producto" className="ml-2 inline-flex items-center px-4 py-2 bg-[var(--moiz-text)] text-white rounded-lg shadow hover:opacity-95 transition">
              Comprar
            </a>
          </div>

          {/* mobile hamburger */}
          <div className="md:hidden">
            <button
              aria-label="Abrir menú"
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-700 bg-white/30 hover:bg-white/40 transition"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <motion.path
                  d={open ? "M6 18L18 6M6 6l12 12" : "M3 6h18M3 12h18M3 18h18"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-40 bg-black/40"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 w-3/4 max-w-xs h-full bg-white p-6 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Image src="/logo/logo.png" alt="Möiz" width={40} height={36} />
                  <span className="font-semibold">Möiz</span>
                </div>
                <button aria-label="Cerrar" onClick={() => setOpen(false)} className="p-2">
                  ✕
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                <a href="#producto" className="py-3 text-lg font-medium" onClick={() => setOpen(false)}>Producto</a>
                <a href="#beneficios" className="py-3 text-lg font-medium" onClick={() => setOpen(false)}>Beneficios</a>
                <a href="#contacto" className="py-3 text-lg font-medium" onClick={() => setOpen(false)}>Contacto</a>

                <a href="#producto" className="mt-4 inline-flex items-center justify-center px-4 py-3 bg-[var(--moiz-text)] text-white rounded-lg">Comprar</a>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
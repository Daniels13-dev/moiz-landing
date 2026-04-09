"use client";

import { motion } from "framer-motion";

export default function ProductsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center px-6"
    >
      <div className="inline-flex items-center gap-2 bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
        <span className="w-2 h-2 rounded-full bg-[var(--moiz-green)] animate-pulse" />
        Catálogo Completo
      </div>
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-zinc-900 tracking-tighter mb-6 leading-[0.9]">
        Tu Mascota <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--moiz-green)] to-[var(--moiz-yellow)]">
          Lo Tiene Todo
        </span>
      </h1>
      <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed">
        Desde la arena de maíz más pura hasta los snacks y juguetes más
        divertidos. Calidad premium diseñada para la felicidad de tus mejores
        amigos.
      </p>
    </motion.div>
  );
}

"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
  <section id="hero" className="bg-gradient-to-b from-[var(--moiz-bg)] via-white/5 to-[var(--moiz-bg)] py-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        {/* Left: copy */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-3 bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] rounded-full px-3 py-1 text-sm font-medium w-max">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[var(--moiz-green)]" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            100% natural • Biodegradable
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-[var(--moiz-text)]">
            Arena de maíz para gatos
            <br />
            segura, absorbente y sin polvo
          </h1>

          <p className="text-lg text-zinc-600 max-w-xl">
            Una alternativa ecológica al clumping tradicional. Absorbe rápido, controla olores de forma natural y es compostable.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <a
              href="#producto"
              className="inline-flex items-center justify-center bg-[var(--moiz-text)] text-white px-6 py-3 rounded-lg shadow hover:shadow-lg transition"
            >
              Comprar ahora
            </a>

            <a
              href="#producto"
              className="inline-flex items-center justify-center border border-[var(--moiz-green)] text-[var(--moiz-green)] px-5 py-3 rounded-lg hover:bg-[var(--moiz-green)]/10 transition"
            >
              Ver presentaciones
            </a>
          </div>

          <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-[var(--moiz-text)]">4.8</span>
              <span className="text-sm text-zinc-500">/5 valoración media</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[var(--moiz-green)]" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 21 12 17.77 7.82 21 9 12.91 4 9.27l5.91-.99L12 2z" fill="currentColor" />
              </svg>
              <span>Envíos a todo el país</span>
            </div>
          </div>
        </motion.div>

        {/* Right: image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute -inset-6 bg-gradient-to-r from-[var(--moiz-green)]/10 to-transparent rounded-3xl blur-3xl opacity-40" />

          <div className="relative z-10 w-full max-w-md">
            <Image
              src="/logo/moiz.png"
              alt="Moiz — Arena para gatos"
              width={720}
              height={720}
              loading="eager"
              className="rounded-3xl shadow-2xl w-full h-auto object-cover"
              style={{ height: 'auto' }}
            />
          </div>

          {/* small product card */}
          <div className="hidden md:block absolute bottom-6 right-6 bg-white border rounded-2xl p-3 shadow-md w-48">
            <div className="flex items-center gap-3">
              <Image src="/products/arena4kg.png" alt="Arena 4kg" width={64} height={64} className="rounded-md" />
              <div>
                <div className="text-sm font-semibold">Arena 4kg</div>
                <div className="text-xs text-zinc-500">Compacta y control de olores</div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
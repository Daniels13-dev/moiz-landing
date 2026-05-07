"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";

export default function SavingsCalculator() {
  const [cats, setCats] = useState<number>(2);

  // Supuestos hiper-mínimos conservadores
  const classicCostPerCat = 28000;
  const moizCostPerCat = 12000;

  const totalClassic = cats * classicCostPerCat * 12;
  const totalMoiz = cats * moizCostPerCat * 12;
  const totalSavings = totalClassic - totalMoiz;

  return (
    <section className="py-12 md:py-20 bg-white relative overflow-hidden" id="calculadora">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--moiz-green)]/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-4xl mx-auto px-6 relative">
        <div className="text-center mb-12">
          <span className="text-[var(--moiz-green)] font-black text-xs tracking-widest uppercase py-1 px-3 bg-[var(--moiz-green)]/10 rounded-full mb-4 inline-block">
            {siteConfig.ui.calculator.title}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight">
            {siteConfig.ui.calculator.heading} <span className="text-[var(--moiz-green)]">{siteConfig.ui.calculator.headingAccent}</span>
          </h2>
          <p className="mt-4 text-zinc-500 font-medium max-w-lg mx-auto">
            {siteConfig.ui.calculator.description}
          </p>
        </div>

        <div className="bg-zinc-950 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl overflow-hidden border border-white/5">
          <div className="p-8 md:p-16 flex flex-col gap-12">
            {/* Input Section */}
            <div className="space-y-8 text-center max-w-xl mx-auto w-full">
              <label className="text-white font-bold text-xl md:text-2xl block">
                {siteConfig.ui.calculator.question}
              </label>

              <div className="flex justify-center gap-3 h-10 items-center">
                <AnimatePresence mode="popLayout">
                  {Array.from({ length: cats }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="text-3xl filter drop-shadow-[0_0_10px_rgba(106,142,42,0.5)]"
                    >
                      🐱
                    </motion.span>
                  ))}
                </AnimatePresence>
                <div className="ml-4 bg-[var(--moiz-green)]/20 text-[var(--moiz-green)] px-3 py-1 rounded-lg text-sm font-black">
                  {cats} {cats === 1 ? siteConfig.ui.calculator.catLabel : siteConfig.ui.calculator.catsLabel}
                </div>
              </div>

              <div className="relative pt-6">
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={cats}
                  onChange={(e) => setCats(parseInt(e.target.value))}
                  className="w-full h-3 bg-zinc-800 rounded-full appearance-none cursor-pointer focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, var(--moiz-green) ${((cats - 1) / 5) * 100}%, #27272a ${((cats - 1) / 5) * 100}%)`,
                  }}
                />
                <div className="flex justify-between mt-4 text-white/30 font-bold text-[10px] uppercase tracking-widest px-1">
                  <span>{siteConfig.ui.calculator.oneCat}</span>
                  <span>{siteConfig.ui.calculator.moreCats}</span>
                </div>
              </div>
            </div>

            {/* Result Section */}
            <div className="bg-white/5 rounded-3xl p-8 md:p-12 text-center border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--moiz-green)]/10 to-transparent opacity-50" />

              <span className="relative z-10 text-white/50 text-xs font-black uppercase tracking-[0.2em] mb-4 block">
                {siteConfig.ui.calculator.estimatedSavings}
              </span>

              <motion.div
                key={cats}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 text-[var(--moiz-green)] text-5xl sm:text-7xl font-black tracking-tighter mb-8 drop-shadow-[0_0_40px_rgba(106,142,42,0.3)]"
              >
                ${totalSavings.toLocaleString("es-CO")}
              </motion.div>

              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm mx-auto">
                <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 flex flex-col items-center">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase mb-1">
                    {siteConfig.ui.calculator.traditional}
                  </span>
                  <span className="text-zinc-400 font-black line-through decoration-red-500/50">
                    ${totalClassic.toLocaleString("es-CO")}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--moiz-green)] flex flex-col items-center shadow-lg shadow-[var(--moiz-green)]/20">
                  <span className="text-[10px] text-zinc-950/60 font-black uppercase mb-1">
                    {siteConfig.ui.calculator.withMoiz}
                  </span>
                  <span className="text-zinc-950 font-black">
                    ${totalMoiz.toLocaleString("es-CO")}
                  </span>
                </div>
              </div>

              <p className="relative z-10 mt-8 text-zinc-500 text-[10px] font-medium max-w-xs mx-auto">
                {siteConfig.ui.calculator.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

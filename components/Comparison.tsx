"use client";

import { Check, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const comparisonData = [
  { 
    feature: "Composición", 
    moiz: "100% Maíz Natural", 
    others: "Arcilla / Bentonita / Sílice",
    explanation: "Möiz usa granos de maíz natural procesados, mientras que la arena común usa arcilla minada o cristales sintéticos de sílice."
  },
  { 
    feature: "Polvo Suspendido", 
    moiz: "0% (Seguro)", 
    others: "Alto (Riesgo respiratorio)",
    explanation: "La bentonita libera partículas finas al verterla o excavar, lo que puede irritar los pulmones de gatos y humanos."
  },
  { 
    feature: "Impacto Ambiental", 
    moiz: "Biodegradable / Compostable", 
    others: "Minería (No degradable)",
    explanation: "Möiz es materia orgánica renovable. La arena de arcilla requiere minería a cielo abierto y no se biodegrada en miles de años."
  },
  { 
    feature: "Control de Olores", 
    moiz: "Neutralización Orgánica", 
    others: "Fragancias Químicas",
    explanation: "El maíz encapsula el amoníaco naturalmente. Las arenas comunes suelen usar perfumes fuertes que pueden incomodar el olfato felino."
  },
  { 
    feature: "Peso por Bolsa", 
    moiz: "Ligera y fácil de cargar", 
    others: "Pesada y difícil de mover",
    explanation: "Nuestra tecnología de secado hace que Möiz sea 60% más ligera que la arena de arcilla, facilitando la compra y el manejo en casa."
  },
  { 
    feature: "Desecho", 
    moiz: "Sanitario o Compost", 
    others: "Basura común únicamente",
    explanation: "Möiz se disuelve en agua, permitiendo desechar pequeñas cantidades por el inodoro de forma segura y ecológica."
  },
];

export default function Comparison() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <section id="comparativa" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[var(--moiz-green)] font-semibold tracking-wider text-sm uppercase mb-3 block">El Cambio Inteligente</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight">
            Möiz vs. Arena Tradicional
          </h2>
          <p className="mt-4 text-lg text-zinc-500 max-w-2xl mx-auto">
            No es solo arena, es una mejora tecnológica para tu hogar y el planeta.
          </p>
        </div>

        <div className="relative rounded-[2.5rem] border border-zinc-100 shadow-2xl bg-white">
          <div className="overflow-visible rounded-[2.5rem]">
            <table className="w-full text-left border-collapse overflow-visible">
                <thead>
                <tr className="bg-zinc-50/50">
                    <th className="p-6 md:p-8 text-zinc-500 font-bold text-sm uppercase tracking-wider border-b border-zinc-100 min-w-[200px]">Característica</th>
                    <th className="p-6 md:p-8 text-[var(--moiz-green)] font-black text-xl md:text-2xl border-b border-zinc-100 bg-[var(--moiz-green)]/5">Möiz</th>
                    <th className="p-6 md:p-8 text-zinc-400 font-bold text-lg md:text-xl border-b border-zinc-100">Otras Arenas</th>
                </tr>
                </thead>
                <tbody>
                {comparisonData.map((item, idx) => (
                    <motion.tr 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className={`border-b border-zinc-50 last:border-0 hover:bg-zinc-50/30 transition-colors relative group`}
                    >
                    <td className="p-6 md:p-8 relative">
                        <div 
                            className="flex items-center gap-2 relative"
                            onMouseEnter={() => setActiveIdx(idx)}
                            onMouseLeave={() => setActiveIdx(null)}
                        >
                            <span className="font-bold text-zinc-900 md:text-lg">{item.feature}</span>
                            <div 
                                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-help ${activeIdx === idx ? "bg-[var(--moiz-green)] text-white" : "bg-zinc-100 text-[var(--moiz-green)] hover:bg-[var(--moiz-green)] hover:text-white"}`}
                            >
                                <Info size={14} />
                            </div>

                            {/* Popover */}
                            <AnimatePresence>
                                {activeIdx === idx && (
                                    <motion.div
                                        initial={{ opacity: 0, y: idx > 3 ? -10 : 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: idx > 3 ? -10 : 10, scale: 0.95 }}
                                        className={`absolute left-0 z-[70] w-[280px] md:w-[320px] bg-zinc-900 text-white p-5 rounded-2xl shadow-2xl pointer-events-none 
                                            ${idx > 3 ? "bottom-full mb-3" : "top-full mt-3"}`}
                                    >
                                        <div className={`absolute left-10 w-3 h-3 bg-zinc-900 rotate-45 ${idx > 3 ? "-bottom-1.5" : "-top-1.5"}`} />
                                        <p className="text-sm font-medium leading-relaxed opacity-90">
                                            {item.explanation}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </td>
                    <td className="p-6 md:p-8 bg-[var(--moiz-green)]/5">
                        <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[var(--moiz-green)] flex items-center justify-center text-white shrink-0">
                            <Check size={14} strokeWidth={4} />
                        </div>
                        <span className="font-extrabold text-zinc-900 md:text-lg">{item.moiz}</span>
                        </div>
                    </td>
                    <td className="p-6 md:p-8">
                        <div className="flex items-center gap-3 opacity-60">
                        <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500 shrink-0">
                            <X size={14} strokeWidth={4} />
                        </div>
                        <span className="font-medium text-zinc-500 md:text-lg">{item.others}</span>
                        </div>
                    </td>
                    </motion.tr>
                ))}
                </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 p-8 rounded-3xl bg-[var(--moiz-yellow)]/10 border border-[var(--moiz-yellow)]/20 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl">💡</div>
          <div>
            <h4 className="font-extrabold text-zinc-900 text-xl mb-1">Dato curioso</h4>
            <p className="text-zinc-600 font-medium">Una bolsa de Möiz de 10kg rinde lo mismo que 20kg de arena de arcilla tradicional, ¡y sin cargar el doble de peso!</p>
          </div>
        </div>
      </div>
    </section>
  );
}

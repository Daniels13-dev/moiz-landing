"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";

export default function SavingsCalculator() {
  const [cats, setCats] = useState<number>(2);

  // Supuestos hiper-mínimos conservadores para no "vender humo"
  const classicCostPerCat = 28000;
  const moizCostPerCat = 12000;

  const totalClassic = cats * classicCostPerCat * 12; // Costo clásico al año por N gatos
  const totalMoiz = cats * moizCostPerCat * 12; // Costo Möiz al año por N gatos
  const totalSavings = totalClassic - totalMoiz;

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="calculadora">
      <div className="max-w-5xl mx-auto px-6 relative">
        {/* Estilos del fondo radiante - Movido fuera del contenedor principal para que overflow-hidden no lo corte */}
        <div className="absolute top-[-15%] right-[-10%] w-[60vw] h-[60vw] bg-[var(--moiz-green)]/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-zinc-900 rounded-[3rem] shadow-2xl relative border border-zinc-800 overflow-hidden"
        >

          <div className="grid lg:grid-cols-2">
            {/* Panel de Inputs */}
            <div className="p-8 md:p-14 lg:p-16 relative z-10 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10">
              <div className="mb-10">
                <span className="text-[var(--moiz-green)] font-bold text-sm tracking-[0.2em] uppercase mb-4 block">
                  Herramienta de Ahorro
                </span>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2 flex items-center gap-4">
                  <Calculator className="text-[var(--moiz-green)] hidden md:block" size={40} />
                  Ahorro en Acción
                </h2>
                <p className="text-zinc-500 font-medium text-lg leading-relaxed mt-4">
                  ¿Cuánto dinero gastas en arena tradicional? La fórmula natural de alto rendimiento de Möiz significa comprar menos kilos a largo plazo.
                </p>
              </div>

              <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                <label className="block text-white font-bold mb-8 text-xl">
                  ¿Cuántos michis conviven contigo?
                  <div className="text-[var(--moiz-green)] text-6xl font-black mt-2 drop-shadow-sm">
                    {cats} {cats === 1 ? "Gato" : "Gatos"}
                  </div>
                </label>
                
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={cats}
                    onChange={(e) => setCats(parseInt(e.target.value))}
                    className="w-full h-3 bg-zinc-800 rounded-lg appearance-none cursor-pointer focus:outline-none transition-all"
                    style={{
                      background: `linear-gradient(to right, var(--moiz-green) ${((cats - 1) / 5) * 100}%, #27272a ${((cats - 1) / 5) * 100}%)`,
                    }}
                    aria-label="Selecciona la cantidad de gatos"
                  />
                  {/* Puntero CSS Nativo sobreescrito sutilmente desde global.css si hace falta */}
                </div>
                <div className="flex justify-between mt-4 text-zinc-500 font-black text-xs uppercase tracking-widest px-1">
                  <span>1 Michi</span>
                  <span>+6 Manadas</span>
                </div>
              </div>
            </div>

            {/* Panel de Resultados */}
            <div className="p-8 md:p-14 lg:p-16 flex flex-col justify-center items-center text-center relative z-10 bg-black/20">
              <span className="text-white/60 font-black text-sm uppercase tracking-[0.2em] block mb-4 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                Dinero Ahorrado (Al año)
              </span>
              
              <div 
                className="text-6xl sm:text-7xl lg:text-[5rem] font-black text-[var(--moiz-green)] mb-8 tracking-tighter drop-shadow-[0_0_40px_rgba(106,142,42,0.2)]"
              >
                ${totalSavings.toLocaleString("es-CO")}
              </div>
              
              <div className="w-full flex flex-col gap-3 font-medium">
                <div className="flex justify-between items-center px-5 py-4 rounded-2xl bg-zinc-800/50 text-base">
                  <span className="text-zinc-400">Gasto Clásico</span>
                  <span className="text-red-400 line-through decoration-red-400/50 decoration-2">${totalClassic.toLocaleString("es-CO")}</span>
                </div>
                <div className="flex justify-between items-center px-5 py-4 rounded-2xl bg-[var(--moiz-green)] text-zinc-950 font-black text-base shadow-lg shadow-[var(--moiz-green)]/20">
                  <span>Möiz de Alto Rendimiento</span>
                  <span>${totalMoiz.toLocaleString("es-CO")}</span>
                </div>
              </div>
              
              <p className="mt-8 text-zinc-500 font-medium text-xs leading-relaxed max-w-sm">
                *Cálculo visual basado en promedios conservadores de rendimiento contra marcas tradicionales de bentonita del mercado común que aglomeran ineficientemente consumiendo más kilogramos.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

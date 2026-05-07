"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertOctagon, RotateCcw } from "lucide-react";
import { buttonVariants, cn } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Möiz App Error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#FAF9F6] flex flex-col selection:bg-[var(--moiz-green)] selection:text-white">
      <section className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mb-8 rotate-12 shadow-sm border border-red-100"
        >
          <AlertOctagon size={48} strokeWidth={2.5} />
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-black text-zinc-900 mb-6 tracking-tight leading-none">
          ¡Agh! Tuvimos un <br /> desliz técnico.
        </h1>

        <p className="text-lg md:text-xl text-zinc-500 font-medium max-w-lg mb-10 leading-relaxed">
          Parece que hemos tropezado con un error inesperado dentro de la aplicación. No te
          preocupes, puedes resetear la tienda y volver a la normalidad de inmediato.
        </p>

        <button
          onClick={() => reset()}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "flex items-center gap-3 shadow-xl hover:-translate-y-1",
          )}
        >
          <RotateCcw size={20} strokeWidth={3} />
          Reiniciar Aplicación
        </button>
      </section>
    </main>
  );
}

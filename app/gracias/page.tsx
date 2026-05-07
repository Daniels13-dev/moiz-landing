"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappButton from "@/components/WhatsappButton";

export default function GraciasPage() {
  useEffect(() => {
    // Disparar confeti épico al cargar la página de confirmación
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const intervalId: ReturnType<typeof setInterval> = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(intervalId);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        colors: ["#6A8E2A", "#E6B800", "#ffffff"],
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        colors: ["#6A8E2A", "#E6B800", "#ffffff"],
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(intervalId as unknown as number);
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF9F6] flex flex-col selection:bg-[var(--moiz-green)] selection:text-white overflow-hidden">
      <Navbar />

      <section className="flex-1 flex flex-col items-center justify-center pt-32 pb-24 px-6 relative z-10">
        {/* Decorative Ambience */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[var(--moiz-green)]/15 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="w-24 h-24 mb-8 bg-[var(--moiz-green)] text-white rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(106,142,42,0.4)] relative z-20"
        >
          <CheckCircle2 size={48} strokeWidth={2.5} />
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center relative z-20 max-w-2xl"
        >
          <span className="text-[var(--moiz-green)] font-black tracking-widest uppercase text-sm mb-4 block">
            ¡Pedido Generado!
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-zinc-900 tracking-tight mb-6 leading-none">
            Gracias por
            <br /> elegir Möiz.
          </h1>
          <p className="text-xl text-zinc-600 font-medium mb-12">
            Hemos transferido tu pedido al chat de WhatsApp de nuestro asesor oficial.{" "}
          </p>

          <Link
            href="/"
            className="group relative inline-flex items-center justify-center px-10 py-5 bg-zinc-900 text-white rounded-full font-bold text-lg overflow-hidden shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            Regresar al Inicio
            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      <Footer />
      <WhatsappButton />
    </main>
  );
}

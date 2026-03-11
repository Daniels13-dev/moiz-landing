"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {

  return (
  <section id="hero" className="bg-[var(--moiz-bg)] py-24">

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-12">

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
        >

          <h1 className="text-5xl font-bold text-[var(--moiz-text)] mb-6">
            Arena de Maíz Natural para Gatos
          </h1>

          <p className="text-lg mb-6">
            Arena ecológica hecha de maíz. Natural, biodegradable
            y con control superior de olores.
          </p>

          <div className="flex gap-4">

            <button className="bg-[var(--moiz-text)] text-white px-6 py-3 rounded-xl">
              Comprar
            </button>

            <button className="border border-[var(--moiz-green)] px-6 py-3 rounded-xl">
              Ver Producto
            </button>

          </div>

        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <Image
            src="/logo/moiz.png"
            alt="Moiz — Arena para gatos"
            width={640}
            height={480}
            className="rounded-xl shadow-xl w-full h-auto"
          />
        </motion.div>

      </div>

    </section>
  );
}
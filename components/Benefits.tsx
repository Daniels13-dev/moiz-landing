"use client";

import { Leaf, ShieldCheck, Droplets, Recycle } from "lucide-react";
import { motion } from "framer-motion";

export default function Benefits() {
  const benefits = [
    { Icon: Leaf, title: "100% Natural", desc: "Hecho a base de maíz, sin químicos añadidos." },
    { Icon: Recycle, title: "Biodegradable", desc: "Se degrada rápidamente y es compostable." },
    { Icon: ShieldCheck, title: "Seguro para gatos", desc: "Sin polvo fino ni sustancias irritantes." },
    { Icon: Droplets, title: "Control de olores", desc: "Neutraliza olores sin fragancias agresivas." },
  ];

  return (
  <section id="beneficios" className="py-12 bg-white">

      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl text-center font-bold text-[var(--moiz-green)] mb-6">Beneficios</h2>
        <p className="text-center text-zinc-600 max-w-2xl mx-auto mb-10">
          Nuestra arena está pensada para el bienestar de tu gato y la comodidad de tu hogar.
        </p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.12 },
            },
          }}
          className="grid sm:grid-cols-2 md:grid-cols-4 gap-6"
        >
          {benefits.map((b, i) => (
            <motion.article
              key={i}
              className="bg-[var(--moiz-bg)] rounded-2xl p-6 shadow-md flex flex-col items-center text-center"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] mb-4">
                <b.Icon size={28} />
              </div>

              <h3 className="font-semibold text-lg mb-1 text-[var(--moiz-text)]">{b.title}</h3>
              <p className="text-sm text-zinc-500">{b.desc}</p>

            </motion.article>
          ))}
        </motion.div>
      </div>

    </section>
  );
}
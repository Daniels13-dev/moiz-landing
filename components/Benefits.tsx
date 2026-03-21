"use client";

import { Leaf, ShieldCheck, Droplets, Recycle, Wind } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Benefits() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const benefits = [
    {
      id: 0,
      Icon: Leaf,
      title: "100% Natural",
      desc: "Hecho a base de maíz seleccionado, libre de químicos y fragancias artificiales.",
      color: "var(--moiz-green)",
      bg: "bg-[var(--moiz-green)]/10",
    },
    {
      id: 1,
      Icon: Recycle,
      title: "Biodegradable",
      desc: "Se desecha por el sanitario o se usa como abono para plantas.",
      color: "var(--moiz-yellow)",
      bg: "bg-white/60",
    },
    {
      id: 2,
      Icon: ShieldCheck,
      title: "Seguro para michis",
      desc: "Suave con sus patas y libre de agentes irritantes para michis sensibles.",
      color: "var(--moiz-pink)",
      bg: "bg-[#FFEAF3]",
    },
    {
      id: 3,
      Icon: Droplets,
      title: "Control de olores",
      desc: "Neutralización orgánica que mantiene tu hogar fresco siempre.",
      color: "#3b82f6",
      bg: "bg-blue-50",
    },
    {
      id: 4,
      Icon: Wind,
      title: "99.9% Sin Polvo",
      desc: "Cuida el sistema respiratorio de tu gato y mantiene tu casa impecable.",
      color: "#14b8a6",
      bg: "bg-white",
    },
  ];

  // Animation mapping for icons based on hoveredId
  const getIconMotion = (id: number) => {
    if (hoveredId !== id) return { rotate: 0, x: 0, y: 0, scale: 1 };
    switch (id) {
      case 0:
        return { rotate: [0, -10, 10, -10, 0] };
      case 1:
        return { rotate: 360 };
      case 2:
        return { scale: [1, 1.2, 1] };
      case 3:
        return { y: [0, -5, 0] };
      case 4:
        return { x: [-3, 3, -3] };
      default:
        return {};
    }
  };

  const getIconTransition = (id: number) => {
    if (hoveredId !== id) return { duration: 0.3, repeat: 0 };
    return {
      duration: id === 1 ? 2 : 0.6,
      repeat: Infinity,
      ease: (id === 1 ? "linear" : "easeInOut") as any,
    };
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <section
      id="beneficios"
      className="py-16 md:py-24 bg-zinc-50 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[var(--moiz-green)] font-semibold tracking-wider text-sm uppercase mb-3 block">
            Por qué elegir Möiz
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight">
            Beneficios para todos
          </h2>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto mt-4">
            Nuestra arena está pensada tanto para el bienestar de tu gato, como
            para la comodidad de tu hogar y el cuidado del planeta.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]"
        >
          {/* Item 0: Natural (Large) */}
          <motion.article
            onMouseEnter={() => setHoveredId(0)}
            onMouseLeave={() => setHoveredId(null)}
            variants={cardVariants}
            className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm flex flex-col justify-end relative overflow-hidden group hover:shadow-lg transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-64 h-64 opacity-20 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-500 bg-[radial-gradient(circle,var(--moiz-green)_0%,transparent_70%)]" />
            <div className="mb-auto">
              <motion.div
                animate={getIconMotion(0)}
                transition={getIconTransition(0)}
                className="w-16 h-16 rounded-2xl bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] flex items-center justify-center mb-6"
              >
                <Leaf size={32} />
              </motion.div>
            </div>
            <h3 className="font-extrabold text-2xl text-zinc-900 mb-2">
              {benefits[0].title}
            </h3>
            <p className="text-zinc-500 font-medium">{benefits[0].desc}</p>
          </motion.article>

          {/* Item 1: Biodegradable (Tall) */}
          <motion.article
            onMouseEnter={() => setHoveredId(1)}
            onMouseLeave={() => setHoveredId(null)}
            variants={cardVariants}
            className="md:row-span-2 bg-gradient-to-b from-[#F9F7EF] to-[#F1ECD4] rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group hover:shadow-lg transition-all duration-300 border border-[#EBE4C4]"
          >
            <motion.div
              animate={getIconMotion(1)}
              transition={getIconTransition(1)}
              className="w-20 h-20 rounded-full bg-white/60 text-[var(--moiz-yellow)] shadow-sm flex items-center justify-center mb-8"
            >
              <Recycle size={40} />
            </motion.div>
            <h3 className="font-extrabold text-2xl text-zinc-900 mb-4">
              {benefits[1].title}
            </h3>
            <p className="text-zinc-600 font-medium">
              {benefits[1].desc} Aporta a un ciclo completamente sostenible.
            </p>
          </motion.article>

          {/* Item 4: Sin Polvo (Tall) */}
          <motion.article
            onMouseEnter={() => setHoveredId(4)}
            onMouseLeave={() => setHoveredId(null)}
            variants={cardVariants}
            className="md:row-span-2 bg-gradient-to-br from-teal-50 to-blue-50 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group hover:shadow-lg transition-all duration-300 border border-teal-100"
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/40 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
            <motion.div
              animate={getIconMotion(4)}
              transition={getIconTransition(4)}
              className="w-20 h-20 rounded-full bg-white text-teal-500 shadow-sm flex items-center justify-center mb-8 relative z-10"
            >
              <Wind size={40} />
            </motion.div>
            <h3 className="font-extrabold text-2xl text-zinc-900 mb-4 relative z-10">
              {benefits[4].title}
            </h3>
            <p className="text-zinc-600 font-medium relative z-10">
              {benefits[4].desc}
            </p>
          </motion.article>

          {/* Item 3: Olores (Std) */}
          <motion.article
            onMouseEnter={() => setHoveredId(3)}
            onMouseLeave={() => setHoveredId(null)}
            variants={cardVariants}
            className="bg-white rounded-3xl p-8 shadow-sm flex gap-6 items-center group hover:shadow-lg transition-all duration-300"
          >
            <motion.div
              animate={getIconMotion(3)}
              transition={getIconTransition(3)}
              className="w-14 h-14 shrink-0 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center"
            >
              <Droplets size={28} />
            </motion.div>
            <div>
              <h3 className="font-bold text-xl text-zinc-900 mb-1">
                {benefits[3].title}
              </h3>
              <p className="text-zinc-500 text-sm">{benefits[3].desc}</p>
            </div>
          </motion.article>

          {/* Item 2: Seguro Michis (Large) */}
          <motion.article
            onMouseEnter={() => setHoveredId(2)}
            onMouseLeave={() => setHoveredId(null)}
            variants={cardVariants}
            className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm flex flex-col justify-end relative overflow-hidden group hover:shadow-lg transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-64 h-64 opacity-20 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-500 bg-[radial-gradient(circle,var(--moiz-pink)_0%,transparent_70%)]" />
            <div className="mb-auto">
              <motion.div
                animate={getIconMotion(2)}
                transition={getIconTransition(2)}
                className="w-16 h-16 rounded-2xl bg-[#FFEAF3] text-[var(--moiz-pink)] flex items-center justify-center mb-6"
              >
                <ShieldCheck size={32} />
              </motion.div>
            </div>
            <h3 className="font-extrabold text-2xl text-zinc-900 mb-2">
              {benefits[2].title}
            </h3>
            <p className="text-zinc-500 font-medium">{benefits[2].desc}</p>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";

const steps = [
  {
    day: "Días 1-3",
    percent: "25%",
    title: "Inicia la mezcla",
    desc: "Mezcla un 25% de Möiz con un 75% de tu arena anterior. Deja que tu gato se familiarice con la nueva textura.",
    icon: "🌱",
  },
  {
    day: "Días 4-6",
    percent: "50%",
    title: "Mitad y mitad",
    desc: "Aumenta la proporción a partes iguales. Ya notarás una mejora en el control de olores y menos polvo.",
    icon: "⚖️",
  },
  {
    day: "Días 7-9",
    percent: "75%",
    title: "Casi listo",
    desc: "Usa un 75% de Möiz. Tu gato ya debería estar totalmente cómodo con el cambio natural.",
    icon: "✨",
  },
  {
    day: "Día 10+",
    percent: "100%",
    title: "Cambio Total",
    desc: "¡Felicidades! Tu hogar ahora es 100% libre de químicos y totalmente sostenible.",
    icon: "🐈",
  },
];

export default function TransitionGuide() {
  return (
    <section
      id="transicion"
      className="py-16 md:py-24 bg-zinc-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[var(--moiz-green)] font-semibold tracking-wider text-sm uppercase mb-3 block">
            El Cambio Perfecto
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight">
            Cómo pasarse a Möiz
          </h2>
          <p className="mt-4 text-lg text-zinc-500 max-w-2xl mx-auto">
            Para una transición exitosa y sin estrés para tu michi, te
            recomendamos seguir este plan de 10 días.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[45%] left-0 w-full h-0.5 bg-zinc-200 z-0" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative z-10 bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow group text-center"
            >
              <div className="w-20 h-20 rounded-full bg-zinc-50 border-4 border-white shadow-inner flex items-center justify-center text-4xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>

              <div className="inline-block px-4 py-1 rounded-full bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] text-sm font-black mb-4">
                {step.day}
              </div>

              <h3 className="font-extrabold text-2xl text-zinc-900 mb-4">
                {step.title}
              </h3>

              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="h-2 w-24 bg-zinc-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: step.percent }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: idx * 0.2 + 0.5 }}
                    className="h-full bg-[var(--moiz-green)]"
                  />
                </div>
                <span className="text-sm font-bold text-zinc-400">
                  {step.percent}
                </span>
              </div>

              <p className="text-zinc-500 font-medium text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-zinc-400 font-medium italic">
            * Recuerda limpiar el arenero antes de empezar con el día 10 para
            una frescura total.
          </p>
        </div>
      </div>
    </section>
  );
}

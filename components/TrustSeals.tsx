"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, Star, Heart } from "lucide-react";

const seals = [
  {
    icon: <ShieldCheck size={28} />,
    title: "Pago Seguro",
    desc: "100% Protegido con Wompi y ePayco",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: <Truck size={28} />,
    title: "Envío Nacional",
    desc: "Cobertura total en toda Colombia",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: <Star size={28} />,
    title: "Calidad Premium",
    desc: "Productos seleccionados rigurosamente",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: <Heart size={28} />,
    title: "Soporte Möiz",
    desc: "Atención personalizada para tu peludito",
    color: "bg-rose-50 text-rose-600",
  },
];

export default function TrustSeals() {
  return (
    <section className="py-12 bg-white/50 border-y border-zinc-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {seals.map((seal, index) => (
            <motion.div
              key={seal.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div
                className={`w-16 h-16 ${seal.color} rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                {seal.icon}
              </div>
              <h4 className="text-sm font-black text-zinc-900 uppercase tracking-wider mb-1">
                {seal.title}
              </h4>
              <p className="text-xs text-zinc-500 font-medium leading-tight max-w-[140px]">
                {seal.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

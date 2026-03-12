"use client";

import { motion } from "framer-motion";

type Review = {
  id: number;
  name: string;
  rating: number;
  date: string;
  city?: string;
  text: string;
};

const reviews: Review[] = [
  {
    id: 1,
    name: "María P.",
    rating: 5,
    date: "Feb 2026",
    city: "Bogotá",
    text: "Excelente absorción y controla muy bien los olores. Mis gatos la prefieren y además es compostable."
  },
  {
    id: 2,
    name: "Carlos R.",
    rating: 5,
    date: "Ene 2026",
    city: "Medellín",
    text: "Se nota la calidad; no levanta polvo y la presentación de 10 kg rinde bastante."
  },
  {
    id: 3,
    name: "Ana G.",
    rating: 4,
    date: "Dic 2025",
    city: "Cali",
    text: "Buena absorción, sólo desearía un poco más de control de olores en semanas muy calurosas."
  },
  {
    id: 4,
    name: "Sofía L.",
    rating: 5,
    date: "Feb 2026",
    city: "Barranquilla",
    text: "Mi gato tiene alergias y con esta arena noté menos estornudos. Muy recomendable."
  },
  {
    id: 5,
    name: "Jorge M.",
    rating: 5,
    date: "Mar 2026",
    city: "Bucaramanga",
    text: "Fácil de limpiar y el paquete llegó en perfecto estado. Gran producto por el precio."
  },
  {
    id: 6,
    name: "Lucía T.",
    rating: 4,
    date: "Nov 2025",
    city: "Pereira",
    text: "Me gusta que sea ecológica, y que no deje olor. Ojalá hubiera más tamaños para probar."
  },
  {
    id: 7,
    name: "Andrés V.",
    rating: 5,
    date: "Feb 2026",
    city: "Cúcuta",
    text: "Compacta y muy absorbente. Recomendé a mis vecinos y quedaron encantados."
  },
  {
    id: 8,
    name: "Valentina Q.",
    rating: 5,
    date: "Mar 2026",
    city: "Manizales",
    text: "Envase práctico y diseño cuidado. El olor natural es muy agradable."
  },
  {
    id: 9,
    name: "Diego S.",
    rating: 4,
    date: "Ene 2026",
    city: "Ibagué",
    text: "Buena relación calidad-precio. En días de mucha humedad puede durar menos, pero cumple."
  }
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1 text-yellow-400" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < count ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.2}
          className={i < count ? "text-yellow-400" : "text-zinc-300"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 .587l3.668 7.431L24 9.748l-6 5.848 1.417 8.265L12 19.771 4.583 23.861 6 15.596 0 9.748l8.332-1.73z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductReviews() {
  return (
    <section aria-labelledby="reviews-title" className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8 text-center">
          <h2 id="reviews-title" className="text-3xl font-extrabold text-[var(--moiz-text)]">Reseñas de clientes</h2>
          <p className="mt-2 text-zinc-600">Opiniones reales de personas que ya probaron la arena Möiz</p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {reviews.map((r) => (
            <motion.article
              key={r.id}
              className="bg-white rounded-2xl p-5 shadow-md border border-transparent hover:shadow-lg hover:border-[color:var(--moiz-green)]/10 transition transform hover:-translate-y-1"
              variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
              aria-label={`Reseña de ${r.name}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[var(--moiz-green)]/10 flex items-center justify-center text-[var(--moiz-green)] font-semibold">
                    {r.name.split(" ")[0].slice(0,1)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--moiz-text)]">{r.name}</div>
                    <div className="text-xs text-zinc-400">{r.city} • {r.date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Stars count={r.rating} />
                </div>
              </div>

              <p className="mt-4 text-sm text-zinc-700">{r.text}</p>

              <div className="mt-4 flex items-center gap-3">
                <button className="text-xs text-[var(--moiz-green)] px-3 py-1 rounded-full border border-[var(--moiz-green)]/10 hover:bg-[var(--moiz-green)]/5 transition">Útil</button>
                <button className="text-xs text-zinc-400">Denunciar</button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

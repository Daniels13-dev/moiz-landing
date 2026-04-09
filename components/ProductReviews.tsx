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
    text: "Excelente calidad en todos sus productos. A mi mascota le encantó y además son amigables con el entorno.",
  },
  {
    id: 2,
    name: "Carlos R.",
    rating: 5,
    date: "Ene 2026",
    city: "Medellín",
    text: "Se nota la calidad y el cuidado que le ponen a cada detalle; todo rinde bastante y mis peluditos están felices.",
  },
  {
    id: 3,
    name: "Ana G.",
    rating: 4,
    date: "Dic 2025",
    city: "Cali",
    text: "Muy buena atención y los accesorios me parecieron espectaculares. ¡A mis mascotas les encantó su nuevo juguete!",
  },
  {
    id: 4,
    name: "Sofía L.",
    rating: 5,
    date: "Feb 2026",
    city: "Barranquilla",
    text: "Mi mascota es muy sensible y con estos productos naturales he notado una gran mejoría. Muy recomendable.",
  },
  {
    id: 5,
    name: "Jorge M.",
    rating: 5,
    date: "Mar 2026",
    city: "Bucaramanga",
    text: "El pedido llegó en perfecto estado y súper rápido. Gran variedad de productos a un precio inmejorable.",
  },
  {
    id: 6,
    name: "Lucía T.",
    rating: 4,
    date: "Nov 2025",
    city: "Pereira",
    text: "Me gusta mucho que ofrezcan opciones ecológicas y tan variadas. Ojalá traigan más productos para probar.",
  },
  {
    id: 7,
    name: "Andrés V.",
    rating: 5,
    date: "Feb 2026",
    city: "Cúcuta",
    text: "Excelentes artículos. Recomendé la tienda a mis familiares para sus perritos y quedaron encantados.",
  },
  {
    id: 8,
    name: "Valentina Q.",
    rating: 5,
    date: "Mar 2026",
    city: "Manizales",
    text: "El diseño y empaque de cada cosa es sumamente cuidado. Todo se siente muy premium.",
  },
  {
    id: 9,
    name: "Diego S.",
    rating: 4,
    date: "Ene 2026",
    city: "Ibagué",
    text: "Buena relación calidad-precio. A mis perritos les fascinan los snacks y juguetes que compramos acá.",
  },
];

export default function ProductReviews() {
  return (
    <motion.section
      id="clientes"
      aria-labelledby="reviews-title"
      className="py-16 md:py-24 bg-white relative overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Productos para Mascotas Möiz",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: "87",
            },
            review: reviews.slice(0, 5).map((r) => ({
              "@type": "Review",
              reviewRating: {
                "@type": "Rating",
                ratingValue: r.rating.toString(),
              },
              author: {
                "@type": "Person",
                name: r.name,
              },
              reviewBody: r.text,
            })),
          }),
        }}
      />
      {/* Soft background decor */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-[var(--moiz-green)]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-12 md:mb-16 relative z-10 text-center">
        <span className="text-[var(--moiz-green)] font-semibold tracking-wider text-sm uppercase mb-3 block">
          Testimonios
        </span>
        <h2
          id="reviews-title"
          className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight"
        >
          Mascotas felices, dueños tranquilos
        </h2>
        <p className="mt-4 text-lg text-zinc-500 max-w-2xl mx-auto">
          Cientos de hogares confían en nuestros productos naturales e
          innovadores. Estas son sus experiencias reales con Möiz.
        </p>
      </div>

      <div className="relative w-full flex overflow-x-hidden group pb-4">
        {/* Left/Right Fade Masks */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none fade-mask-l" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none fade-mask-r" />

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: 35,
            ease: "linear",
          }}
          className="flex gap-6 px-3"
          style={{ width: "max-content" }}
        >
          {/* Double the reviews array to create seamless loop */}
          {[...reviews, ...reviews].map((r, i) => (
            <article
              key={`${r.id}-${i}`}
              className="w-[320px] shrink-0 bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-zinc-100 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition duration-300"
              aria-label={`Reseña de ${r.name}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--moiz-green)]/10 flex items-center justify-center text-[var(--moiz-green)] font-extrabold text-lg">
                    {r.name.split(" ")[0].slice(0, 1)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-900">
                      {r.name}
                    </div>
                    <div className="text-xs text-zinc-400 font-medium">
                      {r.date}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div
                    className="flex"
                    aria-label={`Valoración de ${r.rating} estrellas`}
                  >
                    {Array.from({ length: 5 }).map((_, index) => (
                      <svg
                        key={index}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill={index < r.rating ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className={
                          index < r.rating ? "text-yellow-400" : "text-zinc-200"
                        }
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 .587l3.668 7.431L24 9.748l-6 5.848 1.417 8.265L12 19.771 4.583 23.861 6 15.596 0 9.748l8.332-1.73z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-[15px] leading-relaxed text-zinc-600">
                &quot;{r.text}&quot;
              </p>
            </article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

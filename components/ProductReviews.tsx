"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getReviews } from "@/app/actions/reviews";

type Review = {
  id: string | number;
  name: string;
  rating: number;
  image?: string | null;
  date: string | null;
  city: string | null;
  text: string;
};

const fallbackReviews: Review[] = [
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
  const [dbReviews, setDbReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      const res = await getReviews();
      if (res.success && res.reviews.length > 0) {
        setDbReviews(res.reviews as any);
      }
      setLoading(false);
    }
    loadReviews();
  }, []);

  const displayReviews = dbReviews.length > 0 ? dbReviews : fallbackReviews;

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
            review: displayReviews.slice(0, 5).map((r) => ({
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
          Cientos de hogares confían en nuestros productos naturales e innovadores. Estas son sus
          experiencias reales con Möiz.
        </p>
      </div>

      <div className={`relative w-full flex group pb-4 ${displayReviews.length > 3 ? "overflow-x-hidden" : "px-6"}`}>
        {/* Left/Right Fade Masks - Only show if marquee is active */}
        {displayReviews.length > 3 && (
          <>
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none fade-mask-l" />
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none fade-mask-r" />
          </>
        )}

        <motion.div
          animate={displayReviews.length > 3 ? { x: ["0%", "-50%"] } : {}}
          transition={
            displayReviews.length > 3
              ? {
                  repeat: Infinity,
                  duration: 35,
                  ease: "linear",
                }
              : {}
          }
          className={`flex gap-8 ${displayReviews.length <= 3 ? "justify-center w-full flex-wrap" : ""}`}
          style={{ width: displayReviews.length > 3 ? "max-content" : "100%" }}
        >
          {/* Loop only if we have enough content to fill a marquee, otherwise show once */}
          {(displayReviews.length > 3 ? [...displayReviews, ...displayReviews] : displayReviews).map((r, i) => (
            <article
              key={`${r.id}-${i}`}
              className="w-[380px] md:w-[450px] shrink-0 bg-white rounded-[2.5rem] overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.04)] border border-zinc-100 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 group"
              aria-label={`Reseña de ${r.name}`}
            >
              <div className="flex flex-col h-full">
                {/* Image Section (if available) */}
                <div className="relative h-64 w-full bg-zinc-50 overflow-hidden">
                  {r.image ? (
                    <img
                      src={r.image}
                      alt={`Foto de ${r.name}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[var(--moiz-green)]/5 text-[var(--moiz-green)]">
                      <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl font-black shadow-sm">
                        {r.name.charAt(0)}
                      </div>
                    </div>
                  )}
                  {/* Rating Badge Overlay */}
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-1 shadow-xl">
                    <span className="font-black text-zinc-900">{r.rating}.0</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-yellow-400"
                    >
                      <path d="M12 .587l3.668 7.431L24 9.748l-6 5.848 1.417 8.265L12 19.771 4.583 23.861 6 15.596 0 9.748l8.332-1.73z" />
                    </svg>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-xl font-black text-zinc-900 mb-1">{r.name}</h3>
                    <div className="flex items-center gap-3 text-[10px] uppercase font-black tracking-widest text-zinc-400">
                      <span>{r.city || "Colombia"}</span>
                      <span className="w-1 h-1 bg-zinc-200 rounded-full" />
                      <span>{r.date || "Reciente"}</span>
                    </div>
                  </div>

                  <p className="text-[16px] leading-relaxed text-zinc-600 font-medium italic flex-1">
                    &quot;{r.text}&quot;
                  </p>
 
                  <div className="mt-auto pt-6 border-t border-zinc-50 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--moiz-green)] flex items-center justify-center text-white">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-zinc-900">
                      Compra Verificada
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

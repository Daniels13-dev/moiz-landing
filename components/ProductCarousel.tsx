"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

const products = [
  { name: "Arena 2kg", image: "/products/arena2kg.png", price: "$12.000", desc: "Ideal para gatos pequeños" },
  { name: "Arena 4kg", image: "/products/arena4kg.png", price: "$24.000", desc: "Presentación balanceada" },
  { name: "Arena 10kg", image: "/products/arena10kg.png", price: "$55.000", desc: "Mejor relación precio/uso" },
  { name: "Arena 20kg", image: "/products/arena20kg.png", price: "$108.000", desc: "Para hogares con varios gatos" },
  { name: "Arena 50kg", image: "/products/arena50kg.png", price: "$237.000", desc: "Uso profesional / granjas" },
];

export default function ProductCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const [selected, setSelected] = useState(0);
  const [slides, setSlides] = useState(products.length);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    setSlides(emblaApi.scrollSnapList().length);
    emblaApi.on("select", onSelect);
    // initial
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (idx: number) => {
      if (emblaApi) emblaApi.scrollTo(idx);
    },
    [emblaApi]
  );

  return (
  <section id="producto" className="py-12 bg-white">

      <h2 className="text-4xl text-center font-bold text-[var(--moiz-green)] mb-16">
        Presentaciones
      </h2>

      <div className="relative max-w-6xl mx-auto px-6">

        {/* viewport */}
        <div className="overflow-hidden" ref={emblaRef}>

          {/* container */}
          <div className="flex items-stretch">

            {products.map((p, i) => (
              <div key={i} className="flex-[0_0_80%] md:flex-[0_0_33.333%] px-4">
                <div className="flex flex-col items-center bg-white border border-gray-100 shadow-md rounded-2xl p-6 hover:shadow-xl transform hover:-translate-y-1 transition">

                  {/* imagen producto */}
                  <div className="w-48 h-64 mb-4 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
                    <Image src={p.image} alt={p.name} width={192} height={256} className="w-full h-full object-contain" style={{ width: 'auto' }} />
                  </div>

                  <div className="text-center">
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <p className="text-sm text-zinc-500 mt-1">{p.desc}</p>
                    <div className="mt-3 flex items-center justify-center gap-3">
                      <span className="text-[var(--moiz-text)] font-bold">{p.price}</span>
                      <button className="bg-[var(--moiz-text)] text-white px-4 py-2 rounded-md text-sm hover:opacity-95 transition">Comprar</button>
                    </div>
                  </div>

                </div>
              </div>
            ))}

          </div>
        </div>

        {/* botón izquierda */}
        <button
          onClick={scrollPrev}
          aria-label="Anterior"
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border shadow-md rounded-full w-11 h-11 flex items-center justify-center hover:scale-105 transition"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        {/* botón derecha */}
        <button
          onClick={scrollNext}
          aria-label="Siguiente"
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border shadow-md rounded-full w-11 h-11 flex items-center justify-center hover:scale-105 transition"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        {/* indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: slides }).map((_, idx) => (
            <button
              key={idx}
              aria-label={`Ir a la diapositiva ${idx + 1}`}
              onClick={() => scrollTo(idx)}
              className={`w-2 h-2 rounded-full transition ${selected === idx ? 'bg-[var(--moiz-text)]' : 'bg-zinc-300'}`}
            />
          ))}
        </div>

      </div>

    </section>
  );
}
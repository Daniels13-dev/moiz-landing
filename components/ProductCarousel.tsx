"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";
import Image from "next/image";

const products = [
  { name: "Arena 2kg", image: "/products/arena2kg.png" },
  { name: "Arena 4kg", image: "/products/arena4kg.png" },
  { name: "Arena 10kg", image: "/products/arena10kg.png" },
  { name: "Arena 20kg", image: "/products/arena20kg.png" },
  { name: "Arena 50kg", image: "/products/arena50kg.png" },
];

export default function ProductCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section id="producto" className="py-24 bg-white">

      <h2 className="text-4xl text-center font-bold text-[var(--moiz-green)] mb-16">
        Presentaciones
      </h2>

      <div className="relative max-w-6xl mx-auto px-6">

        {/* viewport */}
        <div className="overflow-hidden" ref={emblaRef}>

          {/* container */}
          <div className="flex">

            {products.map((p, i) => (
              <div
                key={i}
                className="flex-[0_0_100%] md:flex-[0_0_33.333%] px-4"
              >
                <div className="flex flex-col items-center bg-white border border-gray-100 shadow-md rounded-2xl p-8 hover:shadow-xl transition">

                  {/* imagen producto */}
                  <div className="w-52 h-72 mb-6 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">

                    <Image
                      src={p.image}
                      alt={p.name}
                      width={208}
                      height={288}
                      className="w-full h-full object-contain"
                    />

                  </div>

                  <h3 className="text-lg font-semibold mb-4">
                    {p.name}
                  </h3>

                  <button className="bg-[var(--moiz-text)] text-white px-6 py-2 rounded-lg hover:opacity-90 transition">
                    Comprar
                  </button>

                </div>
              </div>
            ))}

          </div>
        </div>

        {/* botón izquierda */}
        <button
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border shadow-md rounded-full w-11 h-11 flex items-center justify-center hover:scale-105 transition"
        >
          ←
        </button>

        {/* botón derecha */}
        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border shadow-md rounded-full w-11 h-11 flex items-center justify-center hover:scale-105 transition"
        >
          →
        </button>

      </div>

    </section>
  );
}
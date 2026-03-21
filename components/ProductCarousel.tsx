"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { productsData as products } from "@/data/products";
import { Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: false, align: "center", skipSnaps: false },
    [Autoplay({ delay: 5000, stopOnInteraction: true })],
  );

  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );
  const scrollTo = useCallback(
    (idx: number) => emblaApi && emblaApi.scrollTo(idx),
    [emblaApi],
  );

  const activeProduct = products[selected];
  const { cart, addToCart, updateQuantity } = useCart();

  const activeQuantity =
    cart.find((item) => item.id === activeProduct.name)?.quantity || 0;

  return (
    <section
      id="producto"
      className="relative py-16 md:py-32 bg-[#0A0E0A] text-white overflow-hidden"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] bg-[var(--moiz-green)]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 lg:gap-24 items-center relative z-10 min-h-[500px]">
        {/* Left: Dynamic Content with AnimatePresence */}
        <div className="lg:col-span-5 flex flex-col justify-center h-full relative order-2 lg:order-1 pt-10 lg:pt-0">
          <span className="text-[var(--moiz-green)] font-extrabold tracking-[0.2em] text-xs uppercase mb-6 block border border-[var(--moiz-green)]/30 w-max px-3 py-1 rounded-full">
            Explora la Colección
          </span>

          <div className="relative h-[250px] sm:h-[220px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 flex flex-col justify-start"
              >
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter mb-4 leading-none">
                  {activeProduct.name.replace("Arena ", "")}
                  <span className="text-[var(--moiz-green)]">KG</span>
                </h2>
                <p className="text-lg text-zinc-400 mb-8 max-w-md leading-relaxed">
                  {activeProduct.desc}
                </p>
                <div className="flex items-center gap-6 mt-auto pb-4">
                  <span className="text-3xl font-extrabold text-white">
                    ${activeProduct.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                  </span>
                  <div className="flex items-center gap-2">
                    <AnimatePresence>
                      {activeQuantity > 0 && (
                        <>
                          <motion.button
                            initial={{ scale: 0, opacity: 0, x: 20 }}
                            animate={{ scale: 1, opacity: 1, x: 0 }}
                            exit={{ scale: 0, opacity: 0, x: 20 }}
                            onClick={() =>
                              updateQuantity(activeProduct.name, -1)
                            }
                            className="flex items-center justify-center w-10 h-10 bg-white/75 text-[#0A0E0A] rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus size={18} strokeWidth={3} />
                          </motion.button>

                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="flex items-center justify-center min-w-[2.5rem] h-10 px-3 rounded-full bg-white text-[#0A0E0A] font-black text-base shadow-xl"
                          >
                            {activeQuantity}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                    <button
                      onClick={() => addToCart(activeProduct)}
                      className="flex items-center justify-center w-10 h-10 bg-[var(--moiz-green)] text-[#0A0E0A] rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95"
                      aria-label="Agregar al carrito"
                    >
                      <Plus size={18} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-8 lg:mt-16 border-t border-white/10 pt-8">
            <button
              onClick={scrollPrev}
              aria-label="Producto Anterior"
              className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#0A0E0A] transition-colors duration-300"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Siguiente Producto"
              className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#0A0E0A] transition-colors duration-300"
            >
              <ChevronRight size={24} />
            </button>

            <div className="ml-4 flex gap-2">
              {products.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Ir al producto ${i + 1}`}
                  onClick={() => scrollTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${selected === i ? "w-12 bg-[var(--moiz-green)]" : "w-3 bg-white/20 hover:bg-white/40"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Cover-flow style Carousel */}
        <div className="lg:col-span-7 h-[400px] sm:h-[500px] md:h-[600px] w-full relative order-1 lg:order-2">
          <div
            className="overflow-hidden w-[100vw] lg:w-full ml-[-20px] lg:ml-0 px-[20px] lg:px-0 h-full"
            ref={emblaRef}
          >
            <div className="flex h-full items-center">
              {products.map((p, i) => {
                const isActive = selected === i;

                return (
                  <div
                    key={i}
                    className="flex-[0_0_100%] min-w-0 h-full flex items-center justify-center transition-all duration-700"
                  >
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isActive ? 1.15 : 0.85,
                        opacity: isActive ? 1 : 0,
                        y: isActive ? 0 : 20,
                      }}
                      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                      className="relative w-full h-[80%] flex items-center justify-center select-none"
                    >
                      {/* Massive bg text decoration behind product */}
                      {isActive && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] sm:text-[18rem] lg:text-[22rem] font-black text-white/[0.02] z-0 pointer-events-none select-none tracking-tighter">
                          {p.name.replace("Arena", "").trim()}
                        </div>
                      )}

                      <Image
                        src={p.image}
                        alt={`Empaque de ${p.name} de arena Möiz`}
                        width={400}
                        height={600}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                      />
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

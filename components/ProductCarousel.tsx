"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";

import { CatalogProduct } from "@/types/product";

import { siteConfig } from "@/config/site";

interface ProductCarouselProps {
  products: CatalogProduct[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
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

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((idx: number) => emblaApi && emblaApi.scrollTo(idx), [emblaApi]);

  const activeProduct = products[selected] || products[0];
  const { cart, addToCart, updateQuantity } = useCart();

  const activeQuantity = activeProduct
    ? cart.find((item) => item.id === activeProduct.id)?.quantity || 0
    : 0;

  if (!activeProduct) return null;

  return (
    <section
      id="producto"
      className="relative py-16 md:py-32 bg-[#0A0E0A] text-white overflow-hidden"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] bg-[var(--moiz-green)]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 lg:gap-24 items-center relative z-10 min-h-[500px]">
        {/* Left: Dynamic Content */}
        <div className="lg:col-span-5 flex flex-col justify-center h-full relative order-2 lg:order-1 pt-10 lg:pt-0">
          <div className="inline-flex items-center gap-2 text-[var(--moiz-green)] font-extrabold tracking-[0.2em] text-xs uppercase mb-6 border border-[var(--moiz-green)]/30 w-max px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--moiz-green)] animate-pulse" />
            {siteConfig.ui.featuredSelection}
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col justify-start w-full"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500">
                    {activeProduct.category}
                  </span>
                  <span className="w-1 h-px bg-zinc-700" />
                  <span className="text-[10px] font-black tracking-widest uppercase text-[var(--moiz-green)]">
                    {activeProduct.petType}
                  </span>
                </div>

                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter mb-4 leading-[0.9]">
                  {activeProduct.name}
                </h2>

                <p className="text-lg text-zinc-400 max-w-md leading-relaxed">
                  {activeProduct.description}
                </p>

                <div className="flex items-center gap-8 mt-6 pb-4">
                  <div className="flex flex-col">
                    {activeProduct.oldPrice && (
                      <span className="text-sm text-zinc-500 line-through font-bold">
                        ${activeProduct.oldPrice.toLocaleString("es-CO")}
                      </span>
                    )}
                    <span className="text-4xl font-black text-white leading-none">
                      ${activeProduct.price.toLocaleString("es-CO")}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <AnimatePresence>
                      {activeQuantity > 0 && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/10"
                        >
                          <button
                            onClick={() => updateQuantity(activeProduct.id, -1)}
                            className="flex items-center justify-center w-10 h-10 bg-white text-zinc-900 rounded-full hover:scale-105 active:scale-95 transition-all"
                          >
                            <Minus size={18} strokeWidth={3} />
                          </button>
                          <span className="font-black px-2 min-w-[1.5rem] text-center">
                            {activeQuantity}
                          </span>
                          <button
                            onClick={() => addToCart(activeProduct)}
                            className="flex items-center justify-center w-10 h-10 bg-[var(--moiz-green)] text-zinc-900 rounded-full hover:scale-105 active:scale-95 transition-all"
                          >
                            <Plus size={18} strokeWidth={3} />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {activeQuantity === 0 && (
                      <button
                        onClick={() => addToCart(activeProduct)}
                        className="group flex items-center justify-center gap-3 px-8 py-4 bg-[var(--moiz-green)] text-zinc-950 rounded-full font-black text-sm uppercase tracking-widest shadow-xl shadow-[var(--moiz-green)]/20 hover:scale-105 active:scale-95 transition-all"
                      >
                        <ShoppingBag size={20} />
                        {siteConfig.ui.addToCart}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-8 lg:mt-10 border-t border-white/10 pt-8 mt-auto">
            <button
              onClick={scrollPrev}
              className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#0A0E0A] transition-colors duration-300"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={scrollNext}
              className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#0A0E0A] transition-colors duration-300"
            >
              <ChevronRight size={24} />
            </button>

            <div className="ml-4 flex gap-2">
              {products.map((_, i) => (
                <button
                  key={i}
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
                        scale: isActive ? 1.15 : 0.8,
                        opacity: isActive ? 1 : 0.3,
                        filter: isActive ? "blur(0px)" : "blur(4px)",
                      }}
                      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                      className="relative w-full h-[80%] flex items-center justify-center select-none"
                    >
                      {/* Massive bg text decoration */}
                      {isActive && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] sm:text-[14rem] lg:text-[18rem] font-black text-white/[0.03] z-0 pointer-events-none select-none tracking-tighter uppercase text-center w-full">
                          {p.category}
                        </div>
                      )}

                      <Image
                        src={p.image}
                        alt={p.name}
                        width={500}
                        height={700}
                        priority={isActive}
                        className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_45px_100px_rgba(0,0,0,0.8)]"
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

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Bone, Bath, Activity, Star, Tag, Package, ArrowRight } from "lucide-react";
import { ElementType } from "react";

// Visual mapping based on typical pet store category names extending dynamic DB categories
const styleMap: Record<
  string,
  {
    subtitle: string;
    icon: ElementType;
    color: string;
    iconColor: string;
    hoverColor: string;
  }
> = {
  alimento: {
    subtitle: "Nutrición premium",
    icon: Bone,
    color: "bg-orange-50",
    iconColor: "text-orange-500",
    hoverColor: "group-hover:bg-orange-500",
  },
  alimentos: {
    subtitle: "Nutrición premium",
    icon: Bone,
    color: "bg-orange-50",
    iconColor: "text-orange-500",
    hoverColor: "group-hover:bg-orange-500",
  },
  snacks: {
    subtitle: "Premios deliciosos",
    icon: Bone,
    color: "bg-yellow-50",
    iconColor: "text-yellow-500",
    hoverColor: "group-hover:bg-yellow-500",
  },
  higiene: {
    subtitle: "Limpieza y cuidado",
    icon: Bath,
    color: "bg-blue-50",
    iconColor: "text-blue-500",
    hoverColor: "group-hover:bg-blue-500",
  },
  juguetes: {
    subtitle: "Diversión garantizada",
    icon: Activity,
    color: "bg-purple-50",
    iconColor: "text-purple-500",
    hoverColor: "group-hover:bg-purple-500",
  },
  accesorios: {
    subtitle: "Estilo y confort",
    icon: Star,
    color: "bg-pink-50",
    iconColor: "text-pink-500",
    hoverColor: "group-hover:bg-pink-500",
  },
  ropa: {
    subtitle: "A la moda",
    icon: Tag,
    color: "bg-rose-50",
    iconColor: "text-rose-500",
    hoverColor: "group-hover:bg-rose-500",
  },
};

// Fallback style for unmapped categories
const fallbackStyle = {
  subtitle: "Lo mejor para tu mascota",
  icon: Package,
  color: "bg-zinc-50",
  iconColor: "text-zinc-500",
  hoverColor: "group-hover:bg-[var(--moiz-green)]",
};

interface CategoryProps {
  id: string;
  name: string;
}

export default function CategoriesSection({ dbCategories }: { dbCategories?: CategoryProps[] }) {
  // If we receive data from DB, we use it. Otherwise, return null or fallback
  if (!dbCategories || dbCategories.length === 0) return null;

  return (
    <section className="py-24 bg-[#F9F9F8] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent opacity-50" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
        <div className="text-left mb-16 md:flex items-end justify-between">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 mb-4"
            >
              Explora por <span className="text-[var(--moiz-green)]">Categorías</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-zinc-500 font-medium leading-relaxed"
            >
              El universo de tus mascotas reunido en cajas de sorpresas. Encuentra rápidamente lo
              indispensable.
            </motion.p>
          </div>
          <Link
            href="/productos"
            className="hidden md:flex items-center justify-center w-14 h-14 bg-white border border-zinc-200 text-[var(--moiz-green)] rounded-full hover:border-[var(--moiz-green)] hover:shadow-xl transition-all duration-300 group"
            aria-label="Ver catálogo completo"
          >
            <ArrowRight
              size={24}
              className="transition-transform duration-300 group-hover:-rotate-45"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] grid-flow-dense gap-4 md:gap-6">
          {dbCategories.map((dbCat, index) => {
            const mappedStyle = styleMap[dbCat.name.toLowerCase()] || fallbackStyle;
            const Icon = mappedStyle.icon;

            const total = dbCategories.length;
            const isLast = index === total - 1;

            // Default styling
            let bentoClasses = "md:col-span-1 md:row-span-1";
            let iconWrapperSize = "w-20 h-20 mb-6";
            let titleSize = "text-xl";
            const layoutClasses = "flex-col items-center justify-center text-center";

            // Bento Core Layout Engine
            if (index === 0) {
              bentoClasses = "md:col-span-2 md:row-span-2"; // 1st is always huge
              iconWrapperSize = "w-32 h-32 mb-8";
              titleSize = "text-3xl md:text-4xl";
            } else if (index === 1) {
              bentoClasses = "md:col-span-2 md:row-span-1"; // 2nd is always horizontal but perfectly centered internally
              iconWrapperSize = "w-20 h-20 mb-4";
              titleSize = "text-2xl";
            } else if (index === 2 || index === 3) {
              bentoClasses = "md:col-span-1 md:row-span-1"; // 3rd and 4th are regular squares
            } else {
              // Beyond 4: Create wide cards, but still perfectly centered
              bentoClasses = "md:col-span-2 md:row-span-1";
              iconWrapperSize = "w-20 h-20 mb-4";
              titleSize = "text-2xl";
            }

            // Fix empty holes for odd-item counts by dynamically stretching the last item
            if (total === 5 && isLast) {
              // If there are exactly 5, the last one should span all 4 columns instead of just 2
              bentoClasses = "md:col-span-4 md:row-span-1";
              iconWrapperSize = "w-20 h-20 mb-4";
            } else if (total > 5 && isLast) {
              const remainingSpace = (total - 4) % 2;
              if (remainingSpace !== 0) {
                bentoClasses = "md:col-span-4 md:row-span-1";
                iconWrapperSize = "w-20 h-20 mb-4";
              }
            } else if (total === 3 && isLast) {
              bentoClasses = "md:col-span-4 md:row-span-1";
              iconWrapperSize = "w-20 h-20 mb-4";
            }

            return (
              <Link
                href={`/productos?categoria=${encodeURIComponent(dbCat.name)}`}
                key={dbCat.id}
                className={`block ${bentoClasses} w-full h-full`}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.1, 0.4),
                  }}
                  className={`group cursor-pointer bg-white border border-transparent shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] rounded-[2.5rem] p-8 hover:border-[var(--moiz-green)]/30 transition-all duration-300 flex ${layoutClasses} relative overflow-hidden h-full drop-shadow-sm`}
                >
                  {/* Background decoration shape */}
                  <div
                    className={`absolute -right-8 -bottom-8 w-40 h-40 rounded-full transition-transform duration-700 opacity-20 scale-50 group-hover:scale-150 ${mappedStyle.color}`}
                  />

                  <div
                    className={`${iconWrapperSize} rounded-full flex items-center justify-center transition-colors duration-500 relative z-10 ${mappedStyle.color} ${mappedStyle.hoverColor}`}
                  >
                    <Icon
                      size={index === 0 ? 48 : 32}
                      strokeWidth={2.5}
                      className={`transition-colors duration-500 ${mappedStyle.iconColor} group-hover:text-white`}
                    />
                  </div>

                  <div
                    className={`relative z-10 ${bentoClasses.includes("md:row-span-1") && !bentoClasses.includes("col-span-1") && !bentoClasses.includes("text-center") ? "mt-4 md:mt-0 flex-1" : ""}`}
                  >
                    <h3
                      className={`${titleSize} font-bold text-zinc-900 mb-2 group-hover:text-[var(--moiz-green)] transition-colors`}
                    >
                      {dbCat.name}
                    </h3>
                    <p
                      className={`${index === 0 ? "text-base md:text-lg" : "text-sm"} font-medium text-zinc-500/80`}
                    >
                      {mappedStyle.subtitle}
                    </p>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

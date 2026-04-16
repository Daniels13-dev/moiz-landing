"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, ChevronRight } from "lucide-react";
import { CatalogProduct } from "@/types/product";
import { createProductSlug } from "@/utils/slug";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/config/site";

interface RelatedProductsSectionProps {
  relatedProducts: CatalogProduct[];
  category: string;
}

export default function RelatedProductsSection({
  relatedProducts,
  category,
}: RelatedProductsSectionProps) {
  const { addToCart } = useCart();

  if (relatedProducts.length === 0) return null;

  return (
    <div className="border-t border-zinc-200 pt-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tighter mb-2">
            {siteConfig.ui.related.title} <span className="text-[var(--moiz-green)]">{siteConfig.ui.related.titleAccent}</span>
          </h2>
          <p className="text-zinc-500 font-medium text-lg">
            {siteConfig.ui.related.subtitle}
          </p>
        </div>
        <Link
          href={`/productos?categoria=${encodeURIComponent(category)}`}
          className="hidden md:flex items-center gap-2 font-bold text-[var(--moiz-green)] hover:underline"
        >
          {siteConfig.ui.order.viewMore} {category} <ChevronRight size={18} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((rel, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            key={rel.id}
            className="group relative bg-white border border-zinc-100 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-zinc-200/50 hover:border-zinc-200 transition-all cursor-pointer flex flex-col h-full"
          >
            <Link
              href={`/productos/${createProductSlug(rel.name)}`}
              className="absolute inset-0 z-10"
            />

            <div className="relative aspect-square bg-zinc-50 rounded-2xl mb-6 p-4 flex items-center justify-center overflow-hidden">
              <Image
                src={rel.image}
                alt={rel.name}
                fill
                className="object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-zinc-900 group-hover:text-[var(--moiz-green)] mb-1 transition-colors">
                  {rel.name}
                </h4>
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-4">
                  {rel.category}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-black text-lg text-zinc-900">
                  ${rel.price.toLocaleString("es-CO")}
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart(rel);
                  }}
                  className="relative z-20 w-10 h-10 bg-zinc-100 hover:bg-[var(--moiz-green)] text-zinc-900 hover:text-white rounded-full flex items-center justify-center transition-colors pointer-events-auto"
                >
                  <Plus size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

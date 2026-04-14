"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

interface BlogProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    rating: number;
  };
}

export default function BlogProductCard({ product }: BlogProductCardProps) {
  const slug = product.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return (
    <div className="my-12 p-1 bg-gradient-to-br from-[var(--moiz-green)]/20 to-zinc-100 rounded-[2.5rem]">
      <div className="bg-white rounded-[2.4rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <div className="relative w-40 h-40 md:w-56 md:h-56 shrink-0 bg-zinc-50 rounded-3xl overflow-hidden p-4">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain drop-shadow-md"
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex text-yellow-400">
              <Star size={14} fill="currentColor" />
            </div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Recomendación de Expertos
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-black text-zinc-900 mb-3 tracking-tight">
            {product.name}
          </h3>

          <p className="text-zinc-500 font-medium text-sm md:text-base leading-relaxed mb-6 line-clamp-2">
            {product.description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-zinc-100 mt-auto">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">
                Precio Online
              </span>
              <span className="text-2xl md:text-3xl font-black text-zinc-900">
                ${product.price.toLocaleString("es-CO")}
              </span>
            </div>

            <Link
              href={`/productos/${slug}`}
              className="px-8 py-4 bg-zinc-900 text-white rounded-full font-bold flex items-center gap-2 hover:bg-[var(--moiz-green)] transition-all group scale-100 active:scale-95 shadow-lg shadow-zinc-200"
            >
              Adquirir ahora
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

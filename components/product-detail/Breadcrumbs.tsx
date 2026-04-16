"use client";

import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";

interface BreadcrumbsProps {
  category: string;
}

export default function Breadcrumbs({ category }: BreadcrumbsProps) {
  return (
    <div className="w-full bg-white border-b border-zinc-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 md:gap-4 text-xs md:text-sm font-bold text-zinc-500 overflow-x-auto whitespace-nowrap scrollbar-hide"
        >
          <Link
            href="/"
            className="hover:text-[var(--moiz-green)] transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Inicio
          </Link>
          <ChevronRight size={14} className="text-zinc-300 flex-shrink-0" />
          <Link href="/productos" className="hover:text-[var(--moiz-green)] transition-colors">
            Catálogo
          </Link>
          <ChevronRight size={14} className="text-zinc-300 flex-shrink-0" />
          <Link
            href={`/productos?categoria=${encodeURIComponent(category)}`}
            className="text-zinc-900 hover:text-[var(--moiz-green)] transition-colors"
          >
            {category}
          </Link>
        </nav>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";

interface BreadcrumbsProps {
  category: string;
  productName?: string;
}

export default function Breadcrumbs({ category, productName }: BreadcrumbsProps) {
  const categorySlug = category.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": siteConfig.url
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Catálogo",
        "item": `${siteConfig.url}/productos`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": category,
        "item": `${siteConfig.url}/productos/categoria/${categorySlug}`
      },
      ...(productName ? [{
        "@type": "ListItem",
        "position": 4,
        "name": productName
      }] : [])
    ]
  };

  return (
    <div className="w-full bg-white border-b border-zinc-100 sticky top-0 z-40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
            href={`/productos/categoria/${categorySlug}`}
            className="text-zinc-600 hover:text-[var(--moiz-green)] transition-colors"
          >
            {category}
          </Link>
          {productName && (
            <>
              <ChevronRight size={14} className="text-zinc-300 flex-shrink-0" />
              <span className="text-zinc-900 truncate max-w-[200px]">{productName}</span>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}

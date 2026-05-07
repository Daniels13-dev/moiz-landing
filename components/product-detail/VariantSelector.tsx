"use client";

import Image from "next/image";
import { ProductVariant } from "@/types/product";

interface VariantSelectorProps {
  filteredVariants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  setSelectedVariant: (variant: ProductVariant) => void;
  hasSizes: boolean;
}

export default function VariantSelector({
  filteredVariants,
  selectedVariant,
  setSelectedVariant,
  hasSizes,
}: VariantSelectorProps) {
  if (filteredVariants.length === 0) return null;

  return (
    <div className="mb-10">
      <label className="text-xs font-black uppercase tracking-widest text-zinc-400 block mb-4">
        {hasSizes ? "Estampado" : "Color"}:{" "}
        <span className="text-zinc-900">{selectedVariant?.name}</span>
      </label>
      <div className="flex flex-wrap gap-4">
        {filteredVariants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const outOfStock = variant.stock <= 0;
          return (
            <button
              key={variant.id}
              onClick={() => setSelectedVariant(variant)}
              disabled={outOfStock}
              title={variant.name}
              className={`group relative flex flex-col items-center gap-2 transition-all p-2 rounded-2xl border-2 ${
                isSelected
                  ? "border-[var(--moiz-green)] bg-[var(--moiz-green)]/5"
                  : "border-transparent hover:bg-zinc-100"
              } ${outOfStock ? "opacity-40 cursor-not-allowed grayscale" : "cursor-pointer"}`}
            >
              <div className="relative">
                {variant.image ? (
                  <div
                    className={`w-12 h-12 rounded-full border-2 overflow-hidden transition-transform ${
                      isSelected
                        ? "border-[var(--moiz-green)] scale-110 shadow-md shadow-[var(--moiz-green)]/20"
                        : "border-zinc-200 group-hover:border-zinc-400"
                    }`}
                  >
                    <Image
                      src={variant.image}
                      alt={variant.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={`w-12 h-12 rounded-full border-2 transition-transform ${
                      isSelected
                        ? "border-[var(--moiz-green)] scale-110"
                        : "border-white shadow group-hover:border-zinc-300"
                    }`}
                    style={{ backgroundColor: variant.color || "#eee" }}
                  />
                )}
                {outOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-red-500 rotate-45 transform" />
                  </div>
                )}
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-tighter max-w-[4rem] text-center leading-tight ${
                  isSelected ? "text-zinc-900" : "text-zinc-400"
                }`}
              >
                {variant.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { ProductVariant } from "@/types/product";

interface SizeSelectorProps {
  sortedSizes: string[];
  selectedSize: string | null;
  setSelectedSize: (size: string) => void;
  variants: ProductVariant[];
  onSizeChange: (size: string) => void;
}

export default function SizeSelector({
  sortedSizes,
  selectedSize,
  setSelectedSize,
  variants,
  onSizeChange,
}: SizeSelectorProps) {
  if (sortedSizes.length === 0) return null;

  return (
    <div className="mb-6">
      <label className="text-xs font-black uppercase tracking-widest text-zinc-400 block mb-3">
        Talla: <span className="text-zinc-900">{selectedSize}</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {sortedSizes.map((size) => {
          const sizeVariants = variants.filter((v) => v.size === size);
          const hasStock = sizeVariants.some((v) => v.stock > 0);
          return (
            <button
              key={size}
              onClick={() => {
                setSelectedSize(size);
                onSizeChange(size);
              }}
              disabled={!hasStock}
              className={`px-5 py-2.5 rounded-xl font-black text-sm uppercase tracking-wider border-2 transition-all ${
                selectedSize === size
                  ? "border-zinc-900 bg-zinc-900 text-white shadow-lg"
                  : hasStock
                    ? "border-zinc-200 text-zinc-700 hover:border-zinc-400"
                    : "border-zinc-100 text-zinc-300 cursor-not-allowed line-through"
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}

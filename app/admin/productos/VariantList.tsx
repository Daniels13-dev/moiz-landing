"use client";

import Image from "next/image";
import { Palette, Box, Edit2, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/format";

interface Variant {
  id: string;
  name: string;
  color?: string | null;
  image?: string | null;
  size?: string | null;
  stock: number;
  price?: number | null;
}

interface VariantListProps {
  variants: Variant[];
  onEdit: (variant: Variant) => void;
  onDelete: (id: string, name: string) => void;
  loading: boolean;
}

export default function VariantList({ variants, onEdit, onDelete, loading }: VariantListProps) {
  return (
    <div className="space-y-3 mt-4">
      {variants.length === 0 ? (
        <div className="text-center py-10 bg-zinc-50 border border-dashed border-zinc-200 rounded-3xl">
          <Palette size={32} className="mx-auto text-zinc-200 mb-2" />
          <p className="text-zinc-400 font-bold text-sm">Este producto no tiene variantes aún.</p>
        </div>
      ) : (
        variants.map((v) => (
          <div
            key={v.id}
            className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-2xl group hover:border-[var(--moiz-green)]/20 transition-all"
          >
            <div className="flex items-center gap-4">
              {v.image ? (
                <div className="w-10 h-10 rounded-full border border-zinc-100 shadow-sm shrink-0 overflow-hidden">
                  <Image
                    src={v.image}
                    alt={v.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover shadow-inner"
                  />
                </div>
              ) : (
                <div
                  className="w-10 h-10 rounded-full border border-zinc-100 shadow-sm shrink-0"
                  style={{ backgroundColor: v.color || "#eee" }}
                />
              )}
              <div>
                <h4 className="font-black text-zinc-900 leading-tight flex items-center gap-2">
                  {v.name}
                  {v.size && (
                    <span className="text-[10px] font-black uppercase tracking-widest bg-zinc-900 text-white px-2 py-0.5 rounded-full">
                      {v.size}
                    </span>
                  )}
                </h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
                    <Box size={12} /> {v.stock} disp.
                  </span>
                  {v.price && (
                    <span className="text-[10px] font-black text-[var(--moiz-green)] uppercase tracking-tighter">
                      {formatCurrency(v.price)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
              <button
                type="button"
                onClick={() => onEdit(v)}
                disabled={loading}
                className="p-2 text-zinc-300 hover:text-[var(--moiz-green)] hover:bg-[var(--moiz-green)]/10 rounded-lg transition-all"
              >
                <Edit2 size={16} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(v.id, v.name)}
                disabled={loading}
                className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

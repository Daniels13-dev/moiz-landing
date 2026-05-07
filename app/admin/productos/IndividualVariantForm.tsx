"use client";

import { Loader2, Save, Plus } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

interface Variant {
  id: string;
  name: string;
  color?: string | null;
  image?: string | null;
  size?: string | null;
  stock: number;
  price?: number | null;
}

interface IndividualVariantFormProps {
  editingVariant: Variant | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  sizingSystem: "tamaños" | "tallas";
  currentSizes: string[];
}

export default function IndividualVariantForm({
  editingVariant,
  onSubmit,
  loading,
  sizingSystem,
  currentSizes,
}: IndividualVariantFormProps) {
  return (
    <form
      id="variant-form"
      onSubmit={onSubmit}
      className="bg-white p-8 rounded-[2.5rem] border-2 border-[var(--moiz-green)]/20 mb-6 shadow-xl shadow-zinc-200/50"
    >
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">
            Nombre del Estampado / Color
          </label>
          <input
            name="name"
            placeholder="Ej: Mariposas, Azul Marino"
            required
            defaultValue={editingVariant?.name || ""}
            className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[var(--moiz-green)]/20 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">
            Talla / Tamaño ({sizingSystem === "tamaños" ? "P, M, G" : "XS-XXL"})
          </label>
          <div className="flex flex-wrap gap-2 pt-1">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="size"
                value=""
                defaultChecked={!editingVariant?.size}
                className="sr-only peer"
              />
              <span className="px-3 py-1.5 rounded-lg border-2 border-zinc-200 text-xs font-black uppercase tracking-wider text-zinc-500 peer-checked:border-zinc-900 peer-checked:bg-zinc-900 peer-checked:text-white transition-all cursor-pointer block">
                N/A
              </span>
            </label>
            {currentSizes.map((s) => (
              <label key={s} className="cursor-pointer">
                <input
                  type="radio"
                  name="size"
                  value={s}
                  defaultChecked={editingVariant?.size === s}
                  className="sr-only peer"
                />
                <span className="px-3 py-1.5 rounded-lg border-2 border-zinc-200 text-xs font-black uppercase tracking-wider text-zinc-500 peer-checked:border-zinc-900 peer-checked:bg-zinc-900 peer-checked:text-white transition-all cursor-pointer block">
                  {s}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">
            Imagen del Estampado
          </label>
          <ImageUpload name="image" defaultValue={editingVariant?.image || ""} />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">
            Stock
          </label>
          <input
            name="stock"
            type="number"
            required
            defaultValue={editingVariant?.stock ?? 10}
            className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[var(--moiz-green)]/20 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">
            Precio (Opcional)
          </label>
          <input
            name="price"
            type="number"
            step="any"
            placeholder="Dejar vacío para precio base"
            defaultValue={editingVariant?.price || ""}
            className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[var(--moiz-green)]/20 outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[var(--moiz-green)] text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : editingVariant ? (
          <Save size={16} />
        ) : (
          <Plus size={16} />
        )}
        {editingVariant ? "Guardar Cambios" : "Guardar Variante"}
      </button>
    </form>
  );
}

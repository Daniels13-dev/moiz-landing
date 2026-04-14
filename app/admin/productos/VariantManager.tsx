"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Palette, Box, Save } from "lucide-react";
import { createVariant, deleteVariant, updateVariant } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Edit2 } from "lucide-react";

interface Variant {
  id: string;
  name: string;
  color?: string | null;
  image?: string | null;
  stock: number;
  price?: number | null;
}

interface VariantManagerProps {
  productId: string;
  variants: Variant[];
}

export default function VariantManager({
  productId,
  variants: initialVariants,
}: VariantManagerProps) {
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (showAddForm || editingVariant) {
      document
        .getElementById("variant-form")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showAddForm, editingVariant]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    const formData = new FormData(form);

    const res = editingVariant
      ? await updateVariant(editingVariant.id, productId, formData)
      : await createVariant(productId, formData);

    if (res.success) {
      toast.success(editingVariant ? "Variante actualizada" : "Variante añadida");
      if (!editingVariant) form.reset();
      else setEditingVariant(null);

      router.refresh();
    } else {
      toast.error(res.error || "Error al procesar variante");
    }
    setLoading(false);
  };

  const handleDeleteVariant = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar variante "${name}"?`)) return;
    setLoading(true);
    const res = await deleteVariant(id, productId);
    if (res.success) {
      toast.success("Variante eliminada");
      router.refresh();
    } else {
      toast.error(res.error || "Error al eliminar");
    }
    setLoading(false);
  };

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between mb-8 bg-zinc-50/50 p-6 rounded-[2rem] border border-zinc-100">
        <div>
          <h3 className="text-xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            <Palette className="text-[var(--moiz-green)]" size={20} />
            {editingVariant ? "Editando Variante" : "Variantes de Color"}
          </h3>
          <p className="text-sm text-zinc-500 font-medium">
            {editingVariant
              ? `Modificando "${editingVariant.name}"`
              : "Gestiona disponibilidad por color."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (editingVariant) {
              setEditingVariant(null);
            } else {
              setShowAddForm(!showAddForm);
            }
          }}
          className="flex items-center gap-2 px-6 py-2 bg-zinc-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
        >
          {showAddForm || editingVariant ? (
            <>Cerrar</>
          ) : (
            <>
              <Plus size={14} strokeWidth={3} />
              Añadir Color
            </>
          )}
        </button>
      </div>

      {(showAddForm || editingVariant) && (
        <form
          id="variant-form"
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-[2.5rem] border-2 border-[var(--moiz-green)]/20 mb-10 shadow-xl shadow-zinc-200/50"
        >
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">
                Nombre del Color
              </label>
              <input
                name="name"
                placeholder="Ej: Azul Marino"
                required
                defaultValue={editingVariant?.name || ""}
                className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[var(--moiz-green)]/20 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">
                Color (Hex)
              </label>
              <div className="flex gap-2">
                <input
                  name="color"
                  type="color"
                  defaultValue={editingVariant?.color || "#6A8E2A"}
                  className="w-12 h-11 p-1 bg-white border border-zinc-200 rounded-xl cursor-pointer"
                />
                <input
                  name="color"
                  placeholder="#6A8E2A"
                  defaultValue={editingVariant?.color || ""}
                  className="flex-1 p-3 bg-white border border-zinc-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[var(--moiz-green)]/20 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">
                URL Imagen
              </label>
              <input
                name="image"
                placeholder="/products/color-1.png"
                required
                defaultValue={editingVariant?.image || ""}
                className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[var(--moiz-green)]/20 outline-none"
              />
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
                placeholder="Dejar vacío para base"
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
      )}

      <div className="space-y-3">
        {initialVariants.length === 0 ? (
          <div className="text-center py-10 bg-zinc-50 border border-dashed border-zinc-200 rounded-3xl">
            <Palette size={32} className="mx-auto text-zinc-200 mb-2" />
            <p className="text-zinc-400 font-bold text-sm">Este producto no tiene variantes aún.</p>
          </div>
        ) : (
          initialVariants.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-2xl group hover:border-[var(--moiz-green)]/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full border border-zinc-100 shadow-sm shrink-0"
                  style={{ backgroundColor: v.color || "#eee" }}
                />
                <div>
                  <h4 className="font-black text-zinc-900 leading-tight">{v.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
                      <Box size={12} /> {v.stock} disp.
                    </span>
                    {v.price && (
                      <span className="text-[10px] font-black text-[var(--moiz-green)] uppercase tracking-tighter">
                        ${v.price.toLocaleString("es-CO")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  type="button"
                  onClick={() => {
                    setEditingVariant(v);
                    setShowAddForm(false);
                    setTimeout(() => {
                      document
                        .getElementById("variant-form")
                        ?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }, 100);
                  }}
                  disabled={loading}
                  className="p-2 text-zinc-300 hover:text-[var(--moiz-green)] hover:bg-[var(--moiz-green)]/10 rounded-lg transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteVariant(v.id, v.name)}
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
    </div>
  );
}

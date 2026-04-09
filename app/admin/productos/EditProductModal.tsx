"use client";

import { useState } from "react";
import { X, Save, Loader2, ChevronDown } from "lucide-react";
import { updateProduct } from "../actions";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

interface EditProductModalProps {
  product: {
    id: string;
    name: string;
    description?: string;
    price: number;
    oldPrice?: number | null;
    categoryId?: string;
    petType?: string;
    image?: string;
    isFeatured?: boolean;
    isNew?: boolean;
  };
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProductModal({
  product,
  categories,
  isOpen,
  onClose,
}: EditProductModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateProduct(product.id, formData);

    if (res.success) {
      toast.success("Producto actualizado correctamente");
      onClose();
    } else {
      toast.error(res.error || "Error al actualizar");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl border border-zinc-100 p-10 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-black text-zinc-900 mb-2 tracking-tighter">
          Editar Producto
        </h2>
        <p className="text-zinc-500 font-medium mb-8">
          Modifica los detalles del producto.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 pl-4">
                  Nombre
                </label>
                <input
                  name="name"
                  defaultValue={product.name}
                  required
                  className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--moiz-green)]/20 focus:border-[var(--moiz-green)] transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 pl-4">
                  Descripción
                </label>
                <textarea
                  name="description"
                  defaultValue={product.description}
                  rows={3}
                  required
                  className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--moiz-green)]/20 focus:border-[var(--moiz-green)] transition-all font-bold resize-none"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 pl-4">
                    Precio
                  </label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={product.price}
                    required
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--moiz-green)]/20 focus:border-[var(--moiz-green)] transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 pl-4">
                    P. Anterior
                  </label>
                  <input
                    name="oldPrice"
                    type="number"
                    step="0.01"
                    defaultValue={product.oldPrice || ""}
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--moiz-green)]/20 focus:border-[var(--moiz-green)] transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 pl-1">
                  Categoría y Tipo
                </label>
                <div className="relative group">
                  <select
                    name="categoryId"
                    defaultValue={product.categoryId}
                    required
                    className="w-full p-4 pr-12 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--moiz-green)]/20 focus:border-[var(--moiz-green)] transition-all font-medium appearance-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-[var(--moiz-green)] pointer-events-none transition-colors"
                    size={20}
                  />
                </div>
                <div className="relative group">
                  <select
                    name="petType"
                    defaultValue={product.petType}
                    className="w-full p-4 pr-12 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--moiz-green)]/20 focus:border-[var(--moiz-green)] transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="Ambos">Mascota: Ambos</option>
                    <option value="Perro">Mascota: Perro</option>
                    <option value="Gato">Mascota: Gato</option>
                  </select>
                  <ChevronDown
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-[var(--moiz-green)] pointer-events-none transition-colors"
                    size={20}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 pl-4">
              URL Imagen
            </label>
            <input
              name="image"
              defaultValue={product.image}
              required
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--moiz-green)]/20 focus:border-[var(--moiz-green)] transition-all font-bold"
            />
          </div>

          <div className="flex gap-4">
            <label className="flex-1 flex items-center gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl cursor-pointer hover:border-[var(--moiz-green)]/30 transition-all">
              <input
                name="isFeatured"
                type="checkbox"
                defaultChecked={product.isFeatured}
                className="w-5 h-5 accent-[var(--moiz-green)]"
              />
              <span className="text-sm font-bold text-zinc-900">Destacado</span>
            </label>
            <label className="flex-1 flex items-center gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl cursor-pointer hover:border-[var(--moiz-green)]/30 transition-all">
              <input
                name="isNew"
                type="checkbox"
                defaultChecked={product.isNew}
                className="w-5 h-5 accent-[var(--moiz-green)]"
              />
              <span className="text-sm font-bold text-zinc-900">Nuevo</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-zinc-100 text-zinc-600 rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-4 bg-[var(--moiz-green)] text-white rounded-2xl font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(106,142,42,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              <span>Actualizar Producto</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

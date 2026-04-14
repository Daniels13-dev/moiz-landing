"use client";

import { useState } from "react";
import { Plus, ChevronDown, Loader2, Save } from "lucide-react";
import { createProduct } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
}

export default function ProductForm({ categories }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await createProduct(formData);

    if (res.success) {
      toast.success("Producto creado con éxito");
      router.push("/admin/productos");
      router.refresh();
    } else {
      toast.error(res.error || "Ocurrió un error al crear el producto");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-10 bg-white border border-zinc-100 rounded-[3rem] shadow-sm">
      <h2 className="text-2xl font-black text-zinc-900 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] rounded-xl flex items-center justify-center">
          <Plus size={20} />
        </div>
        Nuevo Producto
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-zinc-400 pl-1">
            Información Básica
          </label>
          <input
            name="name"
            type="text"
            placeholder="Nombre"
            required
            className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--moiz-green)]/20 focus:border-[var(--moiz-green)] transition-all font-medium"
          />
          <textarea
            name="description"
            placeholder="Descripción corta"
            required
            rows={3}
            className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--moiz-green)]/20 focus:border-[var(--moiz-green)] transition-all font-medium resize-none"
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 pl-1">
              Precio (COP)
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              placeholder="99.000"
              required
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--moiz-green)]/20 focus:border-[var(--moiz-green)] transition-all font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 pl-1">
              P. Anterior
            </label>
            <input
              name="oldPrice"
              type="number"
              step="0.01"
              placeholder="120.000"
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--moiz-green)]/20 focus:border-[var(--moiz-green)] transition-all font-medium"
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
              required
              className="w-full p-4 pr-12 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--moiz-green)]/20 focus:border-[var(--moiz-green)] transition-all font-medium appearance-none cursor-pointer"
            >
              <option value="">Selecciona Categoría</option>
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
              defaultValue="Ambos"
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

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-zinc-400 pl-1">
            URL de Imagen
          </label>
          <input
            name="image"
            type="text"
            placeholder="/products/image.png"
            defaultValue="/products/arena4kg-transparent.png"
            required
            className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--moiz-green)]/20 focus:border-[var(--moiz-green)] transition-all font-medium"
          />
        </div>

        <div className="flex gap-4">
          <label className="flex-1 flex items-center gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl cursor-pointer hover:border-[var(--moiz-green)]/30 transition-all">
            <input
              name="isFeatured"
              type="checkbox"
              className="w-5 h-5 accent-[var(--moiz-green)]"
            />
            <span className="text-sm font-bold text-zinc-900">Destacado</span>
          </label>
          <label className="flex-1 flex items-center gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl cursor-pointer hover:border-[var(--moiz-green)]/30 transition-all">
            <input name="isNew" type="checkbox" className="w-5 h-5 accent-[var(--moiz-green)]" />
            <span className="text-sm font-bold text-zinc-900">Nuevo</span>
          </label>
        </div>

        <label className="flex items-center gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl cursor-pointer hover:border-[var(--moiz-green)]/30 transition-all">
          <input
            name="allowSubscription"
            type="checkbox"
            className="w-5 h-5 accent-[var(--moiz-green)]"
          />
          <span className="text-sm font-bold text-zinc-900">
            Permitir Compra mediante Suscripción
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--moiz-green)] text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[var(--moiz-green)]/20 hover:scale-[1.02] active:scale-95 transition-all mt-4 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          <span>{loading ? "Creando..." : "Crear Producto"}</span>
        </button>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Save, Loader2, ChevronDown, LayoutDashboard, Palette } from "lucide-react";
import { updateProduct } from "../../../actions";
import { toast } from "sonner";
import VariantManager from "../../VariantManager";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ui/ImageUpload";

interface Category {
  id: string;
  name: string;
}

interface EditProductViewProps {
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
    allowSubscription?: boolean;
    variants?: {
      id: string;
      name: string;
      color?: string | null;
      image?: string | null;
      stock: number;
      price?: number | null;
    }[];
  };
  categories: Category[];
}

export default function EditProductView({ product, categories }: EditProductViewProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "variants">("general");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateProduct(product.id, formData);

    if (res.success) {
      toast.success("Producto actualizado correctamente");
      router.push("/admin/productos");
      router.refresh();
    } else {
      toast.error(res.error || "Error al actualizar");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-[600px]">
      {/* Tabs */}
      <div className="p-8 pb-0 bg-white border-b border-zinc-50">
        <div className="flex gap-2 p-1.5 bg-zinc-100/50 rounded-2xl w-fit mb-2">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "general"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            <LayoutDashboard size={14} />
            Información General
          </button>
          <button
            onClick={() => setActiveTab("variants")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "variants"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            <Palette size={14} />
            Variantes de Color
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-8 pt-4 pb-8">
        {activeTab === "general" ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            {/* Main Fields */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">
                  Nombre del Producto
                </label>
                <input
                  name="name"
                  defaultValue={product.name}
                  required
                  className="w-full p-5 bg-zinc-50 border border-zinc-200 rounded-[2rem] focus:ring-4 focus:ring-[var(--moiz-green)]/10 focus:border-[var(--moiz-green)] outline-none transition-all font-black text-xl text-zinc-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">
                  Descripción Detallada
                </label>
                <textarea
                  name="description"
                  defaultValue={product.description}
                  rows={4}
                  required
                  className="w-full p-5 bg-zinc-50 border border-zinc-200 rounded-[2rem] focus:ring-4 focus:ring-[var(--moiz-green)]/10 focus:border-[var(--moiz-green)] outline-none transition-all font-bold text-zinc-700 resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Pricing Grid */}
            <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">
                    Precio de Venta
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-black">
                      $
                    </span>
                    <input
                      name="price"
                      type="number"
                      step="any"
                      defaultValue={product.price}
                      required
                      className="w-full p-4 pl-10 bg-white/5 border border-white/10 rounded-2xl focus:border-[var(--moiz-green)] focus:ring-4 focus:ring-[var(--moiz-green)]/10 outline-none transition-all font-black text-2xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">
                    Precio Anterior
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-black">
                      $
                    </span>
                    <input
                      name="oldPrice"
                      type="number"
                      step="any"
                      defaultValue={product.oldPrice || ""}
                      className="w-full p-4 pl-10 bg-white/5 border border-white/10 rounded-2xl focus:border-white/20 outline-none transition-all font-black text-xl text-white/40"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Categorization & Options */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">
                  Categoría
                </label>
                <div className="relative group">
                  <select
                    name="categoryId"
                    defaultValue={product.categoryId}
                    required
                    className="w-full p-4 pr-12 bg-zinc-50 border border-zinc-200 rounded-2xl font-bold appearance-none cursor-pointer outline-none focus:border-[var(--moiz-green)] transition-all"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-[var(--moiz-green)] transition-colors"
                    size={20}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">
                  Tipo de Mascota
                </label>
                <div className="relative group">
                  <select
                    name="petType"
                    defaultValue={product.petType}
                    required
                    className="w-full p-4 pr-12 bg-zinc-50 border border-zinc-200 rounded-2xl font-bold appearance-none cursor-pointer outline-none focus:border-[var(--moiz-green)] transition-all"
                  >
                    <option value="Ambos">Ambos</option>
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                  </select>
                  <ChevronDown
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-[var(--moiz-green)] transition-colors"
                    size={20}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">
                Imagen Principal
              </label>
              <ImageUpload name="image" defaultValue={product.image || ""} required />
            </div>

            <div className="flex gap-4">
              <label className="flex-1 flex items-center justify-between p-5 bg-zinc-50 border border-zinc-200 rounded-[1.5rem] cursor-pointer hover:border-[var(--moiz-green)]/30 transition-all group">
                <span className="text-xs font-black uppercase tracking-widest text-zinc-500 group-hover:text-[var(--moiz-green)] transition-colors">
                  Producto Destacado
                </span>
                <input
                  name="isFeatured"
                  type="checkbox"
                  defaultChecked={product.isFeatured}
                  className="w-6 h-6 accent-[var(--moiz-green)] rounded-lg outline-none"
                />
              </label>
              <label className="flex-1 flex items-center justify-between p-5 bg-zinc-50 border border-zinc-200 rounded-[1.5rem] cursor-pointer hover:border-[var(--moiz-green)]/30 transition-all group">
                <span className="text-xs font-black uppercase tracking-widest text-zinc-500 group-hover:text-[var(--moiz-green)] transition-colors">
                  Nuevo Producto
                </span>
                <input
                  name="isNew"
                  type="checkbox"
                  defaultChecked={product.isNew}
                  className="w-6 h-6 accent-[var(--moiz-green)] rounded-lg outline-none"
                />
              </label>
            </div>

            <label className="flex items-center justify-between p-5 bg-zinc-50 border border-zinc-200 rounded-[1.5rem] cursor-pointer hover:border-[var(--moiz-green)]/30 transition-all group">
              <span className="text-xs font-black uppercase tracking-widest text-zinc-500 group-hover:text-[var(--moiz-green)] transition-colors">
                Permitir Compra mediante Suscripción
              </span>
              <input
                name="allowSubscription"
                type="checkbox"
                defaultChecked={product.allowSubscription}
                className="w-6 h-6 accent-[var(--moiz-green)] rounded-lg outline-none"
              />
            </label>

            <div className="flex gap-4 pt-10">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-5 bg-[var(--moiz-green)] text-white rounded-full font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-[var(--moiz-green)]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Actualizar Producto
              </button>
            </div>
          </form>
        ) : (
          <div className="animate-in slide-in-from-right-2 duration-300">
            <VariantManager productId={product.id} variants={product.variants || []} />
          </div>
        )}
      </div>
    </div>
  );
}

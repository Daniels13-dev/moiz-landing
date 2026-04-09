"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Edit2 } from "lucide-react";
import { deleteProduct } from "../actions";
import { toast } from "sonner";
import EditProductModal from "./EditProductModal";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  image?: string;
  name: string;
  description?: string;
  price: number;
  oldPrice?: number | null;
  isFeatured?: boolean;
  isNew?: boolean;
  category?: { name?: string } | null;
  categoryId?: string;
  petType?: string;
}

interface ProductItemProps {
  product: Product;
  categories: Category[];
}

export default function ProductItem({ product, categories }: ProductItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de eliminar "${product.name}"?`)) return;

    setIsDeleting(true);
    const res = await deleteProduct(product.id);
    if (!res.success) {
      toast.error(res.error || "No se pudo eliminar");
    } else {
      toast.success("Producto eliminado");
    }
    setIsDeleting(false);
  };

  return (
    <>
      <div className="p-4 bg-white border border-zinc-100 rounded-3xl flex items-center gap-6 group hover:border-[var(--moiz-green)]/30 transition-all shadow-sm">
        <div className="relative w-24 h-24 bg-zinc-50 rounded-2xl overflow-hidden flex items-center justify-center p-2">
          <Image
            src={product.image || "/logo/logo.png"}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-500 px-3 py-1 rounded-full">
              {product.category?.name || "Sin Categoría"}
            </span>
            {product.isFeatured && (
              <span className="bg-[var(--moiz-green)]/10 text-[10px] font-black uppercase tracking-widest text-[var(--moiz-green)] px-3 py-1 rounded-full">
                Destacado
              </span>
            )}
          </div>
          <h3 className="text-xl font-black text-zinc-900">{product.name}</h3>
          <p className="text-zinc-400 text-sm font-medium line-clamp-1">
            {product.description}
          </p>
        </div>

        <div className="text-right flex flex-col items-end gap-2 pr-4">
          <span className="text-2xl font-black text-zinc-900">
            ${product.price.toLocaleString("es-CO")}
          </span>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditOpen(true)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-all shadow-sm bg-white border border-zinc-100"
              title="Editar"
            >
              <Edit2 size={18} />
            </button>

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-300 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm bg-white border border-zinc-100"
              title="Eliminar"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <EditProductModal
        product={product}
        categories={categories}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  );
}

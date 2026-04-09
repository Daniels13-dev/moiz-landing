"use client";

import { Tag, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";
import EditCategoryModal from "./EditCategoryModal";
import { deleteCategory } from "../actions";
import { toast } from "sonner";

interface CategoryItemProps {
  category: {
    id: string;
    name: string;
    _count: { products: number };
  };
}

export default function CategoryItem({ category }: CategoryItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de eliminar "${category.name}"?`)) return;

    setIsDeleting(true);
    const res = await deleteCategory(category.id);
    if (!res.success) {
      toast.error(res.error || "No se pudo eliminar");
    } else {
      toast.success("Categoría eliminada");
    }
    setIsDeleting(false);
  };

  return (
    <>
      <div className="p-6 bg-white border border-zinc-100 rounded-3xl flex items-center justify-between group hover:border-[var(--moiz-green)]/30 transition-colors shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-[var(--moiz-green)]/10 group-hover:text-[var(--moiz-green)] transition-colors">
            <Tag size={20} />
          </div>
          <div>
            <h3 className="font-black text-zinc-900 text-lg">
              {category.name}
            </h3>
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
              {category._count.products} productos asociados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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

      <EditCategoryModal
        category={category}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  );
}

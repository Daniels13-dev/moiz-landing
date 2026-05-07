"use client";

import { Tag, Trash2, Edit2, Loader2 } from "lucide-react";
import { useState } from "react";
import EditCategoryModal from "./EditCategoryModal";
import { deleteCategory, toggleCategoryActive } from "../actions";
import { toast } from "sonner";

interface CategoryItemProps {
  category: {
    id: string;
    name: string;
    isActive: boolean;
    _count: { products: number };
  };
}

export default function CategoryItem({ category }: CategoryItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isActive, setIsActive] = useState(category.isActive);

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

  const handleToggleActive = async () => {
    setIsToggling(true);
    const newState = !isActive;
    const res = await toggleCategoryActive(category.id, newState);
    if (!res.success) {
      toast.error(res.error || "No se pudo actualizar el estado");
    } else {
      setIsActive(newState);
      toast.success(newState ? "Categoría activada" : "Categoría desactivada");
    }
    setIsToggling(false);
  };

  return (
    <>
      <div className={`p-6 bg-white border rounded-3xl flex items-center justify-between group transition-all shadow-sm ${
        isActive ? "border-zinc-100 hover:border-[var(--moiz-green)]/30" : "border-red-100 bg-red-50/20 opacity-75"
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
            isActive ? "bg-zinc-50 text-zinc-400 group-hover:bg-[var(--moiz-green)]/10 group-hover:text-[var(--moiz-green)]" : "bg-red-50 text-red-300"
          }`}>
            <Tag size={20} />
          </div>
          <div>
            <h3 className={`font-black text-lg transition-colors ${isActive ? "text-zinc-900" : "text-zinc-400"}`}>
              {category.name}
            </h3>
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
              {category._count.products} productos asociados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Active toggle */}
          <button
            onClick={handleToggleActive}
            disabled={isToggling}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm bg-white border ${
              isActive
                ? "text-green-600 hover:bg-green-50 border-green-100"
                : "text-zinc-300 hover:bg-red-50 hover:text-red-500 border-zinc-100"
            }`}
            title={isActive ? "Desactivar" : "Activar"}
          >
            {isToggling ? (
              <Loader2 size={16} className="animate-spin" />
            ) : isActive ? (
              <span className="text-sm font-black">On</span>
            ) : (
              <span className="text-sm font-black">Off</span>
            )}
          </button>

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

"use client";

import { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { updateCategory } from "../actions";
import { toast } from "sonner";

interface EditCategoryModalProps {
  category: { id: string; name: string };
  isOpen: boolean;
  onClose: () => void;
}

export default function EditCategoryModal({ category, isOpen, onClose }: EditCategoryModalProps) {
  const [name, setName] = useState(category.name);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateCategory(category.id, name);
    if (res.success) {
      toast.success("Categoría actualizada");
      onClose();
    } else {
      toast.error(res.error || "Ocurrió un error");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-zinc-100 p-10 animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-black text-zinc-900 mb-2 tracking-tighter">
          Editar Categoría
        </h2>
        <p className="text-zinc-500 font-medium mb-8">Modifica el nombre de la categoría.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 pl-4">
              Nombre de Categoría
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--moiz-green)]/20 focus:border-[var(--moiz-green)] transition-all font-bold"
            />
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
              className="flex-2 py-4 bg-[var(--moiz-green)] text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-[var(--moiz-green)]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

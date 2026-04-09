"use client";

import { useState, useRef } from "react";
import { Plus, Loader2, Save } from "lucide-react";
import { createCategory } from "../actions";
import { toast } from "sonner";

export default function CategoryForm() {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await createCategory(formData);

    if (res.success) {
      toast.success("Categoría creada con éxito");
      formRef.current?.reset();
    } else {
      toast.error(res.error || "Ocurrió un error");
    }

    setLoading(false);
  };

  return (
    <div className="md:col-span-4 h-max p-8 bg-white border border-zinc-100 rounded-[2.5rem] shadow-sm">
      <h2 className="text-xl font-black text-zinc-900 mb-6 flex items-center gap-2">
        <Plus size={18} className="text-[var(--moiz-green)]" />
        Nueva Categoría
      </h2>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <input
          name="name"
          type="text"
          placeholder="Nombre (ej. Snacks)"
          required
          className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--moiz-green)]/20 focus:border-[var(--moiz-green)] transition-all font-medium"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--moiz-green)] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-[var(--moiz-green)]/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          <span>{loading ? "Creando..." : "Crear"}</span>
        </button>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Plus, Palette, Layers, Type, Ruler } from "lucide-react";
import { createVariant, createVariantBatch, deleteVariant, updateVariant } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Sub-components
import IndividualVariantForm from "./IndividualVariantForm";
import BatchVariantForm from "./BatchVariantForm";
import VariantList from "./VariantList";

const TAMAÑOS = ["P", "M", "G"];
const TALLAS = ["XS", "S", "M", "L", "XL", "XXL"];
const ALL_SIZE_KEYS = Array.from(new Set([...TAMAÑOS, ...TALLAS]));

interface Variant {
  id: string;
  name: string;
  color?: string | null;
  image?: string | null;
  size?: string | null;
  stock: number;
  price?: number | null;
}

interface VariantManagerProps {
  productId: string;
  variants: Variant[];
}

export default function VariantManager({ productId, variants: initialVariants }: VariantManagerProps) {
  const [tab, setTab] = useState<"individual" | "batch">("individual");
  const [sizingSystem, setSizingSystem] = useState<"tamaños" | "tallas">("tamaños");
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const router = useRouter();

  // Batch tab state
  const [batchImage, setBatchImage] = useState("");
  const [batchSizes, setBatchSizes] = useState<
    Record<string, { enabled: boolean; stock: number; price: string }>
  >(Object.fromEntries(ALL_SIZE_KEYS.map((s) => [s, { enabled: false, stock: 10, price: "" }])));

  useEffect(() => {
    if (showAddForm || editingVariant) {
      document.getElementById("variant-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showAddForm, editingVariant]);

  const handleIndividualSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleBatchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const color = (formData.get("color") as string) || null;

    const activeSizes = sizingSystem === "tamaños" ? TAMAÑOS : TALLAS;

    const sizes = activeSizes
      .filter((s) => batchSizes[s].enabled)
      .map((s) => ({
        size: s,
        stock: batchSizes[s].stock,
        price: batchSizes[s].price
          ? parseFloat(batchSizes[s].price.replace(/\./g, "").replace(",", "."))
          : null,
      }));

    if (!name) {
      toast.error("Ingresa el nombre del estampado");
      return;
    }
    if (sizes.length === 0) {
      toast.error("Selecciona al menos una talla");
      return;
    }

    setLoading(true);
    const res = await createVariantBatch(productId, {
      name,
      image: batchImage || null,
      color,
      sizes,
    });

    if (res.success) {
      const count = (res as { count?: number }).count ?? sizes.length;
      toast.success(`${count} variante(s) creadas correctamente`);
      form.reset();
      setBatchImage("");
      setBatchSizes(
        Object.fromEntries(ALL_SIZE_KEYS.map((s) => [s, { enabled: false, stock: 10, price: "" }])),
      );
      router.refresh();
    } else {
      toast.error(res.error || "Error al crear variantes");
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

  const currentSizes = sizingSystem === "tamaños" ? TAMAÑOS : TALLAS;

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 bg-zinc-50/50 p-6 rounded-[2rem] border border-zinc-100 gap-4">
        <div>
          <h3 className="text-xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            <Palette className="text-[var(--moiz-green)]" size={20} />
            Variantes
          </h3>
          <p className="text-sm text-zinc-500 font-medium tracking-tight">Gestiona colores, estampados y tallas.</p>
        </div>

        <div className="flex bg-zinc-100 p-1 rounded-2xl gap-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              setTab("individual");
              setShowAddForm(false);
              setEditingVariant(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              tab === "individual" ? "bg-white text-zinc-900 shadow" : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            <Plus size={12} strokeWidth={3} />
            Individual
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("batch");
              setShowAddForm(false);
              setEditingVariant(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              tab === "batch" ? "bg-white text-zinc-900 shadow" : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            <Layers size={12} />
            Por Tallas
          </button>
        </div>
      </div>

      {(showAddForm || editingVariant || tab === "batch") && (
        <div className="flex justify-center mb-4">
          <div className="flex bg-white border border-zinc-100 p-1 rounded-2xl shadow-sm gap-1">
            <button
              type="button"
              onClick={() => setSizingSystem("tamaños")}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                sizingSystem === "tamaños" ? "bg-zinc-900 text-white shadow-lg" : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              <Type size={12} />
              Tamaños (P, M, G)
            </button>
            <button
              type="button"
              onClick={() => setSizingSystem("tallas")}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                sizingSystem === "tallas" ? "bg-zinc-900 text-white shadow-lg" : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              <Ruler size={12} />
              Tallas (S, M, L...)
            </button>
          </div>
        </div>
      )}

      {tab === "individual" && (
        <>
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => {
                if (editingVariant) setEditingVariant(null);
                else setShowAddForm(!showAddForm);
              }}
              className="flex items-center gap-2 px-6 py-2 bg-zinc-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
            >
              {showAddForm || editingVariant ? "Cerrar" : <><Plus size={14} strokeWidth={3} /> Añadir</>}
            </button>
          </div>

          {(showAddForm || editingVariant) && (
            <IndividualVariantForm
              editingVariant={editingVariant}
              onSubmit={handleIndividualSubmit}
              loading={loading}
              sizingSystem={sizingSystem}
              currentSizes={currentSizes}
            />
          )}
        </>
      )}

      {tab === "batch" && (
        <BatchVariantForm
          onSubmit={handleBatchSubmit}
          loading={loading}
          sizingSystem={sizingSystem}
          currentSizes={currentSizes}
          batchImage={batchImage}
          setBatchImage={setBatchImage}
          batchSizes={batchSizes}
          setBatchSizes={setBatchSizes}
        />
      )}

      <VariantList
        variants={initialVariants}
        onEdit={(v) => {
          const isDescSystem = v.size && TAMAÑOS.includes(v.size) && !TALLAS.includes(v.size);
          setSizingSystem(isDescSystem ? "tamaños" : "tallas");
          setEditingVariant(v);
          setTab("individual");
          setShowAddForm(false);
        }}
        onDelete={handleDeleteVariant}
        loading={loading}
      />
    </div>
  );
}

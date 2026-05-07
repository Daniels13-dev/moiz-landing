"use client";

import { Loader2, Layers } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

interface BatchVariantFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  sizingSystem: "tamaños" | "tallas";
  currentSizes: string[];
  batchImage: string;
  setBatchImage: (url: string) => void;
  batchSizes: Record<string, { enabled: boolean; stock: number; price: string }>;
  setBatchSizes: React.Dispatch<
    React.SetStateAction<Record<string, { enabled: boolean; stock: number; price: string }>>
  >;
}

export default function BatchVariantForm({
  onSubmit,
  loading,
  sizingSystem,
  currentSizes,
  batchImage,
  setBatchImage,
  batchSizes,
  setBatchSizes,
}: BatchVariantFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-8 rounded-[2.5rem] border-2 border-[var(--moiz-green)]/20 mb-6 shadow-xl shadow-zinc-200/50"
    >
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">
              Nombre del Estampado / Color
            </label>
            <input
              name="name"
              placeholder="Ej: Mariposas"
              required
              className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[var(--moiz-green)]/20 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">
              Imagen del Estampado
            </label>
            <ImageUpload
              name="_batchImageDisplay"
              defaultValue={batchImage}
              onUrlChange={(url) => setBatchImage(url)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2 block mb-3">
            Selecciona {sizingSystem === "tamaños" ? "Tamaños" : "Tallas"}, Stock y Precio
          </label>
          <div className="space-y-3">
            {currentSizes.map((size) => {
              const sizeData = batchSizes[size];
              if (!sizeData) return null;

              return (
                <div
                  key={size}
                  className={`flex flex-col gap-3 p-4 rounded-2xl border-2 transition-all ${
                    sizeData.enabled
                      ? "border-[var(--moiz-green)] bg-[var(--moiz-green)]/5"
                      : "border-zinc-100 bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setBatchSizes((prev) => ({
                          ...prev,
                          [size]: { ...prev[size], enabled: !prev[size].enabled },
                        }))
                      }
                      className={`w-8 h-8 rounded-lg font-black text-sm flex items-center justify-center transition-all shrink-0 ${
                        sizeData.enabled
                          ? "bg-[var(--moiz-green)] text-white"
                          : "bg-zinc-200 text-zinc-400 hover:bg-zinc-300"
                      }`}
                    >
                      {size}
                    </button>

                    <span className="text-xs font-black text-zinc-500 w-16">
                      {sizeData.enabled ? "Incluida" : "No incluir"}
                    </span>
                  </div>

                  {sizeData.enabled && (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                          Stock
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={sizeData.stock}
                          onChange={(e) =>
                            setBatchSizes((prev) => ({
                              ...prev,
                              [size]: { ...prev[size], stock: parseInt(e.target.value) || 0 },
                            }))
                          }
                          className="w-full p-2.5 border border-zinc-200 rounded-xl text-sm font-black focus:ring-2 focus:ring-[var(--moiz-green)]/20 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                          Precio
                        </label>
                        <input
                          type="number"
                          step="any"
                          placeholder="Precio"
                          value={sizeData.price}
                          onChange={(e) =>
                            setBatchSizes((prev) => ({
                              ...prev,
                              [size]: { ...prev[size], price: e.target.value },
                            }))
                          }
                          className="w-full p-2.5 border border-zinc-200 rounded-xl text-sm font-black focus:ring-2 focus:ring-[var(--moiz-green)]/20 outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {Object.values(batchSizes).some((s) => s.enabled) && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-[var(--moiz-green)]/10 rounded-2xl text-sm font-bold text-[var(--moiz-green)]">
          <Layers size={16} />
          Se crearán <strong>{currentSizes.filter((s) => batchSizes[s].enabled).length}</strong>{" "}
          variantes del sistema <strong>{sizingSystem}</strong>.
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[var(--moiz-green)] text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : <Layers size={16} />}
        Crear Variantes por {sizingSystem === "tamaños" ? "Tamaño" : "Talla"}
      </button>
    </form>
  );
}

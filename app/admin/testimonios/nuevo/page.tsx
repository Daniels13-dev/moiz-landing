"use client";

import { useState } from "react";
import { ArrowLeft, MessageSquare, Star, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createReview } from "@/app/actions/reviews";
import ImageUpload from "@/components/ui/ImageUpload";

export default function NuevoTestimonioPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get("name") as string,
        rating: rating,
        text: formData.get("text") as string,
        city: formData.get("city") as string,
        date: formData.get("date") as string,
        image: imageUrl,
      };

      const res = await createReview(data);
      if (res.success) {
        toast.success("¡Testimonio creado con éxito!");
        router.push("/admin/testimonios");
      } else {
        toast.error("Error al crear el testimonio");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Ocurrió un error inesperado");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pb-20">
      <div className="mb-12">
        <Link
          href="/admin/testimonios"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors font-bold text-xs uppercase tracking-widest mb-4"
        >
          <ArrowLeft size={14} /> Volver a testimonios
        </Link>
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <MessageSquare size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter">
            Nuevo Testimonio
          </h1>
        </div>
        <p className="text-zinc-500 font-medium">
          Completa la información para añadir una nueva prueba social a tu tienda.
        </p>
      </div>

      <div className="bg-white rounded-[3rem] shadow-xl border border-zinc-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Column 1: Image & Basic Info */}
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 px-1">
                  Foto del Cliente (Opcional)
                </label>
                <div className="p-2 bg-zinc-50 rounded-[2.5rem] border border-zinc-100">
                  <ImageUpload 
                    name="image" 
                    folder="moiz/testimonials"
                    skipRemoveBackground={true}
                    onUrlChange={setImageUrl}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">
                    Nombre Completo
                  </label>
                  <input
                    name="name"
                    required
                    placeholder="Ej: María Paula Sánchez"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-zinc-900 font-bold outline-none focus:border-[var(--moiz-green)] focus:ring-4 focus:ring-[var(--moiz-green)]/5 transition-all text-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">
                      Ciudad
                    </label>
                    <input
                      name="city"
                      placeholder="Ej: Manizales"
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-zinc-900 font-bold outline-none focus:border-[var(--moiz-green)] focus:ring-4 focus:ring-[var(--moiz-green)]/5 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">
                      Fecha de Compra
                    </label>
                    <input
                      name="date"
                      placeholder="Ej: Feb 2026"
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-zinc-900 font-bold outline-none focus:border-[var(--moiz-green)] focus:ring-4 focus:ring-[var(--moiz-green)]/5 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Rating & Content */}
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 px-1">
                  Valoración del Cliente
                </label>
                <div className="flex gap-3 bg-zinc-50 p-6 rounded-[2rem] border border-zinc-100 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125"
                    >
                      <Star
                        size={36}
                        className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-200"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">
                  Experiencia del Cliente
                </label>
                <textarea
                  name="text"
                  required
                  rows={8}
                  placeholder="Escribe aquí el testimonio real del cliente..."
                  className="w-full h-full min-h-[250px] bg-zinc-50 border border-zinc-100 rounded-[2rem] p-8 text-zinc-900 font-medium outline-none focus:border-[var(--moiz-green)] focus:ring-4 focus:ring-[var(--moiz-green)]/5 transition-all resize-none leading-relaxed text-lg"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 bg-zinc-900 text-white rounded-[2rem] font-black text-base uppercase tracking-widest hover:bg-[var(--moiz-green)] hover:text-zinc-950 transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
              >
                {isSubmitting ? <><Loader2 className="animate-spin" /> Creando...</> : <><Save size={20} /> Guardar Testimonio</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

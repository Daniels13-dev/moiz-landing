"use client";

import { useState } from "react";
import { Pencil, X, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateReview } from "@/app/actions/reviews";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ui/ImageUpload";

export default function EditTestimonioModal({ review }: { review: any }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [imageUrl, setImageUrl] = useState(review.image || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      rating: rating,
      text: formData.get("text") as string,
      city: formData.get("city") as string,
      date: formData.get("date") as string,
      image: imageUrl,
    };

    const res = await updateReview(review.id, data);
    if (res.success) {
      toast.success("¡Testimonio actualizado!");
      setIsOpen(false);
      router.refresh();
    } else {
      toast.error("Error al actualizar");
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-3 text-zinc-300 hover:text-[var(--moiz-green)] hover:bg-[var(--moiz-green)]/5 rounded-2xl transition-all"
        title="Editar testimonio"
      >
        <Pencil size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-zinc-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-y-auto relative border border-zinc-100 animate-scale-in custom-scrollbar">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 p-2 text-zinc-400 hover:text-zinc-900 transition-colors z-10 bg-white/80 backdrop-blur-sm rounded-full"
            >
              <X size={24} />
            </button>

            <form onSubmit={handleSubmit} className="p-10 md:p-14">
              <h2 className="text-3xl font-black text-zinc-900 mb-2 tracking-tighter">
                Editar Testimonio
              </h2>
              <p className="text-zinc-500 font-medium mb-10">
                Puedes cambiar la foto y la información del cliente.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">
                    Foto del Cliente
                  </label>
                  <ImageUpload 
                    name="image" 
                    defaultValue={review.image}
                    folder="moiz/testimonials"
                    skipRemoveBackground={true}
                    onUrlChange={setImageUrl}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">
                    Nombre del Cliente
                  </label>
                  <input
                    name="name"
                    required
                    defaultValue={review.name}
                    placeholder="Ej: María Paula"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-zinc-900 font-bold outline-none focus:border-[var(--moiz-green)] focus:ring-4 focus:ring-[var(--moiz-green)]/5 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">
                      Ciudad
                    </label>
                    <input
                      name="city"
                      defaultValue={review.city}
                      placeholder="Ej: Manizales"
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-zinc-900 font-bold outline-none focus:border-[var(--moiz-green)] focus:ring-4 focus:ring-[var(--moiz-green)]/5 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">
                      Fecha
                    </label>
                    <input
                      name="date"
                      defaultValue={review.date}
                      placeholder="Ej: Feb 2026"
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-zinc-900 font-bold outline-none focus:border-[var(--moiz-green)] focus:ring-4 focus:ring-[var(--moiz-green)]/5 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">
                    Valoración
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 transition-transform hover:scale-125"
                      >
                        <Star
                          size={28}
                          className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-200"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">
                    Testimonio
                  </label>
                  <textarea
                    name="text"
                    required
                    rows={4}
                    defaultValue={review.text}
                    placeholder="Escribe aquí lo que dice el cliente..."
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-zinc-900 font-medium outline-none focus:border-[var(--moiz-green)] focus:ring-4 focus:ring-[var(--moiz-green)]/5 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[var(--moiz-green)] hover:text-zinc-950 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                >
                  {isSubmitting ? <><Loader2 className="animate-spin" /> Guardando...</> : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useEffect, use } from "react";
import { ArrowLeft, MessageSquare, Star, Loader2, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateReview, deleteReview, getAllReviewsForAdmin } from "@/app/actions/reviews";
import ImageUpload from "@/components/ui/ImageUpload";

export default function EditarTestimonioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    async function loadReview() {
      const res = await getAllReviewsForAdmin();
      if (res.success) {
        const found = res.reviews.find((r: any) => r.id === id);
        if (found) {
          setReview(found);
          setRating(found.rating);
          setImageUrl(found.image || "");
        } else {
          toast.error("Testimonio no encontrado");
          router.push("/admin/testimonios");
        }
      }
      setLoading(false);
    }
    loadReview();
  }, [id, router]);

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

    const res = await updateReview(id, data);
    if (res.success) {
      toast.success("¡Testimonio actualizado!");
      router.push("/admin/testimonios");
      router.refresh();
    } else {
      toast.error("Error al actualizar");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Seguro que quieres borrar este testimonio?")) return;
    const res = await deleteReview(id);
    if (res.success) {
      toast.success("Testimonio borrado");
      router.push("/admin/testimonios");
      router.refresh();
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-zinc-300" size={48} />
    </div>
  );

  if (!review) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 pb-20">
      <div className="mb-12 flex items-start justify-between">
        <div>
          <Link
            href="/admin/testimonios"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors font-bold text-xs uppercase tracking-widest mb-4"
          >
            <ArrowLeft size={14} /> Volver a testimonios
          </Link>
          <div className="flex items-center gap-4 mb-2">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm ${
              review.isActive ? "bg-[var(--moiz-green)] text-white" : "bg-zinc-100 text-zinc-400"
            }`}>
              {review.name.charAt(0)}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter">
              Editar Testimonio
            </h1>
          </div>
          <p className="text-zinc-500 font-medium font-bold text-sm">
            ID: <span className="font-mono text-zinc-400">{review.id}</span>
          </p>
        </div>

        <button
          onClick={handleDelete}
          className="p-4 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
          title="Borrar testimonio"
        >
          <Trash2 size={24} />
        </button>
      </div>

      <div className="bg-white rounded-[3rem] shadow-xl border border-zinc-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Column 1: Image & Basic Info */}
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 px-1">
                  Foto del Cliente
                </label>
                <div className="p-2 bg-zinc-50 rounded-[2.5rem] border border-zinc-100">
                  <ImageUpload 
                    name="image" 
                    defaultValue={review.image}
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
                    defaultValue={review.name}
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
                      defaultValue={review.city || ""}
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
                      defaultValue={review.date || ""}
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
                  Valoración
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
                  defaultValue={review.text}
                  placeholder="Escribe aquí el testimonio real del cliente..."
                  className="w-full h-full min-h-[250px] bg-zinc-50 border border-zinc-100 rounded-[2rem] p-8 text-zinc-900 font-medium outline-none focus:border-[var(--moiz-green)] focus:ring-4 focus:ring-[var(--moiz-green)]/5 transition-all resize-none leading-relaxed text-lg"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 bg-zinc-900 text-white rounded-[2rem] font-black text-base uppercase tracking-widest hover:bg-[var(--moiz-green)] hover:text-zinc-950 transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
              >
                {isSubmitting ? <><Loader2 className="animate-spin" /> Guardando...</> : <><Save size={20} /> Actualizar Cambios</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

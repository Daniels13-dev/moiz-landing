"use client";

import { useState } from "react";
import { Star, Trash2, MapPin, Calendar, Eye, EyeOff, Pencil } from "lucide-react";
import { toast } from "sonner";
import { toggleReviewActive, deleteReview } from "@/app/actions/reviews";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ReviewItem({ review }: { review: any }) {
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    const res = await toggleReviewActive(review.id, !review.isActive);
    if (res.success) {
      toast.success(review.isActive ? "Testimonio ocultado" : "Testimonio activado");
      router.refresh();
    } else {
      toast.error("Error al actualizar");
    }
    setIsToggling(false);
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar este testimonio?")) return;
    setIsDeleting(true);
    const res = await deleteReview(review.id);
    if (res.success) {
      toast.success("Testimonio eliminado");
      router.refresh();
    } else {
      toast.error("Error al eliminar");
    }
    setIsDeleting(false);
  };

  return (
    <div className={`p-8 group transition-all ${!review.isActive ? "bg-zinc-50/50" : "bg-white"}`}>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg overflow-hidden ${
              review.isActive ? "bg-[var(--moiz-green)]/10 text-[var(--moiz-green)]" : "bg-zinc-200 text-zinc-400"
            }`}>
              {review.image ? (
                <img src={review.image} className="w-full h-full object-cover" alt="" />
              ) : (
                review.name.charAt(0)
              )}
            </div>
            <div>
              <h3 className="font-black text-zinc-900 text-xl">{review.name}</h3>
              <div className="flex items-center gap-4 text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
                {review.city && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {review.city}
                  </span>
                )}
                {review.date && (
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {review.date}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-200"}
              />
            ))}
          </div>

          <p className="text-zinc-600 leading-relaxed italic">&quot;{review.text}&quot;</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/testimonios/${review.id}`}
            className="p-3 text-zinc-300 hover:text-[var(--moiz-green)] hover:bg-[var(--moiz-green)]/5 rounded-2xl transition-all"
            title="Editar testimonio"
          >
            <Pencil size={20} />
          </Link>

          <button
            onClick={handleToggle}
            disabled={isToggling}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              review.isActive 
                ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200" 
                : "bg-[var(--moiz-green)] text-white hover:opacity-90"
            }`}
          >
            {isToggling ? "..." : review.isActive ? <><EyeOff size={14} /> Ocultar</> : <><Eye size={14} /> Activar</>}
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-3 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

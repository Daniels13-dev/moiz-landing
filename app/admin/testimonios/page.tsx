import { MessageSquare, ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";
import ReviewItem from "./ReviewItem";
import { getAllReviewsForAdmin } from "@/app/actions/reviews";

export const dynamic = "force-dynamic";

export default async function AdminTestimoniosPage() {
  const res = await getAllReviewsForAdmin();
  const reviews = res.success ? res.reviews : [];

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors font-bold text-xs uppercase tracking-widest mb-4 group"
          >
            <div className="p-1 bg-zinc-100 rounded-lg group-hover:bg-zinc-200 transition-colors">
              <ArrowLeft size={12} />
            </div>
            Volver al panel
          </Link>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-purple-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-purple-200">
              <MessageSquare size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter">
                Testimonios
              </h1>
              <p className="text-zinc-500 font-medium mt-1">
                Gestiona la prueba social de tu marca.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/testimonios/nuevo"
          className="inline-flex items-center gap-3 px-10 py-5 bg-zinc-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-[var(--moiz-green)] hover:text-zinc-950 transition-all shadow-2xl hover:scale-105 active:scale-95"
        >
          <div className="p-1 bg-white/10 rounded-lg">
            <PlusCircle size={20} />
          </div>
          Nuevo Testimonio
        </Link>
      </div>

      {/* Stats / Filter Bar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-white px-6 py-3 rounded-2xl border border-zinc-100 flex items-center gap-3 shadow-sm">
          <span className="w-2 h-2 bg-[var(--moiz-green)] rounded-full animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-zinc-900">
            {reviews.length} Reseñas en total
          </span>
        </div>
      </div>

      {/* Main List Container */}
      <div className="bg-white rounded-[3rem] shadow-[0_4px_40px_rgba(0,0,0,0.03)] border border-zinc-100 overflow-hidden">
        <div className="divide-y divide-zinc-100">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))
          ) : (
            <div className="p-32 text-center">
              <div className="w-24 h-24 bg-zinc-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-zinc-300 border-2 border-dashed border-zinc-200">
                <MessageSquare size={48} />
              </div>
              <h3 className="text-2xl font-black text-zinc-900 mb-3 tracking-tight">No hay nada por aquí...</h3>
              <p className="text-zinc-500 max-w-sm mx-auto font-medium">
                Los testimonios que añadas aquí aparecerán automáticamente en la sección de clientes de Möiz.
              </p>
              <Link
                href="/admin/testimonios/nuevo"
                className="inline-block mt-8 text-[var(--moiz-green)] font-black uppercase tracking-widest text-xs hover:underline"
              >
                Crear mi primer testimonio →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

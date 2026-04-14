import { getOrderByNumber } from "@/app/actions/orders";
import OrderDetail from "@/components/orders/OrderDetail";
import Link from "next/link";
import { ChevronLeft, Package } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const order = await getOrderByNumber(id);

  if (!order) {
    // If not found, it might be due to a guest order or RLS
    // For now, let's redirect to tracking if it's not the user's order
    return (
      <main className="bg-[#FAF9F6] min-h-screen flex flex-col selection:bg-[var(--moiz-green)] selection:text-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6 py-24 md:py-32">
          <div className="max-w-md w-full bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl border border-zinc-100 text-center">
            <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <Package size={32} />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 mb-4 tracking-tight">
              No pudimos cargar tu pedido
            </h2>
            <p className="text-zinc-500 font-medium mb-10 text-sm leading-relaxed">
              Es posible que el pedido aún se esté procesando o que no tengas permisos para verlo.
              Intenta rastrearlo con tu identificación.
            </p>
            <Link
              href="/rastrear-mi-pedido"
              className="block w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-zinc-900/10"
            >
              Ir a Rastrear Pedido
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-[#FAF9F6] min-h-screen flex flex-col selection:bg-[var(--moiz-green)] selection:text-white overflow-x-hidden">
      <Navbar />

      <div className="flex-1 max-w-6xl w-full mx-auto px-6 pt-12 pb-20">
        <div className="mb-10">
          <Link
            href="/pedidos"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-[var(--moiz-green)] font-black text-xs uppercase tracking-widest transition-colors mb-6"
          >
            <ChevronLeft size={16} /> Volver a Mis Pedidos
          </Link>
        </div>

        <OrderDetail order={order} />
      </div>

      <Footer />
    </main>
  );
}

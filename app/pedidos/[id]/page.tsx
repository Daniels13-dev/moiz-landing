import { getOrderByNumber } from "@/app/actions/orders";
import OrderDetail from "@/components/orders/OrderDetail";
import Link from "next/link";
import { ChevronLeft, Package, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function OrderDetailPage({ params, searchParams }: OrderDetailPageProps) {
  const { id } = await params;
  const sp = await searchParams;

  // Detectar si viene de una redirección de Wompi
  const isFromWompi = !!sp?.id; // Wompi agrega ?id=transaction_id en la redirect_url

  const order = await getOrderByNumber(id);

  if (!order) {
    return (
      <main className="bg-[#FAF9F6] min-h-screen flex flex-col">
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
              Es posible que el pedido aún se esté procesando. Espera unos segundos y recarga la página,
              o rastréalo con tu identificación.
            </p>
            <Link
              href="/rastrear-mi-pedido"
              className="block w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-zinc-900/10"
            >
              Rastrear mi Pedido
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
        {/* Banner de confirmación de pago cuando viene de Wompi */}
        {isFromWompi && order.status === "pagada" && (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <CheckCircle2 className="text-green-500 shrink-0" size={32} />
            <div>
              <p className="font-black text-green-800 text-lg">¡Pago procesado exitosamente!</p>
              <p className="text-green-600 text-sm font-medium">
                Tu pedido <strong>{id}</strong> ha sido recibido. Recibirás una confirmación pronto.
              </p>
            </div>
          </div>
        )}

        {isFromWompi && order.status === "rechazada" && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="w-10 h-10 bg-red-100 text-red-500 rounded-full flex items-center justify-center shrink-0">
              <Package size={20} />
            </div>
            <div>
              <p className="font-black text-red-800 text-lg">El pago no pudo completarse</p>
              <p className="text-red-600 text-sm font-medium">
                Tu pedido <strong>{id}</strong> sigue pendiente. Puedes intentar pagar de nuevo abajo.
              </p>
            </div>
          </div>
        )}

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

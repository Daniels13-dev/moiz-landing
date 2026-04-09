import { getUserOrders } from "@/app/actions/orders";
import OrderTable from "@/components/orders/OrderTable";
import Link from "next/link";
import { Package, ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/pedidos");
  }

  const orders = await getUserOrders();

  return (
    <main className="bg-[#FAF9F6] min-h-screen flex flex-col selection:bg-[var(--moiz-green)] selection:text-white overflow-x-hidden">
      <Navbar />

      <div className="flex-1 max-w-4xl w-full mx-auto px-6 pt-12 pb-20 min-h-[70vh] relative">
        <Link
          href="/"
          className="absolute -top-12 left-0 flex items-center gap-2 text-zinc-400 hover:text-[var(--moiz-green)] font-bold text-sm transition-colors group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Volver al Inicio
        </Link>

        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            <Package size={14} />
            Tu Historial
          </div>
          <h1 className="text-5xl font-black text-zinc-900 tracking-tighter">
            Mis <span className="text-[var(--moiz-green)]">Pedidos</span>
          </h1>
          <p className="text-zinc-500 font-medium mt-4">
            Aquí puedes ver todos tus pedidos anteriores y seguir el estado de
            tus compras actuales.
          </p>
        </div>

        <OrderTable orders={orders} />
      </div>

      <Footer />
    </main>
  );
}

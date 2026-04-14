import { getAllOrders } from "@/app/actions/orders";
import AdminOrderTable from "@/components/orders/AdminOrderTable";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div className="max-w-7xl mx-auto px-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-zinc-400 font-bold text-sm hover:text-[var(--moiz-green)] transition-colors group mb-8"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Volver al panel
      </Link>

      <div className="mb-12">
        <div className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <ShoppingBag size={14} />
          Administración
        </div>
        <h1 className="text-5xl font-black text-zinc-900 tracking-tighter">
          Gestión de <span className="text-[var(--moiz-green)]">Pedidos</span>
        </h1>
        <p className="text-zinc-500 font-medium mt-4 max-w-2xl">
          Monitorea las ventas, actualiza estados de envío y revisa el historial de cada cliente.
        </p>
      </div>

      <AdminOrderTable orders={orders} />
    </div>
  );
}

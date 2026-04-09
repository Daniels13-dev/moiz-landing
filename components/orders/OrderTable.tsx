import Link from "next/link";
import OrderStatusBadge from "./OrderStatusBadge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronRight, Calendar, Package } from "lucide-react";

interface OrderItem {
  id: string;
  productId?: string;
  productName?: string | null;
  quantity?: number;
  price?: number;
}

interface Order {
  id: string;
  totalAmount: number;
  currency?: string;
  createdAt: string | number | Date;
  items: OrderItem[];
  status?: string;
}

interface OrderTableProps {
  orders: Order[];
}

export default function OrderTable({ orders }: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white border border-zinc-100 rounded-[3rem] p-12 text-center">
        <div className="w-20 h-20 bg-zinc-50 text-zinc-300 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package size={40} />
        </div>
        <h3 className="text-2xl font-black text-zinc-900 mb-2">
          No tienes pedidos aún
        </h3>
        <p className="text-zinc-500 font-medium mb-8 max-w-xs mx-auto">
          Cuando realices una compra, aparecerá aquí para que puedas seguirla.
        </p>
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 bg-[var(--moiz-green)] text-zinc-950 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/pedidos/${order.id}`}
          className="group flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 bg-white border border-zinc-100 rounded-[2.5rem] hover:border-[var(--moiz-green)] transition-all hover:shadow-xl hover:shadow-[var(--moiz-green)]/5"
        >
          <div className="flex items-center gap-6 mb-4 md:mb-0">
            <div className="w-14 h-14 bg-zinc-50 text-zinc-400 rounded-2xl flex items-center justify-center group-hover:bg-[var(--moiz-green)]/10 group-hover:text-[var(--moiz-green)] transition-colors">
              <Package size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                Orden #{order.id.slice(-6).toUpperCase()}
              </p>
              <h4 className="text-xl font-bold text-zinc-900 group-hover:text-[var(--moiz-green)] transition-colors">
                ${order.totalAmount.toLocaleString("es-CO")} {order.currency}
              </h4>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-xs font-medium text-zinc-500">
                  <Calendar size={12} />
                  {format(new Date(order.createdAt), "d 'de' MMMM, yyyy", {
                    locale: es,
                  })}
                </span>
                <span className="text-zinc-300">•</span>
                <span className="text-xs font-medium text-zinc-500">
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "producto" : "productos"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-6">
            <OrderStatusBadge status={order.status ?? "pendiente"} />
            <div className="hidden md:flex w-10 h-10 bg-zinc-50 text-zinc-300 rounded-full items-center justify-center group-hover:bg-[var(--moiz-green)] group-hover:text-zinc-950 transition-all translate-x-0 group-hover:translate-x-1">
              <ChevronRight size={20} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

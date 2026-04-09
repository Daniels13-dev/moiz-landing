"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import OrderStatusBadge from "./OrderStatusBadge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronRight,
  Calendar,
  User,
  ShoppingBag,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { updateOrderStatus } from "@/app/actions/orders";
import type { OrderStatus } from "@/app/actions/orders";
import { toast } from "sonner";

interface AdminOrder {
  id: string;
  orderNumber?: number | string;
  createdAt: string | number | Date;
  customerName: string;
  status: string;
  profile?: { email?: string } | null;
  totalAmount: number;
  currency?: string;
}

interface AdminOrderTableProps {
  orders: AdminOrder[];
}

export default function AdminOrderTable({
  orders: initialOrders,
}: AdminOrderTableProps) {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [filter, setFilter] = useState("all");

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus,
  ) => {
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      toast.success("Estado actualizado con éxito");
    } else {
      toast.error("Error al actualizar el estado");
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4 bg-white p-6 rounded-[2.5rem] border border-zinc-100 overflow-x-auto whitespace-nowrap no-scrollbar">
        <Filter size={18} className="text-zinc-400 mr-2 flex-shrink-0" />
        {[
          "all",
          "pendiente",
          "pagado",
          "enviado",
          "entregado",
          "cancelado",
        ].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              filter === s
                ? "bg-zinc-900 text-white shadow-lg"
                : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100"
            }`}
          >
            {s === "all" ? "Todos" : s}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-zinc-100 rounded-[3rem] p-12 text-center">
            <ShoppingBag size={40} className="text-zinc-200 mx-auto mb-4" />
            <p className="text-zinc-500 font-bold italic">
              No se encontraron pedidos con este filtro.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="group flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 bg-white border border-zinc-100 rounded-[3rem] hover:border-[var(--moiz-green)] transition-all hover:shadow-xl hover:shadow-[var(--moiz-green)]/5"
            >
              <div className="flex items-center gap-6 mb-4 md:mb-0">
                <div className="w-16 h-16 bg-zinc-50 text-zinc-900 rounded-[1.5rem] flex items-center justify-center group-hover:bg-[var(--moiz-green)] group-hover:text-white transition-colors">
                  <ShoppingBag size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      ID:{" "}
                      {order.orderNumber
                        ? `MZ-${order.orderNumber}`
                        : order.id.slice(-6).toUpperCase()}
                    </p>
                    <span className="text-zinc-200">•</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 inline-flex items-center gap-1">
                      <Calendar size={10} />{" "}
                      {format(new Date(order.createdAt), "d MMM, yy", {
                        locale: es,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-black text-zinc-900">
                      {order.customerName}
                    </h4>
                    <OrderStatusBadge
                      status={order.status}
                      className="scale-90 origin-left"
                    />
                  </div>
                  <p className="text-sm font-medium text-zinc-500 flex items-center gap-2">
                    <User size={14} className="text-[var(--moiz-green)]" />
                    {order.profile?.email || "Invitado"}
                    <span className="mx-1 text-zinc-300">|</span>
                    <span className="font-bold text-zinc-900">
                      ${order.totalAmount.toLocaleString("es-CO")}{" "}
                      {order.currency}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0 mt-4 md:mt-0">
                <select
                  value={order.status}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleStatusUpdate(order.id, e.target.value as OrderStatus)
                  }
                  className="bg-zinc-50 border border-zinc-100 text-zinc-900 text-xs font-black uppercase tracking-widest rounded-full px-4 py-2.5 focus:ring-2 focus:ring-[var(--moiz-green)] outline-none transition-all cursor-pointer hover:bg-zinc-100"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="pagado">Pagado</option>
                  <option value="enviado">Enviado</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                </select>

                <Link
                  href={`/admin/pedidos/${order.id}`}
                  className="w-12 h-12 bg-zinc-900 text-white rounded-full flex items-center justify-center hover:bg-[var(--moiz-green)] transition-all group/btn"
                >
                  <ChevronRight
                    size={24}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

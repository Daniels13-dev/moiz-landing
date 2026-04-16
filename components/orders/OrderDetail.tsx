import OrderStatusBadge from "./OrderStatusBadge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MapPin, Phone, User, Package, Clock, Truck } from "lucide-react";
import { siteConfig } from "@/config/site";

interface OrderItem {
  id: string;
  productName?: string | null;
  quantity: number;
  price: number;
}

interface OrderHistoryEvent {
  id: string;
  status: string;
  changedAt: string | number | Date;
  comment?: string | null;
}

interface OrderDetailOrder {
  id: string;
  orderNumber?: number | string;
  customerName: string;
  customerPhone?: string | null;
  customerAddress?: string | null;
  items: OrderItem[];
  totalAmount: number;
  currency?: string;
  status: string;
  shippingMethod?: string;
  customerCity?: string | null | undefined;
  customerState?: string | null | undefined;
  customerIdentification?: string | null;
  history: OrderHistoryEvent[];
}

import DownloadInvoiceButton from "@/components/billing/DownloadInvoiceButton";

interface OrderDetailProps {
  order: OrderDetailOrder;
  showHelp?: boolean;
}

export default function OrderDetail({ order, showHelp = true }: OrderDetailProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Order Details */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white border border-zinc-100 rounded-[3rem] p-8 md:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-zinc-900 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                Pedido #{order.orderNumber ? `MZ-${order.orderNumber}` : order.id}
              </div>
              <h1 className="text-4xl font-black text-zinc-900 tracking-tighter">
                Detalle del Pedido
              </h1>
            </div>
            <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
              {["pagado", "enviado", "entregado"].includes(order.status.toLowerCase()) && (
                <DownloadInvoiceButton
                  orderNumber={`MZ-${order.orderNumber}`}
                  customerNit={order.customerIdentification || ""}
                />
              )}
              <OrderStatusBadge status={order.status} className="text-sm px-5 py-2 self-start" />
            </div>
          </div>

          <div
            className={`mb-10 inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border ${
              order.shippingMethod?.toLowerCase() === "domicilio"
                ? "bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] border-[var(--moiz-green)]/20 shadow-sm"
                : "bg-blue-50 text-blue-500 border-blue-100"
            }`}
          >
            <Truck size={16} />
            <span className="opacity-60 mr-2">{siteConfig.ui.order.method}:</span>
            {order.shippingMethod?.toLowerCase() === "domicilio"
              ? "🛵 Domicilio Möiz (Entrega Hoy)"
              : "🚚 Envío Nacional Estándar"}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 bg-zinc-50 rounded-3xl">
              <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">
                <User size={14} /> Cliente
              </span>
              <p className="text-lg font-bold text-zinc-900">{order.customerName}</p>
              <p className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 mt-1">
                <Phone size={14} /> {order.customerPhone}
              </p>
            </div>
            <div className="p-6 bg-zinc-50 rounded-3xl">
              <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">
                <MapPin size={14} /> Dirección de Envío
              </span>
              <p className="text-lg font-bold text-zinc-900 line-clamp-2">
                {order.customerAddress || "No especificada"}
              </p>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-zinc-900 flex items-center gap-3">
              <Package size={22} className="text-[var(--moiz-green)]" />
              Productos
            </h3>
            <div className="divide-y divide-zinc-100 border-y border-zinc-100">
              {order.items.map((item: OrderItem) => (
                <div key={item.id} className="py-6 flex items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-100">
                      <Package size={24} className="text-zinc-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900">{item.productName || "Producto"}</h4>
                      <p className="text-sm font-medium text-zinc-500">
                        Cantidad: {item.quantity} x ${item.price.toLocaleString("es-CO")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-zinc-900">
                      ${(item.price * item.quantity).toLocaleString("es-CO")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="mt-10 p-8 bg-zinc-900 rounded-[2.5rem] text-white">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <span className="font-bold text-white/60">{siteConfig.ui.order.subtotal}</span>
              <span className="font-bold">${order.totalAmount.toLocaleString("es-CO")}</span>
            </div>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <span className="font-bold text-white/60">{siteConfig.ui.order.shipping}</span>
              <span className="font-bold text-[var(--moiz-green)] italic">{siteConfig.ui.order.free}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black">{siteConfig.ui.order.total}</span>
              <span className="text-3xl font-black text-[var(--moiz-green)]">
                ${order.totalAmount.toLocaleString("es-CO")} {order.currency}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: History & Misc */}
      <div className="lg:col-span-1 space-y-8">
        <div className="bg-white border border-zinc-100 rounded-[3rem] p-10 shadow-sm h-fit">
          <h3 className="text-xl font-black text-zinc-900 flex items-center gap-3 mb-8">
            <Clock size={22} className="text-[var(--moiz-green)]" />
            Historial
          </h3>
          <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-100">
            {order.history.map((event: OrderHistoryEvent) => (
              <div key={event.id} className="relative pl-10">
                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-[var(--moiz-green)] z-10" />
                <div>
                  <p className="text-sm font-black text-zinc-900 mb-1 capitalize">{event.status}</p>
                  <p className="text-xs font-medium text-zinc-500 mb-2">
                    {format(new Date(event.changedAt), "d 'de' MMMM, HH:mm", {
                      locale: es,
                    })}
                  </p>
                  <p className="text-sm text-zinc-600 italic bg-zinc-50 p-3 rounded-2xl border border-zinc-100/50">
                    {event.comment || "Sin comentarios."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showHelp && (
          <div className="bg-[var(--moiz-green)]/10 border border-[var(--moiz-green)]/20 rounded-[3rem] p-10 text-center">
            <h4 className="text-lg font-black text-[var(--moiz-green)] mb-2">{siteConfig.ui.needHelp}</h4>
            <p className="text-sm font-medium text-zinc-600 mb-6">
              {siteConfig.ui.whatsappReady}
            </p>
            <a
              href="https://wa.me/573218515161"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[var(--moiz-green)] px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm hover:scale-105 transition-transform"
            >
              Soporte Möiz
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

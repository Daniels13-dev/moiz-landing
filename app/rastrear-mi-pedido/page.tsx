"use client";

import { useState } from "react";
import { trackOrder } from "@/app/actions/orders";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Calendar,
  CreditCard,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TrackedOrder {
  orderNumber: string | number;
  status: string;
  createdAt: string | number | Date;
  customerAddress: string;
  customerCity: string;
  customerState: string;
  customerIdentification: string;
  shippingMethod: string;
  history: Array<{
    id: string;
    status: string;
    comment: string | null;
    changedAt: string | number | Date;
  }>;
}

import DownloadInvoiceButton from "@/components/billing/DownloadInvoiceButton";

export default function TrackOrderPage() {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [trackingId, setTrackingId] = useState("");
  const [nit, setNit] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId || !nit) {
      toast.error("Por favor completa ambos campos.");
      return;
    }

    setLoading(true);
    setOrder(null);

    const result = await trackOrder(trackingId, nit);

    if (result.success) {
      setOrder(result.order as unknown as TrackedOrder);
      toast.success("Pedido encontrado");
    } else {
      toast.error(result.error || "No se pudo encontrar el pedido.");
    }
    setLoading(false);
  };

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendiente":
        return {
          icon: <Clock size={20} />,
          color: "text-amber-500",
          bg: "bg-amber-50",
          label: "Pendiente",
        };
      case "pagado":
        return {
          icon: <CreditCard size={20} />,
          color: "text-blue-500",
          bg: "bg-blue-50",
          label: "Pagado",
        };
      case "enviado":
        return {
          icon: <Truck size={20} />,
          color: "text-indigo-500",
          bg: "bg-indigo-50",
          label: "En Camino",
        };
      case "entregado":
        return {
          icon: <CheckCircle2 size={20} />,
          color: "text-[var(--moiz-green)]",
          bg: "bg-[var(--moiz-green)]/10",
          label: "Entregado",
        };
      case "cancelado":
        return {
          icon: <AlertCircle size={20} />,
          color: "text-red-500",
          bg: "bg-red-50",
          label: "Cancelado",
        };
      default:
        return {
          icon: <Package size={20} />,
          color: "text-zinc-500",
          bg: "bg-zinc-50",
          label: status,
        };
    }
  };

  return (
    <main className="bg-[#FAF9F6] min-h-screen flex flex-col selection:bg-[var(--moiz-green)] selection:text-white">
      <Navbar />

      <div className="flex-1 pt-24 md:pt-32 px-6 max-w-4xl mx-auto w-full pb-24">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] rounded-full text-xs font-black uppercase tracking-widest mb-6"
          >
            <Package size={14} /> Logística Möiz
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tighter mb-4"
          >
            Rastrear mi Pedido
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 font-medium max-w-lg mx-auto"
          >
            Ingresa los datos proporcionados al momento de tu compra para conocer el estado actual
            de tu envío.
          </motion.p>
        </div>

        {/* Search Form */}
        <section className="mb-12">
          <form
            onSubmit={handleTrack}
            className="bg-white p-6 md:p-10 rounded-[3rem] shadow-2xl border border-zinc-100"
          >
            <div className="grid md:grid-cols-12 gap-6 items-end">
              <div className="md:col-span-4 space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">
                  ID de Pedido
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300"
                    size={18}
                  />
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Ej. MZ-1001"
                    className="w-full pl-12 pr-6 py-4 bg-zinc-50/50 border border-zinc-100 rounded-[1.2rem] outline-none transition-all font-bold text-zinc-900 placeholder:text-zinc-300 focus:bg-white focus:ring-4 focus:ring-[var(--moiz-green)]/15 focus:border-[var(--moiz-green)] text-sm"
                  />
                </div>
              </div>
              <div className="md:col-span-5 space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">
                  Cédula o NIT
                </label>
                <input
                  type="text"
                  value={nit}
                  onChange={(e) => setNit(e.target.value)}
                  placeholder="Ingresa tu identificación"
                  className="w-full px-6 py-4 bg-zinc-50/50 border border-zinc-100 rounded-[1.2rem] outline-none transition-all font-bold text-zinc-900 placeholder:text-zinc-300 focus:bg-white focus:ring-4 focus:ring-[var(--moiz-green)]/15 focus:border-[var(--moiz-green)] text-sm"
                />
              </div>
              <div className="md:col-span-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-zinc-900 text-white rounded-[1.2rem] font-bold hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 text-sm shadow-xl shadow-zinc-900/10 h-[54px] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Clock className="animate-spin" size={18} />
                  ) : (
                    <>
                      Rastrear <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Results */}
        <AnimatePresence mode="wait">
          {order && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              {/* Main Status Card */}
              <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-zinc-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <Truck size={180} className="-rotate-12" />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-zinc-400 font-bold text-sm uppercase tracking-widest">
                        Pedido
                      </span>
                      <span className="text-2xl font-black text-zinc-900 tracking-tight">
                        MZ-{order.orderNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-zinc-500 font-medium text-sm">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {format(new Date(order.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
                    {["pagado", "enviado", "entregado"].includes(order.status.toLowerCase()) && (
                      <DownloadInvoiceButton
                        orderNumber={`MZ-${order.orderNumber}`}
                        customerNit={order.customerIdentification}
                      />
                    )}
                    <div
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold ${getStatusConfig(order.status).bg} ${getStatusConfig(order.status).color}`}
                    >
                      {getStatusConfig(order.status).icon}
                      {getStatusConfig(order.status).label}
                    </div>
                  </div>
                </div>

                {/* Tracking Progress */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 relative">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 hidden md:block -translate-y-1/2" />

                  {["pendiente", "pagado", "enviado", "entregado"].map((s, idx) => {
                    const currentStatusIdx = [
                      "pendiente",
                      "pagado",
                      "enviado",
                      "entregado",
                    ].indexOf(order.status.toLowerCase());
                    const isCompleted = currentStatusIdx >= idx;
                    const isCurrent = currentStatusIdx === idx;

                    return (
                      <div
                        key={s}
                        className="relative flex flex-col items-center md:items-start z-10"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isCompleted ? "bg-[var(--moiz-green)] text-zinc-950 scale-110 shadow-lg" : "bg-zinc-100 text-zinc-400"}`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-zinc-300" />
                          )}
                        </div>
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest mt-4 ${isCurrent ? "text-zinc-900" : "text-zinc-400"}`}
                        >
                          {s === "estandar" ? "En camino" : s}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-zinc-100">
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-zinc-900 flex items-center gap-2">
                      <MapPin size={16} className="text-[var(--moiz-green)]" /> Dirección de Entrega
                    </h4>
                    <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                      {order.customerAddress}
                      <br />
                      {order.customerCity}, {order.customerState}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-zinc-900 flex items-center gap-2">
                      <ShoppingBag size={16} className="text-[var(--moiz-green)]" /> Logística
                      Seleccionada
                    </h4>
                    <p className="text-zinc-500 text-sm font-medium">
                      {order.shippingMethod === "domicilio"
                        ? "🛵 Domicilio Möiz (Local)"
                        : "🚚 Envío Nacional Estándar"}
                    </p>
                  </div>
                </div>
              </div>

              {/* History Timeline */}
              {order.history && order.history.length > 0 && (
                <div className="bg-zinc-900 rounded-[3rem] p-10 text-white">
                  <h3 className="text-xl font-black mb-10 flex items-center gap-3">
                    <Clock className="text-[var(--moiz-green)]" /> Historial de Tracking
                  </h3>
                  <div className="space-y-10">
                    {order.history.map((h, i) => (
                      <div key={h.id} className="relative flex gap-6">
                        {i !== order.history.length - 1 && (
                          <div className="absolute left-[11px] top-8 bottom-[-20px] w-0.5 bg-white/10" />
                        )}
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 ${i === 0 ? "bg-[var(--moiz-green)] border-[var(--moiz-green)]" : "border-white/20 bg-zinc-900"}`}
                        >
                          {i === 0 && <ArrowRight size={12} className="text-zinc-950" />}
                        </div>
                        <div>
                          <p
                            className={`font-black tracking-tight ${i === 0 ? "text-white" : "text-white/40"}`}
                          >
                            {h.comment || `Estado cambiado a ${h.status}`}
                          </p>
                          <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mt-1">
                            {format(new Date(h.changedAt), "d 'de' MMMM, h:mm b", { locale: es })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}

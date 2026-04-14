"use client";

import { useState } from "react";
import {
  X,
  Calendar,
  Package,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import { cancelSubscription } from "@/app/actions/subscriptions";
import { toast } from "sonner";

interface PublicSubscription {
  id: string;
  deliveryCount: number;
  nextBillingDate: string | Date;
  product: {
    name: string;
    image: string;
  };
}

interface ManageSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: PublicSubscription;
}

export default function ManageSubscriptionModal({
  isOpen,
  onClose,
  subscription,
}: ManageSubscriptionModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCancel = async () => {
    setIsDeleting(true);
    const result = await cancelSubscription(subscription.id);
    if (result.success) {
      toast.success("Suscripción cancelada correctamente");
      onClose();
    } else {
      toast.error(result.error || "Error al cancelar");
      setIsDeleting(false);
      setIsConfirming(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-3xl bg-white rounded-t-[3rem] md:rounded-[3rem] shadow-2xl z-[70] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-zinc-100 bg-white shrink-0">
              <div>
                <h2 className="text-3xl font-black text-zinc-900 tracking-tighter">
                  Gestionar <span className="text-[var(--moiz-green)]">Suscripción</span>
                </h2>
                <p className="text-zinc-500 font-medium text-sm">
                  Detalles y logística de tu pedido recurrente
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 bg-zinc-50 text-zinc-400 rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Product & Status */}
                <div className="space-y-6">
                  <div className="bg-zinc-50 p-6 rounded-[2.5rem] border border-zinc-100 flex items-center gap-6">
                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center p-4 shadow-sm border border-zinc-100 shrink-0">
                      <Image
                        src={subscription.product.image}
                        alt={subscription.product.name}
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1">
                        Producto
                      </p>
                      <h3 className="text-lg font-black text-zinc-900 leading-tight mb-2">
                        {subscription.product.name}
                      </h3>
                      <div className="bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 w-fit uppercase border border-[var(--moiz-green)]/20">
                        <CheckCircle2 size={12} /> Activa
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50/50 border border-blue-100 p-8 rounded-[2.5rem] space-y-4">
                    <div className="flex items-center gap-3 text-blue-600">
                      <Info size={20} />
                      <h4 className="font-black uppercase tracking-widest text-xs">
                        Permanencia y Ahorro
                      </h4>
                    </div>
                    <div className="space-y-4 bg-white/60 p-5 rounded-3xl border border-blue-100/50 shadow-sm">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                          Entregas realizadas
                        </p>
                        <p className="text-[10px] font-black uppercase text-[var(--moiz-green)] tracking-widest font-mono bg-white px-2 py-0.5 rounded-full border border-zinc-100">
                          {subscription.deliveryCount} / 3
                        </p>
                      </div>
                      <div className="w-full h-2.5 bg-zinc-100/80 rounded-full overflow-hidden flex gap-1.5 p-0.5 border border-zinc-200/30">
                        {[1, 2, 3].map((step) => (
                          <div
                            key={step}
                            className={`flex-1 h-full rounded-full transition-all duration-500 ${subscription.deliveryCount >= step ? "bg-[var(--moiz-green)] shadow-[0_0_8px_rgba(102,187,106,0.3)]" : "bg-zinc-200"}`}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-zinc-500 font-bold leading-relaxed italic">
                        * Mantén tu beneficio del 5% OFF completando al menos 3 pedidos.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Delivery Details & Actions */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-zinc-50 p-6 rounded-[2.5rem] border border-zinc-100 flex items-center gap-5">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[var(--moiz-green)] border border-zinc-100 shrink-0">
                        <Calendar size={22} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-0.5">
                          Próxima Entrega
                        </p>
                        <p className="font-black text-xl text-zinc-900">
                          {format(new Date(subscription.nextBillingDate), "dd 'de' MMMM", {
                            locale: es,
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="bg-zinc-50 p-6 rounded-[2.5rem] border border-zinc-100 flex items-center gap-5">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 border border-zinc-100 shrink-0">
                        <Package size={22} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-0.5">
                          Tu Frecuencia
                        </p>
                        <p className="font-black text-xl text-zinc-900">Cada 30 días</p>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="mt-4 pt-4 border-t border-zinc-100">
                    {subscription.deliveryCount >= 3 ? (
                      <>
                        {!isConfirming ? (
                          <button
                            onClick={() => setIsConfirming(true)}
                            className="w-full py-5 text-zinc-400 font-bold text-sm flex items-center justify-center gap-3 hover:text-red-500 transition-all bg-zinc-50 hover:bg-red-50 rounded-[2rem] border border-dashed border-zinc-200 hover:border-red-200"
                          >
                            <Trash2 size={18} /> Cancelar suscripción
                          </button>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 space-y-4"
                          >
                            <div className="flex items-center gap-3 text-red-600">
                              <AlertCircle size={20} />
                              <p className="font-black text-sm uppercase tracking-tight">
                                Confirmar Cancelación
                              </p>
                            </div>
                            <p className="text-xs text-red-700/60 font-medium leading-relaxed mb-4">
                              ¿Estás seguro? Perderás el descuento permanente y el precio protegido
                              de este producto.
                            </p>
                            <div className="flex flex-col gap-3">
                              <button
                                disabled={isDeleting}
                                onClick={handleCancel}
                                className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                              >
                                {isDeleting ? (
                                  <Loader2 className="animate-spin" size={16} />
                                ) : (
                                  "Sí, Cancelar"
                                )}
                              </button>
                              <button
                                disabled={isDeleting}
                                onClick={() => setIsConfirming(false)}
                                className="w-full py-4 bg-white text-zinc-900 border border-zinc-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-50 transition-all"
                              >
                                No, Mantener
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </>
                    ) : (
                      <div className="p-8 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 flex flex-col items-center text-center gap-3 opacity-60">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-zinc-300 border border-zinc-100 shadow-sm">
                          <Trash2 size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                            Opción de cancelación bloqueada
                          </p>
                          <p className="text-[10px] text-zinc-500 font-bold leading-tight px-4">
                            Disponible tras recibir{" "}
                            <span className="text-zinc-800">
                              {3 - subscription.deliveryCount} entregas más
                            </span>
                            .
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-zinc-50 border-t border-zinc-100 shrink-0">
              <button
                onClick={onClose}
                className="w-full py-5 bg-zinc-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10 active:scale-[0.98]"
              >
                Cerrar y Volver
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

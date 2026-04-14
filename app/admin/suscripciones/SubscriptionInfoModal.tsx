"use client";

import {
  X,
  MapPin,
  Phone,
  User,
  Package,
  Calendar,
  CheckCircle2,
  Truck,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import Image from "next/image";
import { es } from "date-fns/locale";
import { completeSubscriptionReminder } from "@/app/admin/actions";
import { useState } from "react";
import { toast } from "sonner";

interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
}

interface UserProfile {
  email: string;
  fullName: string | null;
  phone: string | null;
  addresses: Address[];
}

interface Product {
  name: string;
  image: string;
}

interface SubscriptionReminder {
  id: string;
  status: string;
  reminderDate: Date;
  user: UserProfile;
  product: Product;
}

interface SubscriptionInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminder: SubscriptionReminder;
}

export default function SubscriptionInfoModal({
  isOpen,
  onClose,
  reminder,
}: SubscriptionInfoModalProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const address = reminder.user.addresses?.[0]; // Usamos la primera dirección por defecto

  const isLocalDelivery =
    address?.state === "Caldas" && ["Manizales", "Villamaría"].includes(address?.city || "");

  const handleComplete = async () => {
    setIsCompleting(true);
    const result = await completeSubscriptionReminder(reminder.id);
    if (result.success) {
      toast.success("Entrega marcada como completada. Se ha programado el siguiente recordatorio.");
      onClose();
    } else {
      toast.error(result.error || "Error al completar");
    }
    setIsCompleting(false);
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
            className="fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-4xl h-full md:h-auto md:max-h-[85vh] bg-white rounded-t-[3rem] md:rounded-[3rem] shadow-2xl z-[70] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-zinc-100 bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-3xl font-black text-zinc-900 tracking-tighter">
                  Información de Entrega
                </h2>
                <p className="text-zinc-500 font-medium text-sm">
                  Detalles para coordinar la suscripción mensual
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 bg-zinc-50 text-zinc-400 rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cliente Section */}
                <div className="bg-zinc-50 p-6 rounded-[2rem] border border-zinc-100 space-y-4">
                  <div className="flex items-center gap-3 text-[var(--moiz-green)]">
                    <User size={20} className="font-black" />
                    <h3 className="font-black uppercase tracking-widest text-xs">
                      Datos del Cliente
                    </h3>
                  </div>
                  <div className="space-y-2 pl-8">
                    <p className="text-xl font-black text-zinc-900">
                      {reminder.user.fullName || "Sin nombre registrado"}
                    </p>
                    <div className="flex items-center gap-2 text-zinc-500 font-medium">
                      <Phone size={14} />
                      <span>{reminder.user.phone || address?.phone || "Sin teléfono"}</span>
                    </div>
                    <p className="text-sm text-zinc-400">{reminder.user.email}</p>
                  </div>
                </div>

                {/* Logística Section */}
                <div className="bg-zinc-50 p-6 rounded-[2rem] border border-zinc-100 space-y-4">
                  <div className="flex items-center gap-3 text-orange-500">
                    <Truck size={20} className="font-black" />
                    <h3 className="font-black uppercase tracking-widest text-xs">
                      Logística de Envío
                    </h3>
                  </div>
                  <div className="pl-8">
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black uppercase tracking-wider ${isLocalDelivery ? "bg-[var(--moiz-green)]/10 text-[var(--moiz-green)]" : "bg-blue-50 text-blue-500"}`}
                    >
                      {isLocalDelivery ? "🛵 Domicilio Local Möiz" : "🚚 Envío Nacional Estándar"}
                    </div>
                    <p className="text-xs text-zinc-400 font-medium mt-2">
                      {isLocalDelivery
                        ? "Zona de cobertura rápida (Manizales/Villamaría)."
                        : "Requiere despacho por transportadora nacional."}
                    </p>
                  </div>
                </div>

                {/* Entrega Section */}
                <div className="bg-zinc-50 p-6 rounded-[2rem] border border-zinc-100 space-y-4">
                  <div className="flex items-center gap-3 text-blue-500">
                    <MapPin size={20} className="font-black" />
                    <h3 className="font-black uppercase tracking-widest text-xs">
                      Punto de Entrega
                    </h3>
                  </div>
                  {address ? (
                    <div className="space-y-4 pl-8">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                          Dirección
                        </p>
                        <p className="text-lg font-bold text-zinc-900 leading-tight">
                          {address.street}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                            Ciudad
                          </p>
                          <p className="font-bold text-zinc-900">{address.city}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                            Dpto.
                          </p>
                          <p className="font-bold text-zinc-900">{address.state}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="pl-8 py-4">
                      <p className="text-zinc-400 font-bold italic">No hay dirección registrada.</p>
                    </div>
                  )}
                </div>

                {/* Producto Section */}
                <div className="bg-zinc-50 p-6 rounded-[2rem] border border-zinc-100 space-y-4">
                  <div className="flex items-center gap-3 text-zinc-900">
                    <Package size={20} className="font-black" />
                    <h3 className="font-black uppercase tracking-widest text-xs">
                      Producto Suscrito
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 pl-8">
                    <div className="w-16 h-16 bg-white rounded-2xl border border-zinc-200 flex items-center justify-center p-2 flex-shrink-0">
                      <Image
                        src={reminder.product.image}
                        alt={reminder.product.name}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-black text-zinc-900 leading-tight">
                        {reminder.product.name}
                      </p>
                      <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold mt-1">
                        <Calendar size={12} />
                        <span>
                          Siguiente:{" "}
                          {format(new Date(reminder.reminderDate), "dd 'de' MMMM", { locale: es })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-8 bg-zinc-900 flex items-center justify-between gap-6 shrink-0">
              <div className="hidden md:flex items-center gap-3 text-[var(--moiz-green)]">
                <CheckCircle2 size={24} />
                <span className="font-black uppercase tracking-[0.2em] text-[10px]">
                  Listo para enviar
                </span>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button
                  onClick={onClose}
                  className="px-8 py-4 bg-white/10 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all text-center"
                >
                  Cerrar
                </button>
                {reminder.status === "pendiente" && (
                  <button
                    disabled={isCompleting}
                    onClick={handleComplete}
                    className="flex-1 md:flex-none px-8 py-4 bg-[var(--moiz-green)] text-zinc-950 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
                  >
                    {isCompleting ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      "Completar Entrega"
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

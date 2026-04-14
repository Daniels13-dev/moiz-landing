"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, User, Package, ShieldCheck } from "lucide-react";
import SubscriptionInfoModal from "./SubscriptionInfoModal";

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
  reminderDate: Date | string;
  status: string;
  user: UserProfile;
  product: Product;
}

interface SubscriptionReminderCardProps {
  reminder: SubscriptionReminder;
}

export default function SubscriptionReminderCard({ reminder }: SubscriptionReminderCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Normalize reminder date
  const reminderDate = new Date(reminder.reminderDate);

  const address = reminder.user.addresses?.[0];
  const isLocalDelivery =
    address?.state === "Caldas" && ["Manizales", "Villamaría"].includes(address?.city || "");

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative cursor-pointer"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5 text-zinc-900 group-hover:scale-110 transition-transform duration-500">
          <Calendar size={120} className="-rotate-12 translate-x-8 -translate-y-8" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-zinc-100 text-zinc-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2">
              <Calendar size={12} />
              {format(reminderDate, "dd MMM yyyy", { locale: es })}
            </div>
            <div className="flex items-center gap-2">
              <div
                className="bg-white border border-zinc-200 text-lg p-1.5 rounded-xl shadow-sm leading-none"
                title={isLocalDelivery ? "Domicilio Local" : "Envío Nacional"}
              >
                {isLocalDelivery ? "🛵" : "🚚"}
              </div>
              <div className="bg-yellow-100 text-yellow-700 text-[8px] font-black px-2 py-1 rounded-md uppercase">
                {reminder.status === "pendiente" ? "Próximo" : "Realizado"}
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 group-hover:bg-[var(--moiz-green)]/10 group-hover:text-[var(--moiz-green)] transition-colors">
                <User size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-zinc-400 tracking-tighter">
                  Cliente
                </p>
                <p className="font-bold text-zinc-900 line-clamp-1">
                  {reminder.user.fullName || reminder.user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 group-hover:bg-[var(--moiz-green)]/10 group-hover:text-[var(--moiz-green)] transition-colors">
                <Package size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-zinc-400 tracking-tighter">
                  Producto
                </p>
                <p className="font-bold text-zinc-900 line-clamp-1">{reminder.product.name}</p>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[var(--moiz-green)] transition-all flex items-center justify-center gap-2"
          >
            Ver detalles de entrega <ShieldCheck size={16} />
          </button>
        </div>
      </div>

      <SubscriptionInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reminder={reminder}
      />
    </>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, Package, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ManageSubscriptionModal from "./ManageSubscriptionModal";

interface Product {
  id: string;
  name: string;
  image: string;
}

export interface Subscription {
  id: string;
  productId: string;
  nextBillingDate: Date | string;
  lockedPrice: number;
  deliveryCount: number;
  product: Product;
}

interface UserSubscriptionCardProps {
  subscription: Subscription;
}

export default function UserSubscriptionCard({ subscription }: UserSubscriptionCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-white border border-zinc-100 rounded-[3rem] p-8 md:p-10 shadow-sm hover:shadow-xl transition-all group flex flex-col md:flex-row gap-8 cursor-pointer relative"
      >
        <div className="w-full md:w-48 h-48 bg-zinc-50 rounded-3xl p-4 flex items-center justify-center relative overflow-hidden flex-shrink-0">
          <Image
            src={subscription.product.image}
            alt={subscription.product.name}
            width={150}
            height={150}
            className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 bg-[var(--moiz-green)] text-white text-[10px] font-black px-2 py-1 rounded-md uppercase">
            5% OFF
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 mb-2 leading-tight group-hover:text-[var(--moiz-green)] transition-colors">
              {subscription.product.name}
            </h2>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold">
                <Calendar size={14} className="text-[var(--moiz-green)]" />
                Próxima: {format(new Date(subscription.nextBillingDate), "dd MMM", { locale: es })}
              </div>
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold">
                <Package size={14} className="text-[var(--moiz-green)]" />
                Cada 30 días
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
            <div>
              <p className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">
                Precio Fijo
              </p>
              <p className="text-xl font-black text-zinc-900">
                ${subscription.lockedPrice.toLocaleString("es-CO")}
              </p>
            </div>
            <div className="w-12 h-12 bg-zinc-900 text-white rounded-full flex items-center justify-center group-hover:bg-[var(--moiz-green)] transition-all">
              <ChevronRight size={20} />
            </div>
          </div>
        </div>
      </div>

      <ManageSubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subscription={subscription}
      />
    </>
  );
}

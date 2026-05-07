"use client";

import Image from "next/image";
import { CheckCircle2, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface AddToCartToastProps {
  id: string | number;
  name: string;
  price: number;
  image: string;
  onCheckout: () => void;
}

export default function AddToCartToast({ id, name, price, image, onCheckout }: AddToCartToastProps) {
  return (
    <div className="max-w-md md:w-96 w-full bg-zinc-900 border border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden pointer-events-auto">
      <div className="p-6 md:p-8 flex items-center gap-6">
        <div className="relative h-20 w-20 bg-white rounded-2xl p-2 flex-shrink-0">
          <Image src={image} alt={name} fill className="object-contain" />
          <div className="absolute -top-2 -right-2 bg-[var(--moiz-green)] text-white p-1 rounded-full border-2 border-zinc-900">
            <CheckCircle2 size={16} />
          </div>
        </div>

        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--moiz-green)] mb-1">
            Agregado con éxito
          </p>
          <h4 className="text-xl font-bold text-white mb-1 leading-tight">{name}</h4>
          <p className="text-white/60 font-medium text-sm">
            ${price.toLocaleString("es-CO")}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-0">
        <button
          onClick={() => {
            toast.dismiss(id);
            onCheckout();
          }}
          className="w-full py-4 bg-[var(--moiz-green)] text-zinc-950 rounded-2xl font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Ir a pagar <CreditCard size={16} />
        </button>
      </div>
    </div>
  );
}

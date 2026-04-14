"use client";

import { CheckCircle2, ShoppingBag, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface SuccessViewProps {
  successOrder: {
    displayId: string;
    totalAmount: number;
    finalAmount: number;
    discountAmount: number;
    couponCode?: string;
  };
  recentCart: { id: string; name: string; quantity: number; price: number }[];
}

export default function SuccessView({ successOrder, recentCart }: SuccessViewProps) {
  const router = useRouter();

  return (
    <main className="bg-[#FAF9F6] min-h-screen flex flex-col selection:bg-[var(--moiz-green)] selection:text-white">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-12 md:pt-20 px-6 w-full pb-24">
        <div className="max-w-xl w-full bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-zinc-100 text-center">
          <div className="w-24 h-24 bg-[var(--moiz-green)] rounded-full text-zinc-950 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter mb-4">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-zinc-500 font-medium mb-10">
            Hemos recibido tu pedido correctamente. Te enviaremos los detalles adicionales a
            Whatsapp.
          </p>

          <div className="bg-zinc-50 rounded-3xl p-6 border border-zinc-100 text-left mb-8">
            <h3 className="font-black text-zinc-900 mb-4 flex items-center gap-2">
              <ShoppingBag size={18} className="text-[var(--moiz-green)]" /> Tu Compra
            </h3>
            <div className="space-y-4 mb-4">
              {recentCart.map(
                (item: { id: string; name: string; quantity: number; price: number }) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="font-bold text-zinc-700">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-black text-zinc-900">
                      ${(item.price * item.quantity).toLocaleString("es-CO")}
                    </span>
                  </div>
                ),
              )}
            </div>

            {successOrder.couponCode && (
              <div className="border-t border-zinc-100 py-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-zinc-500">Subtotal</span>
                  <span className="font-black text-zinc-900">
                    ${successOrder.totalAmount.toLocaleString("es-CO")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-[var(--moiz-green)]">
                  <span className="font-bold">Descuento ({successOrder.couponCode})</span>
                  <span className="font-black">
                    -${successOrder.discountAmount.toLocaleString("es-CO")}
                  </span>
                </div>
              </div>
            )}

            <div className="border-t border-zinc-200 pt-4 flex justify-between items-center">
              <span className="font-bold text-zinc-500">Total pagado</span>
              <span className="text-xl font-black text-[var(--moiz-green)]">
                ${successOrder.finalAmount.toLocaleString("es-CO")}
              </span>
            </div>
          </div>

          <div className="bg-[var(--moiz-green)]/10 border-2 border-[var(--moiz-green)]/20 p-8 rounded-[2.5rem] mb-10 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-[var(--moiz-green)]">
              <Truck size={120} className="-rotate-12 translate-x-4 -translate-y-4" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-black text-zinc-900 mb-2">Rastrea tu pedido</h3>
              <p className="text-sm font-medium text-zinc-700 mb-6 leading-relaxed">
                Dado que has comprado como invitado, para conocer el estado y rastrear tu pedido en
                cualquier momento, deberás ingresar a nuestra zona de rastreo utilizando tu número
                de <b>Identificación (Cédula/NIT)</b> y tu <b>ID de pedido</b>:
              </p>
              <div className="bg-white px-6 py-4 rounded-2xl flex items-center justify-between shadow-sm mb-6 border border-[var(--moiz-green)]/30">
                <span className="text-zinc-500 font-bold uppercase tracking-widest text-[#71717A] text-[10px]">
                  ID de Pedido
                </span>
                <span className="text-2xl font-black text-zinc-900 tracking-tight">
                  {successOrder.displayId}
                </span>
              </div>
              <button
                onClick={() => router.push("/rastrear-mi-pedido")}
                className="w-full py-4 bg-[var(--moiz-green)] text-zinc-950 rounded-full font-black text-base hover:scale-[1.02] shadow-xl shadow-[var(--moiz-green)]/20 transition-all active:scale-95"
              >
                Ir a Rastrear mi Pedido
              </button>
            </div>
          </div>

          <button
            onClick={() => router.push("/productos")}
            className="text-zinc-500 font-bold text-sm hover:text-[var(--moiz-green)] transition-colors"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
      <Footer />
    </main>
  );
}

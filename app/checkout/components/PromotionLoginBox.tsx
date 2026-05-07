"use client";

import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PromotionLoginBox() {
  const router = useRouter();

  return (
    <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <div className="w-14 h-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
          <LogIn size={24} />
        </div>
        <div>
          <p className="font-black text-zinc-900 text-lg">¿Ya tienes una cuenta?</p>
          <p className="text-sm text-zinc-500 font-medium tracking-tight leading-relaxed">
            Inicia sesión para usar tus datos guardados y comprar más rápido.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => router.push("/login?next=/checkout")}
        className="w-full md:w-auto px-10 py-4 bg-zinc-900 text-white rounded-full font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-zinc-900/10 active:scale-95"
      >
        Iniciar Sesión
      </button>
    </div>
  );
}

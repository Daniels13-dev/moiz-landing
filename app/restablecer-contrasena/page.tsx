"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "../auth/actions";
import { Mail, ArrowLeft, Loader2, Key, CheckCircle2, AlertCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await resetPassword(formData);
    
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(result.success);
    }
  };

  return (
    <main className="bg-[#FAF9F6] min-h-screen flex items-center justify-center p-6 sm:p-10">
      <div className="max-w-xl w-full mx-auto flex flex-col gap-6 py-12">
        {/* Back Link */}
        <div className="flex justify-start w-full">
          <Link
            href="/login"
            className="flex items-center gap-2 text-zinc-400 hover:text-[var(--moiz-green)] font-bold text-sm transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Volver al login
          </Link>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-zinc-100 w-full max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Key size={32} />
            </div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tighter mb-2">
              Recuperar Acceso
            </h1>
            <p className="text-zinc-500 font-semibold md:text-base text-sm tracking-tight">
              Ingresa tu correo y te enviaremos las instrucciones.
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 pl-4">Correo Electrónico</label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[var(--moiz-green)] transition-colors"
                    size={18}
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="tu@correo.com"
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-full focus:outline-none focus:ring-4 focus:ring-[var(--moiz-green)]/10 focus:border-[var(--moiz-green)] transition-all font-semibold text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-5 rounded-3xl flex items-center gap-4 text-sm font-black border border-red-100 animate-shake shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <AlertCircle size={20} />
                  </div>
                  {error}
                </div>
              )}

              <button
                disabled={loading}
                className="w-full bg-[var(--moiz-green)] text-white py-3 rounded-full font-bold shadow-[0_8px_20px_rgba(106,142,42,0.25)] hover:shadow-[0_12px_25px_rgba(106,142,42,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all text-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100 disabled:translate-y-0"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Enviar Instrucciones"}
              </button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-6">
              <div className="bg-green-50 p-6 rounded-[2rem] border border-green-100 flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={28} />
                </div>
                <div className="space-y-1">
                  <p className="font-black text-green-900 leading-tight text-lg">¡Correo enviado!</p>
                  <p className="text-green-700 font-medium text-sm leading-relaxed">
                    {success}
                  </p>
                </div>
              </div>
              
              <Link
                href="/login"
                className="inline-block font-black text-sm text-[var(--moiz-green)] hover:underline uppercase tracking-widest"
              >
                Volver a intentar ingresar
              </Link>
            </div>
          )}

          <div className="mt-10 text-center border-t border-zinc-50 pt-8">
            <p className="text-xs text-zinc-400 font-bold leading-relaxed">
              Si no recibes el correo en unos minutos, revisa tu carpeta de SPAM o correo no deseado.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

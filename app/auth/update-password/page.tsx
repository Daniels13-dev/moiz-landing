"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Lock, Eye, EyeOff, Loader2, Save, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  };

  const handleBack = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <main className="bg-[#FAF9F6] min-h-screen flex items-center justify-center p-6 sm:p-10">
      <div className="max-w-xl w-full mx-auto flex flex-col gap-6 py-12">
        {/* Back Link */}
        <div className="flex justify-start w-full">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-zinc-400 hover:text-[var(--moiz-green)] font-bold text-sm transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </button>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-zinc-100 w-full max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Lock size={32} />
          </div>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tighter mb-2">
            Nueva Contraseña
          </h1>
          <p className="text-zinc-500 font-semibold md:text-base text-sm tracking-tight">
            Ingresa tu nueva clave de acceso para continuar.
          </p>
        </div>

        {!success ? (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 pl-4">Nueva Contraseña</label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[var(--moiz-green)] transition-colors"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full pl-11 pr-12 py-3 bg-zinc-50 border border-zinc-200 rounded-full focus:outline-none focus:ring-4 focus:ring-[var(--moiz-green)]/10 focus:border-[var(--moiz-green)] transition-all font-semibold text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 pl-4">Confirmar Contraseña</label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[var(--moiz-green)] transition-colors"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Repite tu contraseña"
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-full focus:outline-none focus:ring-4 focus:ring-[var(--moiz-green)]/10 focus:border-[var(--moiz-green)] transition-all font-semibold text-sm"
                  />
                </div>
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
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Actualizando...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Guardar Nueva Contraseña
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-4 space-y-6">
            <div className="bg-green-50 p-6 rounded-[2rem] border border-green-100 flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <CheckCircle2 size={28} />
              </div>
              <div className="space-y-1">
                <p className="font-black text-green-900 leading-tight text-lg">¡Cambio exitoso!</p>
                <p className="text-green-700 font-medium text-sm leading-relaxed">
                  Tu contraseña ha sido actualizada. Serás redirigido al login en segundos...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </main>
);
}

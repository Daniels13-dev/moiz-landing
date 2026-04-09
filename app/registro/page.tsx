"use client";
import { useState } from "react";
import Link from "next/link";
import { signup, signInWithGoogle } from "../auth/actions";
import {
  UserPlus,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
  User,
  Phone,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";

export default function RegistroPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const formData = new FormData(e.currentTarget);

    // Client-side password validation
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      setLoading(false);
      return;
    }

    if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      setError(
        "La contraseña debe contener al menos una mayúscula, una minúscula y un número.",
      );
      setLoading(false);
      return;
    }

    const result = (await signup(formData)) as {
      error?: string;
      success?: string;
    };

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      setSuccess(result.success);
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#FAF9F6] min-h-screen flex items-center justify-center p-6 sm:p-10">
      <div className="max-w-2xl w-full mx-auto flex flex-col gap-6 py-12">
        {/* Back Link */}
        <div className="flex justify-start w-full">
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-400 hover:text-[var(--moiz-green)] font-bold text-sm transition-colors group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Volver al Inicio
          </Link>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-zinc-100 w-full mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <UserPlus size={32} />
            </div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tighter mb-2">
              Crear Cuenta
            </h1>
            <p className="text-zinc-500 font-semibold md:text-base text-sm tracking-tight">
              Únete a la familia Möiz Pets.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 pl-4">
                Nombre Completo
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[var(--moiz-green)] transition-colors"
                  size={18}
                />
                <input
                  name="fullName"
                  type="text"
                  required
                  placeholder="Tu nombre y apellido"
                  className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-full focus:outline-none focus:ring-4 focus:ring-[var(--moiz-green)]/10 focus:border-[var(--moiz-green)] transition-all font-semibold text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 pl-4">
                  Correo Electrónico
                </label>
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

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 pl-4">
                  Teléfono / WhatsApp
                </label>
                <div className="relative group">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[var(--moiz-green)] transition-colors"
                    size={18}
                  />
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="310 123 4567"
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-full focus:outline-none focus:ring-4 focus:ring-[var(--moiz-green)]/10 focus:border-[var(--moiz-green)] transition-all font-semibold text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 pl-4">
                  Contraseña
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[var(--moiz-green)] transition-colors"
                    size={18}
                  />
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-full focus:outline-none focus:ring-4 focus:ring-[var(--moiz-green)]/10 focus:border-[var(--moiz-green)] transition-all font-semibold text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 pl-4">
                  Confirmar Contraseña
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[var(--moiz-green)] transition-colors"
                    size={18}
                  />
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-full focus:outline-none focus:ring-4 focus:ring-[var(--moiz-green)]/10 focus:border-[var(--moiz-green)] transition-all font-semibold text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 group cursor-pointer pl-2">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="peer appearance-none w-5 h-5 border-2 border-zinc-200 rounded-md bg-white checked:bg-[var(--moiz-green)] checked:border-[var(--moiz-green)] transition-all cursor-pointer hover:border-[var(--moiz-green)]/50 focus:ring-2 focus:ring-[var(--moiz-green)]/20"
                />
                <svg
                  className="absolute w-3.5 h-3.5 text-white pointer-events-none hidden peer-checked:block left-0.5 top-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <label
                htmlFor="terms"
                className="text-zinc-500 font-bold text-sm cursor-pointer select-none"
              >
                Acepto los{" "}
                <Link
                  href="/terminos"
                  className="text-[var(--moiz-green)] hover:underline"
                >
                  términos y condiciones
                </Link>
              </label>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-[1.5rem] flex items-center gap-3 text-sm font-bold border border-red-100 animate-shake shadow-sm">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertCircle size={18} />
                </div>
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 p-4 rounded-[1.5rem] flex items-center gap-3 text-sm font-bold border border-green-100 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <CheckCircle size={18} />
                </div>
                {success}
              </div>
            )}

            <button
              disabled={loading || !!success}
              className="w-full bg-[var(--moiz-green)] text-white py-3 rounded-full font-bold shadow-[0_8px_20px_rgba(106,142,42,0.25)] hover:shadow-[0_12px_25px_rgba(106,142,42,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all text-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100 disabled:translate-y-0"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Comenzar Ahora"
              )}
            </button>
          </form>

          <div className="mt-8 mb-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-100" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              O regístrate con
            </span>
            <div className="h-px flex-1 bg-zinc-100" />
          </div>

          <button
            type="button"
            onClick={() => signInWithGoogle()}
            className="w-full bg-white border border-zinc-200 py-3 rounded-full font-bold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-3 text-sm"
          >
            <FaGoogle size={18} className="text-[#4285F4]" />
            Registrarme con Google
          </button>

          <div className="mt-8 text-center">
            <p className="text-zinc-500 font-medium text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/login"
                className="text-[var(--moiz-green)] hover:underline font-bold ml-1"
              >
                Inicia Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

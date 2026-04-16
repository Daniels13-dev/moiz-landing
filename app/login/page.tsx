"use client";
import { useState } from "react";
import Link from "next/link";
import { login, signInWithGoogle } from "../auth/actions";
import { LogIn, Mail, Lock, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { siteConfig } from "@/config/site";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#FAF9F6] min-h-screen flex items-center justify-center p-6 sm:p-10">
      <div className="max-w-xl w-full mx-auto flex flex-col gap-6 py-12">
        {/* Back Link */}
        <div className="flex justify-start w-full">
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-400 hover:text-[var(--moiz-green)] font-bold text-sm transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            {siteConfig.ui.login.back}
          </Link>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-zinc-100 w-full max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <LogIn size={32} />
            </div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tighter mb-2">
              {siteConfig.ui.login.title}
            </h1>
            <p className="text-zinc-500 font-semibold md:text-base text-sm tracking-tight">
              {siteConfig.ui.login.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 pl-4">{siteConfig.ui.login.email}</label>
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
                <label className="text-xs font-bold text-zinc-500 pl-4">{siteConfig.ui.login.password}</label>
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
              {loading ? <Loader2 className="animate-spin" size={20} /> : siteConfig.ui.login.cta}
            </button>
          </form>

          <div className="mt-8 mb-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-100" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {siteConfig.ui.login.orContinue}
            </span>
            <div className="h-px flex-1 bg-zinc-100" />
          </div>

          <button
            type="button"
            onClick={() => signInWithGoogle()}
            className="w-full bg-white border border-zinc-200 py-3 rounded-full font-bold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-3 text-sm"
          >
            <FaGoogle size={18} className="text-[#4285F4]" />
            {siteConfig.ui.login.google}
          </button>

          <div className="mt-8 text-center">
            <p className="text-zinc-500 font-medium text-sm">
              {siteConfig.ui.login.noAccount}
              <Link
                href="/registro"
                className="text-[var(--moiz-green)] hover:underline font-bold ml-1"
              >
                {siteConfig.ui.login.register}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

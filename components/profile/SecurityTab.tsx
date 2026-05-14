"use client";

import { useState } from "react";
import { Lock, Trash2, ShieldCheck, AlertTriangle, Loader2, Save } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

interface SecurityTabProps {
  onDeleteAccount: () => void;
}

export default function SecurityTab({ onDeleteAccount }: SecurityTabProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Contraseña actualizada correctamente");
      setPassword("");
      setConfirmPassword("");
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      {/* Change Password Section */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] rounded-xl flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 tracking-tight">Cambiar Contraseña</h2>
            <p className="text-sm text-zinc-500 font-medium">Mantén tu cuenta segura.</p>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="w-full space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 pl-4 uppercase tracking-wider">Nueva Contraseña</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[var(--moiz-green)] transition-colors" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[var(--moiz-green)]/10 focus:border-[var(--moiz-green)] transition-all font-semibold text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 pl-4 uppercase tracking-wider">Confirmar Nueva Contraseña</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[var(--moiz-green)] transition-colors" size={18} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[var(--moiz-green)]/10 focus:border-[var(--moiz-green)] transition-all font-semibold text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-zinc-900 text-white py-3 rounded-2xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-zinc-200"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Actualizar Contraseña
          </button>
        </form>
      </section>

      <hr className="border-zinc-100" />

      {/* Danger Zone */}
      <section>
        <div className="bg-red-50/50 border border-red-100 p-8 rounded-[2rem]">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-red-900 tracking-tight">Zona de Peligro</h3>
              <p className="text-sm text-red-700/70 font-medium">Acciones críticas para tu cuenta.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-md">
              <h4 className="font-bold text-red-900 text-sm mb-1">Eliminar mi cuenta definitivamente</h4>
              <p className="text-xs text-red-700/60 font-medium leading-relaxed">
                Una vez eliminada la cuenta, no podrás recuperar tus pedidos, favoritos ni suscripciones. Esta acción es irreversible.
              </p>
            </div>
            <button
              onClick={onDeleteAccount}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-700 transition-all shadow-xl shadow-red-200 shrink-0"
            >
              <Trash2 size={16} />
              Eliminar Cuenta
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

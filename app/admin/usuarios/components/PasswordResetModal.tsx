"use client";

import { Key, X, EyeOff, Eye, Loader2, Save } from "lucide-react";
import { UserProfile } from "../types";
import { useState } from "react";

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  isChangingPassword: boolean;
  onUpdate: (password: string) => Promise<void>;
}

export default function PasswordResetModal({ isOpen, onClose, user, isChangingPassword, onUpdate }: PasswordResetModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(newPassword);
    setNewPassword("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
        onClick={() => !isChangingPassword && onClose()}
      />
      <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-amber-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Key size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-zinc-900 tracking-tight">Cambiar Contraseña</h3>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{user.full_name || user.email}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
              <p className="text-xs font-bold text-amber-700 leading-relaxed">
                ⚠️ Estás forzando una nueva contraseña para este usuario. El cambio será inmediato y el usuario deberá usar la nueva clave para ingresar.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">
                Nueva Contraseña
              </label>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-amber-500 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full pl-12 pr-12 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-bold text-zinc-900"
                  required
                  minLength={8}
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
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isChangingPassword}
              className="flex-1 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-100 transition-all disabled:opacity-50 text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isChangingPassword || !newPassword}
              className="flex-1 bg-amber-500 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Confirmar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

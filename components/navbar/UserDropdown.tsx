"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ChevronDown,
  LayoutDashboard,
  MapPin,
  Package,
  Clock,
  Heart,
  LogOut,
} from "lucide-react";

interface AuthUser {
  user_metadata?: { full_name?: string };
  email?: string;
  role?: string;
}

interface UserDropdownProps {
  user: any;
  userDropdownOpen: boolean;
  setUserDropdownOpen: (open: boolean) => void;
  handleLogout: () => void;
}

export default function UserDropdown({
  user,
  userDropdownOpen,
  setUserDropdownOpen,
  handleLogout,
}: UserDropdownProps) {
  const authUser = user as AuthUser;

  return (
    <div className="relative">
      <button
        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
        className="flex items-center gap-2 text-sm font-bold text-zinc-700 hover:text-[var(--moiz-green)] transition-colors border border-zinc-200 px-4 py-2 rounded-full bg-white hover:border-[var(--moiz-green)] hover:shadow-sm"
      >
        <div className="w-5 h-5 bg-[var(--moiz-green)] text-white rounded-full flex items-center justify-center">
          <User size={12} />
        </div>
        <ChevronDown
          size={14}
          className={`transition-transform ${userDropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {userDropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-zinc-100 overflow-hidden flex flex-col z-[50]"
            >
              <div className="px-5 py-4 bg-zinc-50 border-b border-zinc-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--moiz-green)] text-white rounded-full flex items-center justify-center shadow-inner flex-shrink-0">
                  <User size={20} />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <p className="text-sm font-black text-zinc-900 truncate">
                    {authUser?.user_metadata?.full_name || "Usuario Möiz"}
                  </p>
                  <p className="text-xs font-medium text-zinc-500 truncate">{authUser?.email}</p>
                </div>
              </div>

              <div className="p-2 flex flex-col">
                {authUser?.role?.toUpperCase() === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-black text-zinc-900 hover:text-[var(--moiz-green)] hover:bg-[var(--moiz-green)]/10 rounded-xl transition-colors bg-zinc-100/80 mb-1"
                  >
                    <LayoutDashboard size={16} className="text-[var(--moiz-green)]" />
                    Panel de Control
                  </Link>
                )}
                <Link
                  href="/perfil"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-zinc-600 hover:text-[var(--moiz-green)] hover:bg-[var(--moiz-green)]/10 rounded-xl transition-colors"
                >
                  <MapPin size={16} />
                  Mi Perfil
                </Link>
                <Link
                  href="/pedidos"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-zinc-600 hover:text-[var(--moiz-green)] hover:bg-[var(--moiz-green)]/10 rounded-xl transition-colors"
                >
                  <Package size={16} />
                  Mis Pedidos
                </Link>
                <Link
                  href="/suscripciones"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-zinc-600 hover:text-[var(--moiz-green)] hover:bg-[var(--moiz-green)]/10 rounded-xl transition-colors"
                >
                  <Clock size={16} />
                  Mis Suscripciones
                </Link>
                <Link
                  href="/favoritos"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-zinc-600 hover:text-[var(--moiz-green)] hover:bg-[var(--moiz-green)]/10 rounded-xl transition-colors"
                >
                  <Heart size={16} />
                  Mis Favoritos
                </Link>
              </div>
              <div className="p-2 border-t border-zinc-100">
                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full text-left"
                >
                  <LogOut size={16} />
                  Cerrar Sesión
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

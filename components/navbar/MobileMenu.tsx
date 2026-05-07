"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, LogOut, User } from "lucide-react";
import { siteConfig } from "@/config/site";
import { usePathname } from "next/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  loading: boolean;
  handleLogout: () => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
  user,
  loading,
  handleLogout,
}: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-zinc-900/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[70] w-full max-w-sm bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-zinc-100">
              <span className="font-extrabold text-2xl tracking-tighter text-[var(--moiz-green)]">
                Möiz
              </span>
              <button
                onClick={onClose}
                className="p-2 bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-8 flex flex-col gap-6">
              <nav className="flex flex-col gap-6">
                {siteConfig.navMain.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-2xl font-black transition-colors ${
                      pathname === item.href
                        ? "text-[var(--moiz-green)]"
                        : "text-zinc-800 hover:text-[var(--moiz-green)]"
                    }`}
                    onClick={onClose}
                  >
                    {item.title}
                  </Link>
                ))}
                <div className="h-px w-full bg-zinc-100 my-2" />
                <Link
                  href="/#clientes"
                  onClick={onClose}
                  className="text-xl font-bold text-zinc-500 hover:text-[var(--moiz-green)] transition-colors"
                >
                  Reseñas de Clientes
                </Link>
                <Link
                  href="/#faq"
                  onClick={onClose}
                  className="text-xl font-bold text-zinc-500 hover:text-[var(--moiz-green)] transition-colors"
                >
                  Preguntas Frecuentes
                </Link>
              </nav>
            </div>

            <div className="p-6 border-t border-zinc-100 bg-zinc-50">
              {!loading &&
                (user ? (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/pedidos"
                      onClick={onClose}
                      className="flex items-center justify-center gap-2 w-full py-4 bg-white border border-zinc-200 text-zinc-900 font-bold rounded-2xl shadow-sm text-lg"
                    >
                      <Package size={20} />
                      Mis Pedidos
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        onClose();
                      }}
                      className="flex items-center justify-center gap-2 w-full py-4 text-red-500 font-bold text-lg hover:bg-red-50 rounded-2xl transition-colors"
                    >
                      <LogOut size={20} />
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-[var(--moiz-green)] text-white font-bold rounded-2xl shadow-[0_8px_20px_rgba(106,142,42,0.25)] text-lg"
                  >
                    <User size={20} />
                    Iniciar Sesión
                  </Link>
                ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

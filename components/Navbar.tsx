"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Menu,
  X,
  Package,
  LogOut,
  User,
  ChevronDown,
  MapPin,
  LayoutDashboard,
  Heart,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useScroll } from "@/hooks/use-scroll";
import { siteConfig } from "@/config/site";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const { totalItems } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  
  // Refactor: Hooks personalizados para lógica de negocio
  const { user, loading, logout } = useAuth();
  const isScrolled = useScroll(20);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  // We make it sticky top-0, z-50.
  return (
    <>
      <header
        className={`sticky top-0 w-full z-50 transition-all duration-300 ${
          isScrolled || pathname !== "/"
            ? "bg-white/90 backdrop-blur-xl border-b border-zinc-200/50 shadow-sm py-3"
            : "bg-white/0 border-b border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between relative">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo/logo.png"
                alt="Möiz"
                width={38}
                height={38}
                className="object-contain"
              />
            </div>
            <span className="font-extrabold text-2xl tracking-tighter text-zinc-900 group-hover:text-[var(--moiz-green)] transition-colors">
              Möiz
            </span>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 bg-white/50 px-8 py-2.5 rounded-full border border-zinc-100 backdrop-blur-md absolute left-1/2 -translate-x-1/2">
            {siteConfig.navMain.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-bold transition-colors ${
                  pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                    ? "text-[var(--moiz-green)]"
                    : "text-zinc-600 hover:text-[var(--moiz-green)]"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Right Actions Section (Desktop) */}
          <div className="hidden md:flex items-center gap-4 relative">
            {!loading &&
              (user ? (
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
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setUserDropdownOpen(false)}
                        />
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
                                {(
                                  user as {
                                    user_metadata?: { full_name?: string };
                                    email?: string;
                                    role?: string;
                                  }
                                )?.user_metadata?.full_name || "Usuario Möiz"}
                              </p>
                              <p className="text-xs font-medium text-zinc-500 truncate">
                                {
                                  (
                                    user as {
                                      user_metadata?: { full_name?: string };
                                      email?: string;
                                      role?: string;
                                    }
                                  )?.email
                                }
                              </p>
                            </div>
                          </div>

                          <div className="p-2 flex flex-col">
                            {(
                              user as {
                                user_metadata?: { full_name?: string };
                                email?: string;
                                role?: string;
                              }
                            )?.role?.toUpperCase() === "ADMIN" && (
                              <Link
                                href="/admin"
                                onClick={() => setUserDropdownOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 text-sm font-black text-zinc-900 hover:text-[var(--moiz-green)] hover:bg-[var(--moiz-green)]/10 rounded-xl transition-colors bg-zinc-100/80 mb-1"
                              >
                                <LayoutDashboard
                                  size={16}
                                  className="text-[var(--moiz-green)]"
                                />
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
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-sm font-bold text-zinc-600 hover:text-[var(--moiz-green)] transition-colors border border-zinc-200 px-4 py-2 rounded-full bg-white hover:border-[var(--moiz-green)] hover:shadow-sm"
                >
                  <User size={18} />
                  <span>Ingresar</span>
                </Link>
              ))}

            {/* Cart Trigger */}
            <Link
              href="/carrito"
              className="group relative flex items-center gap-2 bg-[var(--moiz-green)] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-[0_8px_20px_rgba(106,142,42,0.25)] hover:shadow-[0_12px_25px_rgba(106,142,42,0.4)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <ShoppingBag size={18} />
              <span>Carrito</span>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="flex items-center justify-center bg-white text-[var(--moiz-green)] text-[11px] font-black min-w-[20px] h-[20px] px-1.5 rounded-full ml-1"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* Mobile Right Actions */}
          <div className="flex justify-end md:hidden items-center gap-3">
            {!loading && !user && (
              <Link
                href="/login"
                className="p-2.5 bg-zinc-100 text-zinc-700 rounded-full transition-colors"
              >
                <User size={20} />
              </Link>
            )}
            <Link
              href="/carrito"
              className="relative p-2.5 bg-[var(--moiz-green)] text-white rounded-full transition-colors active:scale-95"
            >
              <ShoppingBag size={20} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold min-w-[20px] h-[20px] px-1 rounded-full border-[2px] border-white"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 bg-zinc-900 text-white rounded-full transition-colors active:scale-95"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sliding Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[60] bg-zinc-900/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
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
                  onClick={() => setMobileMenuOpen(false)}
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
                        pathname === item.href ? "text-[var(--moiz-green)]" : "text-zinc-800 hover:text-[var(--moiz-green)]"
                      }`}
                    >
                      {item.title}
                    </Link>
                  ))}
                  <div className="h-px w-full bg-zinc-100 my-2" />
                  <Link
                    href="/#clientes"
                    className="text-xl font-bold text-zinc-500 hover:text-[var(--moiz-green)] transition-colors"
                  >
                    Reseñas de Clientes
                  </Link>
                  <Link
                    href="/#faq"
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
                        className="flex items-center justify-center gap-2 w-full py-4 bg-white border border-zinc-200 text-zinc-900 font-bold rounded-2xl shadow-sm text-lg"
                      >
                        <Package size={20} />
                        Mis Pedidos
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full py-4 text-red-500 font-bold text-lg hover:bg-red-50 rounded-2xl transition-colors"
                      >
                        <LogOut size={20} />
                        Cerrar Sesión
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
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
    </>
  );
}

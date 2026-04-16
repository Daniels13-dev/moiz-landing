"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, User, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useScroll } from "@/hooks/use-scroll";
import { siteConfig } from "@/config/site";

// Sub-components
import UserDropdown from "./navbar/UserDropdown";
import MobileMenu from "./navbar/MobileMenu";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { totalItems } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const { user, loading, logout } = useAuth();
  const isScrolled = useScroll(20);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
  };

  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

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
                src="https://res.cloudinary.com/dvyqtn7gy/image/upload/v1776223130/moiz/logo/logo.png"
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
            <button
              onClick={() => router.push("/productos?search=focus")}
              className="p-2.5 text-zinc-500 hover:text-[var(--moiz-green)] hover:bg-[var(--moiz-green)]/10 rounded-full transition-all"
              title="Buscar productos"
            >
              <Search size={20} />
            </button>
            {!loading &&
              (user ? (
                <UserDropdown
                  user={user}
                  userDropdownOpen={userDropdownOpen}
                  setUserDropdownOpen={setUserDropdownOpen}
                  handleLogout={handleLogout}
                />
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-sm font-bold text-zinc-600 hover:text-[var(--moiz-green)] transition-colors border border-zinc-200 px-4 py-2 rounded-full bg-white hover:border-[var(--moiz-green)] hover:shadow-sm"
                >
                  <User size={18} />
                  <span>{siteConfig.ui.ingresar}</span>
                </Link>
              ))}

            {/* Cart Trigger with Pulse Animation */}
            <Link
              href="/carrito"
              className="group relative flex items-center gap-2 bg-[var(--moiz-green)] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-[0_8px_20px_rgba(106,142,42,0.25)] hover:shadow-[0_12px_25px_rgba(106,142,42,0.4)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <motion.div
                key={totalItems}
                initial={{ scale: 1 }}
                animate={{ scale: totalItems > 0 ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2"
              >
                <ShoppingBag size={18} />
                <span>{siteConfig.ui.carrito}</span>
              </motion.div>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key={`count-${totalItems}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
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
            <button
              onClick={() => router.push("/productos?search=focus")}
              className="p-2.5 text-zinc-500 hover:text-[var(--moiz-green)] active:bg-zinc-100 rounded-full transition-colors"
            >
              <Search size={20} />
            </button>
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

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        loading={loading}
        handleLogout={handleLogout}
      />
    </>
  );
}

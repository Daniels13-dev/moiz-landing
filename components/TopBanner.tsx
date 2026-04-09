"use client";

// motion unused
import { usePathname } from "next/navigation";

export default function TopBanner() {
  const pathname = usePathname();

  // Hide on admin, login, and registro routes
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/registro")
  )
    return null;

  return (
    <div className="bg-[var(--moiz-green)] text-white py-2.5 px-4 text-center">
      <p className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em]">
        ENVÍO GRATIS por compras mayores a $400.000*
      </p>
    </div>
  );
}

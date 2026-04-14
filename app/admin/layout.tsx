import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { logout } from "@/app/auth/actions";
import { LogOut, Home, Clock } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Robust server-side role check bypassing any RLS using Prisma
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (profile?.role?.toUpperCase() !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* Admin Topbar */}
      <header className="bg-white border-b border-zinc-200 py-3 px-6 md:px-10 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex flex-col">
          <span className="font-black text-xl text-zinc-900 tracking-tight leading-none">
            Möiz<span className="text-[var(--moiz-green)] ml-1">Admin</span>
          </span>
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest mt-1">
            Panel de Control
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-zinc-600 hover:text-[var(--moiz-green)] transition-all bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-full hover:border-[var(--moiz-green)]"
          >
            <Home size={16} />
            Tienda
          </Link>
          <Link
            href="/admin/suscripciones"
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-zinc-600 hover:text-[var(--moiz-green)] transition-all bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-full hover:border-[var(--moiz-green)]"
          >
            <Clock size={16} />
            Suscripciones
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-2 text-sm font-bold text-red-500 bg-white hover:bg-red-50 hover:text-red-600 transition-colors border border-red-100 hover:border-red-200 px-4 py-2.5 rounded-full shadow-sm"
            >
              <LogOut size={16} />
              Salir
            </button>
          </form>
        </div>
      </header>

      <main className="pt-10 pb-20">{children}</main>
    </div>
  );
}

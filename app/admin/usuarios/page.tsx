import prisma from "@/lib/prisma";
import Link from "next/link";
import { Users, ArrowLeft } from "lucide-react";
import UserTable from "./UserTable";

export default async function AdminUsersPage() {
  const users = await prisma.profile.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Prisma model returns camelCased `fullName`; the UserTable expects `full_name`.
  // Map the records to include the expected property to satisfy the component's prop type.
  const normalizedUsers = (users as any[]).map((u) => ({
    ...u,
    full_name: (u as unknown as { fullName?: string }).fullName ?? null,
  }));

  return (
    <div className="max-w-6xl mx-auto px-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-zinc-400 font-bold text-sm hover:text-[var(--moiz-green)] transition-colors group mb-8"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Volver al panel
      </Link>
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[var(--moiz-green)] text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4 shadow-lg shadow-[var(--moiz-green)]/20">
              <Users size={14} />
              Gestión de Comunidad
            </div>
            <h1 className="text-5xl font-black text-zinc-900 tracking-tighter">
              Usuarios Registrados
            </h1>
            <p className="text-zinc-500 mt-2 font-medium text-lg">
              Administra los perfiles, roles y accesos de la plataforma.
            </p>
          </div>
        </div>
      </div>

      <UserTable initialUsers={normalizedUsers} />
    </div>
  );
}

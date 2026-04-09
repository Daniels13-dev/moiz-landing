"use client";

import { useState } from "react";
import {
  Search,
  Shield,
  User,
  Phone,
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
} from "lucide-react";
import { updateUserRole } from "../actions";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  createdAt: Date;
}

interface UserTableProps {
  initialUsers: UserProfile[];
}

export default function UserTable({ initialUsers }: UserTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [updating, setUpdating] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search);

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";

    if (
      !confirm(`¿Estás seguro de cambiar el rol de este usuario a ${newRole}?`)
    )
      return;

    setUpdating(userId);
    const result = await updateUserRole(userId, newRole);
    setUpdating(null);

    if (result.success) {
      toast.success(`Rol actualizado a ${newRole} correctamente`);
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
    } else {
      toast.error(result.error || "Error al actualizar rol");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[var(--moiz-green)] transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--moiz-green)]/20 focus:border-[var(--moiz-green)] transition-all shadow-sm"
          />
        </div>
        <div className="relative group">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none pl-6 pr-12 py-3 bg-white border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--moiz-green)]/20 font-bold text-zinc-600 cursor-pointer shadow-sm min-w-[200px] transition-all"
          >
            <option value="ALL">Todos los Roles</option>
            <option value="ADMIN">Administradores</option>
            <option value="USER">Usuarios (Clientes)</option>
          </select>
          <ChevronDown
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-[var(--moiz-green)] pointer-events-none transition-colors"
            size={18}
          />
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white border border-zinc-100 rounded-[2rem] shadow-xl shadow-zinc-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">
                  Usuario
                </th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">
                  Contacto
                </th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">
                  Rol
                </th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">
                  Registro
                </th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-zinc-400 text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="group hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm ${user.role === "ADMIN" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600"}`}
                        >
                          {user.full_name
                            ? user.full_name[0].toUpperCase()
                            : user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-black text-zinc-900 leading-tight">
                            {user.full_name || "Sin nombre"}
                          </div>
                          <div className="text-sm text-zinc-500 font-medium">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-bold text-zinc-700">
                          <Phone size={14} className="text-zinc-300" />
                          {user.phone || "No registrado"}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                          <Shield size={14} className="text-zinc-200" />
                          ID: {user.id.slice(0, 8)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          user.role === "ADMIN"
                            ? "bg-zinc-900 text-white border-zinc-900"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200"
                        }`}
                      >
                        {user.role === "ADMIN" ? (
                          <ShieldCheck size={12} />
                        ) : (
                          <User size={12} />
                        )}
                        {user.role === "ADMIN" ? "Administrador" : "Usuario"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-zinc-700">
                          {format(new Date(user.createdAt), "d 'de' MMM", {
                            locale: es,
                          })}
                        </span>
                        <span className="text-xs text-zinc-400 font-medium">
                          {format(new Date(user.createdAt), "yyyy")}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => handleRoleToggle(user.id, user.role)}
                        disabled={updating === user.id}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                          user.role === "ADMIN"
                            ? "text-red-500 border-red-100 hover:bg-red-50"
                            : "text-[var(--moiz-green)] border-[var(--moiz-green)]/10 hover:bg-[var(--moiz-green)]/5"
                        } disabled:opacity-50`}
                      >
                        {updating === user.id
                          ? "..."
                          : user.role === "ADMIN"
                            ? "Quitar Admin"
                            : "Hacer Admin"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-zinc-400">
                      <Search size={48} strokeWidth={1} className="mb-2" />
                      <p className="font-bold text-lg">
                        No se encontraron usuarios
                      </p>
                      <p className="text-sm">
                        Prueba con otros términos de búsqueda.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-8 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            {filteredUsers.length} Usuarios mostrados
          </span>
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
            <ShieldAlert size={14} className="text-zinc-300" />
            Atención: Los cambios de rol son inmediatos.
          </div>
        </div>
      </div>
    </div>
  );
}

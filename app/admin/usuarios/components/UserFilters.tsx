"use client";

import { Search, ChevronDown } from "lucide-react";

interface UserFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
}

export default function UserFilters({ search, setSearch, roleFilter, setRoleFilter }: UserFiltersProps) {
  return (
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
  );
}

"use client";

import { Search, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    params.set("page", "1"); // Reset to first page on search

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className="relative group w-full mb-8">
      <div className="relative">
        <Search
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
            isPending ? "text-[var(--moiz-green)] animate-pulse" : "text-zinc-400 group-focus-within:text-[var(--moiz-green)]"
          }`}
          size={18}
        />
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-11 pr-12 py-3.5 bg-white border border-zinc-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[var(--moiz-green)]/10 focus:border-[var(--moiz-green)] transition-all font-semibold text-sm shadow-sm"
        />
        {isPending && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 size={18} className="animate-spin text-[var(--moiz-green)]" />
          </div>
        )}
      </div>
    </div>
  );
}

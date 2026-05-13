"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
}

export default function Pagination({ currentPage, totalPages, totalResults }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center gap-4 mt-12 pb-8">
      <div className="flex items-center gap-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 hover:border-[var(--moiz-green)] hover:text-[var(--moiz-green)] disabled:opacity-50 disabled:hover:border-zinc-200 disabled:hover:text-zinc-600 transition-all shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // Logic to show limited pages if totalPages is large
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all shadow-sm ${
                    currentPage === page
                      ? "bg-[var(--moiz-green)] text-white shadow-[0_8px_20px_rgba(106,142,42,0.2)]"
                      : "bg-white border border-zinc-200 text-zinc-600 hover:border-[var(--moiz-green)]"
                  }`}
                >
                  {page}
                </button>
              );
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return <span key={page} className="px-1 text-zinc-400">...</span>;
            }
            return null;
          })}
        </div>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 hover:border-[var(--moiz-green)] hover:text-[var(--moiz-green)] disabled:opacity-50 disabled:hover:border-zinc-200 disabled:hover:text-zinc-600 transition-all shadow-sm"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
        Página {currentPage} de {totalPages} — {totalResults} resultados totales
      </p>
    </div>
  );
}

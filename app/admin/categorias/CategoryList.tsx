"use client";

import { useState } from "react";
import { Search, Tag } from "lucide-react";
import CategoryItem from "./CategoryItem";

interface CategoryWithCount {
  id: string;
  name: string;
  isActive: boolean;
  _count: {
    products: number;
  };
}

interface CategoryListProps {
  initialCategories: CategoryWithCount[];
}

export default function CategoryList({ initialCategories }: CategoryListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = initialCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="md:col-span-8 space-y-6">
      {/* Search Bar */}
      <div className="relative group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[var(--moiz-green)] transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="Buscar categorías..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[var(--moiz-green)]/10 focus:border-[var(--moiz-green)] transition-all font-semibold text-sm shadow-sm"
        />
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredCategories.map((cat) => (
          <CategoryItem
            key={cat.id}
            category={cat}
          />
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-20 bg-white border border-dashed border-zinc-200 rounded-[3rem]">
            <div className="w-16 h-16 bg-zinc-50 text-zinc-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Tag size={32} />
            </div>
            <p className="text-zinc-400 font-bold">
              {searchTerm 
                ? `No se encontraron resultados para "${searchTerm}"`
                : "No hay categorías registradas."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

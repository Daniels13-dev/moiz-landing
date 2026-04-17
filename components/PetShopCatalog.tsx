"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Plus, Minus, Search, Star, ShoppingBag, Dog, Cat } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site";
import { CatalogProduct } from "@/types/product";
import { createProductSlug } from "@/utils/slug";

interface PetShopCatalogProps {
  initialProducts: CatalogProduct[];
}

export default function PetShopCatalog({ initialProducts }: PetShopCatalogProps) {
  const { cart, addToCart, updateQuantity } = useCart();
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("categoria");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPet, setSelectedPet] = useState<string>("Ambos");
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory || "Todos");

  // Compile unique categories from the active products list
  const categories = useMemo(() => {
    const dbCats = initialProducts.map((p) => p.category);
    // Merge only existing categories from active products and add "Todos" first
    return ["Todos", ...Array.from(new Set(dbCats))];
  }, [initialProducts]);

  const [prevUrlCategory, setPrevUrlCategory] = useState(urlCategory);

  if (urlCategory !== prevUrlCategory) {
    setPrevUrlCategory(urlCategory);
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }

  // Focus input if search param is set to focus
  useEffect(() => {
    if (searchParams.get("search") === "focus") {
      searchInputRef.current?.focus();
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPet =
        selectedPet === "Ambos"
          ? true
          : product.petType === selectedPet || product.petType === "Ambos";
      const matchesCategory =
        selectedCategory === "Todos" ? true : product.category === selectedCategory;

      return matchesSearch && matchesPet && matchesCategory;
    });
  }, [searchQuery, selectedPet, selectedCategory, initialProducts]);

  const getProductQuantity = (productId: string) => {
    return cart.find((item) => item.id === productId)?.quantity || 0;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-8 mb-16">
        {/* Search Input - Full Width / Centralized */}
        <div className="relative max-w-3xl mx-auto w-full group">
          <div className="absolute inset-0 bg-[var(--moiz-green)]/5 blur-2xl rounded-[3rem] group-focus-within:bg-[var(--moiz-green)]/10 transition-all duration-500" />
          <div className="relative flex items-center bg-white border border-zinc-200 rounded-[2.5rem] p-2 shadow-xl shadow-zinc-200/40 focus-within:border-[var(--moiz-green)] focus-within:ring-4 focus-within:ring-[var(--moiz-green)]/5 transition-all duration-300">
            <div className="w-14 h-14 flex items-center justify-center text-zinc-400 group-focus-within:text-[var(--moiz-green)] transition-colors">
              <Search size={24} strokeWidth={2.5} />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder={siteConfig.ui.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent py-4 text-lg font-semibold text-zinc-800 focus:outline-none placeholder:text-zinc-400"
            />
          </div>
        </div>

        {/* Filters Group */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
          {/* Pet Toggle - Iconic */}
          <div className="flex bg-white border border-zinc-200 p-1.5 rounded-[2rem] shadow-sm">
            {[
              { id: "Ambos", label: "Todos", icon: null },
              { id: "Perro", label: "Perros", icon: <Dog size={18} /> },
              { id: "Gato", label: "Gatos", icon: <Cat size={18} /> },
            ].map((pet) => (
              <button
                key={pet.id}
                onClick={() => setSelectedPet(pet.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-sm font-black uppercase tracking-wider transition-all duration-300 ${
                  selectedPet === pet.id
                    ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20 translate-y-[-2px]"
                    : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {pet.icon}
                {pet.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:block w-1.5 h-1.5 rounded-full bg-zinc-300" />

          {/* Categories - Pill Navigation */}
          <div className="relative">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative flex items-center justify-center h-10 whitespace-nowrap px-6 rounded-full text-sm font-black uppercase tracking-wider transition-all duration-500 overflow-hidden ${
                    selectedCategory === cat
                      ? "text-white scale-105"
                      : "text-zinc-500 bg-zinc-100/50 hover:bg-zinc-100 hover:text-zinc-900 border border-transparent"
                  }`}
                >
                  {selectedCategory === cat && (
                    <motion.div
                      layoutId="cat-bg"
                      className="absolute inset-0 bg-gradient-to-r from-[var(--moiz-green)] to-[#86A93C] z-0"
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-zinc-500 font-medium">
          Mostrando <span className="text-zinc-900 font-bold">{filteredProducts.length}</span>{" "}
          productos
        </p>
      </div>

      {/* Grid with Layout Transitions */}
      {filteredProducts.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative group flex flex-col h-full bg-white rounded-[2rem] border border-zinc-100 hover:border-zinc-200 hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 overflow-hidden"
              >
                {/* Clickable Area for Detail Page */}
                <Link
                  href={`/productos/${createProductSlug(product.name)}`}
                  className="absolute inset-0 z-10"
                  aria-label={`Ver detalles de ${product.name}`}
                />

                {/* Image Container */}
                <div className="relative aspect-[4/5] bg-zinc-50 p-6 overflow-hidden flex items-center justify-center">
                  {product.isNew && (
                    <span className="absolute top-4 left-4 z-20 bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                      Nuevo
                    </span>
                  )}
                  {product.oldPrice && (
                    <span className="absolute top-4 right-4 z-20 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                      Oferta
                    </span>
                  )}

                  <motion.div whileHover={{ scale: 1.1 }} className="relative w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain drop-shadow-xl"
                      priority
                    />
                  </motion.div>

                  {/* Add to Cart Overlay (Hover) */}
                  <div
                    className={`absolute inset-x-0 bottom-0 p-4 transition-transform duration-500 z-30 ${
                      getProductQuantity(product.id) > 0
                        ? "translate-y-0"
                        : "translate-y-full group-hover:translate-y-0"
                    }`}
                  >
                    {getProductQuantity(product.id) > 0 ? (
                      <div className="bg-white border border-zinc-200 shadow-xl rounded-full flex items-center justify-center p-1 gap-3 w-max mx-auto pointer-events-auto">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateQuantity(product.id, -1);
                          }}
                          className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition-colors"
                        >
                          <Minus size={18} strokeWidth={3} />
                        </button>
                        <span className="text-lg font-black text-zinc-900 min-w-[1.2rem] text-center">
                          {getProductQuantity(product.id)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart(product, null, false, "", { x: e.clientX, y: e.clientY });
                          }}
                          className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--moiz-green)] text-white hover:scale-105 active:scale-95 transition-all shadow-md shadow-[var(--moiz-green)]/20"
                        >
                          <Plus size={18} strokeWidth={3} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(product, null, false, "", { x: e.clientX, y: e.clientY });
                        }}
                        className="btn-moiz w-full bg-zinc-900 text-white cursor-pointer pointer-events-auto"
                      >
                        <ShoppingBag size={20} />
                        {siteConfig.ui.addToCart}
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black tracking-widest uppercase text-zinc-400">
                      {product.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300" />
                    <span className="text-[10px] font-black tracking-widest uppercase text-[var(--moiz-green)]">
                      {product.petType}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-[var(--moiz-green)] transition-colors leading-tight">
                    {product.name}
                  </h3>

                  <p className="text-sm text-zinc-500 line-clamp-2 mb-4 leading-relaxed flex-1">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100">
                    <div className="flex flex-col">
                      {product.oldPrice && (
                        <span className="text-sm text-zinc-400 line-through font-medium">
                          ${product.oldPrice.toLocaleString("es-CO")}
                        </span>
                      )}
                      <span className="text-2xl font-black text-zinc-900">
                        ${product.price.toLocaleString("es-CO")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-zinc-100 px-2 py-1 rounded-lg">
                        <Star className="fill-yellow-400 text-yellow-400" size={14} />
                        <span className="text-xs font-bold text-zinc-600">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-zinc-200">
          <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={32} className="text-zinc-400" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 mb-2">{siteConfig.ui.noProducts}</h3>
          <p className="text-zinc-500">{siteConfig.ui.noProductsDesc}</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Todos");
              setSelectedPet("Ambos");
            }}
            className="mt-6 font-bold text-[var(--moiz-green)] hover:underline"
          >
            Limpiar todos los filtros
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Star, Trash2, Heart } from "lucide-react";
import { CatalogProduct, createProductSlug } from "./PetShopCatalog";
import { toggleFavorite } from "@/app/actions/favorites";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface FavoritesListProps {
  initialFavorites: CatalogProduct[];
}

export default function FavoritesList({
  initialFavorites,
}: FavoritesListProps) {
  const [favorites, setFavorites] = useState(initialFavorites);
  const { addToCart } = useCart();

  const handleRemove = async (id: string) => {
    // Optimistic UI update
    setFavorites((prev) => prev.filter((p) => p.id !== id));
    await toggleFavorite(id);
    toast.success("Producto eliminado de favoritos");
  };

  if (favorites.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-32 bg-white rounded-[3rem] border border-zinc-100 shadow-sm"
      >
        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart size={32} className="text-zinc-200" />
        </div>
        <h3 className="text-2xl font-bold text-zinc-900 mb-2">
          Aún no tienes favoritos
        </h3>
        <p className="text-zinc-500 mb-8 max-w-xs mx-auto">
          Explora nuestro catálogo y guarda los productos que más te gustan.
        </p>
        <Link
          href="/productos"
          className="inline-flex items-center justify-center h-14 px-10 bg-[var(--moiz-green)] text-white font-black rounded-full hover:scale-105 transition-all shadow-lg shadow-[var(--moiz-green)]/20 uppercase text-xs tracking-widest"
        >
          Explorar Productos
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <AnimatePresence mode="popLayout">
        {favorites.map((product) => (
          <motion.div
            layout
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative flex flex-col h-full bg-white rounded-[2.5rem] border border-zinc-100 hover:border-zinc-200 hover:shadow-2xl hover:shadow-zinc-200/40 transition-all duration-500"
          >
            {/* Remove Button */}
            <button
              onClick={() => handleRemove(product.id)}
              className="absolute top-4 right-4 z-30 w-10 h-10 bg-white/80 backdrop-blur-sm border border-zinc-100 text-zinc-400 hover:text-red-500 rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={18} />
            </button>

            {/* Product Link Area */}
            <Link
              href={`/productos/${createProductSlug(product.name)}`}
              className="absolute inset-0 z-10"
            />

            {/* Image Section */}
            <div className="relative aspect-square bg-zinc-50 rounded-[2rem] p-6 m-2 flex items-center justify-center overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-700"
              />
            </div>

            {/* Info Section */}
            <div className="p-6 pt-2 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black tracking-widest uppercase text-zinc-400">
                  {product.category}
                </span>
                <Star className="fill-yellow-400 text-yellow-400" size={10} />
                <span className="text-[10px] font-bold text-zinc-600">
                  {product.rating}
                </span>
              </div>

              <h3 className="text-xl font-bold text-zinc-900 group-hover:text-[var(--moiz-green)] transition-all line-clamp-1 mb-4">
                {product.name}
              </h3>

              <div className="mt-auto flex items-center justify-between">
                <span className="text-2xl font-black text-zinc-900">
                  ${product.price.toLocaleString("es-CO")}
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="relative z-20 w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-xl hover:bg-black hover:scale-110 active:scale-95 transition-all"
                >
                  <ShoppingBag size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

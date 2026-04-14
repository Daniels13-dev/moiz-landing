"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface ProductGalleryProps {
  activeImage: string;
  activeName: string;
  isNew?: boolean;
  oldPrice?: number | null;
  isFavorite: boolean;
  handleToggleFavorite: () => void;
  favLoading: boolean;
}

export default function ProductGallery({
  activeImage,
  activeName,
  isNew,
  oldPrice,
  isFavorite,
  handleToggleFavorite,
  favLoading,
}: ProductGalleryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative lg:h-[700px] h-[450px] w-full bg-white rounded-[3rem] border border-zinc-100 flex items-center justify-center p-8 overflow-hidden group"
    >
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--moiz-green)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Badges */}
      <div className="absolute top-8 left-8 flex flex-col gap-2 z-20">
        {isNew && (
          <span className="bg-zinc-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
            Nuevo
          </span>
        )}
        {oldPrice && (
          <span className="bg-red-500 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
            Oferta
          </span>
        )}
      </div>

      {/* Favorite */}
      <button
        onClick={handleToggleFavorite}
        disabled={favLoading}
        className={`absolute top-8 right-8 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm ${
          isFavorite
            ? "bg-rose-500 text-white shadow-rose-200"
            : "bg-zinc-50 hover:bg-zinc-100 text-zinc-400 hover:text-rose-500 shadow-sm"
        } ${favLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <Heart size={20} strokeWidth={2.5} className={isFavorite ? "fill-current" : ""} />
      </button>

      {/* Product Image */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
        className="relative w-full h-full max-w-[80%]"
      >
        <Image
          src={activeImage}
          alt={activeName}
          fill
          priority
          className="object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700"
        />
      </motion.div>
    </motion.div>
  );
}

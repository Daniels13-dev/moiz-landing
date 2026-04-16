"use client";

import { Star } from "lucide-react";

interface ProductInfoProps {
  name: string;
  description: string;
  rating: number;
  petType: string;
}

export default function ProductInfo({ name, description, rating, petType }: ProductInfoProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-lg">
          {petType}
        </div>
        <div className="flex items-center gap-1 bg-zinc-100 px-2 py-1.5 rounded-lg">
          <Star className="fill-yellow-400 text-yellow-400" size={14} />
          <span className="text-xs font-bold text-zinc-700">{rating}</span>
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 tracking-tighter mb-6 leading-[1.1]">
        {name}
      </h1>

      <p className="text-lg md:text-xl text-zinc-500 leading-relaxed mb-10">
        {description}
      </p>
    </div>
  );
}

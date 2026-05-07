import prisma from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductForm from "../ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link
        href="/admin/productos"
        className="inline-flex items-center gap-2 text-zinc-400 font-bold text-sm hover:text-[var(--moiz-green)] transition-colors group mb-8"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Volver a productos
      </Link>

      <div className="mb-12">
        <h1 className="text-5xl font-black text-zinc-900 tracking-tighter mb-2">Crear Producto</h1>
        <p className="text-zinc-500 font-medium text-lg">
          Añade un nuevo producto al catálogo de Möiz.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}

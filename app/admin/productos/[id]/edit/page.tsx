import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import EditProductView from "./EditProductView";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Link
        href="/admin/productos"
        className="inline-flex items-center gap-2 text-zinc-400 font-bold text-sm hover:text-[var(--moiz-green)] transition-colors group mb-8"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Volver a productos
      </Link>

      <div className="mb-10">
        <h1 className="text-4xl font-black text-zinc-900 tracking-tighter mb-2">Editar Producto</h1>
        <p className="text-zinc-500 font-medium tracking-tight">
          Estás editando <span className="text-zinc-900 font-bold">{product.name}</span>
        </p>
      </div>

      <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-xl overflow-hidden">
        <EditProductView product={product} categories={categories} />
      </div>
    </div>
  );
}

import prisma from "@/lib/prisma";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductForm from "./ProductForm";
import ProductItem from "./ProductItem";

export default async function AdminProductos() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-zinc-400 font-bold text-sm hover:text-[var(--moiz-green)] transition-colors group mb-8"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Volver al panel
      </Link>
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-5xl font-black text-zinc-900 tracking-tighter mb-2">
            Productos
          </h1>
          <p className="text-zinc-500 font-medium text-lg">
            Gestiona el inventario de Möiz Pets.
          </p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-zinc-100 shadow-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--moiz-green)]" />
          <span className="text-sm font-black text-zinc-900">
            {products.length} Productos
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <ProductForm categories={categories} />

        {/* List */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {products.map((p) => (
            <ProductItem key={p.id} product={p} categories={categories} />
          ))}

          {products.length === 0 && (
            <div className="text-center py-40 bg-white border border-dashed border-zinc-200 rounded-[4rem]">
              <ShoppingBag size={48} className="mx-auto text-zinc-200 mb-6" />
              <h3 className="text-2xl font-black text-zinc-300">
                No hay productos aún
              </h3>
              <p className="text-zinc-300 font-bold">
                Empieza por crear uno a la izquierda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

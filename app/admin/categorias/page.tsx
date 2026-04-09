import prisma from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CategoryItem from "./CategoryItem";
import CategoryForm from "./CategoryForm";

export default async function AdminCategorias() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="max-w-4xl mx-auto px-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-[var(--moiz-green)] font-bold text-sm transition-colors group mb-8"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Volver al panel
      </Link>
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tighter mb-2">
            Categorías
          </h1>
          <p className="text-zinc-500 font-medium">
            Administra las etiquetas de tus productos.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        <CategoryForm />

        {/* List */}
        <div className="md:col-span-8 space-y-3">
          {(categories as any[]).map((cat) => (
            <CategoryItem
              key={cat.id}
              category={{
                id: cat.id,
                name: cat.name,
                _count: { products: cat._count.products },
              }}
            />
          ))}

          {categories.length === 0 && (
            <div className="text-center py-20 bg-white border border-dashed border-zinc-200 rounded-[3rem]">
              <p className="text-zinc-400 font-bold">
                No hay categorías registradas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

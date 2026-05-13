import prisma from "@/lib/prisma";
import { ShoppingBag, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import ProductItem from "./ProductItem";
import ProductFilters from "./ProductFilters";
import Pagination from "./Pagination";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function AdminProductos({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const page = Number(params.page) || 1;
  const pageSize = 20;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { category: true, variants: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="max-w-7xl mx-auto px-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-zinc-400 font-bold text-sm hover:text-[var(--moiz-green)] transition-colors group mb-8"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Volver al panel
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black text-zinc-900 tracking-tighter mb-2">Productos</h1>
          <p className="text-zinc-500 font-medium text-lg">Gestiona el inventario de Möiz Pets.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/productos/nuevo"
            className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Plus size={16} strokeWidth={3} />
            Nuevo Producto
          </Link>
          <div className="bg-white px-6 py-3 rounded-2xl border border-zinc-100 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--moiz-green)]" />
            <span className="text-sm font-black text-zinc-900">{totalCount} Productos</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <ProductFilters />

      <div className="flex flex-col gap-4">
        {products.map((p) => (
          <ProductItem key={p.id} product={p} />
        ))}

        {products.length === 0 && (
          <div className="text-center py-40 bg-white border border-dashed border-zinc-200 rounded-[4rem]">
            <ShoppingBag size={48} className="mx-auto text-zinc-200 mb-6" />
            <h3 className="text-2xl font-black text-zinc-300">
              {search ? `No se encontraron resultados para "${search}"` : "No hay productos aún"}
            </h3>
            <p className="text-zinc-300 font-bold">
              {search ? "Intenta con otros términos de búsqueda." : "Empieza por crear uno arriba."}
            </p>
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalResults={totalCount}
        />
      </div>
    </div>
  );
}

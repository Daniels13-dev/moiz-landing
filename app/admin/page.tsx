import Link from "next/link";
import {
  ShoppingBag,
  Tag,
  LayoutDashboard,
  ChevronRight,
  Users,
  Package,
  FileSpreadsheet,
} from "lucide-react";

export default function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <LayoutDashboard size={14} />
          Panel de Administración
        </div>
        <h1 className="text-5xl font-black text-zinc-900 tracking-tighter">
          Gestión interna de <span className="text-[var(--moiz-green)]">Möiz Pets</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        <Link
          href="/admin/categorias"
          className="group p-10 bg-white border border-zinc-100 rounded-[3rem] hover:border-[var(--moiz-green)] transition-all shadow-sm hover:shadow-xl hover:shadow-[var(--moiz-green)]/10"
        >
          <div className="w-16 h-16 bg-zinc-50 text-zinc-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[var(--moiz-green)] group-hover:text-white transition-colors">
            <Tag size={32} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-zinc-900 mb-2">Categorías</h2>
              <p className="text-zinc-500 font-medium">Administra las categorías del catálogo.</p>
            </div>
            <ChevronRight className="text-zinc-300 group-hover:text-[var(--moiz-green)] translate-x-0 group-hover:translate-x-2 transition-all" />
          </div>
        </Link>

        <Link
          href="/admin/productos"
          className="group p-10 bg-white border border-zinc-100 rounded-[3rem] hover:border-[var(--moiz-green)] transition-all shadow-sm hover:shadow-xl hover:shadow-[var(--moiz-green)]/10"
        >
          <div className="w-16 h-16 bg-zinc-50 text-zinc-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[var(--moiz-green)] group-hover:text-white transition-colors">
            <ShoppingBag size={32} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-zinc-900 mb-2">Productos</h2>
              <p className="text-zinc-500 font-medium">Crea y edita productos de la tienda.</p>
            </div>
            <ChevronRight className="text-zinc-300 group-hover:text-[var(--moiz-green)] translate-x-0 group-hover:translate-x-2 transition-all" />
          </div>
        </Link>

        <Link
          href="/admin/pedidos"
          className="group p-10 bg-white border border-zinc-100 rounded-[3rem] hover:border-[var(--moiz-green)] transition-all shadow-sm hover:shadow-xl hover:shadow-[var(--moiz-green)]/10"
        >
          <div className="w-16 h-16 bg-zinc-50 text-zinc-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[var(--moiz-green)] group-hover:text-white transition-colors">
            <Package size={32} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-zinc-900 mb-2">Pedidos</h2>
              <p className="text-zinc-500 font-medium">Gestiona las ventas y estados de envío.</p>
            </div>
            <ChevronRight className="text-zinc-300 group-hover:text-[var(--moiz-green)] translate-x-0 group-hover:translate-x-2 transition-all" />
          </div>
        </Link>

        <Link
          href="/admin/facturacion"
          className="group p-10 bg-white border border-zinc-100 rounded-[3rem] hover:border-[var(--moiz-green)] transition-all shadow-sm hover:shadow-xl hover:shadow-[var(--moiz-green)]/10"
        >
          <div className="w-16 h-16 bg-zinc-50 text-zinc-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[var(--moiz-green)] group-hover:text-white transition-colors">
            <FileSpreadsheet size={32} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-zinc-900 mb-2">Facturación</h2>
              <p className="text-zinc-500 font-medium">Reportes contables y fiscales en Excel.</p>
            </div>
            <ChevronRight className="text-zinc-300 group-hover:text-[var(--moiz-green)] translate-x-0 group-hover:translate-x-2 transition-all" />
          </div>
        </Link>

        <Link
          href="/admin/usuarios"
          className="group p-10 bg-white border border-zinc-100 rounded-[3rem] hover:border-[var(--moiz-green)] transition-all shadow-sm hover:shadow-xl hover:shadow-[var(--moiz-green)]/10"
        >
          <div className="w-16 h-16 bg-zinc-50 text-zinc-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[var(--moiz-green)] group-hover:text-white transition-colors">
            <Users size={32} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-zinc-900 mb-2">Usuarios</h2>
              <p className="text-zinc-500 font-medium">
                Gestiona roles y revisa perfiles de usuarios.
              </p>
            </div>
            <ChevronRight className="text-zinc-300 group-hover:text-[var(--moiz-green)] translate-x-0 group-hover:translate-x-2 transition-all" />
          </div>
        </Link>
      </div>
    </div>
  );
}

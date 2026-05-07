"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Edit2, AlertTriangle, X, Loader2 } from "lucide-react";
import { deleteProduct, toggleProductActive } from "../actions";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  image?: string;
  name: string;
  description?: string;
  price: number;
  oldPrice?: number | null;
  isFeatured?: boolean;
  isNew?: boolean;
  allowSubscription?: boolean;
  category?: { name?: string } | null;
  variants?: {
    id: string;
    name: string;
    color?: string | null;
    image?: string | null;
    stock: number;
    price?: number | null;
  }[];
  isActive?: boolean;
}

interface ProductItemProps {
  product: Product;
}

export default function ProductItem({ product }: ProductItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isActive, setIsActive] = useState<boolean>(product.isActive ?? true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState<{ message: string; hasOrders: boolean } | null>(
    null,
  );

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteProduct(product.id);
    if (!res.success) {
      const hasOrders = (res as { hasOrders?: boolean }).hasOrders === true;
      setDeleteError({ message: res.error || "No se pudo eliminar", hasOrders });
      if (!hasOrders) toast.error(res.error || "No se pudo eliminar");
    } else {
      setShowDeleteModal(false);
      toast.success("Producto eliminado");
    }
    setIsDeleting(false);
  };

  const handleToggleActive = async () => {
    setIsToggling(true);
    const newState = !isActive;
    const res = await toggleProductActive(product.id, newState);
    if (!res.success) {
      toast.error(res.error || "No se pudo actualizar el estado");
    } else {
      setIsActive(newState);
      setShowDeleteModal(false);
      setDeleteError(null);
      toast.success(newState ? "Producto activado" : "Producto desactivado");
    }
    setIsToggling(false);
  };

  return (
    <>
      {/* ── Product Row ─────────────────────────────────────────── */}
      <div className="p-4 bg-white border border-zinc-100 rounded-3xl flex items-center gap-6 group hover:border-[var(--moiz-green)]/30 transition-all shadow-sm">
        <div className="relative w-24 h-24 bg-zinc-50 rounded-2xl overflow-hidden flex items-center justify-center p-2">
          <Image
            src={
              product.image ||
              "https://res.cloudinary.com/dvyqtn7gy/image/upload/v1776223130/moiz/logo/logo.png"
            }
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-500 px-3 py-1 rounded-full">
              {product.category?.name || "Sin Categoría"}
            </span>
            {product.isFeatured && (
              <span className="bg-[var(--moiz-green)]/10 text-[10px] font-black uppercase tracking-widest text-[var(--moiz-green)] px-3 py-1 rounded-full">
                Destacado
              </span>
            )}
            {product.allowSubscription && (
              <span className="bg-blue-50 text-[10px] font-black uppercase tracking-widest text-blue-500 px-3 py-1 rounded-full border border-blue-100">
                Suscripción
              </span>
            )}
            {product.variants && product.variants.length > 0 && (
              <span className="bg-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-400 px-3 py-1 rounded-full">
                {product.variants.length} Colores
              </span>
            )}
            {(() => {
              const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
              if (totalStock === 0) {
                return (
                  <span className="bg-red-50 text-[10px] font-black uppercase tracking-widest text-red-500 px-3 py-1 rounded-full border border-red-100">
                    Agotado
                  </span>
                );
              }
              if (totalStock < 5) {
                return (
                  <span className="bg-amber-50 text-[10px] font-black uppercase tracking-widest text-amber-500 px-3 py-1 rounded-full border border-amber-100 flex items-center gap-1">
                    <AlertTriangle size={10} /> Stock Bajo ({totalStock})
                  </span>
                );
              }
              return (
                <span className="bg-green-50 text-[10px] font-black uppercase tracking-widest text-green-500 px-3 py-1 rounded-full border border-green-100">
                  Stock: {totalStock}
                </span>
              );
            })()}
          </div>
          <h3 className="text-xl font-black text-zinc-900">{product.name}</h3>
          <p className="text-zinc-400 text-sm font-medium line-clamp-1">{product.description}</p>
        </div>

        <div className="text-right flex flex-col items-end gap-2 pr-4">
          <span className="text-2xl font-black text-zinc-900">
            ${product.price.toLocaleString("es-CO")}
          </span>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity items-center">
            {/* Active toggle */}
            <button
              onClick={handleToggleActive}
              disabled={isToggling}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm bg-white border ${
                isActive
                  ? "text-green-600 hover:bg-green-50 border-green-100"
                  : "text-zinc-300 hover:bg-red-50 hover:text-red-500 border-zinc-100"
              }`}
              title={isActive ? "Desactivar" : "Activar"}
            >
              {isActive ? (
                <span className="text-sm font-black">On</span>
              ) : (
                <span className="text-sm font-black">Off</span>
              )}
            </button>

            {/* Edit */}
            <Link
              href={`/admin/productos/${product.id}/edit`}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-all shadow-sm bg-white border border-zinc-100"
              title="Editar"
            >
              <Edit2 size={18} />
            </Link>

            {/* Delete — opens modal */}
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-300 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm bg-white border border-zinc-100"
              title="Eliminar"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Delete Confirmation Modal ────────────────────────────── */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteError(null);
              }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm"
            >
              <div className="bg-white rounded-3xl shadow-2xl shadow-black/20 p-8 mx-4">
                {deleteError?.hasOrders ? (
                  /* ── Has Orders: can't delete ── */
                  <>
                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                      <AlertTriangle className="text-amber-500" size={28} />
                    </div>
                    <h3 className="text-xl font-black text-zinc-900 text-center mb-2">
                      No se puede eliminar
                    </h3>
                    <p className="text-center text-zinc-500 text-sm font-medium mb-6">
                      {deleteError.message}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowDeleteModal(false);
                          setDeleteError(null);
                        }}
                        className="flex-1 py-3 rounded-2xl border border-zinc-200 text-zinc-700 font-black text-sm hover:bg-zinc-50 transition-all flex items-center justify-center gap-2"
                      >
                        <X size={16} />
                        Cerrar
                      </button>
                      {isActive && (
                        <button
                          onClick={() => handleToggleActive()}
                          disabled={isToggling}
                          className="flex-1 py-3 rounded-2xl bg-zinc-900 text-white font-black text-sm hover:bg-zinc-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                          {isToggling ? <Loader2 size={16} className="animate-spin" /> : null}
                          Desactivar
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  /* ── Normal confirm delete ── */
                  <>
                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                      <AlertTriangle className="text-red-500" size={28} />
                    </div>
                    <h3 className="text-xl font-black text-zinc-900 text-center mb-1">
                      Eliminar producto
                    </h3>
                    <p className="text-center text-zinc-500 text-sm font-medium mb-6">
                      ¿Estás seguro de eliminar &quot;
                      <span className="font-black text-zinc-900">{product.name}</span>&quot;? Esta
                      acción no se puede deshacer.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowDeleteModal(false);
                          setDeleteError(null);
                        }}
                        className="flex-1 py-3 rounded-2xl border border-zinc-200 text-zinc-700 font-black text-sm hover:bg-zinc-50 transition-all flex items-center justify-center gap-2"
                      >
                        <X size={16} />
                        Cancelar
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-black text-sm hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/25"
                      >
                        {isDeleting ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                        {isDeleting ? "Eliminando..." : "Eliminar"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

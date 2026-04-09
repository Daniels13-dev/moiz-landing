"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Heart,
} from "lucide-react";
import { CatalogProduct, createProductSlug } from "./PetShopCatalog";
import { toggleFavorite, checkIfFavorite } from "@/app/actions/favorites";
import { toast } from "sonner";

import { siteConfig } from "@/config/site";

interface ProductDetailViewProps {
  product: CatalogProduct & {
    isNew?: boolean;
    isFeatured?: boolean;
    oldPrice?: number | null;
  };
  relatedProducts: CatalogProduct[];
}

export default function ProductDetailView({
  product,
  relatedProducts,
}: ProductDetailViewProps) {
  const { cart, addToCart, updateQuantity } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(true);

  const cartItem = cart.find((item) => item.id === product.id);
  const currentQuantity = cartItem?.quantity || 0;

  useEffect(() => {
    const checkFav = async () => {
      const fav = await checkIfFavorite(product.id);
      setIsFavorite(fav);
      setFavLoading(false);
    };
    checkFav();
  }, [product.id]);

  const handleToggleFavorite = async () => {
    setFavLoading(true);
    const result = await toggleFavorite(product.id);
    if ("success" in result) {
      setIsFavorite(result.action === "added");
      toast.success(
        result.action === "added"
          ? "¡Agregado a favoritos!"
          : "Eliminado de favoritos",
      );
    } else if ("error" in result) {
      toast.error(result.error);
    }
    setFavLoading(false);
  };

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const productUrl = `${siteConfig.url}/productos/${createProductSlug(product.name)}`;

  return (
    <div className="min-h-screen bg-[#F9F9F8] selection:bg-[var(--moiz-green)] selection:text-white pb-24">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: product.image,
            description: product.description,
            brand: {
              "@type": "Brand",
              name: siteConfig.name,
            },
            offers: {
              "@type": "Offer",
              url: productUrl,
              priceCurrency: "COP",
              price: product.price,
              availability: "https://schema.org/InStock",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: "25", // Mocked for now
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Inicio",
                item: siteConfig.url,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Catálogo",
                item: `${siteConfig.url}/productos`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: product.category,
                item: `${siteConfig.url}/productos?categoria=${encodeURIComponent(product.category)}`,
              },
              {
                "@type": "ListItem",
                position: 4,
                name: product.name,
                item: productUrl,
              },
            ],
          }),
        }}
      />

      {/* Top Navbar / Breadcrumbs */}
      <div className="w-full bg-white border-b border-zinc-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 md:gap-4 text-xs md:text-sm font-bold text-zinc-500 overflow-x-auto whitespace-nowrap scrollbar-hide"
          >
            <Link
              href="/"
              className="hover:text-[var(--moiz-green)] transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Inicio
            </Link>
            <ChevronRight size={14} className="text-zinc-300 flex-shrink-0" />
            <Link
              href="/productos"
              className="hover:text-[var(--moiz-green)] transition-colors"
            >
              Catálogo
            </Link>
            <ChevronRight size={14} className="text-zinc-300 flex-shrink-0" />
            <Link
              href={`/productos?categoria=${encodeURIComponent(product.category)}`}
              className="text-zinc-900 hover:text-[var(--moiz-green)] transition-colors"
            >
              {product.category}
            </Link>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 md:pt-20">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-32">
          {/* Left: Image Canvas */}
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
              {product.isNew && (
                <span className="bg-zinc-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                  Nuevo
                </span>
              )}
              {product.oldPrice && (
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
              <Heart
                size={20}
                strokeWidth={2.5}
                className={isFavorite ? "fill-current" : ""}
              />
            </button>

            {/* Product Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
              className="relative w-full h-full max-w-[80%]"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700"
              />
            </motion.div>
          </motion.div>

          {/* Right: Product Details & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col justify-center"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-lg">
                {product.petType}
              </div>
              <div className="flex items-center gap-1 bg-zinc-100 px-2 py-1.5 rounded-lg">
                <Star className="fill-yellow-400 text-yellow-400" size={14} />
                <span className="text-xs font-bold text-zinc-700">
                  {product.rating}
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 tracking-tighter mb-6 leading-[1.1]">
              {product.name}
            </h1>

            <p className="text-lg md:text-xl text-zinc-500 leading-relaxed mb-10">
              {product.description}
            </p>

            {/* Price Block */}
            <div className="flex flex-col mb-10 pb-10 border-b border-zinc-200">
              {product.oldPrice && (
                <span className="text-xl text-zinc-400 font-medium line-through mb-1">
                  ${product.oldPrice.toLocaleString("es-CO")}
                </span>
              )}
              <span className="text-5xl lg:text-6xl font-black text-zinc-900 tracking-tight">
                ${product.price.toLocaleString("es-CO")}
              </span>
            </div>

            {/* Interaction Block */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              {currentQuantity > 0 ? (
                <div className="bg-white border border-zinc-200 h-16 w-full sm:w-auto rounded-full flex items-center justify-between px-2 shadow-sm shrink-0">
                  <button
                    onClick={() => updateQuantity(product.id, -1)}
                    className="w-12 h-12 flex items-center justify-center bg-zinc-50 hover:bg-zinc-100 text-zinc-900 rounded-full transition-colors"
                  >
                    <Minus size={20} strokeWidth={2.5} />
                  </button>
                  <span className="text-xl font-black text-zinc-900 w-16 text-center">
                    {currentQuantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, 1)}
                    className="w-12 h-12 flex items-center justify-center bg-[var(--moiz-green)] hover:bg-[var(--moiz-green)]/90 text-white rounded-full transition-colors"
                  >
                    <Plus size={20} strokeWidth={2.5} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="btn-moiz w-full sm:w-auto bg-zinc-900 text-white px-12 relative overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {isAdded ? (
                      <motion.div
                        key="added"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center gap-2 text-[var(--moiz-green)]"
                      >
                        <ShieldCheck size={22} />
                        En carrito
                      </motion.div>
                    ) : (
                      <motion.div
                        key="add"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingBag size={22} />
                        Agregar al carrito
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              )}

              <Link
                href="/carrito"
                className="btn-moiz w-full sm:w-auto border-2 border-zinc-200 text-zinc-900 px-8 hover:border-[var(--moiz-green)] hover:text-[var(--moiz-green)]"
              >
                Comprar ahora
              </Link>
            </div>

            {/* Quick Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-zinc-100 shadow-sm">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm">
                    Envío Express
                  </h4>
                  <p className="text-xs text-zinc-500 font-medium">
                    Llega en minutos
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-zinc-100 shadow-sm">
                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm">
                    Garantía Moiz
                  </h4>
                  <p className="text-xs text-zinc-500 font-medium">
                    Calidad asegurada
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-zinc-200 pt-24">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tighter mb-2">
                  Completa el{" "}
                  <span className="text-[var(--moiz-green)]">kit</span>
                </h2>
                <p className="text-zinc-500 font-medium text-lg">
                  Productos que combinan perfecto con tu selección.
                </p>
              </div>
              <Link
                href={`/productos?categoria=${encodeURIComponent(product.category)}`}
                className="hidden md:flex items-center gap-2 font-bold text-[var(--moiz-green)] hover:underline"
              >
                Ver más {product.category} <ChevronRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  key={rel.id}
                  className="group relative bg-white border border-zinc-100 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-zinc-200/50 hover:border-zinc-200 transition-all cursor-pointer flex flex-col h-full"
                >
                  <Link
                    href={`/productos/${createProductSlug(rel.name)}`}
                    className="absolute inset-0 z-10"
                  />

                  <div className="relative aspect-square bg-zinc-50 rounded-2xl mb-6 p-4 flex items-center justify-center overflow-hidden">
                    <Image
                      src={rel.image}
                      alt={rel.name}
                      fill
                      className="object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-zinc-900 group-hover:text-[var(--moiz-green)] mb-1 transition-colors">
                        {rel.name}
                      </h4>
                      <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-4">
                        {rel.category}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-lg text-zinc-900">
                        ${rel.price.toLocaleString("es-CO")}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(rel);
                        }}
                        className="relative z-20 w-10 h-10 bg-zinc-100 hover:bg-[var(--moiz-green)] text-zinc-900 hover:text-white rounded-full flex items-center justify-center transition-colors pointer-events-auto"
                      >
                        <Plus size={18} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

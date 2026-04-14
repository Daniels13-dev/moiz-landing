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
  Info,
} from "lucide-react";
import { CatalogProduct, createProductSlug } from "./PetShopCatalog";
import { toggleFavorite, checkIfFavorite } from "@/app/actions/favorites";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";

// Sub-components
import ProductGallery from "./product-detail/ProductGallery";
import RelatedProductsSection from "./product-detail/RelatedProductsSection";

export interface ProductVariant {
  id: string;
  name: string;
  color?: string | null;
  image: string | null;
  stock: number;
  price: number | null;
}

interface ProductDetailViewProps {
  product: CatalogProduct & {
    isNew?: boolean;
    isFeatured?: boolean;
    oldPrice?: number | null;
    variants?: ProductVariant[];
    stock?: number;
  };
  relatedProducts: CatalogProduct[];
}

export default function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const { cart, addToCart, updateQuantity } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(true);

  const cartItem = cart.find((item) => item.id === product.id);
  const currentQuantity = cartItem?.quantity || 0;
  const [purchaseType, setPurchaseType] = useState<"once" | "subscription">("once");
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null,
  );
  const [showSubInfo, setShowSubInfo] = useState(false);

  const activePrice = selectedVariant?.price || product.price;
  const activeImage = selectedVariant?.image || product.image;
  const activeName = selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name;
  const activeStock = selectedVariant !== null ? selectedVariant.stock : (product.stock ?? 0);

  useEffect(() => {
    let isMounted = true;
    const checkFav = async () => {
      const fav = await checkIfFavorite(product.id);
      if (isMounted) {
        setIsFavorite(fav);
        setFavLoading(false);
      }
    };
    checkFav();
    return () => {
      isMounted = false;
    };
  }, [product.id]);

  const handleToggleFavorite = async () => {
    setFavLoading(true);
    const result = await toggleFavorite(product.id);
    if ("success" in result) {
      setIsFavorite(result.action === "added");
      toast.success(
        result.action === "added" ? "¡Agregado a favoritos!" : "Eliminado de favoritos",
      );
    } else if ("error" in result) {
      toast.error(result.error);
    }
    setFavLoading(false);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, purchaseType === "subscription");
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
            <Link href="/productos" className="hover:text-[var(--moiz-green)] transition-colors">
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
          <ProductGallery
            activeImage={activeImage}
            activeName={activeName}
            isNew={product.isNew}
            oldPrice={product.oldPrice}
            isFavorite={isFavorite}
            handleToggleFavorite={handleToggleFavorite}
            favLoading={favLoading}
          />

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
                <span className="text-xs font-bold text-zinc-700">{product.rating}</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 tracking-tighter mb-6 leading-[1.1]">
              {product.name}
            </h1>

            <p className="text-lg md:text-xl text-zinc-500 leading-relaxed mb-10">
              {product.description}
            </p>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-10">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 block mb-4">
                  Selecciona Color: <span className="text-zinc-900">{selectedVariant?.name}</span>
                </label>
                <div className="flex flex-wrap gap-4">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={variant.stock <= 0}
                      className={`group relative flex flex-col items-center gap-2 transition-all p-2 rounded-2xl border-2 ${
                        selectedVariant?.id === variant.id
                          ? "border-[var(--moiz-green)] bg-[var(--moiz-green)]/5"
                          : "border-transparent hover:bg-zinc-100"
                      } ${variant.stock <= 0 ? "opacity-40 cursor-not-allowed grayscale" : "cursor-pointer"}`}
                    >
                      <div className="relative">
                        <div
                          className={`w-10 h-10 rounded-full border-2 transition-transform ${
                            selectedVariant?.id === variant.id
                              ? "border-[var(--moiz-green)] scale-110"
                              : "border-white"
                          }`}
                          style={{ backgroundColor: variant.color || "#eee" }}
                        />
                        {variant.stock <= 0 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-0.5 bg-red-500 rotate-45 transform" />
                          </div>
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase tracking-tighter ${
                          selectedVariant?.id === variant.id ? "text-zinc-900" : "text-zinc-400"
                        }`}
                      >
                        {variant.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Purchase Options Selector */}
            {product.allowSubscription ? (
              <div className="flex flex-col gap-3 mb-10">
                <button
                  onClick={() => setPurchaseType("once")}
                  className={`p-5 rounded-[2rem] border-2 transition-all flex items-center justify-between text-left group ${purchaseType === "once" ? "border-zinc-900 bg-zinc-50" : "border-zinc-100 hover:border-zinc-200"}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${purchaseType === "once" ? "border-zinc-900" : "border-zinc-300 group-hover:border-zinc-400"}`}
                    >
                      {purchaseType === "once" && (
                        <motion.div
                          layoutId="activeCircle"
                          className="w-3 h-3 bg-zinc-900 rounded-full"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-zinc-900 leading-tight">Compra única</h3>
                      <p className="text-xs text-zinc-500 font-medium">
                        Pedido estándar sin compromiso
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-xl text-zinc-900">
                    ${activePrice.toLocaleString("es-CO")}
                  </span>
                </button>

                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setPurchaseType("subscription")}
                  onKeyDown={(e) => e.key === "Enter" && setPurchaseType("subscription")}
                  className={`p-5 rounded-[2rem] border-2 transition-all flex items-center justify-between text-left relative group cursor-pointer ${purchaseType === "subscription" ? "border-[var(--moiz-green)] bg-[var(--moiz-green)]/5" : "border-zinc-100 hover:border-zinc-200"}`}
                >
                  <div className="absolute -top-3 right-6 bg-[var(--moiz-green)] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-[var(--moiz-green)]/20">
                    Ahorra 5%
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${purchaseType === "subscription" ? "border-[var(--moiz-green)]" : "border-zinc-300 group-hover:border-zinc-400"}`}
                    >
                      {purchaseType === "subscription" && (
                        <motion.div
                          layoutId="activeCircle"
                          className="w-3 h-3 bg-[var(--moiz-green)] rounded-full"
                        />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-zinc-900 leading-tight">
                          Suscripción Mensual
                        </h3>
                        <div className="relative">
                          <button
                            type="button"
                            onMouseEnter={() => setShowSubInfo(true)}
                            onMouseLeave={() => setShowSubInfo(false)}
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowSubInfo(!showSubInfo);
                            }}
                            className="text-zinc-400 hover:text-[var(--moiz-green)] transition-colors p-1"
                          >
                            <Info size={14} />
                          </button>
                          <AnimatePresence>
                            {showSubInfo && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                className="absolute bottom-full left-0 mb-3 w-64 bg-zinc-900 text-white p-5 rounded-3xl shadow-2xl z-50 text-[10px] leading-relaxed font-medium pointer-events-none"
                              >
                                <div className="space-y-3">
                                  <p className="font-black uppercase tracking-widest text-[var(--moiz-green)] border-b border-white/10 pb-2">
                                    Términos de Suscripción
                                  </p>
                                  <p>
                                    • La suscripción tiene un compromiso mínimo de <b>3 meses</b> (3
                                    entregas).
                                  </p>
                                  <p>
                                    • <b>Sin cobros anticipados:</b> Pagas cada mes al momento de
                                    recibir o mediante el método elegido.
                                  </p>
                                  <p>
                                    • Podrás cancelar tu suscripción libremente una vez completadas
                                    las primeras 3 entregas.
                                  </p>
                                </div>
                                <div className="absolute top-full left-4 border-[8px] border-transparent border-t-zinc-900" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--moiz-green)] font-bold italic">
                        Recibe cada mes y ahorra tiempo
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-2xl text-[var(--moiz-green)]">
                    ${(activePrice * 0.95).toLocaleString("es-CO")}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mb-10 p-8 bg-zinc-900 rounded-[2.5rem] text-white flex items-center justify-between">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-1">
                    Precio
                  </label>
                  <h3 className="text-4xl font-black">${activePrice.toLocaleString("es-CO")}</h3>
                </div>
                {product.oldPrice && (
                  <div className="text-right">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-1">
                      Antes
                    </label>
                    <span className="text-lg text-white/40 line-through font-bold">
                      ${product.oldPrice.toLocaleString("es-CO")}
                    </span>
                  </div>
                )}
              </div>
            )}

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
                    disabled={currentQuantity >= activeStock}
                    className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${
                      currentQuantity >= activeStock
                        ? "bg-zinc-100 text-zinc-300 cursor-not-allowed"
                        : "bg-[var(--moiz-green)] hover:bg-[var(--moiz-green)]/90 text-white"
                    }`}
                  >
                    <Plus size={20} strokeWidth={2.5} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={activeStock <= 0}
                  className={`btn-moiz w-full sm:w-auto px-12 relative overflow-hidden transition-all ${
                    activeStock <= 0
                      ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                      : "bg-zinc-900 text-white"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {activeStock <= 0 ? (
                      <motion.div
                        key="oos"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        Agotado
                      </motion.div>
                    ) : isAdded ? (
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
                  <h4 className="font-bold text-zinc-900 text-sm">Envío Express</h4>
                  <p className="text-xs text-zinc-500 font-medium">Llega en minutos</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-zinc-100 shadow-sm">
                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm">Garantía Moiz</h4>
                  <p className="text-xs text-zinc-500 font-medium">Calidad asegurada</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products Section */}
        <RelatedProductsSection relatedProducts={relatedProducts} category={product.category} />
      </div>
    </div>
  );
}

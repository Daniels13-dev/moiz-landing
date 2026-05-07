"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, ShoppingBag, ShieldCheck } from "lucide-react";
import { CatalogProduct, ProductVariant } from "@/types/product";
import { toggleFavorite, checkIfFavorite } from "@/app/actions/favorites";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";
import { useProductVariants } from "@/hooks/useProductVariants";

// Sub-components
import ProductGallery from "./product-detail/ProductGallery";
import RelatedProductsSection from "./product-detail/RelatedProductsSection";
import Breadcrumbs from "./product-detail/Breadcrumbs";
import ProductInfo from "./product-detail/ProductInfo";
import SizeSelector from "./product-detail/SizeSelector";
import VariantSelector from "./product-detail/VariantSelector";
import PurchaseOptions from "./product-detail/PurchaseOptions";
import QuickBadges from "./product-detail/QuickBadges";
import { Link } from "lucide-react";
import NextLink from "next/link";
import { AnimatePresence } from "framer-motion";

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

  const {
    sortedSizes,
    hasSizes,
    selectedSize,
    setSelectedSize,
    filteredVariants,
    selectedVariant,
    setSelectedVariant,
    activeState
  } = useProductVariants(product);

  const cartItem = cart.find((item) => item.id === product.id);
  const currentQuantity = cartItem?.quantity || 0;
  const [purchaseType, setPurchaseType] = useState<"once" | "subscription">("once");
  const [showSubInfo, setShowSubInfo] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#F9F9F8] selection:bg-[var(--moiz-green)] selection:text-white pb-24">
      <Breadcrumbs category={product.category} productName={product.name} />

      <div className="max-w-7xl mx-auto px-6 pt-12 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-32">
          <ProductGallery
            activeImage={activeState.image}
            activeName={activeState.name}
            isNew={product.isNew}
            oldPrice={product.oldPrice}
            isFavorite={isFavorite}
            handleToggleFavorite={handleToggleFavorite}
            favLoading={favLoading}
          />

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col justify-center"
          >
            <ProductInfo
              name={product.name}
              description={product.description}
              rating={product.rating}
              petType={product.petType}
            />

            <SizeSelector
              sortedSizes={sortedSizes}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              variants={product.variants || []}
            />

            <VariantSelector
              filteredVariants={filteredVariants}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
              hasSizes={hasSizes}
            />

            <PurchaseOptions
              allowSubscription={!!product.allowSubscription}
              purchaseType={purchaseType}
              setPurchaseType={setPurchaseType}
              activePrice={activeState.price}
              oldPrice={product.oldPrice}
              showSubInfo={showSubInfo}
              setShowSubInfo={setShowSubInfo}
            />

            {activeState.isOutOfStock && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8"
              >
                <h3 className="text-amber-800 font-bold text-lg mb-2 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  Producto Agotado Temporalmente
                </h3>
                <p className="text-amber-700 text-sm mb-4">
                  Estamos trabajando para reabastecer este producto lo más pronto posible. ¡No te preocupes! Tenemos alternativas excelentes para ti.
                </p>
                <button 
                  onClick={() => document.getElementById('related-products')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-amber-100 text-amber-800 font-bold px-4 py-2 rounded-lg text-sm hover:bg-amber-200 transition-colors inline-flex items-center gap-2"
                >
                  Ver alternativas similares ↓
                </button>
              </motion.div>
            )}

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
                    disabled={currentQuantity >= activeState.stock}
                    className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${
                      currentQuantity >= activeState.stock
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
                  disabled={activeState.isOutOfStock}
                  className={`btn-moiz w-full sm:w-auto px-12 relative overflow-hidden transition-all ${
                    activeState.isOutOfStock
                      ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                      : "bg-zinc-900 text-white"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {activeState.isOutOfStock ? (
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

              <NextLink
                href="/carrito"
                className="btn-moiz w-full sm:w-auto border-2 border-zinc-200 text-zinc-900 px-8 hover:border-[var(--moiz-green)] hover:text-[var(--moiz-green)]"
              >
                Comprar ahora
              </NextLink>
            </div>

            <QuickBadges />
          </motion.div>
        </div>

        <RelatedProductsSection relatedProducts={relatedProducts} category={product.category} />
      </div>
    </div>
  );
}

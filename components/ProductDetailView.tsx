"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, ShoppingBag, ShieldCheck } from "lucide-react";
import { CatalogProduct, ProductVariant } from "@/types/product";
import { toggleFavorite, checkIfFavorite } from "@/app/actions/favorites";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";

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

  const cartItem = cart.find((item) => item.id === product.id);
  const currentQuantity = cartItem?.quantity || 0;
  const [purchaseType, setPurchaseType] = useState<"once" | "subscription">("once");
  const hasVariants = product.variants && product.variants.length > 0;

  // Derive unique sizes from variants
  const allSizes = hasVariants
    ? (Array.from(new Set(product.variants!.map((v) => v.size).filter(Boolean))) as string[])
    : [];
  const hasSizes = allSizes.length > 0;

  const LETTER_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const SPANISH_ORDER = ["P", "M", "G"];

  const sortedSizes = allSizes.sort((a, b) => {
    const isSpanish = allSizes.some((s) => s === "P" || s === "G");
    const order = isSpanish ? SPANISH_ORDER : LETTER_ORDER;
    const idxA = order.indexOf(a);
    const idxB = order.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return 0;
  });

  const [selectedSize, setSelectedSize] = useState<string | null>(hasSizes ? sortedSizes[0] : null);

  const filteredVariants = hasVariants
    ? hasSizes && selectedSize
      ? product.variants!.filter((v) => v.size === selectedSize)
      : product.variants!
    : [];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    filteredVariants.length > 0 ? filteredVariants[0] : null,
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

  return (
    <div className="min-h-screen bg-[#F9F9F8] selection:bg-[var(--moiz-green)] selection:text-white pb-24">
      <Breadcrumbs category={product.category} />

      <div className="max-w-7xl mx-auto px-6 pt-12 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-32">
          <ProductGallery
            activeImage={activeImage}
            activeName={activeName}
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
              onSizeChange={(size) => {
                const sizeVariants = product.variants!.filter((v) => v.size === size);
                const first = sizeVariants.find((v) => v.stock > 0) || sizeVariants[0];
                setSelectedVariant(first || null);
              }}
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
              activePrice={activePrice}
              oldPrice={product.oldPrice}
              showSubInfo={showSubInfo}
              setShowSubInfo={setShowSubInfo}
            />

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

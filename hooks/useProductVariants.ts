import { useState, useMemo } from "react";
import { ProductVariant, CatalogProduct } from "@/types/product";
import { ProductUtils } from "@/lib/product-utils";

/**
 * Hook personalizado para gestionar la lógica de variantes de un producto.
 * Encapsula la selección de tallas, filtrado de variantes y derivación de estado activo.
 */
export function useProductVariants(product: CatalogProduct & { variants?: ProductVariant[]; stock?: number }) {
  const hasVariants = product.variants && product.variants.length > 0;
  
  // 1. Obtener tallas ordenadas (Memoized)
  const sortedSizes = useMemo(() => 
    ProductUtils.getSortedSizes(product.variants || []),
    [product.variants]
  );
  
  const hasSizes = sortedSizes.length > 0;

  // 2. Estado de selección
  const [selectedSize, setSelectedSize] = useState<string | null>(hasSizes ? sortedSizes[0] : null);

  // 3. Filtrar variantes según talla (Memoized)
  const filteredVariants = useMemo(() => 
    ProductUtils.filterVariantsBySize(product.variants || [], selectedSize),
    [product.variants, selectedSize]
  );

  // 4. Estado de variante seleccionada
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(() => 
    ProductUtils.getInitialVariant(filteredVariants)
  );

  // 5. Sincronizar variante seleccionada cuando cambia la talla
  const handleSizeChange = (size: string | null) => {
    setSelectedSize(size);
    const newFiltered = ProductUtils.filterVariantsBySize(product.variants || [], size);
    setSelectedVariant(ProductUtils.getInitialVariant(newFiltered));
  };

  // 6. Derivar estado activo (Memoized)
  const activeState = useMemo(() => {
    return {
      price: selectedVariant?.price || product.price,
      image: selectedVariant?.image || product.image,
      name: selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name,
      stock: selectedVariant !== null ? selectedVariant.stock : (product.stock ?? 0),
      isOutOfStock: (selectedVariant !== null ? selectedVariant.stock : (product.stock ?? 0)) <= 0
    };
  }, [selectedVariant, product]);

  return {
    sortedSizes,
    hasSizes,
    selectedSize,
    setSelectedSize: handleSizeChange,
    filteredVariants,
    selectedVariant,
    setSelectedVariant,
    activeState
  };
}

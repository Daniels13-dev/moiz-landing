import { ProductVariant } from "@/types/product";

/**
 * Utilidades puras para la lógica de visualización y selección de productos.
 * Permite que componentes como DetailView o QuickView compartan la misma lógica.
 */
export const ProductUtils = {
  LETTER_ORDER: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
  SPANISH_ORDER: ["P", "M", "G"],

  /**
   * Extrae tallas únicas de una lista de variantes y las ordena.
   */
  getSortedSizes(variants: ProductVariant[] = []): string[] {
    const allSizes = Array.from(
      new Set(variants.map((v) => v.size).filter(Boolean))
    ) as string[];

    if (allSizes.length === 0) return [];

    const isSpanish = allSizes.some((s) => s === "P" || s === "G");
    const order = isSpanish ? this.SPANISH_ORDER : this.LETTER_ORDER;

    return allSizes.sort((a, b) => {
      const idxA = order.indexOf(a);
      const idxB = order.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });
  },

  /**
   * Filtra las variantes según la talla seleccionada.
   */
  filterVariantsBySize(variants: ProductVariant[] = [], size: string | null): ProductVariant[] {
    if (!size) return variants;
    return variants.filter((v) => v.size === size);
  },

  /**
   * Busca la mejor variante inicial (con stock preferiblemente).
   */
  getInitialVariant(variants: ProductVariant[] = []): ProductVariant | null {
    if (variants.length === 0) return null;
    return variants.find((v) => v.stock > 0) || variants[0];
  }
};

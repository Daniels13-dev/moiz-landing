import { BUSINESS_CONFIG } from "@/config/business";

/**
 * Utilidades puras para cálculos del carrito.
 * Desacoplado de React para permitir pruebas unitarias y consistencia.
 */
export const CartUtils = {
  /**
   * Parsea un precio que puede venir como string formateado o número.
   */
  parsePrice(price: number | string): number {
    if (typeof price === "number") return price;
    return parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
  },

  /**
   * Calcula el precio final de un item considerando variantes y suscripciones.
   */
  calculateItemPrice(
    basePrice: number | string,
    variantPrice?: number | null,
    isSubscription: boolean = false
  ): number {
    let price = variantPrice ?? this.parsePrice(basePrice);

    if (isSubscription) {
      price = price * (1 - BUSINESS_CONFIG.subscriptions.discountRate);
    }

    return Math.round(price);
  },

  /**
   * Genera un ID único para el item del carrito.
   */
  generateCartItemId(productId: string, variantId?: string, isSubscription?: boolean): string {
    const parts = [productId];
    if (variantId) parts.push(variantId);
    if (isSubscription) parts.push("sub");
    return parts.join("-");
  },

  /**
   * Calcula el resumen financiero del carrito.
   */
  calculateSummary(cart: any[], discountPercentage: number = 0) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = Math.round((totalPrice * discountPercentage) / 100);
    const finalPrice = totalPrice - discountAmount;

    return {
      totalItems,
      totalPrice,
      discountAmount,
      finalPrice,
    };
  }
};

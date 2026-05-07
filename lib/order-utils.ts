/**
 * Utilidades centralizadas para el manejo de órdenes.
 * Evita la duplicación de lógica de formatos (MZ-) y normalización de datos.
 */
export const OrderUtils = {
  PREFIX: "MZ-",

  /**
   * Formatea un número de pedido para visualización (ej: 123 -> MZ-123).
   */
  formatOrderNumber(orderNumber: number | string): string {
    if (!orderNumber) return "";
    const cleanNumber = orderNumber.toString().toUpperCase().replace(this.PREFIX, "").trim();
    return `${this.PREFIX}${cleanNumber}`;
  },

  /**
   * Extrae el número numérico de un ID de pedido (ej: MZ-123 -> 123).
   */
  parseOrderNumber(orderDisplay: string): number | null {
    if (!orderDisplay) return null;
    const numberStr = orderDisplay.toUpperCase().replace(this.PREFIX, "").trim();
    const orderNumber = parseInt(numberStr);
    return isNaN(orderNumber) ? null : orderNumber;
  },

  /**
   * Normaliza un NIT o Cédula (elimina puntos, guiones y espacios).
   */
  normalizeNit(nit: string): string {
    if (!nit) return "";
    return nit.trim().replace(/\D/g, "");
  },

  /**
   * Compara dos identificaciones de forma segura.
   */
  compareNit(nit1: string, nit2: string): boolean {
    return this.normalizeNit(nit1) === this.normalizeNit(nit2);
  }
};

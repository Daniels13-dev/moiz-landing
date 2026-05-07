import { COLOMBIA_REGIONS } from "@/config/colombia-data";
import { BUSINESS_CONFIG } from "@/config/business";

/**
 * Utilidades para manejo de ubicaciones geográficas.
 * Centraliza la lógica para evitar acoplamiento en componentes UI.
 */
export const LocationUtils = {
  /**
   * Retorna la lista de departamentos disponibles.
   */
  getRegions(): string[] {
    return Object.keys(COLOMBIA_REGIONS).sort();
  },

  /**
   * Retorna las ciudades asociadas a un departamento.
   */
  getCitiesByRegion(region: string): string[] {
    if (!region) return [];
    return COLOMBIA_REGIONS[region] || [];
  },

  /**
   * Verifica si una ubicación específica es apta para domicilio propio (Möiz).
   */
  isLocalDeliveryAvailable(region: string, city: string): boolean {
    const { localDeliveryRegions, localDeliveryCities } = BUSINESS_CONFIG.shipping;
    return localDeliveryRegions.includes(region) && localDeliveryCities.includes(city);
  },

  /**
   * Retorna el nombre legible de un método de envío.
   */
  getShippingMethodLabel(method: string): string {
    switch (method) {
      case "domicilio":
        return "🛵 DOMICILIO MÖIZ (ENTREGA HOY)";
      case "estandar":
        return "🚚 ENVÍO NACIONAL ESTÁNDAR";
      default:
        return "📦 ENVÍO";
    }
  }
};

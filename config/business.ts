/**
 * Constantes y reglas de negocio globales de Möiz.
 * Centralizado para facilitar ajustes sin tocar el código de la interfaz.
 */
export const BUSINESS_CONFIG = {
  // Logística y Envíos
  shipping: {
    freeThreshold: 400000, // Umbral para envío gratis nacional
    localDeliveryRegions: ["Caldas"],
    localDeliveryCities: ["Manizales", "Villamaría"],
  },

  // Impuestos y Cargos
  tax: {
    ivaRate: 0.19, // IVA del 19% si aplica
  },

  // Suscripciones
  subscriptions: {
    discountRate: 0.05, // Descuento por suscripción (5%)
    minCommitmentMonths: 3,
  },

  // Contacto
  whatsapp: {
    number: "573218515161",
    defaultMessage: "Hola Möiz! Quisiera más información.",
  }
};

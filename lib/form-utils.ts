/**
 * Utilidades para parsear y normalizar datos provenientes de formularios (FormData).
 * Diseñado para ser usado en Server Actions de forma consistente.
 */

/**
 * Parsea un string de moneda localizado (ej: "1.200.000") a un float válido.
 */
export function parseLocalizedFloat(value: any): number | null {
  if (value === null || value === undefined || value === "") return null;
  const str = String(value);
  const cleaned = str.replace(/\./g, "").replace(",", ".");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Parsea un valor a entero asegurando un valor por defecto.
 */
export function parseInteger(value: any, defaultValue = 0): number {
  if (value === null || value === undefined || value === "") return defaultValue;
  const parsed = parseInt(String(value), 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Normaliza un booleano proveniente de un checkbox (FormData).
 * Los checkboxes de HTML envían "on" si están marcados.
 */
export function parseCheckbox(value: any): boolean {
  return value === "on" || value === true || value === "true";
}

/**
 * Normaliza strings de formularios eliminando espacios extra.
 */
export function parseString(value: any): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

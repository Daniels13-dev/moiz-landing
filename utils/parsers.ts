/**
 * Parsea un string de moneda localizado (ej: "1.200.000" o "1200,50") a un float válido.
 */
export function parseLocalizedFloat(value: string | null | undefined): number | null {
  if (!value) return null;
  // Elimina puntos de miles y reemplaza coma decimal por punto
  const cleaned = value.replace(/\./g, "").replace(",", ".");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Parsea un valor de stock asegurando que siempre sea un entero válido.
 */
export function parseInteger(value: string | null | undefined, defaultValue = 0): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Normaliza un booleano proveniente de un checkbox (FormData).
 */
export function parseCheckbox(value: FormDataEntryValue | null): boolean {
  return value === "on";
}

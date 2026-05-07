import { z } from "zod";

/**
 * Utilidad para manejar errores en Server Actions de forma consistente.
 */
export function handleActionError(error: any, context: string = "Action") {
  console.error(`[${context} Error]:`, error);

  if (error instanceof z.ZodError) {
    const firstError = error.issues[0];
    return { 
      success: false,
      error: `Dato inválido: ${firstError.path.join(".")} - ${firstError.message}` 
    } as const;
  }

  if (error instanceof Error) {
    return { success: false, error: error.message } as const;
  }

  return { success: false, error: "Ocurrió un error inesperado. Por favor intenta de nuevo." } as const;
}

import prisma from "./prisma";

/**
 * Prisma Secure Client (Supabase RLS Integration)
 * 
 * Este cliente extiende tu instancia normal de Prisma para inyectar
 * el contexto del usuario actual en la base de datos antes de cada consulta.
 * 
 * ¿Por qué es necesario?
 * Porque normalmente Prisma usa el usuario "postgres" (superuser), el cual
 * se salta todas las políticas de Row Level Security (RLS) de Supabase.
 * 
 * Instrucciones de uso:
 * 1. Habilita RLS en tus tablas en Supabase (ej. `Order`, `Profile`).
 * 2. Crea las políticas (ej. "Los usuarios solo pueden ver sus propias órdenes").
 * 3. En lugar de usar `import prisma from "@/lib/prisma"`, usa esta función.
 * 
 * @example
 * const db = getSecurePrisma(user.id);
 * const misOrdenes = await db.order.findMany(); // RLS bloqueará si intenta ver otras órdenes
 */
export const getSecurePrisma = (userId: string) => {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          try {
            // Inyectamos el ID del usuario en la sesión de Postgres para que
            // Supabase RLS pueda leerlo usando `auth.uid()`
            const claims = JSON.stringify({ sub: userId });
            
            // Ejecutamos la inyección del claim y el query real en la misma transacción
            const [ , result ] = await prisma.$transaction([
              prisma.$executeRawUnsafe(
                `SELECT set_config('request.jwt.claims', $1, TRUE)`, 
                claims
              ),
              query(args)
            ]);
            
            return result;
          } catch (error) {
            console.error("Error en Secure Prisma con RLS:", error);
            throw error;
          }
        }
      }
    }
  });
};

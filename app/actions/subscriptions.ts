"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function cancelSubscription(subscriptionId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No autenticado");
    }

    // Verificar que la suscripción pertenezca al usuario
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription || subscription.userId !== user.id) {
      throw new Error("Suscripción no encontrada");
    }

    // Regla de negocio: Al menos 3 compras para cancelar
    if (subscription.deliveryCount < 3) {
      throw new Error(
        `Debes completar al menos 3 pedidos para poder cancelar esta suscripción. Llevas ${subscription.deliveryCount}.`,
      );
    }

    // Cancelar la suscripción (eliminándola o marcándola como cancelada)
    // El usuario pidió "cancelar", vamos a marcarla como cancelada o eliminarla según el modelo
    // Dado que no hay un estado 'cancelada' explícito en el modelo Subscription mostrado antes (solo status por defecto 'activa')
    // vamos a eliminarla para que deje de generar recordatorios.

    await prisma.subscription.delete({
      where: { id: subscriptionId },
    });

    // También eliminamos los recordatorios pendientes asociados
    await prisma.subscriptionReminder.deleteMany({
      where: {
        userId: user.id,
        productId: subscription.productId,
        status: "pendiente",
      },
    });

    revalidatePath("/suscripciones");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

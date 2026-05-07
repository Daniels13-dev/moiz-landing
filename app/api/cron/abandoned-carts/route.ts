import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Next.js Cron Setup (Requires Vercel or similar external cron caller)
export async function GET(request: Request) {
  // Verificamos el header de autorización para que solo Vercel Cron u otro servicio seguro pueda llamarlo
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    // 1. Calcular el límite de tiempo (ej. 30 minutos atrás)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // 2. Buscar carritos abandonados:
    // Criterios: Estado "pendiente", creados hace más de 30 minutos pero menos de 1 hora
    // y que no tengan ya un historial de "recordatorio_enviado".
    const abandonedOrders = await prisma.order.findMany({
      where: {
        status: "pendiente",
        createdAt: {
          lte: thirtyMinutesAgo,
          gte: oneHourAgo,
        },
        history: {
          none: {
            status: "recordatorio_enviado",
          },
        },
      },
      include: {
        items: true,
      },
    });

    if (abandonedOrders.length === 0) {
      return NextResponse.json({ message: "No hay carritos abandonados recientes." });
    }

    const processedOrders = [];

    // 3. Procesar cada orden abandonada
    for (const order of abandonedOrders) {
      // AQUÍ PUEDES CONECTAR UNA API DE WHATSAPP (Ej: Twilio, Meta API) O CORREO (Resend)
      // Ejemplo (Simulado):
      // await sendWhatsAppMessage(order.customerPhone, `¡Hola ${order.customerName}! Olvidaste productos en tu carrito...`);

      // 4. Registrar en el historial que ya se envió el recordatorio para no hacer spam
      await prisma.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: "recordatorio_enviado",
          comment: "Mensaje automático de recuperación de carrito enviado.",
        },
      });

      processedOrders.push(order.id);
    }

    return NextResponse.json({
      success: true,
      recoveredCount: processedOrders.length,
      ordersProcessed: processedOrders,
    });
  } catch (error) {
    console.error("Error procesando carritos abandonados:", error);
    return NextResponse.json({ error: "Fallo interno del servidor" }, { status: 500 });
  }
}

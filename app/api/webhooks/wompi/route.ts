import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { OrderService } from "@/services/order-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validar la firma (Signature) - OBLIGATORIO para producción
    const secretEvents = process.env.WOMPI_EVENTS_SECRET;
    
    if (!secretEvents) {
      console.error("CRÍTICO: WOMPI_EVENTS_SECRET no está configurado en las variables de entorno.");
      return NextResponse.json({ error: "Error de configuración de seguridad" }, { status: 500 });
    }

    if (!body.signature) {
      return NextResponse.json({ error: "Firma faltante" }, { status: 401 });
    }

    const { properties, checksum } = body.signature;
    const concatenatedValues = properties.map((prop: string) => {
      return prop.split('.').reduce((o: any, i: string) => o[i], body.data);
    }).join('');
    
    // IMPORTANTE: Wompi requiere incluir el timestamp entre los valores y el secreto
    const hash = crypto.createHash('sha256')
      .update(concatenatedValues + body.timestamp + secretEvents)
      .digest('hex');
    
    if (hash !== checksum) {
      console.error(`[Wompi Webhook] Firma inválida. Esperado: ${checksum}, Calculado: ${hash}`);
      return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
    }

    if (body.event === "transaction.updated") {
      const transaction = body.data.transaction;
      const reference = transaction.reference;
      const status = transaction.status;
      
      console.log(`[Wompi Webhook] ✅ Firma válida. Evento: ${body.event} | Ref: ${reference} | Status: ${status}`);

      const orderNumber = parseInt(reference.replace("MZ-", ""), 10);
      
      if (isNaN(orderNumber)) {
        console.error(`[Wompi Webhook] ❌ Referencia inválida: ${reference}`);
        return NextResponse.json({ error: "Referencia inválida" }, { status: 400 });
      }

      const order = await prisma.order.findUnique({ where: { orderNumber } });

      if (!order) {
        console.error(`[Wompi Webhook] ❌ Orden no encontrada: orderNumber=${orderNumber}`);
        return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
      }

      console.log(`[Wompi Webhook] 📦 Orden encontrada: ${order.id} | Estado actual: ${order.status}`);

      let newStatus = order.status;
      if (status === "APPROVED") {
        const paidAmount = transaction.amount_in_cents;
        const expectedAmount = Math.round(Number(order.totalAmount) * 100);

        console.log(`[Wompi Webhook] 💰 Monto pagado: ${paidAmount} | Monto esperado: ${expectedAmount}`);

        if (paidAmount !== expectedAmount) {
          console.error(`[Wompi Webhook] 🚨 ALERTA: Montos no coinciden!`);
          await OrderService.updateOrderStatusWithHistory(
            order.id, 
            "error_pago", 
            `ALERTA DE FRAUDE: El monto pagado (${paidAmount}) no coincide con el esperado (${expectedAmount}). Ref Wompi: ${transaction.id}`
          );
          return NextResponse.json({ error: "Monto inválido" }, { status: 400 });
        }
        
        newStatus = "pagada";
      } else if (status === "DECLINED" || status === "ERROR" || status === "VOIDED") {
        newStatus = "rechazada";
      }

      if (newStatus !== order.status) {
        console.log(`[Wompi Webhook] 🔄 Actualizando estado: ${order.status} → ${newStatus}`);
        await OrderService.updateOrderStatusWithHistory(
          order.id, 
          newStatus, 
          `Actualización automática Wompi. Ref: ${transaction.id}. Status: ${status}`
        );
        revalidatePath("/admin");
        revalidatePath("/admin/pedidos");
        revalidatePath("/");
        console.log(`[Wompi Webhook] ✅ Estado actualizado correctamente a: ${newStatus}`);
      } else {
        console.log(`[Wompi Webhook] ℹ️ Estado sin cambios: ${newStatus}`);
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true, message: "Evento ignorado" });
  } catch (error) {
    console.error("Error en Webhook Wompi:", error);
    return NextResponse.json({ error: "Error procesando webhook" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { OrderService } from "@/services/order-service";
import { sendEmail } from "@/lib/email";

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

        // Enviar correo de confirmación de pago
        try {
          await sendEmail({
            to: order.customerEmail || "",
            subject: `✅ ¡Pago Recibido! Tu pedido MZ-${order.orderNumber} está en proceso`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 32px; border: 1px solid #f4f4f5;">
                <img src="https://res.cloudinary.com/dvyqtn7gy/image/upload/v1776223130/moiz/logo/logo.png" alt="Möiz logo" style="width: 80px; margin-bottom: 40px;" />
                
                <h1 style="font-size: 32px; font-weight: 900; color: #09090b; letter-spacing: -0.05em; margin-bottom: 16px; line-height: 1.1;">
                  ¡Tu pago ha sido <span style="color: #6a8e2a;">confirmado</span>!
                </h1>
                
                <p style="font-size: 16px; color: #52525b; font-weight: 500; margin-bottom: 32px; line-height: 1.6;">
                  Hola ${order.customerName.split(' ')[0]}, estamos preparando tu pedido <strong>MZ-${order.orderNumber}</strong> con mucho amor. Pronto recibirás una notificación cuando esté en camino.
                </p>
                
                <div style="background-color: #f7fee7; padding: 32px; border-radius: 24px; margin-bottom: 32px;">
                  <h3 style="font-size: 14px; font-weight: 800; color: #6a8e2a; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; margin-top: 0;">Resumen del Pago</h3>
                  <p style="margin: 0; font-size: 14px; color: #3f6212;">Monto: <strong>$${order.totalAmount.toLocaleString('es-CO')}</strong></p>
                  <p style="margin: 4px 0 0; font-size: 14px; color: #3f6212;">Referencia: <strong>MZ-${order.orderNumber}</strong></p>
                  <p style="margin: 4px 0 0; font-size: 14px; color: #3f6212;">Método: <strong>Wompi (Bancolombia)</strong></p>
                </div>
                
                <a href="https://moizpets.com/rastrear-mi-pedido?id=MZ-${order.orderNumber}&nit=${order.customerIdentification}" style="display: block; background-color: #6a8e2a; color: #ffffff; text-decoration: none; padding: 20px; border-radius: 100px; font-weight: 900; font-size: 16px; text-align: center; margin-bottom: 32px;">
                  Rastrear mi pedido
                </a>
                
                <p style="font-size: 12px; color: #a1a1aa; text-align: center;">
                  Si tienes alguna duda, escríbenos a nuestro WhatsApp o responde a este correo.
                </p>
              </div>
            `
          });
          console.log(`[Wompi Webhook] 📧 Correo de confirmación enviado a: ${order.customerEmail}`);
        } catch (emailError) {
          console.error(`[Wompi Webhook] ❌ Error enviando correo:`, emailError);
        }
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

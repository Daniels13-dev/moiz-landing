import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { OrderService } from "@/services/order-service";

export async function POST(request: Request) {
  try {
    // ePayco puede enviar los datos como JSON o Form Data
    const isJson = request.headers.get('content-type')?.includes('application/json');
    let body: any;
    
    if (isJson) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      body = Object.fromEntries(formData.entries());
    }

    // 1. Validar la firma (Signature) - OBLIGATORIO
    const p_cust_id_cliente = process.env.EPAYCO_CUST_ID;
    const p_key = process.env.EPAYCO_P_KEY;
    
    if (!p_cust_id_cliente || !p_key) {
      console.error("CRÍTICO: EPAYCO_CUST_ID o EPAYCO_P_KEY no configurados.");
      return NextResponse.json({ error: "Error de configuración" }, { status: 500 });
    }

    if (!body.x_signature || !body.x_ref_payco) {
      return NextResponse.json({ error: "Firma o Referencia Payco faltante" }, { status: 401 });
    }

    const signatureStr = `${p_cust_id_cliente}^${p_key}^${body.x_ref_payco}^${body.x_transaction_id}^${body.x_amount}^${body.x_currency_code}`;
    const hash = crypto.createHash('sha256').update(signatureStr).digest('hex');
    
    if (hash !== body.x_signature) {
      return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
    }

    const reference = body.x_id_invoice; // Ej: "MZ-123"
    const responseStatus = body.x_response; // "Aceptada", "Rechazada", "Pendiente", "Fallida"
    
    if (!reference) {
      return NextResponse.json({ error: "Referencia requerida" }, { status: 400 });
    }

    const orderNumber = parseInt(reference.toString().replace("MZ-", ""), 10);
    
    if (isNaN(orderNumber)) {
      return NextResponse.json({ error: "Referencia inválida" }, { status: 400 });
    }

    // Buscar la orden
    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    // Mapear estado de ePayco a tu base de datos
    let newStatus = order.status;
    if (responseStatus === "Aceptada") {
      // --- SEGURIDAD CRÍTICA: Validar que el monto pagado coincida con la orden ---
      const paidAmount = parseFloat(body.x_amount);
      const expectedAmount = Number(order.totalAmount);

      if (Math.abs(paidAmount - expectedAmount) > 1) {
        await OrderService.updateOrderStatusWithHistory(
          order.id, 
          "error_pago", 
          `ALERTA DE FRAUDE: El monto pagado (${paidAmount}) no coincide con el esperado (${expectedAmount}). Ref ePayco: ${body.x_ref_payco}`
        );
        return NextResponse.json({ error: "Monto inválido" }, { status: 400 });
      }

      newStatus = "pagada";
    } else if (responseStatus === "Rechazada" || responseStatus === "Fallida") {
      newStatus = "rechazada";
    }

      // Si el estado cambia, actualizar BD e historial usando el servicio centralizado
      if (newStatus !== order.status) {
        await OrderService.updateOrderStatusWithHistory(
          order.id, 
          newStatus, 
          `Actualización automática ePayco. Ref: ${body.x_transaction_id}. Status: ${responseStatus}`
        );

        // Purgar caché de vistas relacionadas
        revalidatePath("/admin");
        revalidatePath("/");
      }

    return NextResponse.json({ success: true, message: "Webhook procesado exitosamente" });
  } catch (error) {
    console.error("Error en Webhook ePayco:", error);
    return NextResponse.json({ error: "Error procesando webhook" }, { status: 500 });
  }
}

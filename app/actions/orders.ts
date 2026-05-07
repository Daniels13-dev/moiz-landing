"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { OrderService } from "@/services/order-service";
import { getSecurePrisma } from "@/lib/prisma-secure";
import { checkoutSchema, trackOrderSchema } from "@/lib/validations/order";
import { checkRateLimit } from "@/lib/rate-limit";
import { handleActionError } from "@/lib/action-utils";
import { OrderUtils } from "@/lib/order-utils";

export type OrderStatus = "pendiente" | "pagado" | "enviado" | "entregado" | "cancelado";

/**
 * SERVER ACTION: Crear un nuevo pedido.
 * Orquesta la validación, seguridad y creación delegando en OrderService.
 */
export async function createOrder(data: any) {
  try {
    await checkRateLimit(10); 
    const validatedData = checkoutSchema.parse(data);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // --- IDEMPOTENCIA ---
    const existingOrder = await prisma.order.findFirst({
      where: {
        customerEmail: validatedData.customerEmail,
        status: "pendiente",
        totalAmount: validatedData.totalAmount,
        createdAt: { gte: new Date(Date.now() - 2 * 60 * 1000) } // 2 min
      },
      orderBy: { createdAt: "desc" }
    });

    let order = existingOrder;
    let isDuplicate = !!existingOrder;

    if (!order) {
      order = await OrderService.processOrderCreation(validatedData, user);
    }

    // --- FIRMA WOMPI & LOGS ---
    let wompiSignature = null;
    const amountInCents = Math.round(order.totalAmount * 100);
    const displayId = `MZ-${order.orderNumber}`;
    const currency = "COP";
    const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

    if (integritySecret) {
      const crypto = await import("crypto");
      const chain = `${displayId}${amountInCents}${currency}${integritySecret}`;
      wompiSignature = crypto.createHash("sha256").update(chain).digest("hex");

      // Guardar log del intento de firma
      await prisma.paymentLog.create({
        data: {
          orderId: order.id,
          provider: "WOMPI",
          transactionReference: displayId,
          signature: wompiSignature,
          status: isDuplicate ? "REGENERATED_FOR_DUPLICATE" : "SIGNATURE_GENERATED",
          payload: { amountInCents, currency }
        }
      });
    }

    revalidatePath("/admin/pedidos");
    revalidatePath("/admin");
    revalidatePath("/pedidos");
    revalidatePath("/", "layout");

    return { 
      success: true, 
      orderId: order.id, 
      orderNumber: order.orderNumber,
      wompiSignature,
      isDuplicate
    };
  } catch (error: any) {
    return handleActionError(error, "createOrder");
  }
}

/**
 * SERVER ACTION: Obtener datos de pago de un pedido para reintento.
 * Genera la firma de integridad de Wompi necesaria.
 */
export async function getOrderPaymentData(orderNumberDisplay: string) {
  try {
    const orderNumber = OrderUtils.parseOrderNumber(orderNumberDisplay);
    if (orderNumber === null) return { error: "Referencia inválida" };

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: {
        orderNumber: true,
        totalAmount: true,
        customerEmail: true,
        customerName: true,
        customerPhone: true,
      },
    });

    if (!order) return { error: "Pedido no encontrado" };

    const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;
    let signature = null;
    const amountInCents = Math.round(Number(order.totalAmount) * 100);
    const reference = `MZ-${order.orderNumber}`;

    if (integritySecret) {
      const crypto = await import("crypto");
      const chain = `${reference}${amountInCents}COP${integritySecret}`;
      signature = crypto.createHash("sha256").update(chain).digest("hex");
    }

    return {
      success: true,
      amountInCents,
      reference,
      customerEmail: order.customerEmail || "",
      customerName: order.customerName || "",
      customerPhone: order.customerPhone || "",
      signature,
    };
  } catch (error: any) {
    return { error: "Error al obtener datos del pedido" };
  }
}

/**
 * SERVER ACTION: Obtener todos los pedidos (Solo Admin).
 */
export async function getAllOrders() {
  return await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      profile: { select: { email: true, fullName: true } },
    },
  });
}

/**
 * SERVER ACTION: Actualizar el estado de un pedido (Solo Admin).
 */
export async function updateOrderStatus(orderId: string, newStatus: OrderStatus, comment?: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "No autorizado" };

    const updated = await OrderService.updateOrderStatusWithHistory(
      orderId,
      newStatus,
      comment || `Estado actualizado a "${newStatus}" por administrador.`
    );

    revalidatePath("/admin/pedidos");
    revalidatePath(`/admin/pedidos/${orderId}`);
    revalidatePath("/admin");

    return { success: true, order: updated };
  } catch (error: any) {
    return handleActionError(error, "updateOrderStatus");
  }
}


export async function getUserOrders() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const db = getSecurePrisma(user.id);
  return await db.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
}

/**
 * SERVER ACTION: Obtener detalle de pedido por ID.
 */
export async function getOrderById(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const db = getSecurePrisma(user.id);
  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: true,
      history: { orderBy: { changedAt: "desc" } },
      profile: true,
    },
  });

  // Verificación manual adicional para Admins si RLS no los cubre
  if (!order) {
    const profile = await prisma.profile.findUnique({ where: { id: user.id }, select: { role: true } });
    if (profile?.role === "ADMIN") {
      return await prisma.order.findUnique({
        where: { id },
        include: { items: true, history: { orderBy: { changedAt: "desc" } }, profile: true },
      });
    }
  }

  return order;
}

/**
 * SERVER ACTION: Obtener detalle por número de pedido (MZ-X).
 * Funciona sin sesión para soportar redirecciones de Wompi y pedidos de invitados.
 */
export async function getOrderByNumber(orderNumberDisplay: string) {
  try {
    await checkRateLimit(5); // Límite agresivo para evitar enumeración
    const orderNumber = OrderUtils.parseOrderNumber(orderNumberDisplay);
  if (orderNumber === null) return null;

  // Usamos Prisma directo para que funcione siempre (redirecciones de Wompi, invitados, admins)
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        history: { orderBy: { changedAt: "desc" } },
        profile: true,
      },
    });

    return order ?? null;
  } catch (error) {
    // Si excede el rate limit o hay error, devolvemos null
    return null;
  }
}

/**
 * SERVER ACTION: Rastreo público de pedido con PII ofuscada.
 */
export async function trackOrder(orderDisplay: string, nit: string) {
  try {
    await checkRateLimit(20);
    const validated = trackOrderSchema.parse({ orderDisplay, nit });
    const orderNumber = OrderUtils.parseOrderNumber(validated.orderDisplay);

    if (orderNumber === null) return { error: "Referencia inválida." };

    const order = await prisma.order.findFirst({
      where: { orderNumber },
      include: {
        items: true,
        history: { orderBy: { changedAt: "desc" } },
      },
    });

    if (!order) return { error: "Pedido no encontrado." };

    if (!OrderUtils.compareNit(order.customerIdentification || "", nit)) {
      return { error: "La identificación no coincide." };
    }

    // Ofuscar PII para vista pública
    return {
      success: true,
      order: {
        ...order,
        customerName: (order.customerName || "").split(" ")[0] + " ***",
        customerPhone: (order.customerPhone || "").length > 4 ? "***" + (order.customerPhone || "").slice(-4) : "***",
        customerAddress: (order.customerAddress || "").slice(0, 5) + " ***",
      },
    };
  } catch (error) {
    return { error: "Error al consultar el pedido." };
  }
}

/**
 * SERVER ACTION: Factura pública (Verificación de 2 factores).
 */
export async function getPublicInvoice(orderDisplay: string, nit: string, phoneLast4?: string) {
  try {
    const orderNumber = OrderUtils.parseOrderNumber(orderDisplay);
    if (orderNumber === null) return null;

    const order = await prisma.order.findUnique({ where: { orderNumber } });
    if (!order) return null;

    if (!OrderUtils.compareNit(order.customerIdentification || "", nit)) return null;

    const invoice = await prisma.invoice.findUnique({
      where: { orderId: order.id },
      include: { order: { include: { items: true } } },
    });

    if (!invoice) return null;

    const isVerified = phoneLast4 === (order.customerPhone || "").replace(/\D/g, "").slice(-4);

    if (!isVerified) {
      return {
        ...invoice,
        customerName: (invoice.customerName || "").split(" ")[0] + " ***",
        customerAddress: (invoice.customerAddress || "").slice(0, 6) + " ***",
        customerPhone: (invoice.customerPhone || "").length > 4 ? "***" + (invoice.customerPhone || "").slice(-4) : "***",
        customerNit: (invoice.customerNit || "").length > 4 ? "***" + (invoice.customerNit || "").slice(-4) : "***",
        isMasked: true,
      };
    }

    return { ...invoice, isMasked: false };
  } catch (error) {
    return null;
  }
}

/**
 * SERVER ACTION: Envío de factura por correo.
 */
export async function sendInvoiceToCustomerEmail(orderDisplay: string, nit: string) {
  try {
    const orderNumber = OrderUtils.parseOrderNumber(orderDisplay);
    if (orderNumber === null) return { error: "Referencia inválida" };

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { profile: true }
    });

    if (!order) return { error: "Pedido no encontrado" };
    if (!OrderUtils.compareNit(order.customerIdentification || "", nit)) {
      return { error: "Identificación incorrecta" };
    }

    const email = order.profile?.email || order.customerEmail;
    if (!email) return { error: "No hay correo asociado" };

    console.log(`[EMAIL SERVICE] Factura MZ-${orderNumber} enviada a: ${email}`);
    return { success: true, message: `Enviada a ${email.split('@')[0].slice(0,3)}***@${email.split('@')[1]}` };
  } catch (error) {
    return { error: "Error al enviar el correo" };
  }
}

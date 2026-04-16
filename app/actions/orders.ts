"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { OrderService } from "@/services/order-service";

export type OrderStatus = "pendiente" | "pagado" | "enviado" | "entregado" | "cancelado";

export interface CreateOrderData {
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    variantId?: string;
    isSubscription?: boolean;
    subscriptionInterval?: string;
  }[];
  customerName: string;
  customerLastName?: string;
  customerPhone: string;
  customerAddress: string;
  customerEmail?: string;
  customerNit?: string;
  customerIdType?: string;
  customerCity?: string;
  customerState?: string;
  customerPhoneCountry?: string;
  totalAmount: number;
  billingDifferent?: boolean;
  billingName?: string;
  billingLastName?: string;
  billingNit?: string;
  billingIdType?: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingPhone?: string;
  billingPhoneCountry?: string;
  saveInfo?: boolean;
  shippingMethod?: "estandar" | "domicilio";
}

export async function createOrder(data: CreateOrderData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (data.items.length === 0) {
    return { error: "El carrito está vacío." };
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create the Order
      const newOrder = await tx.order.create({
        data: {
          ...(user?.id ? { profile: { connect: { id: user.id } } } : {}),
          customerName: `${data.customerName} ${data.customerLastName || ""}`.trim(),
          customerPhone: `${data.customerPhoneCountry || "+57"}${data.customerPhone}`.replace(
            /[\s-]/g,
            "",
          ),
          customerAddress: data.customerAddress,
          customerCity: data.customerCity,
          customerState: data.customerState,
          customerIdentification: data.customerNit,
          totalAmount: data.totalAmount,
          currency: "COP",
          status: "pendiente",
          shippingMethod: data.shippingMethod || "estandar",
          stock: 1,

          billingDifferent: data.billingDifferent || false,
          billingName: data.billingName,
          billingNit: data.billingNit,
          billingIdType: data.billingIdType || "CC",
          billingAddress: data.billingAddress,
          billingCity: data.billingCity,
          billingState: data.billingState,
          billingPhone: data.billingPhone,
          billingPhoneCountry: data.billingPhoneCountry || "+57",

          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              quantity: item.quantity,
              price: item.price,
              variantId: item.variantId,
            })),
          },
          history: {
            create: {
              status: "pendiente",
              comment: "Pedido creado satisfactoriamente",
            },
          },
        },
      });

      // 2. Stock and Subscriptions
      await OrderService.processStockDecrement(tx, data.items);

      for (const item of data.items) {
        if (item.isSubscription && user?.id) {
          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + 30);

          await tx.subscription.create({
            data: {
              userId: user.id,
              productId: item.productId,
              status: "activa",
              quantity: item.quantity,
              lockedPrice: item.price,
              nextBillingDate: nextDate,
              frequencyDays: 30,
            },
          });

          await tx.subscriptionReminder.create({
            data: {
              userId: user.id,
              productId: item.productId,
              reminderDate: nextDate,
              status: "pendiente",
            },
          });
        }
      }

      // 3. User Info Sync
      if (user?.id && data.saveInfo) {
        await OrderService.syncProfileWithOrder(tx, user.id, data);
      }

      return newOrder;
    });

    revalidatePath("/admin/pedidos");
    revalidatePath("/pedidos");

    const orderNumber = (order as any)?.orderNumber;
    return { success: true, orderId: order.id, orderNumber };
  } catch (error: any) {
    console.error("Order creation error:", error);
    return { error: error.message || "No se pudo crear el pedido. Por favor intenta de nuevo." };
  }
}

export async function getUserOrders() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  return await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });
}

export async function getOrderById(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  const isAdmin = profile?.role === "ADMIN";

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      history: {
        orderBy: { changedAt: "desc" },
      },
      profile: true,
    },
  });

  if (!order) return null;

  if (order.userId !== user.id && !isAdmin) {
    return null;
  }

  return order;
}

export async function getOrderByNumber(orderNumberDisplay: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const numberStr = orderNumberDisplay.toUpperCase().replace("MZ-", "").trim();
  const orderNumber = parseInt(numberStr);

  if (isNaN(orderNumber)) return null;

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
  const isAdmin = profile?.role === "ADMIN";

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      history: {
        orderBy: { changedAt: "desc" },
      },
      profile: true,
    },
  });

  if (!order) return null;

  if (order.userId !== user.id && !isAdmin) {
    return null;
  }

  return order;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, comment?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (profile?.role !== "ADMIN") {
    throw new Error("No autorizado");
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status,
          comment: comment || `Estado actualizado a ${status}`,
        },
      });

      if (status === "pagado") {
        await OrderService.generateInvoice(tx, orderId);
      }
    });

    revalidatePath(`/admin/pedidos/${orderId}`);
    revalidatePath("/admin/pedidos");
    revalidatePath("/pedidos");

    return { success: true };
  } catch (error) {
    console.error("Update status error:", error);
    return { error: "Error al actualizar el estado" };
  }
}

export async function getAllOrders(status?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (profile?.role !== "ADMIN") return [];

  return await prisma.order.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      profile: true,
    },
  });
}

export async function trackOrder(orderDisplay: string, nit: string) {
  try {
    const numberPart = orderDisplay.toUpperCase().replace("MZ-", "").trim();
    const orderNumber = parseInt(numberPart);

    if (isNaN(orderNumber)) {
      return { error: "Formato de número de pedido inválido." };
    }

    const order = await prisma.order.findFirst({
      where: { orderNumber },
      include: {
        items: true,
        history: {
          orderBy: { changedAt: "desc" },
        },
      },
    });

    if (!order) {
      return { error: "Pedido no encontrado." };
    }

    const normalizedInputNit = nit.trim().replace(/\D/g, "");
    const normalizedOrderNit = (order.customerIdentification || "").trim().replace(/\D/g, "");

    if (normalizedOrderNit !== normalizedInputNit) {
      return {
        error: "La identificación no coincide.",
      };
    }

    return { success: true, order };
  } catch (error) {
    console.error("Tracking error:", error);
    return { error: "Error al consultar el pedido." };
  }
}

export async function getInvoiceByOrderId(orderId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
  const isAdmin = profile?.role === "ADMIN";

  const invoice = await prisma.invoice.findUnique({
    where: { orderId },
    include: {
      order: {
        include: { items: true },
      },
    },
  });

  if (!invoice) return null;

  if (invoice.order.userId !== user.id && !isAdmin) {
    return null;
  }

  return invoice;
}

export async function getPublicInvoice(orderDisplay: string, nit: string) {
  try {
    const numberPart = orderDisplay.toUpperCase().replace("MZ-", "").trim();
    const orderNumber = parseInt(numberPart);
    if (isNaN(orderNumber)) return null;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!order) return null;

    const normalizedInputNit = nit.trim().replace(/\D/g, "");
    const normalizedOrderNit = (order.customerIdentification || "").trim().replace(/\D/g, "");
    if (normalizedOrderNit !== normalizedInputNit) return null;

    const invoice = await prisma.invoice.findUnique({
      where: { orderId: order.id },
      include: {
        order: {
          include: { items: true },
        },
      },
    });

    return invoice;
  } catch (error) {
    console.error("Public invoice error:", error);
    return null;
  }
}

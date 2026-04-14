"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

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

          // Billing Data Persistence
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

      // 2. Update and check stock + Create subscriptions if needed
      for (const item of data.items) {
        // Stock management
        if (item.variantId) {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId },
            select: { stock: true, name: true },
          });

          if (!variant || variant.stock < item.quantity) {
            throw new Error(
              `Stock insuficiente para la variante: ${variant?.name || item.variantId}`,
            );
          }

          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        } else {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            select: { stock: true, name: true },
          });

          if (!product || product.stock < item.quantity) {
            throw new Error(
              `Stock insuficiente para el producto: ${product?.name || item.productId}`,
            );
          }

          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        // Subscription management
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

      // 3. Sync Addresses to Profile (Selective & Delta-only)
      if (user?.id && data.saveInfo) {
        await syncProfileWithOrder(tx, user.id, data);
      }

      return newOrder;
    });

    revalidatePath("/admin/pedidos");
    revalidatePath("/pedidos");

    const orderNumber = (order as { orderNumber?: number | string })?.orderNumber;
    return { success: true, orderId: order.id, orderNumber };
  } catch (error) {
    console.error("Order creation error:", error);
    return { error: "No se pudo crear el pedido. Por favor intenta de nuevo." };
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

  // Check if user is admin using Prisma (bypasses RLS)
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

  // Protection: Only owner or admin can see the order
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

  // 1. Clean number (MZ-1001 -> 1001)
  const numberStr = orderNumberDisplay.toUpperCase().replace("MZ-", "").trim();
  const orderNumber = parseInt(numberStr);

  if (isNaN(orderNumber)) return null;

  // 2. Check admin status
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
  const isAdmin = profile?.role === "ADMIN";

  // 3. Find order
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

  // 4. Protection
  if (order.userId !== user.id && !isAdmin) {
    return null;
  }

  return order;
}

async function generateInvoiceForOrder(tx: Prisma.TransactionClient, orderId: string) {
  const order = await tx.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) return;

  // Si existe ya una factura, no duplicar
  const existingInvoice = await tx.invoice.findUnique({
    where: { orderId },
  });
  if (existingInvoice) return;

  // Tomar datos de facturación (de billing o customer)
  const isDifferent = order.billingDifferent;

  const invoiceData = {
    orderId,
    // billingName already contains the full billing name; avoid referencing billingLastName
    customerName: isDifferent ? `${order.billingName || ""}`.trim() : order.customerName,
    customerNit: isDifferent ? order.billingNit || "" : order.customerIdentification || "",
    customerIdType: isDifferent ? order.billingIdType || "CC" : "CC",
    customerAddress: isDifferent ? order.billingAddress || "" : order.customerAddress || "",
    customerCity: isDifferent ? order.billingCity || "" : order.customerCity || "",
    customerState: isDifferent ? order.billingState || "" : order.customerState || "",
    customerPhone: isDifferent
      ? `${order.billingPhoneCountry || "+57"}${order.billingPhone || ""}`
      : order.customerPhone,
    subtotal: order.totalAmount, // Aquí se podría calcular más específicamente si hay IVA etc
    discount: 0, // Implementar lógica de cupones si es necesario
    total: order.totalAmount,
  };

  await tx.invoice.create({
    data: invoiceData,
  });
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

      // Generar factura si el estado es PAGADO
      if (status === "pagado") {
        await generateInvoiceForOrder(tx, orderId);
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

async function syncProfileWithOrder(
  tx: Prisma.TransactionClient,
  userId: string,
  data: CreateOrderData,
) {
  const existingProfile = await tx.profile.findUnique({
    where: { id: userId },
    include: { addresses: true },
  });

  if (!existingProfile) return;

  const fullName = `${data.customerName} ${data.customerLastName || ""}`.trim();

  // --- PROFILE UPDATE ---
  const profileChanged =
    existingProfile.fullName !== fullName ||
    existingProfile.phone !== data.customerPhone ||
    existingProfile.phoneCountry !== (data.customerPhoneCountry || "+57") ||
    existingProfile.idNumber !== data.customerNit ||
    existingProfile.idType !== (data.customerIdType || "CC");

  if (profileChanged) {
    await tx.profile.update({
      where: { id: userId },
      data: {
        fullName,
        phone: data.customerPhone,
        phoneCountry: data.customerPhoneCountry || "+57",
        idNumber: data.customerNit,
        idType: data.customerIdType || "CC",
      },
    });
  }

  // --- SHIPPING ADDRESS ---
  const existingShipping = existingProfile.addresses.find((addr) => addr.type === "SHIPPING");
  const shippingData = {
    fullName,
    phone: data.customerPhone,
    idNumber: data.customerNit,
    idType: data.customerIdType || "CC",
    street: data.customerAddress,
    city: data.customerCity || "",
    state: data.customerState || "",
    country: "Colombia",
  };

  if (existingShipping) {
    const shippingChanged =
      existingShipping.fullName !== shippingData.fullName ||
      existingShipping.phone !== shippingData.phone ||
      existingShipping.idNumber !== shippingData.idNumber ||
      existingShipping.idType !== shippingData.idType ||
      existingShipping.street !== shippingData.street ||
      existingShipping.city !== shippingData.city ||
      existingShipping.state !== shippingData.state;

    if (shippingChanged) {
      await tx.address.update({
        where: { id: existingShipping.id },
        data: shippingData,
      });
    }
  } else {
    await tx.address.create({
      data: { ...shippingData, profileId: userId, type: "SHIPPING" },
    });
  }

  // --- BILLING ADDRESS ---
  const existingBilling = existingProfile.addresses.find((addr) => addr.type === "BILLING");
  let billingData;
  if (data.billingDifferent) {
    billingData = {
      fullName: `${data.billingName || ""} ${data.billingLastName || ""}`.trim(),
      phone: data.billingPhone || data.customerPhone,
      idNumber: data.billingNit || data.customerNit,
      idType: data.billingIdType || data.customerIdType || "CC",
      street: data.billingAddress || "",
      city: data.billingCity || data.customerCity || "",
      state: data.billingState || data.customerState || "",
      country: "Colombia",
    };
  } else {
    billingData = { ...shippingData };
  }

  if (existingBilling) {
    const billingChanged =
      existingBilling.fullName !== billingData.fullName ||
      existingBilling.phone !== billingData.phone ||
      existingBilling.idNumber !== billingData.idNumber ||
      existingBilling.idType !== billingData.idType ||
      existingBilling.street !== billingData.street ||
      existingBilling.city !== billingData.city ||
      existingBilling.state !== billingData.state;

    if (billingChanged) {
      await tx.address.update({
        where: { id: existingBilling.id },
        data: billingData,
      });
    }
  } else {
    await tx.address.create({
      data: { ...billingData, profileId: userId, type: "BILLING" },
    });
  }
}

export async function trackOrder(orderDisplay: string, nit: string) {
  try {
    // 1. Clean order display (remove MZ- if present)
    const numberPart = orderDisplay.toUpperCase().replace("MZ-", "").trim();
    const orderNumber = parseInt(numberPart);

    if (isNaN(orderNumber)) {
      return { error: "Formato de número de pedido inválido." };
    }

    // 2. Find order
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

    // 3. Verify identifying data (Nit)
    // Normalize: remove everything that is not a digit
    const normalizedInputNit = nit.trim().replace(/\D/g, "");
    const normalizedOrderNit = (order.customerIdentification || "").trim().replace(/\D/g, "");

    if (normalizedOrderNit !== normalizedInputNit) {
      return {
        error: `La identificación no coincide. Buscado: [${normalizedInputNit}], Encontrado en Pedido: [${normalizedOrderNit}]`,
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

  // Protection: Only owner or admin
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

    // Verify Nit
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

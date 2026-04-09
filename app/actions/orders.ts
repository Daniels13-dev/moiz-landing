"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type OrderStatus =
  | "pendiente"
  | "pagado"
  | "enviado"
  | "entregado"
  | "cancelado";

export interface CreateOrderData {
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
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
          userId: user?.id || null,
          customerName:
            `${data.customerName} ${data.customerLastName || ""}`.trim(),
          customerPhone: `${data.customerPhoneCountry || "+57"}${data.customerPhone}`.replace(/[\s-]/g, ''),
          customerAddress: data.customerAddress,
          totalAmount: data.totalAmount,
          currency: "COP",
          status: "pendiente",
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              quantity: item.quantity,
              price: item.price,
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

      // 2. Update stock
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 3. Sync Addresses to Profile (Selective & Delta-only)
      if (user?.id && data.saveInfo) {
        await syncProfileWithOrder(tx, user.id, data);
      }

      return newOrder;
    });

    revalidatePath("/admin/pedidos");
    revalidatePath("/pedidos");

    const orderNumber = (order as { orderNumber?: number | string })
      ?.orderNumber;
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

  // Check if user is admin
  const { data: profile } = await supabase
    .from("Profile")
    .select("role")
    .eq("id", user.id)
    .single();

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

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  comment?: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");

  const { data: profile } = await supabase
    .from("Profile")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "ADMIN") {
    throw new Error("No autorizado");
  }

  try {
    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: { status },
      }),
      prisma.orderStatusHistory.create({
        data: {
          orderId,
          status,
          comment: comment || `Estado actualizado a ${status}`,
        },
      }),
    ]);

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

  const { data: profile } = await supabase
    .from("Profile")
    .select("role")
    .eq("id", user.id)
    .single();

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
  tx: any,
  userId: string,
  data: CreateOrderData,
) {
  const existingProfile = await tx.profile.findUnique({
    where: { id: userId },
    include: { addresses: true },
  });

  if (!existingProfile) return;

  const fullName =
    `${data.customerName} ${data.customerLastName || ""}`.trim();

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
  const existingShipping = existingProfile.addresses.find(
    (a: any) => a.type === "SHIPPING",
  );
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
  const existingBilling = existingProfile.addresses.find(
    (a: any) => a.type === "BILLING",
  );
  let billingData;
  if (data.billingDifferent) {
    billingData = {
      fullName:
        `${data.billingName || ""} ${data.billingLastName || ""}`.trim(),
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


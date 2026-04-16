import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class OrderService {
  /**
   * Genera una factura para un pedido si no existe ya una.
   */
  static async generateInvoice(tx: Prisma.TransactionClient, orderId: string) {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) return;

    const existingInvoice = await tx.invoice.findUnique({
      where: { orderId },
    });
    if (existingInvoice) return;

    const isDifferent = order.billingDifferent;

    const invoiceData = {
      orderId,
      customerName: isDifferent ? `${order.billingName || ""}`.trim() : order.customerName,
      customerNit: isDifferent ? order.billingNit || "" : order.customerIdentification || "",
      customerIdType: isDifferent ? order.billingIdType || "CC" : "CC",
      customerAddress: isDifferent ? order.billingAddress || "" : order.customerAddress || "",
      customerCity: isDifferent ? order.billingCity || "" : order.customerCity || "",
      customerState: isDifferent ? order.billingState || "" : order.customerState || "",
      customerPhone: isDifferent
        ? `${order.billingPhoneCountry || "+57"}${order.billingPhone || ""}`
        : order.customerPhone,
      subtotal: order.totalAmount,
      discount: 0,
      total: order.totalAmount,
    };

    return await tx.invoice.create({
      data: invoiceData,
    });
  }

  /**
   * Sincroniza la información del perfil del usuario con los datos del pedido.
   */
  static async syncProfileWithOrder(
    tx: Prisma.TransactionClient,
    userId: string,
    data: any,
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

  /**
   * Maneja la lógica de reducción de stock para productos y variantes.
   */
  static async processStockDecrement(tx: Prisma.TransactionClient, items: any[]) {
    for (const item of items) {
      if (item.variantId) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          select: { stock: true, name: true },
        });

        if (!variant || variant.stock < item.quantity) {
          throw new Error(`Stock insuficiente para la variante: ${variant?.name || item.variantId}`);
        }

        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      } else {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true, name: true },
        });

        if (!product || product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para el producto: ${product?.name || item.productId}`);
        }

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }
  }
}

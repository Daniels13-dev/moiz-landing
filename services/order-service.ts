import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ProfileService } from "./profile-service";

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
    await ProfileService.syncWithOrderData(userId, data, tx);
  }

  /**
   * Maneja la lógica de reducción de stock para productos y variantes.
   */
  static async processStockDecrement(tx: Prisma.TransactionClient, items: any[]) {
    for (const item of items) {
      if (item.variantId) {
        // Actualización Atómica: Solo descuenta si el stock es mayor o igual a la cantidad
        const result = await tx.productVariant.updateMany({
          where: { 
            id: item.variantId,
            stock: { gte: item.quantity } 
          },
          data: { stock: { decrement: item.quantity } },
        });

        if (result.count === 0) {
          throw new Error(`Stock insuficiente para la variante ID: ${item.variantId}`);
        }
      } else {
        // Actualización Atómica para productos sin variante
        const result = await tx.product.updateMany({
          where: { 
            id: item.productId,
            stock: { gte: item.quantity }
          },
          data: { stock: { decrement: item.quantity } },
        });

        if (result.count === 0) {
          throw new Error(`Stock insuficiente para el producto ID: ${item.productId}`);
        }
      }
    }
  }
  /**
   * Actualiza el estado de una orden y registra el cambio en el historial.
   * Centralizado para ser usado por webhooks (Wompi, ePayco) y Admin.
   */
  static async updateOrderStatusWithHistory(orderId: string, newStatus: string, comment: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Orden no encontrada");

    if (order.status === newStatus) return order;

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: orderId },
        data: { status: newStatus },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status: newStatus,
          comment,
        },
      });

      // Si el pago es exitoso, podemos generar la factura automáticamente
      if (newStatus === "pagada") {
        await this.generateInvoice(tx, orderId);
        
        // Marcamos que el carrito del usuario necesita limpiarse
        if (order.userId) {
          await tx.profile.update({
            where: { id: order.userId },
            data: { cartNeedsClear: true },
          });
        }
      }

      return updated;
    });

    return updatedOrder;
  }

  /**
   * Libera el stock de pedidos abandonados (más de 1 hora en estado pendiente o rechazada).
   */
  static async releaseAbandonedStock() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // Buscamos órdenes que necesiten ser canceladas
    const abandonedOrders = await prisma.order.findMany({
      where: {
        status: { in: ["pendiente", "rechazada"] },
        createdAt: { lt: oneHourAgo },
      },
      include: { items: true },
    });

    if (abandonedOrders.length === 0) return { count: 0 };

    const results = await prisma.$transaction(async (tx) => {
      for (const order of abandonedOrders) {
        // 1. Devolver stock
        for (const item of order.items) {
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            });
          } else {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            });
          }
        }

        // 2. Cancelar orden
        await tx.order.update({
          where: { id: order.id },
          data: { status: "cancelada" },
        });

        // 3. Registrar historial
        await tx.orderStatusHistory.create({
          data: {
            orderId: order.id,
            status: "cancelada",
            comment: "Pedido cancelado automáticamente por abandono (Sistema de Recuperación E2E).",
          },
        });
      }
      return { count: abandonedOrders.length };
    });

    return results;
  }

  /**
   * Genera un número de pedido aleatorio único mayor a 1000.
   */
  static async generateUniqueOrderNumber(tx: Prisma.TransactionClient): Promise<number> {
    let isUnique = false;
    let orderNumber = 0;

    while (!isUnique) {
      orderNumber = Math.floor(Math.random() * (999999 - 1000 + 1)) + 1000;
      const existing = await tx.order.findUnique({
        where: { orderNumber },
        select: { id: true }
      });
      if (!existing) isUnique = true;
    }
    return orderNumber;
  }

  /**
   * Procesa la creación completa de un pedido (Transaccional).
   */
  static async processOrderCreation(data: any, user: any) {
    return await prisma.$transaction(async (tx) => {
      // 1. Validar Precios
      const dbProducts = await tx.product.findMany({
        where: { id: { in: data.items.map((i: any) => i.productId) } },
        include: { variants: true },
      });

      let calculatedTotal = 0;
      const secureItems = data.items.map((item: any) => {
        const dbProduct = dbProducts.find((p) => p.id === item.productId);
        if (!dbProduct) throw new Error(`Producto no encontrado: ${item.productName}`);

        let realPrice = dbProduct.price;
        if (item.variantId) {
          const variant = dbProduct.variants.find((v) => v.id === item.variantId);
          if (!variant) throw new Error(`Variante no encontrada para: ${item.productName}`);
          realPrice = variant.price !== null ? variant.price : dbProduct.price;
        }

        calculatedTotal += realPrice * item.quantity;
        return {
          ...item,
          productName: dbProduct.name,
          price: realPrice,
        };
      });

      if (Math.abs(calculatedTotal - data.totalAmount) > 1) {
        throw new Error("Violación de integridad de precios detectada.");
      }

      // 2. Crear Orden
      const orderNumber = await this.generateUniqueOrderNumber(tx);
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          ...(user?.id ? { profile: { connect: { id: user.id } } } : {}),
          customerName: `${data.customerName} ${data.customerLastName || ""}`.trim(),
          customerPhone: `${data.customerPhoneCountry || "+57"}${data.customerPhone}`.replace(/[\s-]/g, ""),
          customerAddress: data.customerAddress,
          customerCity: data.customerCity,
          customerState: data.customerState,
          customerIdentification: data.customerNit,
          customerEmail: data.customerEmail,
          totalAmount: calculatedTotal,
          currency: "COP",
          status: "pendiente",
          shippingMethod: data.shippingMethod || "estandar",
          items: {
            create: secureItems.map((item: any) => ({
              productId: item.productId,
              productName: item.productName,
              quantity: item.quantity,
              price: item.price,
              variantId: item.variantId,
            })),
          },
          history: { create: { status: "pendiente", comment: "Pedido creado satisfactoriamente" } },
        },
      });

      // 3. Stock y Suscripciones
      await this.processStockDecrement(tx, secureItems);

      for (const item of secureItems) {
        if (item.isSubscription && user?.id) {
          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + 30);

          await tx.subscription.create({
            data: {
              userId: user.id,
              productId: item.productId,
              status: "activa",
              frequencyDays: 30,
              lockedPrice: item.price,
              quantity: item.quantity,
              nextBillingDate: nextDate,
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

      // 4. Perfil Sync
      if (user?.id && data.saveInfo) {
        await this.syncProfileWithOrder(tx, user.id, data);
      }

      return newOrder;
    });
  }
}

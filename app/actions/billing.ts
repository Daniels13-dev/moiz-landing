"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function getInvoicesReport(startDate?: string, endDate?: string) {
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

  const where: any = {};
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      // Create date at start of day in server/local time
      where.createdAt.gte = new Date(`${startDate}T00:00:00`);
    }
    if (endDate) {
      // Create date at end of day in server/local time
      where.createdAt.lte = new Date(`${endDate}T23:59:59`);
    }
  }

  const invoices = await prisma.invoice.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      order: {
        include: { items: true, profile: true },
      },
    },
  });

  // Transform to flat CSV-ready data
  const reportData = invoices.map((inv) => ({
    factura: `FMZ-${inv.invoiceNumber}`,
    pedido: `MZ-${inv.order.orderNumber}`,
    fecha: inv.createdAt.toISOString().split("T")[0],
    cliente: inv.customerName,
    nit: inv.customerNit,
    email: inv.order.profile?.email || "Invitado",
    subtotal: inv.subtotal,
    descuento: inv.discount,
    total: inv.total,
    items: inv.order.items.map((i) => `${i.productName} (x${i.quantity})`).join(" | "),
  }));

  return reportData;
}

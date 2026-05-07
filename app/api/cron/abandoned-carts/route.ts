import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OrderService } from "@/services/order-service";

// Next.js Cron Setup (Requires Vercel or similar external cron caller)
export async function GET(request: Request) {
  // Verificamos el header de autorización para que solo Vercel Cron u otro servicio seguro pueda llamarlo
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const result = await OrderService.releaseAbandonedStock();

    return NextResponse.json({
      success: true,
      releasedCount: result.count,
      message: `Se liberó stock de ${result.count} pedidos abandonados.`,
    });
  } catch (error) {
    console.error("Error liberando stock de carritos abandonados:", error);
    return NextResponse.json({ error: "Fallo interno del servidor" }, { status: 500 });
  }
}

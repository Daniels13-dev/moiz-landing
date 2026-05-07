import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function auditTransactions() {
  console.log("🚀 Iniciando Auditoría de Integridad de Transacciones...");
  
  const paidOrders = await prisma.order.findMany({
    where: {
      status: "pagada"
    },
    include: {
      history: true
    }
  });

  console.log(`📊 Analizando ${paidOrders.length} órdenes pagadas...`);

  const discrepancies = [];

  for (const order of paidOrders) {
    // Si la orden tiene un totalAmount sospechosamente bajo (ej. < 1000 COP)
    // Esto es un indicador de que pudo ser manipulado el precio en el checkout antes del fix.
    if (order.totalAmount < 1000) {
      discrepancies.push({
        id: order.id,
        orderNumber: `MZ-${order.orderNumber}`,
        amount: order.totalAmount,
        date: order.createdAt,
        reason: "Monto extremadamente bajo detectado en orden pagada."
      });
    }
  }

  if (discrepancies.length > 0) {
    console.warn("\n⚠️ ALERTA: Se encontraron posibles inconsistencias:");
    console.table(discrepancies);
    console.log("\nRecomendación: Contactar a estos clientes y verificar el pago en el dashboard de Wompi/ePayco.");
  } else {
    console.log("\n✅ No se detectaron anomalías obvias en las transacciones pagadas.");
  }
}

auditTransactions()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

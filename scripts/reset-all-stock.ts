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

async function resetAllStock() {
  console.log("🚀 Iniciando reset masivo de inventario...");
  
  const result = await prisma.product.updateMany({
    data: { stock: 50 }
  });

  console.log(`✅ Inventario restaurado: ${result.count} productos ahora tienen 50 unidades.`);
}

resetAllStock()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

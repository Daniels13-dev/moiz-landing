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

async function fixStock() {
  const productId = "cmnny5rzk000iuv8oamsbom5r";
  console.log(`🚀 Recargando stock para el producto ${productId}...`);
  
  const updated = await prisma.product.update({
    where: { id: productId },
    data: { stock: 20 } 
  });

  console.log(`✅ Stock actualizado: ${updated.name} ahora tiene ${updated.stock} unidades.`);
}

fixStock()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

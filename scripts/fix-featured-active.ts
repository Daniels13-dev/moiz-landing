/* eslint-disable @typescript-eslint/no-explicit-any */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  // Activate all featured products that are currently inactive
  const result = await (prisma.product as any).updateMany({
    where: { isFeatured: true, isActive: false },
    data: { isActive: true },
  });

  console.log(`✅ ${result.count} productos destacados activados`);

  // Show result
  const featured = await prisma.product.findMany({
    where: { isFeatured: true },
    select: { name: true, isFeatured: true, isActive: true },
  });

  console.log("\nEstado final de productos destacados:");
  featured.forEach((p) =>
    console.log(`  ${p.name}: isFeatured=${p.isFeatured} isActive=${p.isActive}`),
  );

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);

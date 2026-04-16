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
  const products = await prisma.product.findMany({
    select: { id: true, name: true, isFeatured: true, isActive: true },
    orderBy: { name: "asc" },
  });

  console.log("\n📋 Todos los productos en la BD:\n");
  console.log(`${"Nombre".padEnd(40)} ${"isFeatured".padEnd(12)} ${"isActive"}`);
  console.log("─".repeat(65));

  for (const p of products) {
    const featured = p.isFeatured ? "✅ true" : "❌ false";
    const active = p.isActive ? "✅ true" : "❌ false";
    console.log(`${p.name.padEnd(40)} ${featured.padEnd(12)} ${active}`);
  }

  const featuredActive = products.filter((p) => p.isFeatured && p.isActive);
  console.log(`\n🎯 Destacados Y activos: ${featuredActive.length}`);
  featuredActive.forEach((p) => console.log(`   - ${p.name}`));

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);

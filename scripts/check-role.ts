import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkMyRole() {
  const email = "danielsanchez@example.com"; // O el correo con el que estés probando
  const user = await prisma.profile.findFirst({
    where: { email: { contains: "daniel", mode: 'insensitive' } }
  });

  if (user) {
    console.log(`👤 Usuario encontrado: ${user.email}`);
    console.log(`🔑 Rol actual: "${user.role}"`);
  } else {
    console.log("❌ No encontré ningún usuario con ese correo.");
  }
}

checkMyRole().finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});

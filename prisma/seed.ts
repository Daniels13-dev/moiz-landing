import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { productsData } from "../data/products";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Comenzando el seeding...");

  // 1. Limpiar datos existentes
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 2. Crear Categorías únicas
  const categoryNames = Array.from(
    new Set(productsData.map((p) => p.category)),
  );
  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.create({
        data: { name },
      }),
    ),
  );

  console.log(`Creadas ${categories.length} categorías.`);

  // 3. Crear Productos
  for (const product of productsData) {
    const category = categories.find((c) => c.name === product.category);

    if (category) {
      await prisma.product.create({
        data: {
          name: product.name,
          description: product.desc,
          price: product.price,
          oldPrice: product.oldPrice,
          image: product.image,
          categoryId: category.id,
          petType: product.petType,
          productType: product.category, // Map category to productType for now
          rating: product.rating,
          isFeatured: product.isFeatured || false,
          isNew: product.isNew || false,
          stock: 50, // Default stock for seeding
        },
      });
    }
  }

  console.log(
    `Sembrado completado con éxito para ${productsData.length} productos.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

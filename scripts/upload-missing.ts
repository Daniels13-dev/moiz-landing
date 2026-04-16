/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import * as fs from "fs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

const files = [
  {
    localPath: "public/products/arenero-rojo-transparent.png",
    cloudinaryId: "moiz/products/arenero-rojo-transparent",
    localKey: "/products/arenero-rojo-transparent.png",
  },
  {
    localPath: "public/products/arenero-verde-transparent.png",
    cloudinaryId: "moiz/products/arenero-verde-transparent",
    localKey: "/products/arenero-verde-transparent.png",
  },
  {
    localPath: "public/products/arenero-morado-transparent.png",
    cloudinaryId: "moiz/products/arenero-morado-transparent",
    localKey: "/products/arenero-morado-transparent.png",
  },
];

async function compressAndUpload(localPath: string, cloudinaryId: string): Promise<string> {
  const compressed = await sharp(localPath).png({ compressionLevel: 9, quality: 80 }).toBuffer();
  console.log(`   Comprimido: ${(compressed.length / 1024 / 1024).toFixed(2)}MB`);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: cloudinaryId,
        overwrite: true,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      },
    );
    uploadStream.end(compressed);
  });
}

async function main() {
  const urlMap: Record<string, string> = {};

  for (const f of files) {
    if (!fs.existsSync(f.localPath)) {
        console.log(`⚠️  Archivo no encontrado: ${f.localPath}`);
        continue;
    }
    const sizeMB = (fs.statSync(f.localPath).size / 1024 / 1024).toFixed(2);
    console.log(`\n⬆  ${f.localPath} (${sizeMB}MB)`);
    try {
      const url = await compressAndUpload(f.localPath, f.cloudinaryId);
      urlMap[f.localKey] = url;
      console.log(`✅ → ${url}`);
    } catch (e) {
      console.log(`❌ Error:`, e);
    }
  }

  console.log("\n🗄  Actualizando base de datos...");

  for (const [localPath, cloudUrl] of Object.entries(urlMap)) {
    const products = await prisma.product.findMany({ where: { image: localPath } });
    for (const p of products) {
      await prisma.product.update({ where: { id: p.id }, data: { image: cloudUrl } });
      console.log(`  ✅ Producto ${p.id} actualizado`);
    }
    const variants = await prisma.productVariant.findMany({ where: { image: localPath } });
    for (const v of variants) {
      await prisma.productVariant.update({ where: { id: v.id }, data: { image: cloudUrl } });
      console.log(`  ✅ Variante ${v.id} actualizada`);
    }
  }

  console.log("\n🎉 ¡Listo!");
  await prisma.$disconnect();
  await pool.end();
}

main().catch(async (e) => {
  console.error("❌", e);
  await prisma.$disconnect();
  process.exit(1);
});

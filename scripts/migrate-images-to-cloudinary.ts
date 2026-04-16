/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * migrate-images-to-cloudinary.ts
 *
 * Sube todas las imágenes de /public a Cloudinary y actualiza:
 *   1. La base de datos (productos y variantes)
 *   2. Genera el mapa JSON de rutas locales → URLs Cloudinary
 *
 * Ejecutar con:
 *   npx tsx --env-file=.env scripts/migrate-images-to-cloudinary.ts
 */

import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";

// ── Configuración Cloudinary ───────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dvyqtn7gy",
  api_key: process.env.CLOUDINARY_API_KEY || "735853792221746",
  api_secret: process.env.CLOUDINARY_API_SECRET || "Y1n3-Cg3vZBP7wGIGuQVLHy2ONk",
});

// ── Prisma con adapter PG ─────────────────────────────────────────────────────
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

const PUBLIC_DIR = path.join(process.cwd(), "public");

// ── Helpers ────────────────────────────────────────────────────────────────────

async function uploadFile(localPath: string, publicId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      localPath,
      {
        public_id: publicId,
        folder: "moiz",
        overwrite: true,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      },
    );
  });
}

function getImageFiles(dir: string): string[] {
  const exts = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
  const results: string[] = [];

  function walk(current: string) {
    for (const entry of fs.readdirSync(current)) {
      const full = path.join(current, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (exts.includes(path.extname(entry).toLowerCase())) {
        results.push(full);
      }
    }
  }

  walk(dir);
  return results;
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Iniciando migración de imágenes a Cloudinary...\n");

  const imageFiles = getImageFiles(PUBLIC_DIR);
  console.log(`📁 Encontradas ${imageFiles.length} imágenes en /public\n`);

  const urlMap: Record<string, string> = {};

  // ── 1. Subir todas las imágenes ──────────────────────────────────────────────
  for (const filePath of imageFiles) {
    const relativePath = filePath.replace(PUBLIC_DIR, "").replace(/\\/g, "/");
    // publicId sin extensión ni barra inicial: e.g. "products/arena4kg"
    const publicId = relativePath.replace(/^\//, "").replace(/\.[^.]+$/, "");

    try {
      process.stdout.write(`  ⬆  ${relativePath} ...`);
      const cloudUrl = await uploadFile(filePath, publicId);
      urlMap[relativePath] = cloudUrl;
      console.log(` ✅`);
    } catch (err) {
      console.log(` ❌ ERROR: ${err}`);
    }
  }

  // ── 2. Actualizar base de datos ──────────────────────────────────────────────
  console.log("\n🗄  Actualizando base de datos...\n");

  const products = await prisma.product.findMany({ select: { id: true, image: true } });
  let productUpdates = 0;

  for (const product of products) {
    if (!product.image || product.image.startsWith("https://")) continue;

    const cloudUrl = urlMap[product.image];
    if (cloudUrl) {
      await prisma.product.update({ where: { id: product.id }, data: { image: cloudUrl } });
      console.log(`  ✅ Producto ${product.id}: ${product.image}`);
      productUpdates++;
    } else {
      console.log(`  ⚠️  Sin match para producto ${product.id}: "${product.image}"`);
    }
  }

  const variants = await prisma.productVariant.findMany({ select: { id: true, image: true } });
  let variantUpdates = 0;

  for (const variant of variants) {
    if (!variant.image || variant.image.startsWith("https://")) continue;

    const cloudUrl = urlMap[variant.image];
    if (cloudUrl) {
      await prisma.productVariant.update({ where: { id: variant.id }, data: { image: cloudUrl } });
      console.log(`  ✅ Variante ${variant.id}: ${variant.image}`);
      variantUpdates++;
    } else {
      console.log(`  ⚠️  Sin match para variante ${variant.id}: "${variant.image}"`);
    }
  }

  console.log(
    `\n✅ Base de datos: ${productUpdates} productos, ${variantUpdates} variantes actualizados`,
  );

  // ── 3. Guardar JSON del mapa ─────────────────────────────────────────────────
  const mapPath = path.join(process.cwd(), "scripts", "cloudinary-url-map.json");
  fs.writeFileSync(mapPath, JSON.stringify(urlMap, null, 2));
  console.log(`💾 Mapa guardado en scripts/cloudinary-url-map.json`);

  console.log("\n🎉 ¡Migración completada!\n");

  await prisma.$disconnect();
  await pool.end();
}

main().catch(async (e) => {
  console.error("❌ Error fatal:", e);
  await prisma.$disconnect();
  process.exit(1);
});

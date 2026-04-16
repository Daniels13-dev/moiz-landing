import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";

const PRODUCTS_DIR = path.join(process.cwd(), "public", "products");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Solo se permiten imágenes" }, { status: 400 });
    }

    // Ensure /public/products/ exists
    if (!fs.existsSync(PRODUCTS_DIR)) {
      fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
    }

    // Save with unique name, preserving extension
    const ext = path.extname(file.name) || ".png";
    const filename = `${randomUUID()}${ext}`;
    const localPath = path.join(PRODUCTS_DIR, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(localPath, buffer);

    // Return immediately with the local URL so the client can show the image
    const tempUrl = `/products/${filename}`;

    return NextResponse.json({ tempUrl, filename });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Error al guardar la imagen" }, { status: 500 });
  }
}

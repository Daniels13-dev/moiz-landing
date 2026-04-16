import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import cloudinary from "@/lib/cloudinary";
import sharp from "sharp";

const execFileAsync = promisify(execFile);
const PRODUCTS_DIR = path.join(process.cwd(), "public", "products");
const PYTHON = "/usr/bin/python3";

async function removeBackground(inputPath: string, outputPath: string): Promise<void> {
  // Write a temp Python script to avoid shell-escaping issues with paths
  const scriptPath = path.join(PRODUCTS_DIR, `_rembg_${Date.now()}.py`);
  const script = [
    "from rembg import remove",
    `with open(r'${inputPath}', 'rb') as f: data = f.read()`,
    "out = remove(data)",
    `with open(r'${outputPath}', 'wb') as f: f.write(out)`,
  ].join("\n");

  fs.writeFileSync(scriptPath, script);

  try {
    await execFileAsync(PYTHON, [scriptPath], { timeout: 120_000 });
  } finally {
    try {
      fs.unlinkSync(scriptPath);
    } catch {
      /* ignore */
    }
  }
}

async function uploadToCloudinary(filePath: string, publicId: string): Promise<string> {
  let buffer = fs.readFileSync(filePath);

  // Compress if over 10MB (Cloudinary free tier limit)
  const MAX_BYTES = 10 * 1024 * 1024;
  if (buffer.length > MAX_BYTES) {
    buffer = (await sharp(filePath).png({ compressionLevel: 9, quality: 80 }).toBuffer()) as any;
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          public_id: publicId,
          folder: "moiz/products",
          overwrite: true,
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result.secure_url);
        },
      )
      .end(buffer);
  });
}

function cleanup(...paths: string[]) {
  for (const p of paths) {
    try {
      if (fs.existsSync(p)) fs.unlinkSync(p);
    } catch {
      // ignore cleanup errors
    }
  }
}

export async function POST(req: NextRequest) {
  const { filename } = await req.json();

  if (!filename) {
    return NextResponse.json({ error: "filename requerido" }, { status: 400 });
  }

  const originalPath = path.join(PRODUCTS_DIR, filename);
  const baseName = path.basename(filename, path.extname(filename));
  const transparentFilename = `${baseName}-transparent.png`;
  const transparentPath = path.join(PRODUCTS_DIR, transparentFilename);

  if (!fs.existsSync(originalPath)) {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }

  try {
    // Step 1: Remove background with rembg
    await removeBackground(originalPath, transparentPath);

    // Step 2: Upload transparent version to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(transparentPath, baseName);

    // Step 3: Clean up local files
    cleanup(originalPath, transparentPath);

    return NextResponse.json({ url: cloudinaryUrl });
  } catch (err) {
    console.error("Process error:", err);

    // Fallback: if rembg fails, upload the original to Cloudinary
    try {
      console.warn("rembg falló, subiendo imagen original a Cloudinary...");
      const fallbackUrl = await uploadToCloudinary(originalPath, baseName);
      cleanup(originalPath, transparentPath);
      return NextResponse.json({ url: fallbackUrl, warning: "Sin fondo transparente" });
    } catch (fallbackErr) {
      console.error("Fallback upload also failed:", fallbackErr);
      // Last resort: keep local file, return temp URL
      return NextResponse.json(
        {
          error: "No se pudo procesar la imagen",
          keepLocal: true,
          tempUrl: `/products/${filename}`,
        },
        { status: 500 },
      );
    }
  }
}

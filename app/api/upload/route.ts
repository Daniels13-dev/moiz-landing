import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

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

    // Convert file to buffer for Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload directly to Cloudinary using upload_stream (no local disk needed)
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "moiz/products/temp", // Temporary folder
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        }
      ).end(buffer);
    }) as any;

    // Return the Cloudinary URL as the temp URL
    // filename is still used by the process step as public_id
    return NextResponse.json({ 
      tempUrl: result.secure_url, 
      filename: result.public_id, // We'll pass the Cloudinary public_id as filename
      isCloudinary: true 
    });
  } catch (error) {
    console.error("Vercel Upload error:", error);
    return NextResponse.json({ error: "Error al subir a la nube" }, { status: 500 });
  }
}

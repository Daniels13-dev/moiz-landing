import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const { filename, skipRemoveBackground, targetFolder } = await req.json();

    if (!filename) {
      return NextResponse.json({ error: "filename (public_id) requerido" }, { status: 400 });
    }

    // Step: Process image using Cloudinary
    const destinationFolder = targetFolder || "moiz/products";
    const newPublicId = filename.replace(/moiz\/(products|testimonials)\/temp/, destinationFolder);
    
    const result = await cloudinary.uploader.rename(filename, newPublicId, {
      overwrite: true,
    });

    if (skipRemoveBackground) {
      return NextResponse.json({ 
        url: result.secure_url, 
        info: `Imagen movida a ${destinationFolder} sin cambios.` 
      });
    }

    // Option A: Use Cloudinary AI Background Removal (Requires Add-on)
    const transparentUrl = cloudinary.url(result.public_id, {
      transformation: [
        { effect: "bgremoval" },
        { quality: "auto", fetch_format: "auto" }
      ],
      secure: true,
    });

    const regularUrl = result.secure_url;

    return NextResponse.json({ 
      url: regularUrl, 
      transparentUrl: transparentUrl,
      info: "Imagen procesada y movida a almacenamiento permanente." 
    });
  } catch (error) {
    console.error("Vercel Process error:", error);
    return NextResponse.json({ error: "Error al procesar la imagen en la nube" }, { status: 500 });
  }
}

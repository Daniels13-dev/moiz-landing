import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const { filename } = await req.json();

    if (!filename) {
      return NextResponse.json({ error: "filename (public_id) requerido" }, { status: 400 });
    }

    // Step: Process image using Cloudinary (No local Python/Disk needed)
    // We can use Cloudinary's built-in background removal if available
    // or just move it from 'temp' to 'final' products folder.
    
    // For now, we'll perform a rename/move operation to the permanent folder
    // and we'll apply the 'e_bgremoval' effect to the URL if possible
    
    const newPublicId = filename.replace("moiz/products/temp", "moiz/products");
    
    const result = await cloudinary.uploader.rename(filename, newPublicId, {
      overwrite: true,
    });

    // Option A: Use Cloudinary AI Background Removal (Requires Add-on)
    // We generate a URL that includes the background removal transformation
    const transparentUrl = cloudinary.url(result.public_id, {
      transformation: [
        { effect: "bgremoval" },
        { quality: "auto", fetch_format: "auto" }
      ],
      secure: true,
    });

    // Option B: Regular optimized URL (if bgremoval is not enabled in their account)
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

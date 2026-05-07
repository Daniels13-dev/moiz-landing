"use server";

import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function subscribeToNewsletter(email: string) {
  if (!email || !email.includes("@")) {
    return { success: false, message: "Email inválido" };
  }

  try {
    // Check if already exists
    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });

    if (existing && existing.isActive) {
      return { success: false, message: "Este correo ya está suscrito." };
    }

    if (existing) {
      // Reactivate
      await prisma.newsletterSubscription.update({
        where: { email },
        data: { isActive: true },
      });
    } else {
      // Create new
      await prisma.newsletterSubscription.create({
        data: { email },
      });
    }

    // Send Welcome Email
    await sendEmail({
      to: email,
      subject: "🎁 ¡Tu regalo de bienvenida a Möiz Pets!",
      html: `
        <div style="font-family: 'Geist', sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 32px; border: 1px solid #f4f4f5; text-align: center;">
          <img src="https://res.cloudinary.com/dvyqtn7gy/image/upload/v1776223130/moiz/logo/logo.png" alt="Möiz logo" style="width: 80px; margin-bottom: 40px;" />
          
          <h1 style="font-size: 32px; font-weight: 900; color: #09090b; letter-spacing: -0.05em; margin-bottom: 16px; line-height: 1.1;">
            ¡Bienvenido al Universo <span style="color: #6a8e2a;">Möiz</span>!
          </h1>
          
          <p style="font-size: 16px; color: #52525b; font-weight: 500; margin-bottom: 32px; line-height: 1.6;">
            Estamos felices de tenerte con nosotros. Para celebrar tu llegada, te regalamos un descuento especial para tu mascota.
          </p>
          
          <div style="background-color: #f7fee7; border: 2px dashed #6a8e2a; padding: 32px; border-radius: 24px; margin-bottom: 32px;">
            <p style="font-size: 12px; font-weight: 800; color: #6a8e2a; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Usa este código al pagar:</p>
            <h2 style="font-size: 48px; font-weight: 900; color: #09090b; margin: 0; letter-spacing: 0.05em;">MOIZ10</h2>
            <p style="font-size: 14px; font-weight: 600; color: #3f6212; margin-top: 8px;">10% DE DESCUENTO EN TU PRIMERA COMPRA</p>
          </div>
          
          <a href="https://moizpets.com/productos" style="display: block; background-color: #6a8e2a; color: #ffffff; text-decoration: none; padding: 20px; border-radius: 100px; font-weight: 900; font-size: 16px; margin-bottom: 32px; transition: all 0.2s;">
            Quiero mi descuento ahora
          </a>
          
          <p style="font-size: 12px; color: #a1a1aa; font-weight: 500;">
            Si tienes alguna duda, responde a este correo. ¡Estaremos felices de ayudarte!
          </p>
          <p style="font-size: 10px; color: #d4d4d8; text-transform: uppercase; font-weight: 800; margin-top: 40px; letter-spacing: 0.1em;">
            © 2026 MÖIZ PETS • BIENESTAR PREMIUM
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error in subscribeToNewsletter:", error);
    return { success: false, message: "Error en el servidor. Inténtalo más tarde." };
  }
}

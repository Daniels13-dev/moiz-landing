"use server";

import prisma from "@/lib/prisma";

export async function validateCoupon(code: string) {
  if (!code) return { success: false, message: "Código inválido" };

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return { success: false, message: "Este cupón no existe" };
    }

    if (!coupon.isActive) {
      return { success: false, message: "Este cupón ya no está activo" };
    }

    if (coupon.expiryDate && new Date() > coupon.expiryDate) {
      return { success: false, message: "Este cupón ha expirado" };
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return { success: false, message: "Este cupón ya alcanzó su límite de usos" };
    }

    return {
      success: true,
      coupon: {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
      },
    };
  } catch (error) {
    console.error("Error validating coupon:", error);
    return { success: false, message: "Error al validar el cupón" };
  }
}

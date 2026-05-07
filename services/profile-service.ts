import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class ProfileService {
  /**
   * Obtiene el perfil completo de un usuario incluyendo direcciones.
   */
  static async getById(userId: string) {
    return await prisma.profile.findUnique({
      where: { id: userId },
      include: { addresses: true },
    });
  }

  /**
   * Actualiza los datos básicos de un perfil.
   * Soporta transacciones opcionales.
   */
  static async updateBasicInfo(
    userId: string, 
    data: {
      fullName?: string;
      phone?: string;
      phoneCountry?: string;
      idNumber?: string;
      idType?: string;
    },
    tx?: Prisma.TransactionClient
  ) {
    const db = tx || prisma;
    return await db.profile.update({
      where: { id: userId },
      data,
    });
  }

  /**
   * Sincroniza o crea una dirección (SHIPPING o BILLING) para el usuario.
   * Soporta transacciones opcionales.
   */
  static async upsertAddress(
    userId: string,
    addressData: {
      type: "SHIPPING" | "BILLING";
      fullName: string;
      phone: string;
      idNumber?: string;
      idType?: string;
      street: string;
      city: string;
      state: string;
      country?: string;
    },
    tx?: Prisma.TransactionClient
  ) {
    const db = tx || prisma;

    const existingAddress = await db.address.findFirst({
      where: {
        profileId: userId,
        type: addressData.type,
      },
    });

    if (existingAddress) {
      // Solo actualizamos si hay cambios reales
      const hasChanged = 
        existingAddress.fullName !== addressData.fullName ||
        existingAddress.phone !== addressData.phone ||
        existingAddress.idNumber !== addressData.idNumber ||
        existingAddress.idType !== addressData.idType ||
        existingAddress.street !== addressData.street ||
        existingAddress.city !== addressData.city ||
        existingAddress.state !== addressData.state;

      if (!hasChanged) return existingAddress;

      return await db.address.update({
        where: { id: existingAddress.id },
        data: {
          fullName: addressData.fullName,
          phone: addressData.phone,
          idNumber: addressData.idNumber,
          idType: addressData.idType,
          street: addressData.street,
          city: addressData.city,
          state: addressData.state,
          country: addressData.country || "Colombia",
        },
      });
    } else {
      return await db.address.create({
        data: {
          profileId: userId,
          ...addressData,
          country: addressData.country || "Colombia",
        },
      });
    }
  }

  /**
   * Sincroniza el perfil completo a partir de los datos de una orden.
   * Utilizado en el checkout para mantener los datos del usuario actualizados.
   */
  static async syncWithOrderData(userId: string, data: any, tx: Prisma.TransactionClient) {
    const fullName = `${data.customerName || ""} ${data.customerLastName || ""}`.trim();

    // 1. Actualizar perfil básico
    await this.updateBasicInfo(userId, {
      fullName,
      phone: data.customerPhone,
      phoneCountry: data.customerPhoneCountry || "+57",
      idNumber: data.customerNit,
      idType: data.customerIdType || "CC",
    }, tx);

    // 2. Sincronizar dirección de envío
    await this.upsertAddress(userId, {
      type: "SHIPPING",
      fullName,
      phone: data.customerPhone,
      idNumber: data.customerNit,
      idType: data.customerIdType || "CC",
      street: data.customerAddress,
      city: data.customerCity || "",
      state: data.customerState || "",
    }, tx);

    // 3. Sincronizar dirección de facturación
    const billingData = data.billingDifferent ? {
      fullName: `${data.billingName || ""} ${data.billingLastName || ""}`.trim(),
      phone: data.billingPhone || data.customerPhone,
      idNumber: data.billingNit || data.customerNit,
      idType: data.billingIdType || data.customerIdType || "CC",
      street: data.billingAddress || "",
      city: data.billingCity || data.customerCity || "",
      state: data.billingState || data.customerState || "",
    } : {
      fullName,
      phone: data.customerPhone,
      idNumber: data.customerNit,
      idType: data.customerIdType || "CC",
      street: data.customerAddress,
      city: data.customerCity || "",
      state: data.customerState || "",
    };

    await this.upsertAddress(userId, {
      type: "BILLING",
      ...billingData
    }, tx);
  }
}

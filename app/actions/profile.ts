"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

export async function getProfile() {
  noStore();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      include: {
        addresses: true,
      },
    });

    return profile;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

export async function updateProfile(formData: {
  fullName: string;
  phone: string;
  idNumber: string;
  idType: string;
  phoneCountry: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autorizado" };

  try {
    await prisma.profile.update({
      where: { id: user.id },
      data: {
        fullName: formData.fullName,
        phone: formData.phone,
        idNumber: formData.idNumber,
        idType: formData.idType,
        phoneCountry: formData.phoneCountry,
      },
    });

    revalidatePath("/perfil");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Error al actualizar perfil" };
  }
}

export async function upsertAddress(addressData: {
  type: "SHIPPING" | "BILLING";
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autorizado" };

  try {
    // Check if address of this type already exists
    const existingAddress = await prisma.address.findFirst({
      where: {
        profileId: user.id,
        type: addressData.type,
      },
    });

    if (existingAddress) {
      await prisma.address.update({
        where: { id: existingAddress.id },
        data: {
          fullName: addressData.fullName,
          phone: addressData.phone,
          street: addressData.street,
          city: addressData.city,
          state: addressData.state,
        },
      });
    } else {
      await prisma.address.create({
        data: {
          profileId: user.id,
          ...addressData,
          country: addressData.country || "Colombia",
        },
      });
    }

    revalidatePath("/perfil");
    return { success: true };
  } catch (error) {
    console.error("Error upserting address:", error);
    return { error: "Error al guardar dirección" };
  }
}

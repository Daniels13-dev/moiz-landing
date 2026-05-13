"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { ProfileService } from "@/services/profile-service";
import { handleActionError } from "@/lib/action-utils";

export async function getProfile() {
  noStore();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  try {
    return await ProfileService.getById(user.id);
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
    await ProfileService.updateBasicInfo(user.id, formData);
    revalidatePath("/perfil");
    return { success: true };
  } catch (error) {
    return handleActionError(error, "updateProfile");
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
    await ProfileService.upsertAddress(user.id, {
      ...addressData,
      idNumber: "", // Opcional en el perfil directo
      idType: "CC"
    });

    revalidatePath("/perfil");
    return { success: true };
  } catch (error) {
    return handleActionError(error, "upsertAddress");
  }
}

export async function checkAndResetCartClear() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { clear: false };

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { cartNeedsClear: true }
    });

    if (profile?.cartNeedsClear) {
      // Si necesita limpiarse, lo reseteamos a false y devolvemos true al cliente
      await prisma.profile.update({
        where: { id: user.id },
        data: { cartNeedsClear: false }
      });
      return { clear: true };
    }

    return { clear: false };
  } catch (error) {
    return { clear: false };
  }
}

export async function deleteAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "No autorizado" };

  try {
    // Marcado lógico como inactivo
    await prisma.profile.update({
      where: { id: user.id },
      data: { isActive: false }
    });

    // Opcional: Cerrar sesión después de marcar como inactivo
    await supabase.auth.signOut();

    return { success: true };
  } catch (error) {
    return handleActionError(error, "deleteAccount");
  }
}

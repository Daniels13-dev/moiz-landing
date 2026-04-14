"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- CATEGORIES ---

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;

  if (!name) return { error: "El nombre es obligatorio" };

  try {
    await prisma.category.create({
      data: { name },
    });
    revalidatePath("/admin/categorias");
    return { success: true };
  } catch (_error) {
    console.error("Create category error:", _error);
    return { error: "Error al crear la categoría" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });
    revalidatePath("/admin/categorias");
    return { success: true };
  } catch (_error) {
    console.error("Delete category error:", _error);
    return {
      error: "No se puede eliminar una categoría con productos asociados",
    };
  }
}

export async function updateCategory(id: string, name: string) {
  if (!name) return { error: "El nombre es obligatorio" };

  try {
    await prisma.category.update({
      where: { id },
      data: { name },
    });
    revalidatePath("/admin/categorias");
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true };
  } catch (_error) {
    console.error("Update category error:", _error);
    return { error: "Error al actualizar la categoría" };
  }
}

// --- PRODUCTS ---

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const oldPrice = formData.get("oldPrice") ? parseFloat(formData.get("oldPrice") as string) : null;
  const image = formData.get("image") as string;
  const categoryId = formData.get("categoryId") as string;
  const petType = (formData.get("petType") as string) || "";
  const productType = (formData.get("productType") as string) || "";
  const isFeatured = formData.get("isFeatured") === "on";
  const isNew = formData.get("isNew") === "on";
  const allowSubscription = formData.get("allowSubscription") === "on";
  const stock = parseInt(formData.get("stock") as string) || 0;

  if (!name || !price || !categoryId) {
    return { error: "Faltan campos obligatorios" };
  }

  try {
    await prisma.product.create({
      data: {
        name,
        description,
        price,
        oldPrice,
        image,
        category: { connect: { id: categoryId } },
        petType,
        productType,
        isFeatured,
        isNew,
        allowSubscription,
        stock,
        rating: 5.0,
      },
    });
    revalidatePath("/admin/productos");
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true };
  } catch (_error) {
    console.error("Create product error:", _error);
    return { error: "Error al crear el producto" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/admin/productos");
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true };
  } catch (_error) {
    console.error("Delete product error:", _error);
    return { error: "Error al eliminar el producto" };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const oldPrice = formData.get("oldPrice") ? parseFloat(formData.get("oldPrice") as string) : null;
  const image = formData.get("image") as string;
  const categoryId = formData.get("categoryId") as string;
  const petType = (formData.get("petType") as string) || "";
  const productType = (formData.get("productType") as string) || "";
  const isFeatured = formData.get("isFeatured") === "on";
  const isNew = formData.get("isNew") === "on";
  const allowSubscription = formData.get("allowSubscription") === "on";
  const stock = parseInt(formData.get("stock") as string) || 0;

  if (!name || !price || !categoryId) {
    return { error: "Faltan campos obligatorios" };
  }

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        oldPrice,
        image,
        category: { connect: { id: categoryId } },
        petType,
        productType,
        isFeatured,
        isNew,
        allowSubscription,
        stock,
      },
    });
    revalidatePath("/admin/productos");
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true };
  } catch (_error) {
    console.error("Update product error:", _error);
    return { error: "Error al actualizar el producto" };
  }
}

// --- VARIANTS ---

export async function createVariant(productId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const color = formData.get("color") as string;
  const image = formData.get("image") as string;
  const stock = parseInt(formData.get("stock") as string) || 0;
  const price = formData.get("price") ? parseFloat(formData.get("price") as string) : null;

  if (!name) return { error: "El nombre de la variante es obligatorio" };

  try {
    await prisma.productVariant.create({
      data: {
        productId,
        name,
        color,
        image,
        stock,
        price,
      },
    });
    revalidatePath("/admin/productos");
    revalidatePath(`/productos/${productId}`);
    return { success: true };
  } catch (_error) {
    console.error("Create variant error:", _error);
    return { error: "Error al crear la variante" };
  }
}

export async function deleteVariant(id: string, productId: string) {
  try {
    await prisma.productVariant.delete({
      where: { id },
    });
    revalidatePath("/admin/productos");
    revalidatePath(`/productos/${productId}`);
    return { success: true };
  } catch (_error) {
    console.error("Delete variant error:", _error);
    return { error: "Error al eliminar la variante" };
  }
}

export async function updateVariant(id: string, productId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const color = formData.get("color") as string;
  const image = formData.get("image") as string;
  const stock = parseInt(formData.get("stock") as string) || 0;
  const price = formData.get("price") ? parseFloat(formData.get("price") as string) : null;

  try {
    await prisma.productVariant.update({
      where: { id },
      data: {
        name,
        color,
        image,
        stock,
        price,
      },
    });
    revalidatePath("/admin/productos");
    revalidatePath(`/productos/${productId}`);
    return { success: true };
  } catch (_error) {
    console.error("Update variant error:", _error);
    return { error: "Error al actualizar la variante" };
  }
}

// --- USERS ---

export async function updateUserRole(id: string, role: string) {
  try {
    await prisma.profile.update({
      where: { id },
      data: { role },
    });
    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (_error) {
    console.error("Update user role error:", _error);
    return { error: "Error al actualizar el rol del usuario" };
  }
}

// --- SUBSCRIPTIONS ---

export async function completeSubscriptionReminder(reminderId: string) {
  try {
    const reminder = await prisma.subscriptionReminder.findUnique({
      where: { id: reminderId },
      include: {
        subscription: true,
      },
    });

    if (!reminder) return { error: "Recordatorio no encontrado" };
    if (reminder.status === "completado") return { error: "Ya está completado" };

    // Mark current reminder as completed
    await prisma.subscriptionReminder.update({
      where: { id: reminderId },
      data: { status: "completado" },
    });

    // If there's an associated subscription, update it and create next reminder
    if (reminder.subscriptionId && reminder.subscription) {
      const frequency = reminder.subscription.frequencyDays || 30;
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + frequency);

      await prisma.subscription.update({
        where: { id: reminder.subscriptionId },
        data: {
          deliveryCount: { increment: 1 },
          lastBillingDate: new Date(),
          nextBillingDate: nextDate,
        },
      });

      // Schedule NEXT reminder
      await prisma.subscriptionReminder.create({
        data: {
          userId: reminder.userId,
          productId: reminder.productId,
          subscriptionId: reminder.subscriptionId,
          reminderDate: nextDate,
          status: "pendiente",
        },
      });
    }

    revalidatePath("/admin/suscripciones");
    revalidatePath("/suscripciones");
    return { success: true };
  } catch (_error) {
    console.error("Complete reminder error:", _error);
    return { error: "Error al completar el recordatorio" };
  }
}

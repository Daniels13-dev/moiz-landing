"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { parseLocalizedFloat, parseInteger, parseCheckbox } from "@/utils/parsers";

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
  const price = parseLocalizedFloat(formData.get("price") as string) || 0;
  const oldPrice = parseLocalizedFloat(formData.get("oldPrice") as string);
  const image = formData.get("image") as string;
  const categoryId = formData.get("categoryId") as string;
  const petType = (formData.get("petType") as string) || "";
  const productType = (formData.get("productType") as string) || "";
  const isFeatured = parseCheckbox(formData.get("isFeatured"));
  const isNew = parseCheckbox(formData.get("isNew"));
  const allowSubscription = parseCheckbox(formData.get("allowSubscription"));
  const stock = parseInteger(formData.get("stock") as string);
  // Default isActive to false so new products are hidden until explicitly activated
  const isActive = formData.get("isActive") !== null ? parseCheckbox(formData.get("isActive")) : false;

  if (!name || !price || !categoryId) {
    return { error: "Faltan campos obligatorios" };
  }

  try {
    const productData = {
      name,
      description,
      price,
      oldPrice,
      image,
      isActive,
      category: { connect: { id: categoryId } },
      petType,
      productType,
      isFeatured,
      isNew,
      allowSubscription,
      stock,
      rating: 5.0,
    };

    await prisma.product.create({ data: productData });
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
    // Check if product has order history — if so, block deletion
    const orderItemCount = await prisma.orderItem.count({ where: { productId: id } });
    if (orderItemCount > 0) {
      return {
        error: `Este producto tiene ${orderItemCount} pedido(s) asociado(s) y no puede eliminarse. Desactívalo para que no aparezca en el catálogo.`,
        hasOrders: true,
      };
    }

    // Safe to delete — clean up non-cascade relations first
    await prisma.$transaction([
      prisma.subscriptionReminder.deleteMany({ where: { productId: id } }),
      prisma.subscription.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } }),
    ]);

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
  const price = parseLocalizedFloat(formData.get("price") as string) || 0;
  const oldPrice = parseLocalizedFloat(formData.get("oldPrice") as string);
  const image = formData.get("image") as string;
  const categoryId = formData.get("categoryId") as string;
  const petType = (formData.get("petType") as string) || "";
  const productType = (formData.get("productType") as string) || "";
  const isFeatured = parseCheckbox(formData.get("isFeatured"));
  const isNew = parseCheckbox(formData.get("isNew"));
  const allowSubscription = parseCheckbox(formData.get("allowSubscription"));
  const stock = parseInteger(formData.get("stock") as string);
  const isActive = parseCheckbox(formData.get("isActive"));

  if (!name || !price || !categoryId) {
    return { error: "Faltan campos obligatorios" };
  }

  try {
    const productData = {
      name,
      description,
      price,
      oldPrice,
      image,
      isActive,
      category: { connect: { id: categoryId } },
      petType,
      productType,
      isFeatured,
      isNew,
      allowSubscription,
      stock,
    };

    await prisma.product.update({ where: { id }, data: productData });
    revalidatePath("/admin/productos");
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true };
  } catch (_error) {
    console.error("Update product error:", _error);
    return { error: "Error al actualizar el producto" };
  }
}

export async function toggleProductActive(id: string, active: boolean) {
  try {
    await prisma.product.update({ where: { id }, data: { isActive: active } });
    revalidatePath("/admin/productos");
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true };
  } catch (_error) {
    console.error("Toggle product active error:", _error);
    return { error: "Error al actualizar el estado del producto" };
  }
}

// --- VARIANTS ---

export async function createVariant(productId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const color = (formData.get("color") as string) || null;
  const image = (formData.get("image") as string) || null;
  const size = (formData.get("size") as string) || null;
  const stock = parseInteger(formData.get("stock") as string);
  const price = parseLocalizedFloat(formData.get("price") as string);

  if (!name) return { error: "El nombre de la variante es obligatorio" };

  try {
    await prisma.productVariant.create({
      data: {
        productId,
        name,
        color,
        image,
        size,
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

/**
 * Crea múltiples variantes de talla para un mismo estampado/color en una sola operación.
 * Recibe: name, image, price (opcional), y una lista de tallas con su stock individual.
 * Ejemplo: Estampado "Mariposas" en tallas S(10), M(8), L(5) → 3 variantes creadas.
 */
export async function createVariantBatch(
  productId: string,
  data: {
    name: string;
    image: string | null;
    color: string | null;
    sizes: Array<{ size: string; stock: number; price: number | null }>;
  },
) {
  if (!data.name) return { error: "El nombre del estampado es obligatorio" };
  if (data.sizes.length === 0) return { error: "Selecciona al menos una talla" };

  try {
    await prisma.productVariant.createMany({
      data: data.sizes.map(({ size, stock, price }) => ({
        productId,
        name: data.name,
        image: data.image,
        color: data.color,
        price: price, // Now using individual price per size
        size,
        stock,
      })),
    });
    revalidatePath("/admin/productos");
    revalidatePath(`/productos/${productId}`);
    return { success: true, count: data.sizes.length };
  } catch (_error) {
    console.error("Batch variant error:", _error);
    return { error: "Error al crear las variantes" };
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
  const color = (formData.get("color") as string) || null;
  const image = (formData.get("image") as string) || null;
  const size = (formData.get("size") as string) || null;
  const stock = parseInteger(formData.get("stock") as string);
  const price = parseLocalizedFloat(formData.get("price") as string);

  try {
    await prisma.productVariant.update({
      where: { id },
      data: {
        name,
        color,
        image,
        size,
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

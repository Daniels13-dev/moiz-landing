"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { parseLocalizedFloat, parseInteger, parseCheckbox } from "@/lib/form-utils";
import { handleActionError } from "@/lib/action-utils";
import { CategoryService } from "@/services/category-service";
import { ProductService } from "@/services/product-service";
import { SubscriptionService } from "@/services/subscription-service";

// --- CATEGORIES ---

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) return { error: "El nombre es obligatorio" };

  try {
    await CategoryService.create(name);
    revalidatePath("/admin/categorias");
    return { success: true };
  } catch (error) {
    return handleActionError(error, "createCategory");
  }
}

export async function deleteCategory(id: string) {
  try {
    await CategoryService.delete(id);
    revalidatePath("/admin/categorias");
    return { success: true };
  } catch (error) {
    return handleActionError(error, "deleteCategory");
  }
}

export async function updateCategory(id: string, name: string) {
  if (!name) return { error: "El nombre es obligatorio" };
  try {
    await CategoryService.update(id, name);
    revalidatePath("/admin/categorias");
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return handleActionError(error, "updateCategory");
  }
}

export async function toggleCategoryActive(id: string, active: boolean) {
  try {
    await CategoryService.toggleActive(id, active);
    revalidatePath("/admin/categorias");
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return handleActionError(error, "toggleCategoryActive");
  }
}

// --- PRODUCTS ---

export async function createProduct(formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseLocalizedFloat(formData.get("price") as string) || 0,
      oldPrice: parseLocalizedFloat(formData.get("oldPrice") as string),
      image: formData.get("image") as string,
      category: { connect: { id: formData.get("categoryId") as string } },
      petType: (formData.get("petType") as string) || "",
      productType: (formData.get("productType") as string) || "",
      isFeatured: parseCheckbox(formData.get("isFeatured")),
      isNew: parseCheckbox(formData.get("isNew")),
      allowSubscription: parseCheckbox(formData.get("allowSubscription")),
      stock: parseInteger(formData.get("stock") as string),
      isActive: formData.get("isActive") !== null ? parseCheckbox(formData.get("isActive")) : false,
    };

    if (!data.name || !data.price) return { error: "Faltan campos obligatorios" };

    await ProductService.create(data);
    revalidatePath("/admin/productos");
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return handleActionError(error, "createProduct");
  }
}

export async function deleteProduct(id: string) {
  try {
    await ProductService.delete(id);
    revalidatePath("/admin/productos");
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return handleActionError(error, "deleteProduct");
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseLocalizedFloat(formData.get("price") as string) || 0,
      oldPrice: parseLocalizedFloat(formData.get("oldPrice") as string),
      image: formData.get("image") as string,
      category: { connect: { id: formData.get("categoryId") as string } },
      petType: (formData.get("petType") as string) || "",
      productType: (formData.get("productType") as string) || "",
      isFeatured: parseCheckbox(formData.get("isFeatured")),
      isNew: parseCheckbox(formData.get("isNew")),
      allowSubscription: parseCheckbox(formData.get("allowSubscription")),
      stock: parseInteger(formData.get("stock") as string),
      isActive: parseCheckbox(formData.get("isActive")),
    };

    await ProductService.update(id, data);
    revalidatePath("/admin/productos");
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return handleActionError(error, "updateProduct");
  }
}

export async function toggleProductActive(id: string, active: boolean) {
  try {
    await ProductService.toggleActive(id, active);
    revalidatePath("/admin/productos");
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return handleActionError(error, "toggleProductActive");
  }
}

// --- VARIANTS ---

export async function createVariant(productId: string, formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      color: (formData.get("color") as string) || null,
      image: (formData.get("image") as string) || null,
      size: (formData.get("size") as string) || null,
      stock: parseInteger(formData.get("stock") as string),
      price: parseLocalizedFloat(formData.get("price") as string),
    };

    if (!data.name) return { error: "El nombre es obligatorio" };

    await ProductService.createVariant(productId, data);
    revalidatePath("/admin/productos");
    revalidatePath(`/productos/${productId}`);
    return { success: true };
  } catch (error) {
    return handleActionError(error, "createVariant");
  }
}

export async function createVariantBatch(productId: string, data: any) {
  try {
    await ProductService.createVariantBatch(productId, data);
    revalidatePath("/admin/productos");
    revalidatePath(`/productos/${productId}`);
    return { success: true, count: data.sizes.length };
  } catch (error) {
    return handleActionError(error, "createVariantBatch");
  }
}

export async function deleteVariant(id: string, productId: string) {
  try {
    await ProductService.deleteVariant(id);
    revalidatePath("/admin/productos");
    revalidatePath(`/productos/${productId}`);
    return { success: true };
  } catch (error) {
    return handleActionError(error, "deleteVariant");
  }
}

export async function updateVariant(id: string, productId: string, formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      color: (formData.get("color") as string) || null,
      image: (formData.get("image") as string) || null,
      size: (formData.get("size") as string) || null,
      stock: parseInteger(formData.get("stock") as string),
      price: parseLocalizedFloat(formData.get("price") as string),
    };

    await ProductService.updateVariant(id, data);
    revalidatePath("/admin/productos");
    revalidatePath(`/productos/${productId}`);
    return { success: true };
  } catch (error) {
    return handleActionError(error, "updateVariant");
  }
}

// --- USERS ---

export async function updateUserRole(id: string, role: string) {
  try {
    await prisma.profile.update({ where: { id }, data: { role } });
    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error) {
    return handleActionError(error, "updateUserRole");
  }
}

// --- SUBSCRIPTIONS ---

export async function completeSubscriptionReminder(reminderId: string) {
  try {
    await SubscriptionService.completeReminder(reminderId);
    revalidatePath("/admin/suscripciones");
    revalidatePath("/suscripciones");
    return { success: true };
  } catch (error) {
    return handleActionError(error, "completeSubscriptionReminder");
  }
}

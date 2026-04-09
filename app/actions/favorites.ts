"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { formatProduct } from "@/services/products";

export async function toggleFavorite(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Debes iniciar sesión para guardar favoritos" };
  }

  try {
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        },
      },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: {
          userId_productId: {
            userId: user.id,
            productId: productId,
          },
        },
      });
      revalidatePath(`/productos/${productId}`);
      return { success: true, action: "removed" };
    } else {
      await prisma.favorite.create({
        data: {
          userId: user.id,
          productId: productId,
        },
      });
      revalidatePath(`/productos/${productId}`);
      return { success: true, action: "added" };
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return { error: "Error al procesar favoritos" };
  }
}

export async function checkIfFavorite(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        },
      },
    });
    return !!favorite;
  } catch (error) {
    return false;
  }
}

export async function getUserFavorites() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: user.id,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return (favorites as any[]).map((f) =>
      formatProduct({
        ...f.product,
        category: f.product.category.name,
      }),
    );
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
}

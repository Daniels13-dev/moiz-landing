"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getReviews() {
  try {
    const reviews = await prisma.review.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, reviews };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return { success: false, reviews: [] };
  }
}

export async function getAllReviewsForAdmin() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, reviews };
  } catch (error) {
    console.error("Error fetching admin reviews:", error);
    return { success: false, reviews: [] };
  }
}

export async function toggleReviewActive(id: string, active: boolean) {
  try {
    await prisma.review.update({
      where: { id },
      data: { isActive: active },
    });
    revalidatePath("/admin/testimonios");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error toggling review active:", error);
    return { success: false };
  }
}

export async function createReview(data: {
  name: string;
  rating: number;
  text: string;
  image?: string;
  city?: string;
  date?: string;
}) {
  try {
    const review = await prisma.review.create({
      data: {
        ...data,
      },
    });
    revalidatePath("/admin/testimonios");
    revalidatePath("/");
    return { success: true, review };
  } catch (error) {
    console.error("Error creating review:", error);
    return { success: false };
  }
}

export async function updateReview(id: string, data: {
  name?: string;
  rating?: number;
  text?: string;
  image?: string;
  city?: string;
  date?: string;
}) {
  try {
    const review = await prisma.review.update({
      where: { id },
      data: {
        ...data,
      },
    });
    revalidatePath("/admin/testimonios");
    revalidatePath("/");
    return { success: true, review };
  } catch (error) {
    console.error("Error updating review:", error);
    return { success: false };
  }
}

export async function deleteReview(id: string) {
  try {
    await prisma.review.delete({
      where: { id },
    });
    revalidatePath("/admin/testimonios");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { success: false };
  }
}

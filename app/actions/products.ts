"use server";

import { getAllProducts } from "@/services/products";

export async function getCrossSellingProducts() {
  try {
    const products = await getAllProducts();
    return { success: true, products };
  } catch (error) {
    console.error("Error fetching cross-selling products:", error);
    return { success: false, products: [] };
  }
}

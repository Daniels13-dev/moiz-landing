import prisma from "@/lib/prisma";

/**
 * Servicio centralizado para la gestión de productos.
 * Aplica lógica de negocio de arquitectura (como transparencia de imágenes)
 * de forma transparente para los componentes UI.
 */

export interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number | null;
  image: string;
  rating: number;
  category: string;
  petType: string;
  isFeatured?: boolean;
  isNew?: boolean;
}

/**
 * Formatea un producto asegurando que use la versión transparente de la imagen
 * y cumpliendo con el estándar de arquitectura.
 */
export function formatProduct(product: any): ProductData {
  if (!product) return product;

  let image = product.image || "";
  
  // Lógica centralizada: Si es un PNG de producto local sin sufijo transparent, lo añadimos
  if (image.startsWith("/products/") && image.endsWith(".png") && !image.includes("-transparent")) {
    image = image.replace(".png", "-transparent.png");
  }

  return {
    ...product,
    image,
    description: product.description || product.desc || "", // Normalización de nombres de campos
    category: product.category || "General",
    petType: product.petType || "Gato",
  };
}

/**
 * Obtiene el producto destacado para el blog o landing.
 */
export async function getFeaturedProduct() {
  const product = await prisma.product.findFirst({
    where: { isFeatured: true },
    include: { category: true }
  });

  return formatProduct({
    ...product,
    category: product?.category?.name
  });
}

/**
 * Obtiene todos los productos con el formato correcto.
 */
export async function getAllProducts() {
  const products = await prisma.product.findMany({
    include: { category: true }
  });

  return products.map(p => formatProduct({
    ...p,
    category: p.category?.name
  }));
}

/**
 * Resuelve un producto por su Slug (nombre normalizado).
 * Útil para páginas dinámicas de detalle.
 */
export async function getProductBySlug(slug: string) {
  const allProducts = await getAllProducts();

  const matched = allProducts.find((p) => {
    const canonicalSlug = p.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return canonicalSlug === slug;
  });

  return matched || null;
}

/**
 * Obtiene todas las categorías disponibles.
 */
export async function getAllCategories() {
  return await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });
}

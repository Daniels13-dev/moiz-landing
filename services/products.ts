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
  allowSubscription?: boolean;
  variants?: Array<{
    id: string;
    name: string;
    color: string | null;
    image: string | null;
    size: string | null;
    stock: number;
    price: number | null;
  }>;
}

interface RawVariant {
  [key: string]: unknown;
  image?: string | null;
}

interface RawProduct {
  [key: string]: unknown;
  image?: string;
  description?: string;
  desc?: string;
  category?: string;
  petType?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  allowSubscription?: boolean;
  variants?: RawVariant[];
}

/**
 * Formatea un producto asegurando que use la versión transparente de la imagen
 * y cumpliendo con el estándar de arquitectura.
 */
export function formatProduct(product: unknown): ProductData {
  if (!product) return product as unknown as ProductData;
  const p = product as RawProduct;

  const image = p.image || "";

  // Format variant images (pass through, Cloudinary URLs need no transformation)
  const variants = p.variants?.map((v) => ({
    ...v,
    image: v.image || "",
  }));

  return {
    ...p,
    image,
    variants,
    description: p.description || p.desc || "",
    category: p.category || "General",
    petType: p.petType || "Gato",
    isFeatured: Boolean(p.isFeatured),
    isNew: Boolean(p.isNew),
    allowSubscription: Boolean(p.allowSubscription),
  } as ProductData;
}

/**
 * Obtiene el producto destacado para el blog o landing.
 */
export async function getFeaturedProduct() {
  const product = await prisma.product.findFirst({
    where: { 
      isFeatured: true, 
      isActive: true,
      category: { isActive: true }
    },
    include: { category: true },
  });

  return formatProduct({
    ...product,
    category: product?.category?.name,
  });
}

/**
 * Obtiene todos los productos con el formato correcto.
 */
export async function getAllProducts() {
  const products = await prisma.product.findMany({
    where: { 
      isActive: true,
      category: { isActive: true }
    },
    include: { category: true, variants: true },
  });

  return products.map((p) =>
    formatProduct({
      ...p,
      category: p.category?.name,
    }),
  );
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
    where: { isActive: true },
    select: {
      id: true,
      name: true,
    },
  });
}

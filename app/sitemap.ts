import { MetadataRoute } from "next";

export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ select: { id: true, updatedAt: true, name: true } }),
    prisma.category.findMany({ select: { name: true } }),
  ]);

  const productUrls = products.map((product) => {
    const slug = product.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return {
      url: `${siteConfig.url}/productos/${slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    };
  });

  const categoryUrls = categories.map((category) => ({
    url: `${siteConfig.url}/productos?categoria=${encodeURIComponent(category.name)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const staticUrls = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/productos`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/info/arena`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  return [...staticUrls, ...productUrls, ...categoryUrls];
}

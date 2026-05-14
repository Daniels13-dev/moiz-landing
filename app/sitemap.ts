import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { blogPosts } from "@/data/blog";

export const dynamic = "force-dynamic";

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

  const categoryUrls = categories.map((category) => {
    const slug = category.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return {
      url: `${siteConfig.url}/productos/categoria/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    };
  });

  const blogUrls = blogPosts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
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
      url: `${siteConfig.url}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/info/arena`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/testimonios`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/rastrear-mi-pedido`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${siteConfig.url}/terminos`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
    {
      url: `${siteConfig.url}/privacidad`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
    {
      url: `${siteConfig.url}/politicas`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
  ];

  return [...staticUrls, ...productUrls, ...categoryUrls, ...blogUrls];
}

import { Metadata } from "next";

export const revalidate = 3600;
import { getProductBySlug, getAllProducts } from "@/services/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappButton from "@/components/WhatsappButton";
import ProductDetailView from "@/components/ProductDetailView";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => {
    const canonicalSlug = product.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return { id: canonicalSlug };
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: slugParam } = await params;
  const product = await getProductBySlug(slugParam);

  if (!product) return { title: "Producto no encontrado" };

  return {
    title: `${product.name} | Möiz Pets`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slugParam } = await params;
  const product = await getProductBySlug(slugParam);

  if (!product) {
    notFound();
  }

  // Fetch related products (same category)
  const allProducts = await getAllProducts();
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image,
    description: product.description,
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/productos/${product.id}`,
      priceCurrency: "COP",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: siteConfig.name },
    },
  };

  return (
    <main className="bg-[#F9F9F8] min-h-screen flex flex-col selection:bg-[var(--moiz-green)] selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <div className="flex-1">
        <ProductDetailView product={product} relatedProducts={relatedProducts} />
      </div>

      <Footer />
      <WhatsappButton />
    </main>
  );
}

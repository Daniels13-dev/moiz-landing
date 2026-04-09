import { Metadata } from "next";
import { getProductBySlug, getAllProducts } from "@/services/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappButton from "@/components/WhatsappButton";
import ProductDetailView from "@/components/ProductDetailView";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: slugParam } = await params;
  const product = await getProductBySlug(slugParam);

  if (!product) return { title: "Producto no encontrado" };

  return {
    title: `${product.name} | Arena Ecológica Möiz`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

  return (
    <main className="bg-[#F9F9F8] min-h-screen flex flex-col selection:bg-[var(--moiz-green)] selection:text-white">
      <Navbar />

      <div className="flex-1">
        <ProductDetailView product={product} relatedProducts={relatedProducts} />
      </div>

      <Footer />
      <WhatsappButton />
    </main>
  );
}

import { getAllProducts, getAllCategories } from "@/services/products";

export const dynamic = "force-dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCarousel from "@/components/ProductCarousel";
import CategoriesSection from "@/components/CategoriesSection";
import ProductReviews from "@/components/ProductReviews";
import Footer from "@/components/Footer";
import WhatsappButton from "@/components/WhatsappButton";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";

export default async function Home() {
  const [allProducts, categoriesDb] = await Promise.all([getAllProducts(), getAllCategories()]);

  const featuredProducts = allProducts.filter((p) => p.isFeatured).slice(0, 5);

  return (
    <main>
      <Navbar />

      <Hero />

      <ProductCarousel products={featuredProducts} />

      <CategoriesSection dbCategories={categoriesDb} />

      <ProductReviews />

      <FAQ />

      <Newsletter />

      <Footer />

      <WhatsappButton />
    </main>
  );
}

import { getFeaturedProducts, getAllCategories } from "@/services/products";

export const revalidate = 3600;
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCarousel from "@/components/ProductCarousel";
import CategoriesSection from "@/components/CategoriesSection";
import ProductReviews from "@/components/ProductReviews";
import Footer from "@/components/Footer";
import WhatsappButton from "@/components/WhatsappButton";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";
import TrustSeals from "@/components/TrustSeals";

export default async function Home() {
  const [featuredProducts, categoriesDb] = await Promise.all([getFeaturedProducts(5), getAllCategories()]);

  return (
    <main>
      <Navbar />

      <Hero />
      <TrustSeals />

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

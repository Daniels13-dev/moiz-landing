import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCarousel from "@/components/ProductCarousel";
import ProductReviews from "@/components/ProductReviews";
import Benefits from "@/components/Benefits";
import Footer from "@/components/Footer";
import WhatsappButton from "@/components/WhatsappButton";

export default function Home() {

  return (
    <main>

      <Navbar />

      <Hero />

      <ProductCarousel />

    <ProductReviews />

      <Benefits />

      <Footer />

      <WhatsappButton />

    </main>
  );
}
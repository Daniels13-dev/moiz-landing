import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCarousel from "@/components/ProductCarousel";
import ProductReviews from "@/components/ProductReviews";
import Benefits from "@/components/Benefits";
import Footer from "@/components/Footer";
import WhatsappButton from "@/components/WhatsappButton";
import Comparison from "@/components/Comparison";
import TransitionGuide from "@/components/TransitionGuide";
import FAQ from "@/components/FAQ";

export default function Home() {

  return (
    <main>

      <Navbar />

      <Hero />

      <ProductCarousel />

      <Comparison />

      <Benefits />

      <TransitionGuide />

      <ProductReviews />

      <FAQ />

      <Footer />

      <WhatsappButton />

    </main>
  );
}
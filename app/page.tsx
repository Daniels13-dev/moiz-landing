import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCarousel from "@/components/ProductCarousel";
import Benefits from "@/components/Benefits";
import Footer from "@/components/Footer";
import WhatsappButton from "@/components/WhatsappButton";

export default function Home() {

  return (
    <main>

      <Navbar />

      <Hero />

      <ProductCarousel />

      <Benefits />

      <Footer />

      <WhatsappButton />

    </main>
  );
}
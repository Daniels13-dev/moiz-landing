import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Comparison from "@/components/Comparison";
import SavingsCalculator from "@/components/SavingsCalculator";
import Benefits from "@/components/Benefits";
import TransitionGuide from "@/components/TransitionGuide";
import WhatsappButton from "@/components/WhatsappButton";

export default function ArenaInfoPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <Comparison />

      <SavingsCalculator />

      <Benefits />

      <TransitionGuide />

      <Footer />

      <WhatsappButton />
    </main>
  );
}

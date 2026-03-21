import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappButton from "@/components/WhatsappButton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface LegalLayoutProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

export default function LegalLayout({ title, children }: LegalLayoutProps) {
  // Genera la marca de tiempo de la última actualización
  const hoy = new Date();
  const fechaFormateada = `${String(hoy.getDate()).padStart(2, "0")}/${String(hoy.getMonth() + 1).padStart(2, "0")}/${hoy.getFullYear()}`;

  return (
    <main className="bg-[var(--moiz-bg)]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24 min-h-screen text-[var(--moiz-text)] relative">
        {/* Header con botón atrás y Título Dinámico */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="p-3 bg-white rounded-full shadow-md text-[var(--moiz-green)] hover:text-white hover:bg-[var(--moiz-green)] transition-all hover:scale-105 flex-shrink-0"
            aria-label="Ir atrás al inicio"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-[var(--moiz-dark)] font-outfit">
            {title}
          </h1>
        </div>

        {/* Contenedor tipo papel para las políticas */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-gray-100 prose prose-lg prose-green max-w-none space-y-6 text-gray-700">
          <p className="inline-block px-4 py-2 bg-gray-100 rounded-full text-sm font-bold text-gray-600 mb-6 border border-gray-200">
            Última actualización: {fechaFormateada}
          </p>

          {/* Aquí se inyecta el contenido de cada página */}
          {children}
        </div>
      </div>

      <Footer />
      <WhatsappButton />
    </main>
  );
}

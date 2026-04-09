import { getAllProducts } from "@/services/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappButton from "@/components/WhatsappButton";
import ProductsHeader from "@/components/ProductsHeader";
import PetShopCatalog from "@/components/PetShopCatalog";

export default async function ProductosPage() {
  const initialProducts = await getAllProducts();

  return (
    <main className="bg-[#FAF9F6] min-h-screen flex flex-col selection:bg-[var(--moiz-green)] selection:text-white">
      <Navbar />
      <div className="flex-1 pt-8 md:pt-12">
        <ProductsHeader />

        {/* Dynamic Catalog Section */}
        <PetShopCatalog initialProducts={initialProducts} />

        {/* Informational Section */}
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[3rem] border border-zinc-100">
              <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Envíos Rápidos</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Entregas en tiempo récord para que tu mascota nunca se quede sin
                lo que necesita.
              </p>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border border-zinc-100">
              <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2v20M2 12h20" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Calidad Premium</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Solo seleccionamos productos de la más alta calidad, priorizando
                ingredientes naturales.
              </p>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border border-zinc-100">
              <div className="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-7.6-10.4 8.38 8.38 0 013.8.9L21 11.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Soporte Experto</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Nuestro equipo está listo para asesorarte en la mejor elección
                para tu mascota.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsappButton />
    </main>
  );
}

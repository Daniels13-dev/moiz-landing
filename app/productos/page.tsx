"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappButton from "@/components/WhatsappButton";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
const products = [
  { 
    name: "Arena 4", 
    image: "/products/arena4kg-transparent.png", 
    price: "$24.000", 
    desc: "Nuestra presentación estrella. Máximo equilibrio entre rendimiento y frescura constante.",
    colSpan: "lg:col-span-2",
    bgColor: "bg-[#F4F9F1]", // Soft green reflection
  },
  { 
    name: "Arena 10", 
    image: "/products/arena10kg-transparent.png", 
    price: "$55.000", 
    desc: "Mejor relación precio/uso. Perfecta para quienes buscan ahorro sin perder aglomeración.",
    colSpan: "lg:col-span-1",
    bgColor: "bg-zinc-100",
  },
  { 
    name: "Arena 2", 
    image: "/products/arena2kg-transparent.png", 
    price: "$12.000", 
    desc: "Ideal para un mes de prueba o gatos pequeños.",
    colSpan: "lg:col-span-1",
    bgColor: "bg-[#FFF9EA]", // soft yellow
  },
  { 
    name: "Arena 20", 
    image: "/products/arena20kg-transparent.png", 
    price: "$108.000", 
    desc: "El formato de suministro constante. Hogares con 2 a 3 encantadores felinos.",
    colSpan: "lg:col-span-1",
    bgColor: "bg-white border border-zinc-200",
  },
  { 
    name: "Arena 50", 
    image: "/products/arena50kg-transparent.png", 
    price: "$237.000", 
    desc: "El titán del soporte. Uso profesional, fundaciones o familias multiespecie gigantes.",
    colSpan: "lg:col-span-1",
    bgColor: "bg-[#0A0E0A] text-white", // Dark premium card
    darkText: true,
  },
];
export default function ProductosPage() {
  const { cart, addToCart, updateQuantity } = useCart();

  const getProductQuantity = (productName: string) => {
    return cart.find(item => item.id === productName)?.quantity || 0;
  };
  return (
    <main className="bg-[#FAF9F6] min-h-screen flex flex-col selection:bg-[var(--moiz-green)] selection:text-white">
      <Navbar />
      <div className="flex-1 pt-40 md:pt-48 pb-24 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-20 text-center"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-zinc-900 tracking-tighter mb-6 leading-none">
            Elige tu <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--moiz-green)] to-[var(--moiz-yellow)]">Presentación</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Descubre la arena de maíz perfecta para ti. Absorción ultrasónica, 100% compostable y con el control de olores más limpio de Colombia.
          </p>
        </motion.div>
        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[450px]">
          {products.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`group relative rounded-[2.5rem] p-8 md:p-10 overflow-hidden flex flex-col justify-between transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] ${p.colSpan} ${p.bgColor}`}
            >
              {/* Massive background text decoration */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] lg:text-[16rem] font-black pointer-events-none select-none tracking-tighter transition-all duration-700 group-hover:scale-110 ${p.darkText ? 'text-white/[0.03]' : 'text-black/[0.03]'}`}>
                {p.name.replace('Arena', '').trim()}
              </div>
              {/* Top Text Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className={`text-4xl font-extrabold tracking-tight ${p.darkText ? 'text-white' : 'text-zinc-900'}`}>{p.name} <span className="text-2xl text-[var(--moiz-green)]">KG</span></h2>
                    <p className={`mt-3 text-sm font-medium leading-relaxed max-w-sm ${p.darkText ? 'text-zinc-400' : 'text-zinc-500'}`}>{p.desc}</p>
                  </div>
                  <span className={`text-2xl font-black ${p.darkText ? 'text-white' : 'text-[var(--moiz-green)]'}`}>{p.price}</span>
                </div>
              </div>
              {/* Abstract circular glow behind image */}
              <div className="absolute bottom-[-10%] sm:bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-white/40 blur-[50px] rounded-full pointer-events-none z-0" />
              {/* Floating Product Image */}
              <div className="relative z-10 w-full h-[60%] flex items-end justify-center">
                <motion.div
                  whileHover={{ scale: 1.05, y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-full h-full flex items-end justify-center"
                >
                  <Image 
                    src={p.image} 
                    alt={p.name} 
                    width={300} 
                    height={400} 
                    className="object-contain h-full max-h-[120%] drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)]" 
                  />
                </motion.div>
              </div>
              {/* Action Button */}
              <div className="absolute bottom-8 right-8 z-20 flex items-center gap-2">
                <AnimatePresence>
                  {getProductQuantity(p.name) > 0 && (
                    <>
                      <motion.button
                        initial={{ scale: 0, opacity: 0, x: 20 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        exit={{ scale: 0, opacity: 0, x: 20 }}
                        onClick={() => updateQuantity(p.name, -1)}
                        className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 bg-white/75 text-zinc-950 px-3"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
                      </motion.button>

                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className={`flex items-center justify-center min-w-[2.5rem] h-11 px-3 rounded-full font-black text-base shadow-xl border ${p.darkText ? 'bg-white text-zinc-950 border-white' : 'bg-zinc-100 border-zinc-200 text-zinc-900'}`}
                      >
                        {getProductQuantity(p.name)}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
                
                <button 
                  onClick={() => addToCart(p)}
                  className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 bg-[var(--moiz-green)] text-zinc-950"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
      <WhatsappButton />
    </main>
  );
}
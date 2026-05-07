import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { Plus, ShoppingBag, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { getCrossSellingProducts } from "@/app/actions/products";

export default function CartCrossSelling() {
  const { cart, addToCart } = useCart();
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const res = await getCrossSellingProducts();
      if (res.success) {
        setAllProducts(res.products);
      }
      setLoading(false);
    }
    loadProducts();
  }, []);

  const recommendations = useMemo(() => {
    if (allProducts.length === 0) return [];

    // 1. Get IDs of products already in cart
    const cartProductIds = cart.map((item) => item.productId);

    // 2. Filter products that are NOT in cart
    const available = allProducts.filter((p) => !cartProductIds.includes(p.id));

    // 3. Logic: Pick 3 products. 
    // Prefer Featured or just shuffle/pick from different categories.
    return available
      .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
      .slice(0, 3);
  }, [cart, allProducts]);

  if (loading) {
    return (
      <div className="mt-16 flex justify-center py-20">
        <Loader2 className="animate-spin text-zinc-300" size={32} />
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-16 md:mt-24">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 bg-[var(--moiz-green)]/10 text-[var(--moiz-green)] rounded-xl flex items-center justify-center">
          <ShoppingBag size={20} />
        </div>
        <h3 className="text-2xl font-black text-zinc-900 tracking-tight">
          Complementa tu pedido
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-6 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
          >
            <div className="flex-1">
              <div className="relative h-40 w-full mb-6 flex items-center justify-center p-4 bg-[#FAF9F6] rounded-3xl overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-500"
                />
                {product.isNew && (
                  <span className="absolute top-3 left-3 bg-zinc-900 text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                    Nuevo
                  </span>
                )}
              </div>

              <div className="space-y-1 mb-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  {product.category}
                </p>
                <h4 className="text-lg font-black text-zinc-900 leading-tight">
                  {product.name}
                </h4>
                <p className="text-[var(--moiz-green)] font-black">
                  ${product.price.toLocaleString("es-CO")}
                </p>
              </div>
            </div>

            <button
              onClick={() => addToCart(product as any)}
              className="w-full py-3.5 bg-zinc-50 hover:bg-zinc-900 text-zinc-900 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn mt-auto"
            >
              <Plus size={16} className="group-hover/btn:rotate-90 transition-transform" />
              Añadir
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

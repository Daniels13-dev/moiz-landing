import { getOrderById } from "@/app/actions/orders";
import OrderDetail from "@/components/orders/OrderDetail";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <main className="bg-[#FAF9F6] min-h-screen flex flex-col selection:bg-[var(--moiz-green)] selection:text-white overflow-x-hidden">
      <Navbar />

      <div className="flex-1 max-w-6xl w-full mx-auto px-6 pt-12 pb-20">
        <div className="mb-10">
          <Link
            href="/pedidos"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-[var(--moiz-green)] font-black text-xs uppercase tracking-widest transition-colors mb-6"
          >
            <ChevronLeft size={16} /> Volver a Mis Pedidos
          </Link>
        </div>

        <OrderDetail order={order} />
      </div>

      <Footer />
    </main>
  );
}

import { getOrderById } from "@/app/actions/orders";
import OrderDetail from "@/components/orders/OrderDetail";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="mb-10">
        <Link
          href="/admin/pedidos"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-[var(--moiz-green)] font-black text-xs uppercase tracking-widest transition-colors mb-6"
        >
          <ChevronLeft size={16} /> Volver a Pedidos
        </Link>
      </div>

      <OrderDetail order={order} showHelp={false} />
    </div>
  );
}

import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import UserSubscriptionCard, { Subscription } from "./UserSubscriptionCard";

export const dynamic = "force-dynamic";

export default async function UserSubscriptions() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/suscripciones");
  }

  const subscriptions = (await prisma.subscription.findMany({
    where: { userId: user.id },
    include: {
      product: true,
    },
    orderBy: { nextBillingDate: "asc" },
  })) as unknown as Subscription[];

  return (
    <main className="bg-[#FAF9F6] min-h-screen flex flex-col selection:bg-[var(--moiz-green)] selection:text-white">
      <Navbar />

      <div className="flex-1 pt-12 md:pt-20 px-6 max-w-7xl mx-auto w-full pb-24">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tighter mb-4">
            Mis <span className="text-[var(--moiz-green)]">Suscripciones</span>
          </h1>
          <p className="text-zinc-500 font-medium text-lg">
            Gestiona tus entregas recurrentes y ahorra tiempo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {subscriptions.length > 0 ? (
            subscriptions.map((sub) => <UserSubscriptionCard key={sub.id} subscription={sub} />)
          ) : (
            <div className="col-span-full py-40 bg-white border border-dashed border-zinc-200 rounded-[4rem] text-center flex flex-col items-center justify-center gap-6">
              <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-200">
                <ShoppingBag size={48} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-zinc-900 mb-2">Sin suscripciones</h3>
                <p className="text-zinc-500 max-w-xs mx-auto mb-10 font-bold">
                  Aún no tienes productos en modo suscripción. ¡Empieza a ahorrar hoy!
                </p>
                <Link
                  href="/productos"
                  className="px-10 py-5 bg-[var(--moiz-green)] text-zinc-950 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[var(--moiz-green)]/10"
                >
                  Ver Catálogo
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

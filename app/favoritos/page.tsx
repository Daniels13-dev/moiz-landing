import { getUserFavorites } from "@/app/actions/favorites";

export const dynamic = "force-dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FavoritesList from "@/components/FavoritesList";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function FavoritosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/favoritos");
  }

  const initialFavorites = await getUserFavorites();

  return (
    <main className="bg-[#F9F9F8] min-h-screen flex flex-col selection:bg-[var(--moiz-green)] selection:text-white">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-20">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter mb-4">
            Mis <span className="text-[var(--moiz-green)]">Favoritos</span>
          </h1>
          <p className="text-lg text-zinc-500 font-medium">
            Los productos que más te gustan, guardados para cuando los necesites.
          </p>
        </header>

        <FavoritesList initialFavorites={initialFavorites} />
      </div>

      <Footer />
    </main>
  );
}

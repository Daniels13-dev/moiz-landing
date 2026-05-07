import { getProfile } from "@/app/actions/profile";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileView from "@/components/ProfileView";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/perfil");
  }

  const profile = await getProfile();

  if (!profile) {
    // Should not happen if auth works, but safe fallback
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <main className="bg-[#F9F9F8] min-h-screen flex flex-col selection:bg-[var(--moiz-green)] selection:text-white">
      <Navbar />

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 md:py-20">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter mb-4">
            Mi <span className="text-[var(--moiz-green)]">Perfil</span>
          </h1>
          <p className="text-lg text-zinc-500 font-medium">
            Gestiona tu información personal y tus direcciones de envío.
          </p>
        </header>

        <ProfileView initialProfile={profile} />
      </div>

      <Footer />
    </main>
  );
}

import Link from "next/link";
import { ArrowLeft, Cat } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[var(--moiz-bg)] text-[var(--moiz-text)] px-4 text-center">
      <div className="relative mb-8">
        <Cat className="w-32 h-32 text-[var(--moiz-green)] opacity-20 mx-auto" strokeWidth={1} />
        <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl font-black text-[var(--moiz-green)]">
          404
        </h1>
      </div>

      <h2 className="text-3xl font-bold mb-4 font-outfit text-[var(--moiz-dark)]">
        ¡Ups! Parece que tu gatito se perdió
      </h2>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        La página que estás buscando no existe, ha sido movida o está jugando a las escondidas en
        otra caja de arena.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--moiz-green)] text-white rounded-full font-bold hover:bg-[#5b7a24] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#6A8E2A]/20"
      >
        <ArrowLeft className="w-5 h-5" />
        Regresar al Inicio
      </Link>
    </div>
  );
}

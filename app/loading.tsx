import { Cat } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--moiz-bg)] z-50">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-[var(--moiz-green)] rounded-full blur-xl opacity-20 animate-pulse"></div>
        {/* Bouncing cat */}
        <Cat className="w-16 h-16 text-[var(--moiz-green)] animate-bounce relative z-10" />
      </div>
      <p className="mt-4 font-bold text-[var(--moiz-green)] animate-pulse font-outfit tracking-wider">
        CARGANDO...
      </p>
    </div>
  );
}

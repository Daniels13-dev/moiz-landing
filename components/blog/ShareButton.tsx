"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Enlace copiado al portapapeles", {
        description: "Ya puedes compartir esta publicación.",
        icon: <Check size={16} className="text-[var(--moiz-green)]" />,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("No se pudo copiar el enlace");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-3 text-sm font-black text-zinc-400 hover:text-[var(--moiz-green)] transition-all group"
    >
      {copied ? (
        <Check size={18} className="text-[var(--moiz-green)] animate-in zoom-in" />
      ) : (
        <Share2 size={18} className="group-hover:scale-110 transition-transform" />
      )}
      <span>{copied ? "Enlace Copiado" : "Compartir"}</span>
    </button>
  );
}

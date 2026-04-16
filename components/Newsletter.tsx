"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Sparkles, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { siteConfig } from "@/config/site";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      const result = await subscribeToNewsletter(email);

      if (result.success) {
        setIsSubscribed(true);
        toast.success("¡Bienvenido al Universo Möiz!", {
          description: "Tu cupón del 10% ha sido enviado a tu correo.",
        });
      } else {
        toast.error(result.message || "Algo salió mal. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Newsletter error:", error);
      toast.error("Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="newsletter" className="py-24 px-6 md:px-12 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--moiz-green)]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#E6B800]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="max-w-6xl mx-auto">
        <div className="relative z-10 bg-zinc-900 rounded-[3rem] p-8 md:p-16 lg:p-24 overflow-hidden border border-white/5 shadow-2xl">
          {/* Internal Glow */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[var(--moiz-green)]/10 via-transparent to-transparent opacity-50" />

          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-20">
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[var(--moiz-green)] text-xs font-black uppercase tracking-widest mb-6"
              >
                <Sparkles size={14} />
                Beneficio Exclusivo
              </motion.div>

              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-[1.1]">
                {siteConfig.ui.newsletter.title}
              </h2>

              <p className="text-lg text-white/60 font-medium mb-0 max-w-md">
                {siteConfig.ui.newsletter.subtitle}
              </p>
            </div>

            <div className="relative">
              {isSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] text-center backdrop-blur-md"
                >
                  <div className="w-16 h-16 bg-[var(--moiz-green)] text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">{siteConfig.ui.newsletter.success}</h3>
                  <p className="text-white/60 font-medium">
                    {siteConfig.ui.newsletter.successDesc}
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white/5 border border-white/10 p-1.5 md:p-2 rounded-full flex flex-col md:flex-row gap-2 shadow-2xl backdrop-blur-md max-w-md lg:ml-auto"
                >
                  <div className="flex-1 flex items-center gap-4 px-6 py-4 md:py-0">
                    <Mail className="text-white/30" size={20} />
                    <input
                      type="email"
                      placeholder="tucorreo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-transparent border-none outline-none text-white font-bold w-full placeholder:text-white/20 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[var(--moiz-green)] hover:bg-[#7ba335] text-zinc-950 font-black px-8 py-3.5 rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 text-xs uppercase tracking-wider"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin" />
                    ) : (
                      <>
                        Unirme <Send size={14} />
                      </>
                    )}
                  </button>
                </form>
              )}

              <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-6 text-center lg:text-left px-4">
                * No hacemos spam. Solo enviamos amor y descuentos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

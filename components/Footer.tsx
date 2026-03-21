import { FaWhatsapp, FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa";
import { siteConfig } from "@/config/site";

import Link from "next/link";

const socials = [
  { platform: "WhatsApp", url: siteConfig.links.whatsapp, Icon: FaWhatsapp, hoverBgClass: "hover:bg-[#25D366]/10", hoverBorderClass: "hover:border-[#25D366]/30", hoverTextClass: "group-hover:text-[#25D366]" },
  { platform: "Instagram", url: siteConfig.links.instagram, Icon: FaInstagram, hoverBgClass: "hover:bg-[#E1306C]/10", hoverBorderClass: "hover:border-[#E1306C]/30", hoverTextClass: "group-hover:text-[#E1306C]" },
  { platform: "TikTok", url: siteConfig.links.tiktok, Icon: FaTiktok, hoverBgClass: "hover:bg-[#00F2FE]/10", hoverBorderClass: "hover:border-[#00F2FE]/30", hoverTextClass: "group-hover:text-[#00F2FE]" },
  { platform: "Facebook", url: siteConfig.links.facebook, Icon: FaFacebook, hoverBgClass: "hover:bg-[#1877F2]/10", hoverBorderClass: "hover:border-[#1877F2]/30", hoverTextClass: "group-hover:text-[#1877F2]" },
];

export default function Footer() {
  return (
    <div className="bg-white px-4 md:px-8 pb-4 md:pb-8 pt-12">
      {/* Sentinel for Visibility Observer */}
      <div id="footer-marker" className="h-1 w-full" />

      {/* Floating Card Design */}
      <footer
        id="contacto"
        className="bg-[#0A0E0A] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden relative shadow-2xl"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[var(--moiz-green)]/10 blur-[100px] rounded-full pointer-events-none translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-[-20%] left-[-10%] text-[20vw] leading-none font-black text-white/[0.02] pointer-events-none select-none tracking-tighter">
          MÖIZ
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-16 pt-20 md:pt-32 pb-12 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-8 border-b border-white/10 pb-16 md:pb-24">
            {/* Massive Typography */}
            <div className="flex-1">
              <h2 className="text-5xl sm:text-7xl lg:text-[6rem] font-extrabold text-white tracking-tighter leading-[0.9] mb-8">
                Instinto <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--moiz-green)] to-[#E6B800]">
                  Natural.
                </span>
              </h2>
              <p className="text-zinc-400 text-lg sm:text-xl max-w-md leading-relaxed font-medium">
                La alternativa 100% compostable que revoluciona el cuidado
                felino. Cero olores, cero polvo, pura naturaleza.
              </p>
            </div>

            {/* Navigation Column */}
            <div className="flex flex-col gap-6 min-w-[180px]">
              <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs mb-2">
                Explora
              </p>
              <nav className="flex flex-col gap-4">
                {[
                  { name: "Inicio", path: "/" },
                  { name: "Productos", path: "/#producto" },
                  { name: "Comparativa", path: "/#comparativa" },
                  { name: "Beneficios", path: "/#beneficios" },
                  { name: "Transición", path: "/#transicion" },
                  { name: "Reseñas", path: "/#clientes" },
                  { name: "Preguntas", path: "/#faq" },
                ].map((link) => (
                  <Link
                    key={link.name}
                    href={link.path}
                    className="text-zinc-300 font-bold text-lg hover:text-[var(--moiz-green)] transition-all hover:translate-x-1 inline-flex items-center gap-2 group"
                  >
                    {link.name}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Social Pills */}
            <div className="flex flex-col gap-4 min-w-[240px]">
              <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs mb-2">
                Conecta con nosotros
              </p>

              {socials.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Visítanos en ${social.platform}`}
                  className={`group flex items-center justify-between px-6 py-4 rounded-full bg-white/5 border border-white/10 transition-all duration-300 ${social.hoverBgClass} ${social.hoverBorderClass}`}
                >
                  <span className="text-zinc-300 font-bold group-hover:text-white transition-colors">
                    {social.platform}
                  </span>
                  <social.Icon className={`w-5 h-5 text-zinc-500 transition-colors ${social.hoverTextClass}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm md:text-base font-medium text-zinc-500">
            <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-between">
              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  href="/terminos"
                  className="hover:text-[var(--moiz-green)] transition-colors"
                >
                  Términos
                </Link>
                <Link
                  href="/privacidad"
                  className="hover:text-[var(--moiz-green)] transition-colors"
                >
                  Privacidad
                </Link>
                <Link
                  href="/politicas"
                  className="hover:text-[var(--moiz-green)] transition-colors"
                >
                  Politicas de Envío
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-zinc-900 rounded-lg px-3 py-1 font-mono text-xs tracking-widest text-[#25D366]">
                  EN LÍNEA
                </span>
                <span>© 2026 Möiz SAS.</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

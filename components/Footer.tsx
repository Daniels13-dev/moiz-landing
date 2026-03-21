import Link from "next/link";

export default function Footer() {
  return (
    <div className="bg-white px-4 md:px-8 pb-4 md:pb-8 pt-12">
      {/* Sentinel for Visibility Observer */}
      <div id="footer-marker" className="h-1 w-full" />
      
      {/* Floating Card Design */}
      <footer id="contacto" className="bg-[#0A0E0A] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden relative shadow-2xl">
        
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--moiz-green)] to-[#E6B800]">Natural.</span>
              </h2>
              <p className="text-zinc-400 text-lg sm:text-xl max-w-md leading-relaxed font-medium">
                La alternativa 100% compostable que revoluciona el cuidado felino. Cero olores, cero polvo, pura naturaleza.
              </p>
            </div>

            {/* Navigation Column */}
            <div className="flex flex-col gap-6 min-w-[180px]">
              <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs mb-2">Explora</p>
              <nav className="flex flex-col gap-4">
                <Link href="/" className="text-zinc-300 font-bold text-lg hover:text-[var(--moiz-green)] transition-all hover:translate-x-1 inline-flex items-center gap-2 group">
                  Inicio
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/#producto" className="text-zinc-300 font-bold text-lg hover:text-[var(--moiz-green)] transition-all hover:translate-x-1 inline-flex items-center gap-2 group">
                  Productos
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/#comparativa" className="text-zinc-300 font-bold text-lg hover:text-[var(--moiz-green)] transition-all hover:translate-x-1 inline-flex items-center gap-2 group">
                  Comparativa
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/#beneficios" className="text-zinc-300 font-bold text-lg hover:text-[var(--moiz-green)] transition-all hover:translate-x-1 inline-flex items-center gap-2 group">
                  Beneficios
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/#transicion" className="text-zinc-300 font-bold text-lg hover:text-[var(--moiz-green)] transition-all hover:translate-x-1 inline-flex items-center gap-2 group">
                  Transición
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/#clientes" className="text-zinc-300 font-bold text-lg hover:text-[var(--moiz-green)] transition-all hover:translate-x-1 inline-flex items-center gap-2 group">
                  Reseñas
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/#faq" className="text-zinc-300 font-bold text-lg hover:text-[var(--moiz-green)] transition-all hover:translate-x-1 inline-flex items-center gap-2 group">
                  Preguntas
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </nav>
            </div>

            {/* Social Pills */}
            <div className="flex flex-col gap-4 min-w-[240px]">
              <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs mb-2">Conecta con nosotros</p>
              
              <a href="https://wa.me/573218515161" target="_blank" rel="noreferrer" className="group flex items-center justify-between px-6 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-[#25D366]/10 hover:border-[#25D366]/30 transition-all duration-300">
                <span className="text-zinc-300 font-bold group-hover:text-white transition-colors">WhatsApp</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-500 group-hover:text-[#25D366] transition-colors">
                  <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.373 0 .001 5.373 0 12c0 2.11.553 4.07 1.6 5.82L0 24l6.4-1.63A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12 0-1.95-.42-3.8-1.48-5.52zM12 21.5a9.39 9.39 0 0 1-4.9-1.35l-.35-.22-3.8.97.99-3.7-.22-.36A9.5 9.5 0 1 1 21.5 12 9.39 9.39 0 0 1 12 21.5z" />
                  <path d="M17.5 14.5c-.3-.15-1.79-.88-2.07-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.17.2-.34.22-.64.08-.3-.15-1.28-.47-2.43-1.5-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.5.15-.17.2-.28.3-.46.1-.17.05-.32-.02-.46-.07-.13-.68-1.64-.93-2.24-.24-.59-.48-.51-.68-.52l-.58-.01c-.2 0-.52.07-.8.32-.28.26-1.07 1.04-1.07 2.52 0 1.48 1.1 2.9 1.25 3.1.15.2 2.16 3.49 5.23 4.89 3.07 1.4 3.07.93 3.62.87.55-.07 1.79-.73 2.04-1.44.25-.71.25-1.32.17-1.44-.07-.12-.26-.17-.55-.31z" />
                </svg>
              </a>

              <a href="https://www.instagram.com/moizvilla/" target="_blank" rel="noreferrer" className="group flex items-center justify-between px-6 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-[#E1306C]/10 hover:border-[#E1306C]/30 transition-all duration-300">
                <span className="text-zinc-300 font-bold group-hover:text-white transition-colors">Instagram</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 group-hover:text-[#E1306C] transition-colors">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              <a href="https://www.tiktok.com/@moiz.arena" target="_blank" rel="noreferrer" className="group flex items-center justify-between px-6 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-[#00F2FE]/10 hover:border-[#00F2FE]/30 transition-all duration-300">
                <span className="text-zinc-300 font-bold group-hover:text-white transition-colors">TikTok</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-500 group-hover:text-[#00F2FE] transition-colors">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91.04.15 1.5.83 2.9 1.94 3.96 1.13 1.05 2.62 1.63 4.19 1.63v3.7c-2.02-.02-3.95-.6-5.55-1.63v7.35c0 4.01-3.25 7.26-7.26 7.26C5.74 24 2.5 20.76 2.5 16.74c0-4.01 3.25-7.26 7.26-7.26.17 0 .33.01.5.03V13.2c-.17-.02-.33-.03-.5-.03-1.95 0-3.53 1.58-3.53 3.53s1.58 3.53 3.53 3.53c1.95 0 3.53-1.58 3.53-3.53V0h.005z"/>
                </svg>
              </a>

              <a href="https://www.facebook.com/MOIZTD" target="_blank" rel="noreferrer" className="group flex items-center justify-between px-6 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30 transition-all duration-300">
                <span className="text-zinc-300 font-bold group-hover:text-white transition-colors">Facebook</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-500 group-hover:text-[#1877F2] transition-colors">
                  <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99H7.898v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm md:text-base font-medium text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="bg-zinc-900 rounded-lg px-3 py-1 font-mono text-xs tracking-widest text-[#25D366]">EN LÍNEA</span>
              <span>© 2026 Möiz SAS.</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
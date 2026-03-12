export default function Footer() {

  return (
    <footer
      id="contacto"
      className="bg-[var(--moiz-footer)] bg-[#86A93C] text-white py-10"
      style={{ backgroundColor: 'var(--moiz-footer)' }}
    >

      <div className="max-w-6xl mx-auto text-center">

        <div className="flex flex-col md:flex-row items-center md:justify-between gap-6">
          <div>
            <h3 className="text-2xl mb-1 font-bold">Möiz - Instinto Natural</h3>
            <p className="text-sm">Arena ecológica de maíz para gatos</p>
          </div>

          {/* social links */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:opacity-90">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99H7.898v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              <a href="https://www.instagram.com/moizvilla/" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:opacity-90">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
                </svg>
              </a>

              <a href="https://wa.me/573218515161?text=Hola!%20Vengo%20desde%20la%20pagina%20web%20y%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20la%20arena%20M%C3%B6iz." target="_blank" rel="noreferrer" aria-label="WhatsApp" className="hover:opacity-90">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.373 0 .001 5.373 0 12c0 2.11.553 4.07 1.6 5.82L0 24l6.4-1.63A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12 0-1.95-.42-3.8-1.48-5.52zM12 21.5a9.39 9.39 0 0 1-4.9-1.35l-.35-.22-3.8.97.99-3.7-.22-.36A9.5 9.5 0 1 1 21.5 12 9.39 9.39 0 0 1 12 21.5z" />
                  <path d="M17.5 14.5c-.3-.15-1.79-.88-2.07-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.17.2-.34.22-.64.08-.3-.15-1.28-.47-2.43-1.5-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.5.15-.17.2-.28.3-.46.1-.17.05-.32-.02-.46-.07-.13-.68-1.64-.93-2.24-.24-.59-.48-.51-.68-.52l-.58-.01c-.2 0-.52.07-.8.32-.28.26-1.07 1.04-1.07 2.52 0 1.48 1.1 2.9 1.25 3.1.15.2 2.16 3.49 5.23 4.89 3.07 1.4 3.07.93 3.62.87.55-.07 1.79-.73 2.04-1.44.25-.71.25-1.32.17-1.44-.07-.12-.26-.17-.55-.31z" />
                </svg>
              </a>
            </div>

            <small className="text-xs text-white/90">Síguenos en redes para ofertas y tips</small>
          </div>
        </div>

  <div className="mt-6 text-sm text-white/90">© 2026 Möiz</div>

      </div>

    </footer>
  );
}
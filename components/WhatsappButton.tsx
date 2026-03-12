"use client";

import { motion } from "framer-motion";

type Props = {
  phone?: string;
  message?: string;
  inline?: boolean;
};

export default function WhatsappButton({ phone = "573128515161", message = "Hola! Vengo desde la pagina web y quiero más información sobre la arena Möiz.", inline = false }: Props) {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  // We'll animate the width with Framer Motion for a smooth, spring-like expansion.
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Abrir chat de WhatsApp"
      initial={{ y: 12, opacity: 0, width: 48 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ width: 176 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className={`${inline ? '' : 'fixed bottom-6 right-6'} z-50 group`}
      style={{ display: 'inline-block' }}
    >
      <div className="flex items-center overflow-hidden rounded-full shadow-lg bg-[#25D366] text-white" style={{ width: '100%' }}>
        <div className="flex items-center justify-center flex-shrink-0 w-12 h-12">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.373 0 .001 5.373 0 12c0 2.11.553 4.07 1.6 5.82L0 24l6.4-1.63A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12 0-1.95-.42-3.8-1.48-5.52z" />
            <path d="M17.5 14.5c-.3-.15-1.79-.88-2.07-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.17.2-.34.22-.64.08-.3-.15-1.28-.47-2.43-1.5-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.5.15-.17.2-.28.3-.46.1-.17.05-.32-.02-.46-.07-.13-.68-1.64-.93-2.24-.24-.59-.48-.51-.68-.52l-.58-.01c-.2 0-.52.07-.8.32-.28.26-1.07 1.04-1.07 2.52 0 1.48 1.1 2.9 1.25 3.1.15.2 2.16 3.49 5.23 4.89 3.07 1.4 3.07.93 3.62.87.55-.07 1.79-.73 2.04-1.44.25-.71.25-1.32.17-1.44-.07-.12-.26-.17-.55-.31z" />
          </svg>
        </div>

        <div className="pl-2 pr-4 flex items-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out text-sm font-medium whitespace-nowrap">WhatsApp</span>
        </div>
      </div>
    </motion.a>
  );
}
export const siteConfig = {
  name: "Möiz",
  fullName: "Möiz Bienestar Animal SAS",
  version: "1.0.0",
  url: "https://moizpets.com",
  ogImage: "https://moizpets.com/og-image.jpg",
  description: "Bienestar Natural & Premium para tus Mascotas",
  slogan: "El Cambio Inteligente en Arena para Gatos",
  keywords: [
    "arena para gatos",
    "arena ecológica",
    "maíz",
    "mascotas",
    "bienestar animal",
    "Colombia",
    "sustentable",
  ],
  navMain: [
    { title: "Inicio", href: "/" },
    { title: "Catálogo", href: "/productos" },
    { title: "Comparativa", href: "/info/arena" },
    { title: "Blog", href: "/blog" },
  ],
  footerLinks: {
    empresa: [
      { title: "Nosotros", href: "/sobre-moiz" },
      { title: "Contacto", href: "/contacto" },
    ],
    legal: [
      { title: "Términos y Condiciones", href: "/legal/terminos" },
      { title: "Privacidad", href: "/legal/privacidad" },
    ],
  },
  links: {
    instagram: "https://instagram.com/moizpets",
    whatsapp: "https://wa.me/573218515161",
    whatsappNumber: "573218515161",
    tiktok: "https://tiktok.com/@moiz",
    facebook: "https://facebook.com/moiz",
  },
  content: {
    heroTitle: "Lleva el bienestar",
    heroSubtitle: "a otro nivel",
    heroTagline: "Sustentabilidad y Amor en cada gramo",
    whatsappDefaultMessage: "¡Hola Möiz! Me interesa saber más sobre sus productos premium.",
  },
  stats: {
    rating: "4.9",
    happyPets: "+10,000",
  },
  theme: {
    primary: "var(--moiz-green)",
    accent: "var(--moiz-yellow)",
  },
};

export type SiteConfig = typeof siteConfig;

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Möiz - Arena para Gatos / Productos",
    short_name: "Möiz",
    description: "La mejor arena y accesorios para el cuidado de tu gato.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF8",
    theme_color: "#6A8E2A",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "192x192",
        type: "image/x-icon",
      },
      // You should eventually replace/add bigger PNG icons here:
      // {
      //   src: '/icon-512x512.png',
      //   sizes: '512x512',
      //   type: 'image/png',
      // }
    ],
  };
}

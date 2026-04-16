import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "sonner";
import { siteConfig } from "@/config/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: `${siteConfig.name} | Arena Ecológica de Maíz para Gatos en Colombia`,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.fullName }],
  creator: siteConfig.fullName,
  publisher: siteConfig.fullName,
  alternates: {
    canonical: siteConfig.url,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: siteConfig.url,
    siteName: `${siteConfig.name} Arena Ecológica`,
    title: `${siteConfig.name} | El Cambio Inteligente en Arena para Gatos`,
    description: siteConfig.slogan,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `Empaque de Arena de Maíz ${siteConfig.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Arena Ecológica de Maíz para Gatos`,
    description: siteConfig.slogan,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: [
      { url: "https://res.cloudinary.com/dvyqtn7gy/image/upload/v1776223130/moiz/logo/logo.png" },
      {
        url: "https://res.cloudinary.com/dvyqtn7gy/image/upload/v1776223130/moiz/logo/logo.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    shortcut: "https://res.cloudinary.com/dvyqtn7gy/image/upload/v1776223130/moiz/logo/logo.png",
    apple: "https://res.cloudinary.com/dvyqtn7gy/image/upload/v1776223130/moiz/logo/logo.png",
  },
};

import { CartProvider } from "@/context/CartContext";
import SmoothScroll from "@/components/SmoothScroll";
import TopBanner from "@/components/TopBanner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CO" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: `Arena de Maíz para Gatos ${siteConfig.name}`,
              image: siteConfig.ogImage,
              description:
                "Arena ecológica biodegradable hecha de maíz para gatos. Control natural de olores y aglomeración instantánea.",
              brand: {
                "@type": "Brand",
                name: siteConfig.name,
              },
              offers: {
                "@type": "Offer",
                url: siteConfig.url,
                priceCurrency: "COP",
                price: "24000",
                priceValidUntil: "2026-12-31",
                availability: "https://schema.org/InStock",
                seller: {
                  "@type": "Organization",
                  name: siteConfig.fullName,
                },
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
        suppressHydrationWarning
      >
        <TopBanner />
        <SmoothScroll>
          <CartProvider>{children}</CartProvider>
        </SmoothScroll>

        {/* Notificaciones Toaster Popups */}
        <Toaster richColors position="bottom-right" visibleToasts={1} />

        {/* Google Analytics (Sustituye G-XYZ con tu ID oficial de GA4) */}
        <GoogleAnalytics gaId="G-XYZ" />
      </body>
    </html>
  );
}

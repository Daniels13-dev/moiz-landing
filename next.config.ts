import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { 
            key: 'Content-Security-Policy', 
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://va.vercel-scripts.com https://checkout.wompi.co https://checkout.epayco.co https://*.epayco.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://res.cloudinary.com https://images.unsplash.com https://*.epayco.co; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://checkout.wompi.co https://*.wompi.co https://*.epayco.co; frame-src 'self' https://checkout.wompi.co https://checkout.epayco.co; object-src 'none';"
          }
        ],
      },
    ]
  },
};

export default nextConfig;

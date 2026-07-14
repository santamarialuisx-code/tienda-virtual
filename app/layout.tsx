import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CurrencyProvider } from "@/app/contexts/CurrencyContext";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tienda Virtual — Tu tienda en línea en Venezuela",
    template: "%s | Tienda Virtual",
  },
  description:
    "Tu tienda en línea con los mejores productos y precios en Venezuela. Envíos a toda Venezuela con pago por PayPal o PagoMóvil.",
  keywords: [
    "tienda",
    "online",
    "venezuela",
    "compras",
    "ecommerce",
    "paypal",
    "pagomóvil",
  ],
  authors: [{ name: "Tienda Virtual" }],
  creator: "Tienda Virtual",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://tienda-virtual.vercel.app"
  ),
  openGraph: {
    type: "website",
    locale: "es_VE",
    siteName: "Tienda Virtual",
    title: "Tienda Virtual — Tu tienda en línea en Venezuela",
    description:
      "Tu tienda en línea con los mejores productos y precios en Venezuela. Envíos a toda Venezuela con pago por PayPal o PagoMóvil.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tienda Virtual",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tienda Virtual — Tu tienda en línea en Venezuela",
    description:
      "Tu tienda en línea con los mejores productos y precios en Venezuela.",
    images: ["/og-image.png"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CurrencyProvider>
            {/* Skip to content link for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:outline-none"
            >
              Saltar al contenido principal
            </a>
            <Header />
            <main id="main-content" className="flex-1" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

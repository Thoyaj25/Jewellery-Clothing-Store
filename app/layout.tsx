import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./tailwind.css";
import "./globals.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ShoppingAssistant from "./components/ShoppingAssistant";
import StoreToastContainer from "./components/StoreToastContainer";
import StorefrontFloatingSocials from "./components/StorefrontFloatingSocials";
import { CartProvider } from "./context/CartProvider";
import { WishlistProvider } from "./context/WishlistProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Premium Jewellery, Handbags & Indian Fashion | Ultimate Collections",
    template: "%s | Ultimate Collections",
  },

  description:
    "Explore elegant handcrafted jewellery, designer handbags, sarees, kurtis and Indian fashion at Ultimate Collections. Discover beautiful styles for every occasion.",

  keywords: [
    "handcrafted jewellery",
    "imitation jewellery",
    "fashion wear",
    "handbags",
    "sarees",
    "kurtis",
    "kids wear",
    "Ultimate Collections",
  ],

  metadataBase: new URL(
    "https://ultimate-collections-store.vercel.app"
  ),

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "/icon.svg",
  },

  openGraph: {
    title: "Premium Jewellery & Handbags | Ultimate Collections",
    description:
      "Shop elegant jewellery, designer handbags, sarees and kurtis at Ultimate Collections. Discover fashion for every occasion.",
    url: "https://ultimate-collections-store.vercel.app",
    siteName: "Ultimate Collections",
    locale: "en_IN",
    type: "website",

    images: [
      {
        url: "/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "Premium Jewellery & Handbags | Ultimate Collections",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Ultimate Collections",
    description:
      "Shop elegant jewellery, designer handbags, sarees and kurtis at Ultimate Collections. Discover fashion for every occasion.",
    images: ["/og-image.jpeg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-black text-white">
        <CartProvider>
          <WishlistProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <ShoppingAssistant />
            <StorefrontFloatingSocials />
            <StoreToastContainer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
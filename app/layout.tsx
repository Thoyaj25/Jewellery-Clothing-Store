
import type { Metadata } from "next";
import Script from "next/script";
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

const GTM_ID = "GTM-5G2JP6TT";

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
    default: "Ultimate Collections",
    template: "%s | Ultimate Collections",
  },

  description:
    "Shop elegant imitation jewellery, designer clutches, sarees, kurtis and fashion accessories at Ultimate Collections.",

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

  verification: {
    google: "UFjSO4dbpvGSEhpZraPzygix-gY7oH1oxvKUEgiyyBA",
  },

  icons: {
    icon: "/icon.svg",
  },

  openGraph: {
    title: "Ultimate Collections - Premium Jewellery & Fashion",
    description:
      "Discover premium jewellery, sarees, handbags, kurtis and fashion collections for every occasion.",
    url: "https://ultimate-collections-store.vercel.app",
    siteName: "Ultimate Collections",
    locale: "en_IN",
    type: "website",

    images: [
      {
        url: "/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "Ultimate Collections - Premium Jewellery & Fashion",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Ultimate Collections",
    description:
      "Premium handcrafted jewellery, sarees, handbags, kurtis and fashion wear.",
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
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5G2JP6TT"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <Script id="google-tag-manager-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;
f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5G2JP6TT');`}
        </Script>
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

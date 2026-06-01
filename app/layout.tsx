import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NITECAP — Open The Moment | Premixed Cocktails In A Pouch",
  description:
    "NITECAP is a premixed cocktail and mocktail brand in a pouch — built for spontaneous moments. No cap. Just NITECAP. Order now, delivering across Nigeria.",
  keywords: [
    "cocktail delivery Nigeria",
    "cocktails Nigeria",
    "ready-to-drink cocktails",
    "premixed cocktails Nigeria",
    "mocktails Nigeria",
    "party drinks Nigeria",
    "portable cocktails",
    "Chapman cocktail",
    "NITECAP",
    "drinks delivery Nigeria",
    "cocktails in a pouch",
  ],
  authors: [{ name: "NITECAP" }],
  creator: "NITECAP",
  publisher: "NITECAP",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://nitecap.co",
    siteName: "NITECAP",
    title: "NITECAP — Open The Moment",
    description:
      "Premixed cocktails & mocktails in a pouch. No cap. Just NITECAP. Delivering across Nigeria.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NITECAP — Open The Moment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NITECAP — Open The Moment",
    description: "Premixed cocktails & mocktails in a pouch. No cap. Just NITECAP.",
    images: ["/images/og-image.jpg"],
    creator: "@nitecapcocktail",
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
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL("https://nitecap.co"),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NITECAP",
  url: "https://nitecap.co",
  logo: "https://nitecap.co/images/logo.png",
  sameAs: [
    "https://instagram.com/nitecapcocktail",
    "https://twitter.com/nitecapcocktail",
  ],
  description:
    "Premixed cocktails and mocktails in a pouch. Built for spontaneous moments. Delivering across Nigeria.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "NG",
    addressLocality: "Lagos",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}

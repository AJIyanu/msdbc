import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Improves perceived performance
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Improves perceived performance
});

// Site URL for canonical URLs and OpenGraph
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://record.msdbc.com";

// Enhanced metadata for better SEO
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | MSDBC Church Record Management System",
    default: "MSDBC | Church Record Management System",
  },
  description:
    "Simplify church administration with MSDBC. Our intuitive Church Record Management System helps manage members, track donations, and organize events efficiently.",
  keywords: [
    "church management",
    "church administration",
    "member management",
    "donation tracking",
    "event organization",
    "MSDBC",
    "church records",
  ],
  authors: [{ name: "MSDBC" }],
  creator: "AJ Iyanu",
  publisher: "AJ Iyanu",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "MSDBC Church Record Management System",
    title: "MSDBC | Church Record Management System",
    description:
      "Simplify church administration with MSDBC. Our intuitive Church Record Management System helps manage members, track donations, and organize events efficiently.",
    images: [
      {
        url: `${siteUrl}/images/og-image.jpg`, // Create this image for social sharing
        width: 1200,
        height: 630,
        alt: "MSDBC Church Record Management System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MSDBC | Church Record Management System",
    description:
      "Simplify church administration with MSDBC. Our intuitive Church Record Management System helps manage members, track donations, and organize events efficiently.",
    images: [`${siteUrl}/images/twitter-image.jpg`], // Create this image for Twitter
  },
};

// Viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <main className="flex-grow">{children}</main>

        {/* Optional structured data for rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "MSDBC Church Record Management System",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              description:
                "Simplify church administration with MSDBC. Our intuitive Church Record Management System helps manage members, track donations, and organize events efficiently.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}

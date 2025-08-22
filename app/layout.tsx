import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./components/providers";
import Headers from "./components/Headers";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PixelKit - Premium Digital Assets for Creators",
  description: "Discover high-quality images, videos, e-books, and PDFs. Perfect for your next creative project.",
  keywords: "digital assets, stock photos, stock videos, e-books, PDFs, creative resources, design assets",
  authors: [{ name: "PixelKit Team" }],
  creator: "PixelKit",
  publisher: "PixelKit",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://pixelkit.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PixelKit - Premium Digital Assets for Creators",
    description: "Discover high-quality images, videos, e-books, and PDFs. Perfect for your next creative project.",
    url: "https://pixelkit.com",
    siteName: "PixelKit",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PixelKit - Premium Digital Assets",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelKit - Premium Digital Assets for Creators",
    description: "Discover high-quality images, videos, e-books, and PDFs. Perfect for your next creative project.",
    images: ["/og-image.jpg"],
    creator: "@pixelkit",
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <Headers />
          {children}
        </Providers>
      </body>
    </html>
  );
}
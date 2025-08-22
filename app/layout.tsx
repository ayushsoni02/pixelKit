import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./components/providers";
import Header from "./components/Headers";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PixelKit - Premium Digital Assets Marketplace",
  description: "Discover high-quality images, videos, e-books, and PDFs. Perfect for your next creative project.",
  keywords: "digital assets, stock photos, videos, e-books, PDFs, creative resources, design assets",
  authors: [{ name: "PixelKit Team" }],
  openGraph: {
    title: "PixelKit - Premium Digital Assets Marketplace",
    description: "Discover high-quality images, videos, e-books, and PDFs. Perfect for your next creative project.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelKit - Premium Digital Assets Marketplace",
    description: "Discover high-quality images, videos, e-books, and PDFs. Perfect for your next creative project.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
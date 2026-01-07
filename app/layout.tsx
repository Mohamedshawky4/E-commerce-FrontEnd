import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit, Inter } from "next/font/google";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import AuthInitializer from "@/components/AuthInitializer";
import ClientLayout from "@/components/ClientLayout";
import QueryProvider from "@/components/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SPECTRA | Luxury Tech E-commerce",
  description: "Next-generation digital commerce experience forged with liquid metal aesthetics.",
  icons: {
    icon: "/logo-Photoroom.png",
    shortcut: "/logo-Photoroom.png",
    apple: "/logo-Photoroom.png",
  },
  openGraph: {
    title: "SPECTRA | Luxury Tech E-commerce",
    description: "Next-generation digital commerce experience forged with liquid metal aesthetics.",
    url: "https://spectra.com",
    siteName: "SPECTRA",
    images: [
      {
        url: "/logo-Photoroom.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SPECTRA | Luxury Tech E-commerce",
    description: "Next-generation digital commerce experience forged with liquid metal aesthetics.",
    images: ["/logo-Photoroom.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${inter.variable} antialiased`}>
        <QueryProvider>
          <AuthInitializer>
            <ClientLayout>{children}</ClientLayout>
          </AuthInitializer>
        </QueryProvider>
      </body>
    </html>
  );
}

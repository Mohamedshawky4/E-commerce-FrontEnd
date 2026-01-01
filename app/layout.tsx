import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthInitializer from "@/components/AuthInitializer";
import ClientLayout from "@/components/ClientLayout"; // 👈 new wrapper

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SPECTRA | Luxury Tech E-commerce",
  description: "Next-generation digital commerce experience forged with liquid metal aesthetics.",
  icons: {
    icon: "/logo-Photoroom.png",
    shortcut: "/logo-Photoroom.png",
    apple: "/logo-Photoroom.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthInitializer>
          <ClientLayout>{children}</ClientLayout>
        </AuthInitializer>
      </body>
    </html>
  );
}

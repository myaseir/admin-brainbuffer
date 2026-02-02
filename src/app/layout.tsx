import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GlaciaAdmin | Command Center",
  description: "Real-time revenue and system monitoring for Glacia Connection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
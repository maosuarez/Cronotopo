import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { eras } from "@/data/index";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Atlas Histórico",
  description: "Un navegador 3D de la historia: 20 eras, 60 lugares, 300 elementos.",
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${serif.variable} ${sans.variable} h-full antialiased`}
      style={{ "--era-count": eras.length } as React.CSSProperties}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}

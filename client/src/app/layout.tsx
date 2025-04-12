import type { Metadata, Viewport } from "next";

import { Inter } from "next/font/google";

import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { FilterProvider } from "@/lib/contexts/filter.context";

// Load fonts with subset strategy for better performance
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const metadata: Metadata = {
  title: "IncluCity",
  description: "Платформа для інклюзивного розвитку міста",
  icons: {
    icon: "/map-pin.svg",
    shortcut: "/map-pin.svg",
    apple: "/map-pin.svg",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/map-pin.svg",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={inter.variable}>
      <body className={inter.className}>
        <QueryProvider>
          <FilterProvider>
            <AuthProvider>{children}</AuthProvider>
          </FilterProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

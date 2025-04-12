import type { Metadata } from "next";

import { Inter } from "next/font/google";

import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { FilterProvider } from "@/lib/contexts/filter.context";

const inter = Inter({ subsets: ["latin"] });

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
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

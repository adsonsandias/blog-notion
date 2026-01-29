import type { Metadata } from "next";
import React from "react";
import { Montserrat } from "next/font/google";

export const metadata: Metadata = {
  title: "Blog Notion",
  description: "Blog integrado ao Notion com ISR",
};

export const montserrat = Montserrat({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className={montserrat.className}>
      <body>{children}</body>
    </html>
  );
}

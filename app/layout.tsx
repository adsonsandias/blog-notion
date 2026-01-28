import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Blog Notion',
  description: 'Blog integrado ao Notion com ISR'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}

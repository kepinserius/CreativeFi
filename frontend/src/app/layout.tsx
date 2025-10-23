// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Viewport } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CreativeFi - Decentralized Crowdfunding for Creators',
  description: 'A platform for creators to crowdfund their projects with token rewards',
  keywords: ['crowdfunding', 'blockchain', 'ethereum', 'nft', 'decentralized finance', 'creator economy'],
  authors: [{ name: 'CreativeFi Team' }],
  creator: 'CreativeFi Team',
  publisher: 'CreativeFi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'CreativeFi - Decentralized Crowdfunding for Creators',
    description: 'A platform for creators to crowdfund their projects with token rewards',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'CreativeFi',
    images: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/og-image-placeholder.svg` : '/og-image-placeholder.svg',
        width: 1200,
        height: 630,
        alt: 'CreativeFi',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CreativeFi - Decentralized Crowdfunding for Creators',
    description: 'A platform for creators to crowdfund their projects with token rewards',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#8B5CF6', // Purple theme color
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
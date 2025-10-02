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
    url: 'https://creativefi.example.com',
    siteName: 'CreativeFi',
    images: [
      {
        url: '/og-image.jpg', // TODO: Add actual og image
        width: 800,
        height: 600,
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
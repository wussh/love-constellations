import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Love Constellations - Anonymous Love Messages in the Stars",
  description: "Share your unsent love messages anonymously as stars in a beautiful interactive constellation. Express crushes, first loves, apologies, and more. Find twin stars with matching secret codes.",
  keywords: ["love messages", "anonymous", "constellation", "unsent messages", "love letters", "secret messages", "twin souls", "romantic messages"],
  authors: [{ name: "Love Constellations" }],
  creator: "Love Constellations",
  publisher: "Love Constellations",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    title: "Love Constellations - Share Your Unsent Love Messages",
    description: "Turn your unsent love messages into stars in a shared constellation. Anonymous, beautiful, and meaningful.",
    url: '/',
    siteName: 'Love Constellations',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Love Constellations - Stars representing love messages',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Love Constellations - Anonymous Love Messages',
    description: 'Share your unsent love messages as stars in a beautiful constellation',
    images: ['/og-image.png'],
    creator: '@loveconstellations',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

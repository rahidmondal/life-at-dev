import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://life-at-dev.rahidmondal.com/'),
  title: {
    default: 'Life@Dev',
    template: '%s | Life@Dev',
  },
  description:
    'A strategic developer life simulation game. Balance career, skills, and sanity on your journey to 10,000 hours. Manage stress, build reputation, and navigate the tech industry.',
  keywords: [
    'developer simulation',
    'coding game',
    'career simulation',
    'programming game',
    'tech career',
    'developer life',
    'strategy game',
    'indie game',
    'web game',
  ],
  authors: [{ name: 'Life@Dev Team' }],
  creator: 'Life@Dev Team',
  publisher: 'Life@Dev',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://life-at-dev.rahidmondal.com/',
    siteName: 'Life@Dev',
    title: 'Life@Dev - Developer Life Simulation Game',
    description:
      'A strategic developer life simulation game. Balance career, skills, and sanity on your journey to 10,000 hours.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Life@Dev - Developer Life Simulation',
      },
    ],
  },
  category: 'games',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}>{children}</body>
    </html>
  );
}

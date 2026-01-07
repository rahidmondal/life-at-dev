import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import { GameProvider } from '@/context/GameContext';
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
  title: 'Life @ Dev',
  description: 'A high-stakes developer life simulator. Survive the grind, climb the ladder, reach the top.',
  appleWebApp: {
    title: 'Life @ Dev',
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}>
        <ServiceWorkerRegistration />
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}

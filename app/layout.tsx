import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FireGuard - Smart Fire Alert & Community Platform',
  description: 'Real-time fire detection and community safety platform with IoT sensors, emergency alerts, and community features.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Toaster />

        {/* 🚀 Bolt Hackathon Badge */}
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed top-4 right-4 z-50 hover:scale-110 transition-transform"
        >
          <img
            src="https://github.com/kickiniteasy/bolt-hackathon-badge/raw/main/src/public/bolt-badge/white_circle_360x360/white_circle_360x360.png"
            alt="Built with Bolt"
            className="w-20 h-20"
          />
        </a>
      </body>
    </html>
  );
}

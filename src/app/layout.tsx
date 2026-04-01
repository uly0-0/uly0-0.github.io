import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Layout from '@/components/Layout';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Ulysses Ochoa',
  description: 'Cybersecurity Analyst | Network Engineer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}

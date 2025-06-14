import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import './globals.scss';
import ProviderRedux from '@/redux/ProviderRedux';
import 'antd/dist/reset.css';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nike Store',
  description: 'Find the perfect footwear for every occasion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ProviderRedux>
        <Header />
        <main className="main-content">
        {children}
        </main>
        <Footer />
      </ProviderRedux>
      </body>
    </html>
  );
}

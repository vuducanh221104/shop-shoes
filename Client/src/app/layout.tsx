import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from "next";
import "../styles/globals.scss";

export const metadata: Metadata = {
  title: "LeviathanShop - Premium Footwear",
  description: "Find the perfect pair for every occasion at LeviathanShop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

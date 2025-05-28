"use client";
import { Suspense } from 'react';
import ProductDetail from '@/components/ProductDetail';
import styles from './page.module.scss';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = params;
  
  return (
    <main className={styles.main}>
      <div className="container">
        <Suspense fallback={<div className={styles.loading}>Loading product details...</div>}>
          <ProductDetail id={id} />
        </Suspense>
      </div>
    </main>
  );
} 
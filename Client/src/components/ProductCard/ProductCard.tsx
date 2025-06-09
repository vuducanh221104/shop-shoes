'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ProductCard.module.scss';

interface Product {
  slug: any;
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  colors: number;
  isBestSeller?: boolean;
  isSustainable?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Link href={`/product/${product.slug}`} className={styles.card}>
      {/* Product Image */}
      <div className={styles.imageContainer}>
        <Image
          src={product.image}
          alt={product.name}
          width={592}
          height={592}
          className={styles.image}
        />
      </div>

      {/* Product Info */}
      <div className={styles.info}>
        <div className={styles.header}>
          <h3 className={styles.name}>{product.name}</h3>
          <span className={styles.price}>{formatPrice(product.price)}</span>
        </div>

        <div className={styles.details}>
          <span className={styles.category}>{product.category}</span>
          <span className={styles.colors}>{product.colors} Colour</span>
        </div>

        {/* Badges */}
        <div className={styles.badges}>
          {product.isBestSeller && (
            <span className={styles.badge}>Bestseller</span>
          )}
          {product.isSustainable && (
            <span className={styles.badge}>Sustainable Materials</span>
          )}
        </div>
      </div>
    </Link>
  );
} 
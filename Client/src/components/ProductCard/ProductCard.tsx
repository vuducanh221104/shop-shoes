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
  priceDiscount: number;
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

  // Check if there's a valid discount
  const hasDiscount = product.priceDiscount > 0 && product.priceDiscount < product.price;

  // Calculate discount percentage only if there's a valid discount
  const discountPercentage = hasDiscount 
    ? Math.round((1 - (product.priceDiscount / product.price)) * 100) 
    : 0;

  // Determine which price to display
  const displayPrice = hasDiscount ? product.priceDiscount : product.price;

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
          <div className={styles.priceContainer}>
            {hasDiscount ? (
              <>
                <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
                <span className={styles.price}>{formatPrice(displayPrice)}</span>
              </>
            ) : (
              <span className={styles.price}>{formatPrice(displayPrice)}</span>
            )}
          </div>
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
          {hasDiscount && discountPercentage > 0 && (
            <span className={`${styles.badge} ${styles.discountBadge}`}>
              {discountPercentage}% OFF
            </span>
          )}
        </div>
      </div>
    </Link>
  );
} 
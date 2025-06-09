'use client';

import React from 'react';
import { Product } from '@/services/api';
import styles from './page.module.scss';
import Image from 'next/image';
import VariantSelector from '@/components/VariantSelector/VariantSelector';
import { StarIcon } from '@heroicons/react/24/solid';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={styles.productDetail}>
      <div className={styles.container}>
        {/* Left side - Image Gallery */}
        <div className={styles.leftColumn}>
          <div className={styles.thumbnails}>
            {product.variants?.$values[0]?.images?.$values?.map((image: string, index: number) => (
              <div key={index} className={styles.thumbnail}>
                <Image 
                  src={image} 
                  alt={`${product.name} - Thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className={styles.thumbnailImage}
                />
              </div>
            ))}
          </div>
          <div className={styles.mainImage}>
            {product.variants?.$values[0]?.images?.$values[0] && (
              <Image 
                src={product.variants.$values[0].images.$values[0]} 
                alt={product.name}
                width={600}
                height={600}
                className={styles.image}
              />
            )}
          </div>
        </div>

        {/* Right side - Product Info */}
        <div className={styles.rightColumn}>
          <div className={styles.header}>
            <h1 className={styles.name}>{product.name}</h1>
            <div className={styles.subheader}>
              <span className={styles.category}>{product.category?.name}'s Road Racing Shoes</span>
              <div className={styles.rating}>
                <StarIcon className={styles.starIcon} />
                <span>Highly Rated</span>
              </div>
            </div>
          </div>

          <div className={styles.price}>
            {product.priceDetails && (
              <span className={styles.currentPrice}>
                {formatPrice(product.priceDetails.discount)}đ
              </span>
            )}
          </div>

          <div className={styles.colorSelector}>
            <div className={styles.colorThumbnails}>
              {product.variants?.$values.map((variant, index) => (
                <div 
                  key={variant.id} 
                  className={`${styles.colorThumbnail} ${index === 1 ? styles.selected : ''}`}
                >
                  <Image 
                    src={variant.images.$values[0]} 
                    alt={variant.color}
                    width={80}
                    height={80}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.sizeSelector}>
            <div className={styles.sizeHeader}>
              <h3>Select Size</h3>
              <button className={styles.sizeGuide}>
                <span>Size Guide</span>
              </button>
            </div>
            <div className={styles.sizeGrid}>
              {product.variants?.$values[0]?.sizes.$values.map((size) => (
                <button
                  key={size.size}
                  className={`${styles.sizeButton} ${size.stock === 0 ? styles.disabled : ''}`}
                  disabled={size.stock === 0}
                >
                  EU {size.size}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.addToBag}>
              Add to Bag
            </button>
            <button className={styles.favorite}>
              Favourite
            </button>
          </div>

          <div className={styles.description}>
            {product.description}
          </div>
        </div>
      </div>
    </div>
  );
} 
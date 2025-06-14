'use client';

import React, { useState } from 'react';
import styles from './VariantSelector.module.scss';
import Image from 'next/image';

// Define interfaces for the component
interface SizeInfo {
  size: string;
  stock: number;
}

interface Variant {
  id: number;
  color: string;
  sizes: SizeInfo[] | { $values: SizeInfo[] };
  images: string[] | { $values: string[] };
}

interface VariantSelectorProps {
  variants: Variant[];
}

export default function VariantSelector({ variants }: VariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(variants[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Helper functions to safely handle $values
  const getSizes = (variant: Variant): SizeInfo[] => {
    if (!variant.sizes) return [];
    return Array.isArray(variant.sizes) ? variant.sizes : (variant.sizes.$values || []);
  };

  const getImages = (variant: Variant): string[] => {
    if (!variant.images) return [];
    return Array.isArray(variant.images) ? variant.images : (variant.images.$values || []);
  };

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant);
    setSelectedSize(null); // Reset size selection when changing variant
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const getStockForSize = (size: string) => {
    const sizes = getSizes(selectedVariant);
    const sizeInfo = sizes.find(s => s.size === size);
    return sizeInfo?.stock || 0;
  };

  const sizes = getSizes(selectedVariant);

  return (
    <div className={styles.variantSelector}>
      <div className={styles.colors}>
        <h3>Colors:</h3>
        <div className={styles.colorOptions}>
          {variants.map((variant) => {
            const images = getImages(variant);
            const firstImage = images.length > 0 ? images[0] : '';
            
            return (
              <button
                key={variant.id}
                className={`${styles.colorOption} ${selectedVariant.id === variant.id ? styles.selected : ''}`}
                onClick={() => handleVariantSelect(variant)}
              >
                <div className={styles.colorPreview}>
                  {firstImage && (
                    <Image
                      src={firstImage}
                      alt={variant.color}
                      width={50}
                      height={50}
                    />
                  )}
                </div>
                <span>{variant.color}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.sizes}>
        <h3>Sizes:</h3>
        <div className={styles.sizeOptions}>
          {sizes.map((size) => (
            <button
              key={size.size}
              className={`${styles.sizeOption} ${selectedSize === size.size ? styles.selected : ''} ${size.stock === 0 ? styles.outOfStock : ''}`}
              onClick={() => handleSizeSelect(size.size)}
              disabled={size.stock === 0}
            >
              <span className={styles.sizeLabel}>{size.size}</span>
              {size.stock === 0 && <span className={styles.outOfStockLabel}>Out of Stock</span>}
            </button>
          ))}
        </div>
      </div>

      {selectedSize && (
        <div className={styles.stockInfo}>
          <span>Stock: {getStockForSize(selectedSize)}</span>
        </div>
      )}
    </div>
  );
} 
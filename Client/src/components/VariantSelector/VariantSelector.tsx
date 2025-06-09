'use client';

import React, { useState } from 'react';
import { Variant } from '@/services/api';
import styles from './VariantSelector.module.scss';
import Image from 'next/image';

interface VariantSelectorProps {
  variants: Variant[];
}

export default function VariantSelector({ variants }: VariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(variants[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant);
    setSelectedSize(null); // Reset size selection when changing variant
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const getStockForSize = (size: string) => {
    const sizeInfo = selectedVariant.sizes.$values.find(s => s.size === size);
    return sizeInfo?.stock || 0;
  };

  return (
    <div className={styles.variantSelector}>
      <div className={styles.colors}>
        <h3>Colors:</h3>
        <div className={styles.colorOptions}>
          {variants.map((variant) => (
            <button
              key={variant.id}
              className={`${styles.colorOption} ${selectedVariant.id === variant.id ? styles.selected : ''}`}
              onClick={() => handleVariantSelect(variant)}
            >
              <div className={styles.colorPreview}>
                {variant.images.$values[0] && (
                  <Image
                    src={variant.images.$values[0]}
                    alt={variant.color}
                    width={50}
                    height={50}
                  />
                )}
              </div>
              <span>{variant.color}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.sizes}>
        <h3>Sizes:</h3>
        <div className={styles.sizeOptions}>
          {selectedVariant.sizes.$values.map((size) => (
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
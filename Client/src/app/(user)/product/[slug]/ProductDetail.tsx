'use client';

import React, { useState } from 'react';
import { Product } from '@/services/api';
import styles from './page.module.scss';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import SuccessProductList from '@/components/SuccessProductList';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface ProductDetailProps {
  product: Product;
}

// Define types for variant and size
interface Size {
  size: string;
  stock: number;
}

interface Variant {
  id: number;
  color: string;
  images: string[] | { $values: string[] };
  sizes: Size[] | { $values: Size[] };
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const { updateCartQuantity } = useCart();
  const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);

  
  // Helper functions to safely extract arrays
  const getVariants = (): Variant[] => {
    if (!product.variants) return [];
    return Array.isArray(product.variants) ? product.variants : (product.variants.$values || []);
  };
  
  const getImages = (variant: Variant): string[] => {
    if (!variant.images) return [];
    return Array.isArray(variant.images) ? variant.images : (variant.images.$values || []);
  };
  
  const getSizes = (variant: Variant): Size[] => {
    if (!variant.sizes) return [];
    return Array.isArray(variant.sizes) ? variant.sizes : (variant.sizes.$values || []);
  };
  
  // Initialize with safe values
  const variants = getVariants();
  const firstVariant = variants.length > 0 ? variants[0] : {} as Variant;
  const firstVariantImages = getImages(firstVariant);
  
  const [selectedColor, setSelectedColor] = useState(firstVariant.color || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<Variant>(firstVariant);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>(
    firstVariantImages.length > 0 ? firstVariantImages[0] : ''
  );
  const [sizeError, setSizeError] = useState(false);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleColorSelect = (variant: Variant) => {
    setSelectedColor(variant.color);
    setSelectedVariant(variant);
    setSelectedSize(''); // Reset size when color changes
    setSizeError(false); // Reset size error when color changes
    
    const images = getImages(variant);
    setSelectedImage(images.length > 0 ? images[0] : '');
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setSizeError(false); // Clear error when size is selected
  };

  const handleThumbnailClick = (image: string) => {
    setSelectedImage(image);
  };

  const addToCart = async () => {
    if (!selectedSize) {
      setSizeError(true);
      message.error('Please select a size before adding to bag');
      // Scroll to size selector
      document.querySelector('#sizeSelector')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Check if user is authenticated
    if (!currentUser) {
      message.error('Please login to add items to your cart');
      router.push('/account/login');
      return;
    }

    // Cast currentUser to get the correct ID field
    const user = currentUser as { Id?: number };
    const userId = user.Id || 1; // Fallback to ID 1 if not found

    try {
      setLoading(true);
      await axios.post(`http://localhost:5000/api/cart?userId=${userId}`, {
        productId: product.id,
        quantity: 1,
        size: selectedSize,
        color: selectedColor
      });

      message.success('Added to cart successfully');
      await updateCartQuantity(); // Update cart quantity after successful add
    } catch (error) {
      message.error('Failed to add to cart');
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };
console.log(product);
  return (
    <>
    <div className={styles.productDetail}>
      <div className={styles.container}>
        {/* Left side - Image Gallery */}
        <div className={styles.leftColumn}>
          <div className={styles.thumbnails}>
            {getImages(selectedVariant).map((image: string, index: number) => (
              <div 
                key={index} 
                className={`${styles.thumbnail} ${selectedImage === image ? styles.selected : ''}`}
                onClick={() => handleThumbnailClick(image)}
              >
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
            {selectedImage && (
              <Image 
                src={selectedImage} 
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
            {product.priceDiscount && product.priceDiscount !== product.price ? (
              <>
                <span className={styles.currentPrice}>
                  {formatPrice(product.priceDiscount)}
                </span>
                <span className={styles.originalPrice}>
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className={styles.currentPrice}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div className={styles.colorSelector}>
            <h3>Select Color</h3>
            <div className={styles.colorThumbnails}>
              {variants.map((variant: Variant) => {
                const images = getImages(variant);
                const firstImage = images.length > 0 ? images[0] : '';
                
                return (
                  <div 
                    key={variant.id} 
                    className={`${styles.colorThumbnail} ${variant.color === selectedColor ? styles.selected : ''}`}
                    onClick={() => handleColorSelect(variant)}
                  >
                    <Image 
                      src={firstImage} 
                      alt={variant.color}
                      width={80}
                      height={80}
                    />
                    <span className={styles.colorName}>{variant.color}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div id="sizeSelector" className={`${styles.sizeSelector} ${sizeError ? styles.error : ''}`}>
            <div className={styles.sizeHeader}>
              <h3>Select Size</h3>
              <button className={styles.sizeGuide}>
                <span>Size Guide</span>
              </button>
            </div>
            {sizeError && (
              <div className={styles.errorMessage}>
                Please select a size
              </div>
            )}
            <div className={styles.sizeGrid}>
              {getSizes(selectedVariant).map((size: Size) => (
                <button
                  key={size.size}
                  className={`${styles.sizeButton} ${size.stock === 0 ? styles.disabled : ''} ${selectedSize === size.size ? styles.selected : ''}`}
                  disabled={size.stock === 0}
                  onClick={() => handleSizeSelect(size.size)}
                >
                  EU {size.size}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button 
              className={styles.addToBag}
              onClick={addToCart}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add to Bag'}
            </button>
          </div>

          <div className={styles.description}>
            {product.description}
          </div>
        </div>
      </div>
    </div>
      <SuccessProductList />
    </>
  );
} 
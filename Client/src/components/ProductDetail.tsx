"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById } from '@/services/api';
import styles from './ProductDetail.module.scss';

interface Price {
  original: number;
  discount: number;
  quantityDiscount: number;
}

interface Variant {
  color: string;
  sizes: number[];
  images: string[];
}

interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  tags: string[];
  stock: number;
  price: Price;
  variants: Variant[];
}

interface ProductDetailProps {
  id: string;
}

const ProductDetail = ({ id }: ProductDetailProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        // Set default selected size to the first available size
        if (data.variants && data.variants.length > 0 && data.variants[0].sizes.length > 0) {
          setSelectedSize(data.variants[0].sizes[0]);
        }
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Format price to display as currency
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate discount percentage
  const calculateDiscountPercentage = (original: number, discount: number) => {
    return original > 0 
      ? Math.round(((original - discount) / original) * 100) 
      : 0;
  };

  const handleVariantChange = (index: number) => {
    setSelectedVariant(index);
    setSelectedImage(0);
    setSelectedSize(product?.variants[index].sizes[0] || null);
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (product?.stock && value > product.stock) return;
    setQuantity(value);
  };

  if (loading) {
    return <div className={styles.loading}>Loading product details...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error loading product: {error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  if (!product) {
    return <div className={styles.notFound}>Product not found</div>;
  }

  const currentVariant = product.variants[selectedVariant];
  const discountPercentage = calculateDiscountPercentage(product.price.original, product.price.discount);

  return (
    <div className={styles.productDetail}>
      <div className={styles.breadcrumbs}>
        <Link href="/">Home</Link> / 
        <span>{product.name.split(' ').slice(0, 2).join(' ')}</span>
      </div>
      
      <div className={styles.productContainer}>
        <div className={styles.productImages}>
          <div className={styles.mainImage}>
            <Image 
              src={currentVariant.images[selectedImage]} 
              alt={`${product.name} - ${currentVariant.color}`}
              width={600}
              height={600}
              className={styles.productImg}
            />
            {discountPercentage > 0 && (
              <span className={styles.discountBadge}>-{discountPercentage}%</span>
            )}
          </div>
          
          <div className={styles.thumbnails}>
            {currentVariant.images.map((image, index) => (
              <div 
                key={index} 
                className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <Image 
                  src={image} 
                  alt={`${product.name} thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.productInfo}>
          <h1 className={styles.productName}>{product.name}</h1>
          <p className={styles.productBrand}>{product.brand}</p>
          
          <div className={styles.productPrice}>
            {product.price.original !== product.price.discount && (
              <span className={styles.originalPrice}>{formatPrice(product.price.original)}</span>
            )}
            <span className={styles.price}>{formatPrice(product.price.discount)}</span>
          </div>
          
          <div className={styles.productColors}>
            <h3>Color: <span>{currentVariant.color}</span></h3>
            <div className={styles.colorOptions}>
              {product.variants.map((variant, index) => (
                <div 
                  key={index} 
                  className={`${styles.colorOption} ${selectedVariant === index ? styles.selectedColor : ''}`}
                  style={{ backgroundColor: variant.color }}
                  onClick={() => handleVariantChange(index)}
                  title={variant.color}
                ></div>
              ))}
            </div>
          </div>
          
          <div className={styles.productSizes}>
            <h3>Size:</h3>
            <div className={styles.sizeOptions}>
              {currentVariant.sizes.map((size) => (
                <button 
                  key={size} 
                  className={`${styles.sizeOption} ${selectedSize === size ? styles.selectedSize : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <div className={styles.productQuantity}>
            <h3>Quantity:</h3>
            <div className={styles.quantitySelector}>
              <button 
                className={styles.quantityBtn}
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                min="1"
                max={product.stock}
                className={styles.quantityInput}
              />
              <button 
                className={styles.quantityBtn}
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={product.stock ? quantity >= product.stock : false}
              >
                +
              </button>
            </div>
            <p className={styles.stockInfo}>
              {product.stock > 0 ? `${product.stock} items in stock` : 'Out of stock'}
            </p>
          </div>
          
          <div className={styles.productActions}>
            <button className={`btn btn-primary ${styles.addToCartBtn}`} disabled={!selectedSize || product.stock <= 0}>
              Add to Cart
            </button>
            <button className={styles.wishlistBtn}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
          
          <div className={styles.productDescription}>
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          
          {product.tags && product.tags.length > 0 && (
            <div className={styles.productTags}>
              <h3>Tags:</h3>
              <div className={styles.tags}>
                {product.tags.map((tag, index) => (
                  <Link key={index} href={`/tag/${tag}`} className={styles.tag}>
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 
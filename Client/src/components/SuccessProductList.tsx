'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from './SuccessProductList.module.scss';

interface Size {
  size: string;
  stock: number;
}

interface Variant {
  id: number;
  color: string;
  images: {
    $values: string[];
  };
  sizes: {
    $values: Size[];
  };
}

interface Product {
  id: number;
  name: string;
  slug: string;
  brand: string;
  category: {
    name: string;
  };
  price: number;
  priceDiscount: number;
  variants: {
    $values: Variant[];
  };
}

interface ProductResponse {
  products: {
    $values: Product[];
  };
}

export default function SuccessProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<ProductResponse>('http://localhost:5000/api/products/category/men');
        if (response.data.products?.$values) {
          setProducts(response.data.products.$values);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={styles.successProductList}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>You Might Also Like</h2>
          <div className={styles.navigation}>
            <button className={`${styles.prevButton} swiper-button-prev`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className={`${styles.nextButton} swiper-button-next`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next',
          }}
          spaceBetween={24}
          slidesPerView={3}
          slidesPerGroup={3}
          className={styles.swiper}
          breakpoints={{
            320: {
              slidesPerView: 1,
              slidesPerGroup: 1,
              spaceBetween: 16
            },
            640: {
              slidesPerView: 2,
              slidesPerGroup: 2,
              spaceBetween: 20
            },
            1024: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 24
            }
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <Link href={`/product/${product.slug}`} className={styles.productCard}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={product.variants.$values[0].images.$values[0]}
                    alt={product.name}
                    width={400}
                    height={400}
                    className={styles.image}
                    unoptimized
                  />
                </div>
                <div className={styles.info}>
                  <h3 className={styles.name}>{product.name}</h3>
                  <p className={styles.category}>{product.category.name}'s Shoes</p>
                  <div className={styles.price}>
                    <span className={styles.currentPrice}>
                      {formatPrice(product.priceDiscount)}
                    </span>
                    {product.price !== product.priceDiscount && (
                      <span className={styles.originalPrice}>
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
} 
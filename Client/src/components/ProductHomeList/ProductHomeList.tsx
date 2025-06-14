'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProductsByCategory } from '@/services/api';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './ProductHomeList.module.scss';

interface SizeInfo {
  size: string;
  stock: number;
}

interface Variant {
  id: number;
  color: string;
  sizesJson: string;
  imagesString: string;
  productId: number;
  sizes?: SizeInfo[];
  images?: string[];
  totalStock: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
}

interface PriceDetails {
    original: number;
    discount: number;
    quantityDiscount: number;
}

interface ApiProduct {
  priceDiscount: number;
    id: number;
    name: string;
  description?: string;
  brand?: string;
  price: number;
  priceDetails?: PriceDetails;
  stock: number;
  categoryId: number;
  category: Category;
    slug: string;
  variants?: {
    $id: string;
    $values: Variant[];
  };
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  products: {
    $id: string;
    $values: ApiProduct[];
  };
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

interface ProductHomeListProps {
  title: string;
  categorySlug: string;
  viewAllText?: string;
  limit?: number;
}

export default function ProductHomeList({ 
  title, 
  categorySlug,
  viewAllText = 'View All',
  limit = 6
}: ProductHomeListProps) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProductsByCategory(categorySlug, {
          page: 1,
          pageSize: limit,
          sortBy: 'featured'
        }) as ApiResponse;
        
        console.log(`ProductHomeList - ${categorySlug} response:`, response);
        
        if (response && response.products && response.products.$values) {
          setProducts(response.products.$values.slice(0, limit));
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error(`Error fetching ${categorySlug} products:`, error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, limit]);

  if (loading) {
    return (
      <section className={styles.productHomeList}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.loading}>Loading...</div>
      </section>
    );
  }

  const renderProductCard = (product: ApiProduct) => {
    // Extract first image from first variant
    let image = '';
    if (product.variants && product.variants.$values && product.variants.$values.length > 0) {
      const firstVariant = product.variants.$values[0];
      if (firstVariant.imagesString) {
        try {
          const images = JSON.parse(firstVariant.imagesString);
          if (Array.isArray(images) && images.length > 0) {
            image = images[0];
      }
        } catch (error) {
          console.error('Error parsing variant images:', error);
        }
      }
    }
    
    return (
      <ProductCard 
        key={product.id}
        product={{
          slug: product.slug,
          id: product.id,
          name: product.name,
          price: product.price,
          priceDiscount: product.priceDiscount,
          category: product.category.name,
          image: image || '/placeholder.jpg',
          colors: product.variants?.$values.length || 0,
          isBestSeller: false, // You can add this as a tag in the future
          isSustainable: false // You can add this as a tag in the future
        }}
      />
    );
  };

  return (
    <section className={styles.productHomeList}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.grid}>
        {products.length > 0 ? (
          products.map((product) => renderProductCard(product))
        ) : (
          <p className={styles.noProducts}>No products available</p>
        )}
      </div>
      <div className={styles.viewAll}>
        <Link href={`/category/${categorySlug}`} className={styles.viewAllButton}>
          {viewAllText}
        </Link>
      </div>
    </section>
  );
} 
 
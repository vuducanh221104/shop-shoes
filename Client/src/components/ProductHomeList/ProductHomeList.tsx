'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProductsByCategory } from '@/services/api';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './ProductHomeList.module.scss';

// Define types to match the actual API response
interface ProductVariant {
  id: number;
  color: string;
  images: {
    $id: string;
    $values: string[];
  };
}

interface ApiProduct {
  slug: string;
  id: number;
  name: string;
  price?: number;
  priceDetails?: {
    original: number;
    discount: number;
    quantityDiscount: number;
  };
  category: {
    id: number;
    name: string;
    description: string;
    slug: string;
  } | string;
  image?: string;
  tags?: string[];
  variants?: {
    $id: string;
    $values: ProductVariant[];
  };
}

interface ApiResponse {
  $id?: string;
  $values?: ApiProduct[];
  items?: ApiProduct[] | {
    $id: string;
    $values: ApiProduct[];
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
  limit = 4
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
        }) as unknown as ApiResponse;
        
        console.log(`ProductHomeList - ${categorySlug} response:`, response);
        
        // Extract products from the response based on its structure
        let extractedProducts: ApiProduct[] = [];
        
        if (response && response.$values) {
          extractedProducts = response.$values;
        } else if (response && response.items && typeof response.items === 'object' && '$values' in response.items) {
          extractedProducts = response.items.$values;
        } else if (response && response.$id && response.$values) {
          extractedProducts = response.$values;
        } else if (Array.isArray(response)) {
          extractedProducts = response as ApiProduct[];
        } else if (response && Array.isArray(response.items)) {
          extractedProducts = response.items;
        }
        
        console.log(`ProductHomeList - ${categorySlug} extracted products:`, extractedProducts);
        setProducts(extractedProducts.slice(0, limit));
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
    // Extract image from product or variant
    let image = product.image;
    if (!image && product.variants && product.variants.$values && product.variants.$values.length > 0) {
      const firstVariant = product.variants.$values[0];
      if (firstVariant.images && firstVariant.images.$values && firstVariant.images.$values.length > 0) {
        image = firstVariant.images.$values[0];
      }
    }
    
    // Extract category name
    let categoryName = typeof product.category === 'string' ? product.category : 'Unknown';
    if (typeof product.category === 'object' && product.category !== null) {
      categoryName = product.category.name || 'Unknown';
    }
    
    return (
      <ProductCard 
        key={product.id}
        product={{
          slug: product.slug,
          id: product.id,
          name: product.name,
          price: product.price || (product.priceDetails ? product.priceDetails.discount : 0),
          category: categoryName,
          image: image || '/placeholder.jpg',
          colors: product.variants ? product.variants.$values.length : 0,
          isBestSeller: product.tags?.includes('bestseller') || false,
          isSustainable: product.tags?.includes('sustainable') || false
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
 
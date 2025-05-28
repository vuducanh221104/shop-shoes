"use client";
import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { getProductsByCategorySlug } from '@/services/api';
import styles from './ProductList.module.scss';
import Link from 'next/link';

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
  description?: string;
  category?: string[];
  tags?: string[];
  stock?: number;
  price: Price;
  variants: Variant[];
}

interface ProductListProps {
  slugCategory: string;
  title: string;
  linkViewAll?: string;
  description?: string;
}

const ProductList = ({ 
  slugCategory = 'men', 
  title = 'Products', 
  linkViewAll,
  description 
}: ProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch products using the provided category slug
        const data = await getProductsByCategorySlug(slugCategory);
        setProducts(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slugCategory]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Error loading products: {error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return <p className={styles.noProducts}>No products available at the moment.</p>;
  }

  return (
    <div className={styles.productListContainer}>
      <div className={styles.productListHeader}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {linkViewAll && (
          <Link href={linkViewAll} className={styles.viewAllLink}>
            View All
          </Link>
        )}
      </div>

      <div className={styles.productGrid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            brand={product.brand}
            price={product.price}
            variants={product.variants}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList; 
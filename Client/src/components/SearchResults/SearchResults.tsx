'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './SearchResults.module.scss';

interface Product {
  id: number;
  name: string;
  slug: string;
  brand: string;
  price: number;
  priceDiscount: number;
  variants: {
    $values: Array<{
      images: {
        $values: string[];
      };
    }>;
  };
}

interface SearchResultsProps {
  searchTerm: string;
  onClose: () => void;
}

export default function SearchResults({ searchTerm, onClose }: SearchResultsProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Implement debounce effect
  useEffect(() => {
    console.log('Search term changed:', searchTerm);
    const timer = setTimeout(() => {
      console.log('Debounced search term set to:', searchTerm);
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Fetch results when debounced search term changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 1) {
        setProducts([]);
        return;
      }

      console.log('Fetching results for:', debouncedSearchTerm);
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://localhost:5000/api/products/search?q=${debouncedSearchTerm}&pageSize=3`);
        console.log('API response:', response.data);
        
        // Check if the response has the expected structure
        if (response.data && response.data.products && response.data.products.$values) {
          setProducts(response.data.products.$values.slice(0, 3));
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError('Failed to fetch search results');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchTerm]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleViewAllClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    onClose();
  };

  if (!searchTerm) {
    return null;
  }

  return (
    <div className={styles.searchResults}>
      {loading ? (
        <div className={styles.loading}>Searching...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : products.length === 0 ? (
        <div className={styles.noResults}>No products found</div>
      ) : (
        <>
          <div className={styles.resultsList}>
            {products.map((product) => (
              <Link 
                href={`/product/${product.slug}`} 
                key={product.id} 
                className={styles.resultItem}
                onClick={onClose}
              >
                <div className={styles.productImage}>
                  {product.variants && product.variants.$values && product.variants.$values[0]?.images?.$values?.[0] ? (
                    <Image 
                      src={product.variants.$values[0].images.$values[0]} 
                      alt={product.name}
                      width={60}
                      height={60}
                      unoptimized
                    />
                  ) : (
                    <div className={styles.placeholderImage}></div>
                  )}
                </div>
                <div className={styles.productInfo}>
                  <h4 className={styles.productName}>{product.name}</h4>
                  <p className={styles.productBrand}>{product.brand}</p>
                  <div className={styles.productPrice}>
                    {product.priceDiscount && product.priceDiscount !== 0 && product.priceDiscount !== product.price ? (
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
                </div>
              </Link>
            ))}
          </div>
          <a href="#" className={styles.viewAllLink} onClick={handleViewAllClick}>
            View all results
          </a>
        </>
      )}
    </div>
  );
} 
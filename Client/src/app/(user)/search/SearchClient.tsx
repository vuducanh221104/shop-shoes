'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FunnelIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './search.module.scss';
import axios from 'axios';

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

interface Product {
  id: number;
  name: string;
  description?: string;
  brand?: string;
  price: number;
  priceDiscount: number;
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
    $values: Product[];
  };
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

interface SearchClientProps {
  query: string;
  initialPage: number;
  initialPageSize: number;
  initialSortBy: string;
}

const filters = [
  { name: "Brand" },
  { name: "Price Range" },
  { name: "Size" },
  { name: "Colour" },
  { name: "Category" }
];

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: High-Low", value: "price_desc" },
  { label: "Price: Low-High", value: "price_asc" }
];

export default function SearchClient({ 
  query, 
  initialPage, 
  initialPageSize, 
  initialSortBy 
}: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Get current search params
  const page = Number(searchParams?.get('page')) || initialPage;
  const pageSize = Number(searchParams?.get('pageSize')) || initialPageSize;
  const sortBy = searchParams?.get('sortBy') || initialSortBy;

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<ApiResponse>(
          `http://localhost:5000/api/products/search?q=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}`
        );
        
        console.log('API Response:', response);
        
        if (response.data.products && response.data.products.$values) {
          setProducts(response.data.products.$values);
          setCurrentPage(response.data.pagination.currentPage);
          setTotalPages(response.data.pagination.totalPages);
          setTotalItems(response.data.pagination.totalItems);
        } else {
          console.log('Unexpected response structure:', response);
          setProducts([]);
          setTotalItems(0);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError('Failed to load search results. Please try again later.');
        setProducts([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, page, pageSize, sortBy]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const updateSort = (value: string) => {
    if (typeof window === 'undefined') return;
    
    const params = new URLSearchParams(window.location.search);
    params.set('sortBy', value);
    params.set('page', '1'); // Reset to first page when sorting changes
    
    router.push(`/search?${params.toString()}`);
    setShowSortMenu(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPage.toString());
    
    router.push(`/search?${params.toString()}`);
  };

  const getFirstProductImage = (product: Product): string => {
    if (product.variants && product.variants.$values && product.variants.$values.length > 0) {
      const firstVariant = product.variants.$values[0];
      if (firstVariant.imagesString) {
        try {
          const images = JSON.parse(firstVariant.imagesString);
          if (Array.isArray(images) && images.length > 0) {
            return images[0];
          }
        } catch (error) {
          console.error('Error parsing variant images:', error);
        }
      }
    }
    return '/placeholder-product.jpg';
  };

  const renderProducts = () => {
    if (loading) {
      return <div className={styles.loading}>Loading products...</div>;
    }

    if (!Array.isArray(products) || products.length === 0) {
      return <div className={styles.noResults}>No products found for "{query}".</div>;
    }

    return products.map((product) => (
      <ProductCard 
        key={product.id}
        product={{
          slug: product.slug,
          id: product.id,
          name: product.name,
          price: product.price,
          priceDiscount: product.priceDiscount,
          category: product.category?.name || '',
          image: getFirstProductImage(product),
          colors: product.variants ? product.variants.$values.length : 0,
          isBestSeller: false,
          isSustainable: false
        }}
      />
    ));
  };

  const renderPagination = () => {
    if (totalPages <= 1 || !products.length) return null;

    return (
      <div className={styles.pagination}>
        <button 
          className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`} 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        
        <div className={styles.pageNumbers}>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              // Show all pages if 5 or fewer
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              // At the beginning
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              // At the end
              pageNum = totalPages - 4 + i;
            } else {
              // In the middle
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                className={`${styles.pageNumber} ${pageNum === currentPage ? styles.active : ''}`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        
        <button 
          className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Search Results Header */}
        <div className={styles.header}>
          <h1>Search Results for: "{query}" <span>({totalItems} products)</span></h1>
          <div className={styles.controls}>
            <button className={styles.filterButton} onClick={toggleFilters}>
              <FunnelIcon className={styles.icon} />
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
            <div className={styles.sortDropdown}>
              <button 
                className={styles.sortButton}
                onClick={() => setShowSortMenu(!showSortMenu)}
              >
                Sort By: {sortOptions.find(opt => opt.value === sortBy)?.label || 'Featured'}
                <ChevronDownIcon className={styles.icon} />
              </button>
              {showSortMenu && (
                <div className={styles.sortMenu}>
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`${styles.sortOption} ${
                        sortBy === option.value ? styles.active : ''
                      }`}
                      onClick={() => updateSort(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.content}>
          {/* Filters */}
          {showFilters && (
            <aside className={styles.filters}>
              {filters.map((filter, index) => (
                <div key={index} className={styles.filterGroup}>
                  <button className={styles.filterButton}>
                    {filter.name}
                    <ChevronDownIcon className={styles.icon} />
                  </button>
                </div>
              ))}
            </aside>
          )}

          {/* Products Grid */}
          <div className={`${styles.productsGrid} ${!showFilters ? styles.fullWidth : ''}`}>
            {renderProducts()}
            {renderPagination()}
          </div>
        </div>
      </div>
    </div>
  );
} 
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FunnelIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import ProductCard from '@/components/ProductCard/ProductCard';
import { getProductsByCategory } from '@/services/api';
import styles from './page.module.scss';
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

interface CategoryClientProps {
  slug: string;
}

const filters = [
  { name: "Lifestyle" },
  { name: "Skateboarding" },
  { name: "Gender", count: 1 },
  { name: "Sale & Offers" },
  { name: "Size" },
  { name: "Colour" },
  { name: "Collections", count: 1 },
  { name: "Shoe Height" },
  { name: "Brand" }
];

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: High-Low", value: "price_desc" },
  { label: "Price: Low-High", value: "price_asc" }
];

export default function CategoryClient({ slug }: CategoryClientProps) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Get current search params
  const page = Number(searchParams?.get('page')) || 1;
  const pageSize = Number(searchParams?.get('pageSize')) || 12;
  const sortBy = searchParams?.get('sortBy') || 'featured';
  const minPrice = Number(searchParams?.get('minPrice'));
  const maxPrice = Number(searchParams?.get('maxPrice'));

  // Format category name for display
  const categoryName = slug?.charAt(0).toUpperCase() + slug?.slice(1);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<ApiResponse>(
          `http://localhost:5000/api/products/category/${slug}?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}`
        );
        
        console.log('API Response:', response);
        
        if (response.data.products && response.data.products.$values) {
          setProducts(response.data.products.$values);
          setCurrentPage(response.data.pagination.currentPage);
          setTotalPages(response.data.pagination.totalPages);
          console.log('Products set from $values:', response.data.products.$values);
        } else {
          console.log('Unexpected response structure:', response);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug, page, pageSize, sortBy]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const updateSort = (value: string) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('sortBy', value);
    window.history.pushState({}, '', url);
    setShowSortMenu(false);
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
      return <div className={styles.noResults}>No products found for this category.</div>;
    }

    return products.map((product) => {
      console.log('Rendering product:', product);
      
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
            image: getFirstProductImage(product),
            colors: product.variants ? product.variants.$values.length : 0,
            isBestSeller: false,
            isSustainable: false
          }}
        />
      );
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1>{categoryName ? `${categoryName}'s Nike Shoes (${products?.length || 0})` : 'Loading...'}</h1>
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
                    {filter.count && <span>({filter.count})</span>}
                    <ChevronDownIcon className={styles.icon} />
                  </button>
                </div>
              ))}
            </aside>
          )}

          {/* Products Grid */}
          <div className={`${styles.productsGrid} ${!showFilters ? styles.fullWidth : ''}`}>
            {renderProducts()}
          </div>
        </div>
      </div>
    </div>
  );
} 
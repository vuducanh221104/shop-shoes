'use client';

import React from 'react';
import Banner from '@/components/Banner/Banner';
import ProductList from '@/components/ProductList/ProductList';
import { categories } from '@/data/products';

export default function Home() {
  return (
    <>
      <Banner />
      
      <div className="py-4">
        {categories.map((category) => (
          <ProductList key={category.id} category={category} />
        ))}
      </div>
    </>
  );
} 
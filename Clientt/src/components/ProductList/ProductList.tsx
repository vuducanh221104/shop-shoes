'use client';

import React from 'react';
import Link from 'next/link';
import { Category } from '@/data/products';
import ProductItem from '../ProductItem/ProductItem';
import './ProductList.scss';

interface ProductListProps {
  category: Category;
}

const ProductList: React.FC<ProductListProps> = ({ category }) => {
  return (
    <section className="category-section">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title">{category.name}</h2>
          <Link href={`/categories/${category.id}`} className="view-all-link">
            Xem tất cả
          </Link>
        </div>
        
        <div className="row">
          {category.products.map((product) => (
            <div key={product.id} className="col-6 col-md-4 col-lg-3">
              <ProductItem product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList; 
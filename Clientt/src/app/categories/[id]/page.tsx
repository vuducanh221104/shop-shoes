'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { categories } from '@/data/products';
import ProductItem from '@/components/ProductItem/ProductItem';
import './CategoryPage.scss';

const CategoryPage = () => {
  const params = useParams();
  const categoryId = params.id as string;
  
  // Find the category with the matching ID
  const category = categories.find(cat => cat.id === categoryId);
  
  if (!category) {
    return (
      <div className="container py-5 text-center">
        <h2>Danh mục không tồn tại</h2>
        <Link href="/" className="btn btn-primary mt-3">
          Quay về trang chủ
        </Link>
      </div>
    );
  }
  
  return (
    <div className="category-page">
      <div className="container py-4">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4" items={[
          {
            title: <Link href="/"><HomeOutlined /> Trang chủ</Link>,
          },
          {
            title: category.name,
          },
        ]} />
        
        <h1 className="category-title mb-4">{category.name}</h1>
        
        <div className="row">
          {category.products.map(product => (
            <div key={product.id} className="col-6 col-md-4 col-lg-3">
              <ProductItem product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage; 
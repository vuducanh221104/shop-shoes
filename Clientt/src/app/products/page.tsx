'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Breadcrumb, Select, Radio, Slider, InputNumber, Button } from 'antd';
import { HomeOutlined, FilterOutlined } from '@ant-design/icons';
import { categories } from '@/data/products';
import ProductItem from '@/components/ProductItem/ProductItem';
import './ProductsPage.scss';

const { Option } = Select;

const ProductsPage = () => {
  const allProducts = categories.flatMap(category => category.products);
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000000]);
  const [showFilters, setShowFilters] = useState(false);
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    filterProducts(value, sortBy, priceRange);
  };
  
  const handleSortChange = (e: any) => {
    const value = e.target.value;
    setSortBy(value);
    filterProducts(selectedCategory, value, priceRange);
  };
  
  const handlePriceChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setPriceRange(newRange);
    filterProducts(selectedCategory, sortBy, newRange);
  };
  
  const filterProducts = (category: string, sort: string, price: [number, number]) => {
    // Filter by category
    let filtered = category === 'all' 
      ? allProducts 
      : allProducts.filter(product => product.category === category);
    
    // Filter by price
    filtered = filtered.filter(product => 
      product.price >= price[0] && product.price <= price[1]
    );
    
    // Sort products
    if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'name-desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    setFilteredProducts(filtered);
  };
  
  return (
    <div className="products-page">
      <div className="container py-4">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4" items={[
          {
            title: <Link href="/"><HomeOutlined /> Trang chủ</Link>,
          },
          {
            title: 'Tất cả sản phẩm',
          },
        ]} />
        
        <h1 className="page-title mb-4">Tất cả sản phẩm</h1>
        
        <div className="row">
          {/* Filters for mobile */}
          <div className="col-12 d-md-none mb-3">
            <Button 
              type="default" 
              icon={<FilterOutlined />}
              onClick={() => setShowFilters(!showFilters)}
              block
            >
              {showFilters ? 'Ẩn bộ lọc' : 'Hiển thị bộ lọc'}
            </Button>
          </div>
          
          {/* Filters */}
          <div className={`col-md-3 filters ${showFilters ? 'd-block' : 'd-none d-md-block'}`}>
            <div className="filter-section">
              <h4 className="filter-title">Danh mục</h4>
              <Select
                defaultValue="all"
                style={{ width: '100%' }}
                onChange={handleCategoryChange}
              >
                <Option value="all">Tất cả</Option>
                {categories.map(category => (
                  <Option key={category.id} value={category.id}>{category.name}</Option>
                ))}
              </Select>
            </div>
            
            <div className="filter-section">
              <h4 className="filter-title">Sắp xếp theo</h4>
              <Radio.Group onChange={handleSortChange} value={sortBy}>
                <Radio.Button value="default">Mặc định</Radio.Button>
                <Radio.Button value="price-asc">Giá tăng dần</Radio.Button>
                <Radio.Button value="price-desc">Giá giảm dần</Radio.Button>
              </Radio.Group>
            </div>
            
            <div className="filter-section">
              <h4 className="filter-title">Khoảng giá</h4>
              <Slider
                range
                min={0}
                max={3000000}
                step={100000}
                value={priceRange}
                onChange={(value) => handlePriceChange(value as number[])}
              />
              <div className="price-inputs">
                <InputNumber
                  min={0}
                  max={3000000}
                  value={priceRange[0]}
                  onChange={(value) => {
                    const newValue = value || 0;
                    handlePriceChange([newValue, priceRange[1]]);
                  }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                  parser={(value) => parseInt(value?.replace(/\./g, '') || '0', 10)}
                />
                <span className="price-separator">-</span>
                <InputNumber
                  min={0}
                  max={3000000}
                  value={priceRange[1]}
                  onChange={(value) => {
                    const newValue = value || 3000000;
                    handlePriceChange([priceRange[0], newValue]);
                  }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                  parser={(value) => parseInt(value?.replace(/\./g, '') || '0', 10)}
                />
              </div>
            </div>
          </div>
          
          {/* Products */}
          <div className="col-md-9">
            <div className="row">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div key={product.id} className="col-6 col-md-4 col-lg-4">
                    <ProductItem product={product} />
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <p>Không tìm thấy sản phẩm phù hợp.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 
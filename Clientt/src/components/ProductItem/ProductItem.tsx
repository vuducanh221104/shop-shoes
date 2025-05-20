'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Product } from '@/data/products';
import './ProductItem.scss';

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  // Format price with VND currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // In a real app, this would dispatch an action to add the product to the cart
    console.log('Adding to cart:', product);
  };

  return (
    <div className="product-item">
      <Link href={`/products/${product.id}`} className="product-link">
        <div className="card product-card h-100">
          <div className="card-img-container">
            <img 
              src={product.image} 
              alt={product.name} 
              className="card-img-top product-img"
            />
            <div className="product-overlay">
              <Button 
                type="primary" 
                shape="circle" 
                icon={<EyeOutlined />} 
                className="view-details-btn"
              />
            </div>
          </div>
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text price">{formatPrice(product.price)}</p>
            <div className="mt-auto">
              <Button 
                type="primary" 
                icon={<ShoppingCartOutlined />} 
                onClick={handleAddToCart}
                className="add-to-cart-btn"
              >
                Thêm vào giỏ
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductItem; 
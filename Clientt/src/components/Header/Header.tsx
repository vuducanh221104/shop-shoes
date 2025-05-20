'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCartOutlined, MenuOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import './Header.scss';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0); // This would come from a cart context in a real app

  return (
    <header className="header">
      <div className="container">
        <div className="row py-3 align-items-center">
          <div className="col-6 col-md-3">
            <Link href="/" className="logo">
            LeviathanShop
            </Link>
          </div>
          
          <div className="col-md-6 d-none d-md-block">
            <nav className="main-nav">
              <ul className="nav justify-content-center">
                <li className="nav-item">
                  <Link href="/" className="nav-link active">Home</Link>
                </li>
                <li className="nav-item">
                  <Link href="/products" className="nav-link">Products</Link>
                </li>
                <li className="nav-item">
                  <Link href="/categories" className="nav-link">Categories</Link>
                </li>
                <li className="nav-item">
                  <Link href="/contact" className="nav-link">Contact</Link>
                </li>
              </ul>
            </nav>
          </div>
          
          <div className="col-6 col-md-3 text-end">
            <Link href="/cart" className="cart-icon">
              <Badge count={cartCount} size="small">
                <ShoppingCartOutlined style={{ fontSize: '24px' }} />
              </Badge>
            </Link>
            
            <button 
              className="mobile-menu-toggle d-md-none ms-3" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <MenuOutlined />
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu d-md-none">
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link href="/" className="nav-link active">Home</Link>
              </li>
              <li className="nav-item">
                <Link href="/products" className="nav-link">Products</Link>
              </li>
              <li className="nav-item">
                <Link href="/categories" className="nav-link">Categories</Link>
              </li>
              <li className="nav-item">
                <Link href="/contact" className="nav-link">Contact</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 
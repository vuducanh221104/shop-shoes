'use client';

import React from 'react';
import Link from 'next/link';
import './Banner.scss';

const Banner: React.FC = () => {
  return (
    <section 
      className="banner" 
      style={{ 
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80)' 
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-lg-6">
            <div className="banner-content py-5">
              <h1 className="mb-3">Giày chất, giá tốt</h1>
              <p className="lead mb-4">Khám phá bộ sưu tập giày mới nhất với chất lượng cao và giá cả phải chăng.</p>
              <Link href="/products" className="btn btn-accent btn-lg">
                Mua ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner; 
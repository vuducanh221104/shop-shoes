'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button, InputNumber, Tabs, Rate, Breadcrumb } from 'antd';
import { 
  ShoppingCartOutlined, 
  HeartOutlined, 
  HeartFilled, 
  ShareAltOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { categories } from '@/data/products';
import './ProductDetails.scss';

const ProductDetails = () => {
  const params = useParams();
  const slug = params.slug as string;
  
  // Find the product with the matching slug
  const product = categories.flatMap(category => category.products)
    .find(product => product.id === slug);
  
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  
  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h2>Sản phẩm không tồn tại</h2>
        <Link href="/" className="btn btn-primary mt-3">
          Quay về trang chủ
        </Link>
      </div>
    );
  }
  
  // Format price with VND currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };
  
  const handleAddToCart = () => {
    // In a real app, this would dispatch an action to add the product to the cart
    console.log(`Adding ${quantity} of ${product.name} to cart`);
  };
  
  const handleQuantityChange = (value: number | null) => {
    if (value !== null) {
      setQuantity(value);
    }
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  return (
    <div className="product-details-page">
      <div className="container py-4">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4" items={[
          {
            title: <Link href="/"><HomeOutlined /> Trang chủ</Link>,
          },
          {
            title: <Link href={`/categories/${product.category}`}>
              {categories.find(cat => cat.id === product.category)?.name}
            </Link>,
          },
          {
            title: product.name,
          },
        ]} />
        
        <div className="row">
          {/* Product Image */}
          <div className="col-md-6 mb-4">
            <div className="product-image-container">
              <img 
                src={product.image} 
                alt={product.name} 
                className="product-image"
              />
            </div>
          </div>
          
          {/* Product Info */}
          <div className="col-md-6">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-rating mb-3">
              <Rate disabled defaultValue={4.5} allowHalf />
              <span className="ms-2">(120 đánh giá)</span>
            </div>
            
            <div className="product-price mb-4">
              {formatPrice(product.price)}
            </div>
            
            <div className="product-description mb-4">
              <p>
                Giày {product.name} chất lượng cao, thiết kế hiện đại, phù hợp với nhiều phong cách thời trang. 
                Đế giày êm ái, bền bỉ, mang lại cảm giác thoải mái cho người sử dụng.
              </p>
            </div>
            
            <div className="product-actions mb-4">
              <div className="d-flex align-items-center mb-3">
                <div className="me-3">
                  <label className="form-label">Số lượng:</label>
                  <InputNumber 
                    min={1} 
                    max={10} 
                    value={quantity} 
                    onChange={handleQuantityChange} 
                  />
                </div>
              </div>
              
              <div className="d-flex">
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<ShoppingCartOutlined />} 
                  onClick={handleAddToCart}
                  className="add-to-cart-btn me-2"
                >
                  Thêm vào giỏ
                </Button>
                
                <Button 
                  size="large" 
                  icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                  onClick={toggleFavorite}
                  className={`favorite-btn ${isFavorite ? 'is-favorite' : ''}`}
                />
                
                <Button 
                  size="large" 
                  icon={<ShareAltOutlined />}
                  className="ms-2"
                />
              </div>
            </div>
            
            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-label">Danh mục:</span>
                <Link href={`/categories/${product.category}`}>
                  {categories.find(cat => cat.id === product.category)?.name}
                </Link>
              </div>
              <div className="meta-item">
                <span className="meta-label">Mã sản phẩm:</span>
                <span>{product.id}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="product-tabs mt-5">
          <Tabs
            defaultActiveKey="description"
            items={[
              {
                key: 'description',
                label: 'Mô tả chi tiết',
                children: (
                  <div className="tab-content">
                    <h3>Thông tin sản phẩm {product.name}</h3>
                    <p>
                      Giày {product.name} là một trong những mẫu giày bán chạy nhất của chúng tôi. 
                      Với thiết kế hiện đại, đường nét tinh tế, sản phẩm mang đến vẻ đẹp sang trọng 
                      và đẳng cấp cho người sử dụng.
                    </p>
                    <h4>Đặc điểm nổi bật:</h4>
                    <ul>
                      <li>Chất liệu cao cấp, bền bỉ</li>
                      <li>Đế giày êm ái, chống trượt tốt</li>
                      <li>Thiết kế thời trang, phù hợp nhiều phong cách</li>
                      <li>Dễ dàng kết hợp với nhiều loại trang phục</li>
                      <li>Phù hợp cho cả nam và nữ</li>
                    </ul>
                  </div>
                ),
              },
              {
                key: 'specifications',
                label: 'Thông số kỹ thuật',
                children: (
                  <div className="tab-content">
                    <table className="table">
                      <tbody>
                        <tr>
                          <th>Thương hiệu</th>
                          <td>LeviathanShop</td>
                        </tr>
                        <tr>
                          <th>Chất liệu</th>
                          <td>Da tổng hợp, vải cao cấp</td>
                        </tr>
                        <tr>
                          <th>Đế giày</th>
                          <td>Cao su tổng hợp</td>
                        </tr>
                        <tr>
                          <th>Chiều cao đế</th>
                          <td>3cm</td>
                        </tr>
                        <tr>
                          <th>Kích cỡ</th>
                          <td>36 - 44</td>
                        </tr>
                        <tr>
                          <th>Màu sắc</th>
                          <td>Đen, Trắng, Xám</td>
                        </tr>
                        <tr>
                          <th>Xuất xứ</th>
                          <td>Việt Nam</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ),
              },
              {
                key: 'reviews',
                label: 'Đánh giá (120)',
                children: (
                  <div className="tab-content">
                    <div className="reviews-summary mb-4">
                      <div className="row align-items-center">
                        <div className="col-md-4 text-center">
                          <div className="average-rating">4.5</div>
                          <Rate disabled defaultValue={4.5} allowHalf />
                          <p>Dựa trên 120 đánh giá</p>
                        </div>
                        <div className="col-md-8">
                          <div className="rating-bars">
                            {[5, 4, 3, 2, 1].map((star) => (
                              <div key={star} className="rating-bar-item d-flex align-items-center mb-2">
                                <span className="me-2">{star} sao</span>
                                <div className="progress flex-grow-1">
                                  <div 
                                    className="progress-bar" 
                                    style={{ 
                                      width: star === 5 ? '60%' : 
                                             star === 4 ? '25%' : 
                                             star === 3 ? '10%' : 
                                             star === 2 ? '3%' : '2%' 
                                    }}
                                  ></div>
                                </div>
                                <span className="ms-2">
                                  {star === 5 ? '72' : 
                                   star === 4 ? '30' : 
                                   star === 3 ? '12' : 
                                   star === 2 ? '4' : '2'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="reviews-list">
                      {/* Sample reviews */}
                      {[
                        { 
                          name: 'Nguyễn Văn A', 
                          rating: 5, 
                          date: '15/06/2023',
                          comment: 'Sản phẩm rất tốt, đúng như mô tả. Giao hàng nhanh, đóng gói cẩn thận.' 
                        },
                        { 
                          name: 'Trần Thị B', 
                          rating: 4, 
                          date: '20/05/2023',
                          comment: 'Giày đẹp, chất lượng ổn. Tuy nhiên size hơi rộng một chút.' 
                        },
                        { 
                          name: 'Lê Văn C', 
                          rating: 5, 
                          date: '10/04/2023',
                          comment: 'Mẫu mã đẹp, chất liệu tốt, đi rất êm chân. Sẽ ủng hộ shop dài dài.' 
                        }
                      ].map((review, index) => (
                        <div key={index} className="review-item mb-4 pb-4 border-bottom">
                          <div className="d-flex justify-content-between mb-2">
                            <h5 className="review-author">{review.name}</h5>
                            <span className="review-date">{review.date}</span>
                          </div>
                          <Rate disabled defaultValue={review.rating} />
                          <p className="review-content mt-2">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Input, Button, Form } from 'antd';
import { 
  FacebookOutlined, 
  InstagramOutlined, 
  TwitterOutlined, 
  YoutubeOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import './Footer.scss';

const Footer: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (values: { email: string }) => {
    setLoading(true);
    // In a real app, this would call an API to subscribe the user
    console.log('Subscribing email:', values.email);
    setTimeout(() => {
      setLoading(false);
      form.resetFields();
    }, 1000);
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="row py-5">
          <div className="col-md-4 mb-4 mb-md-0">
            <h4 className="footer-title">LeviathanShop</h4>
            <p className="footer-description">
              Cung cấp các sản phẩm giày chất lượng cao với giá cả phải chăng. Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FacebookOutlined />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <InstagramOutlined />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <TwitterOutlined />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <YoutubeOutlined />
              </a>
            </div>
          </div>
          
          <div className="col-md-4 mb-4 mb-md-0">
            <h4 className="footer-title">Liên hệ</h4>
            <ul className="contact-list">
              <li>
                <EnvironmentOutlined className="contact-icon" />
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </li>
              <li>
                <PhoneOutlined className="contact-icon" />
                <span>0123 456 789</span>
              </li>
              <li>
                <MailOutlined className="contact-icon" />
                <span>contact@LeviathanShop.com</span>
              </li>
            </ul>
          </div>
          
          <div className="col-md-4">
            <h4 className="footer-title">Đăng ký nhận khuyến mãi</h4>
            <p>Đăng ký để nhận thông tin về sản phẩm mới và khuyến mãi đặc biệt.</p>
            <Form form={form} onFinish={handleSubscribe} className="subscribe-form">
              <Form.Item 
                name="email" 
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input placeholder="Email của bạn" />
              </Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                className="subscribe-btn"
              >
                Đăng ký
              </Button>
            </Form>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="row py-3">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0">&copy; {new Date().getFullYear()} ShoeShop. Tất cả quyền được bảo lưu.</p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <ul className="footer-links">
                <li><Link href="/about">Về chúng tôi</Link></li>
                <li><Link href="/privacy">Chính sách bảo mật</Link></li>
                <li><Link href="/terms">Điều khoản sử dụng</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
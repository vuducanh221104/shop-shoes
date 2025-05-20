'use client';

import React from 'react';
import Link from 'next/link';
import { Breadcrumb, Form, Input, Button, Select } from 'antd';
import { HomeOutlined, SendOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import './ContactPage.scss';

const { Option } = Select;
const { TextArea } = Input;

const ContactPage = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log('Form values:', values);
    // In a real app, this would send the form data to a backend API
    form.resetFields();
    alert('Cảm ơn bạn đã liên hệ với chúng tôi! Chúng tôi sẽ phản hồi sớm nhất có thể.');
  };

  return (
    <div className="contact-page">
      <div className="container py-4">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4" items={[
          {
            title: <Link href="/"><HomeOutlined /> Trang chủ</Link>,
          },
          {
            title: 'Liên hệ',
          },
        ]} />

        <h1 className="page-title mb-4">Liên hệ với chúng tôi</h1>

        <div className="row">
          <div className="col-md-6 mb-4 mb-md-0">
            <div className="contact-info">
              <h3>Thông tin liên hệ</h3>
              <p>Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>

              <ul className="contact-list">
                <li>
                  <PhoneOutlined className="contact-icon" />
                  <span>0123 456 789</span>
                </li>
                <li>
                  <MailOutlined className="contact-icon" />
                  <span>contact@shoeshop.com</span>
                </li>
                <li>
                  <EnvironmentOutlined className="contact-icon" />
                  <span>123 Đường ABC, Quận 1, TP.HCM</span>
                </li>
              </ul>

              <div className="map-container">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5177580567037!2d106.69892121471834!3d10.771600392324696!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670702e31%3A0xa5777fb3a5bb4f3f!2sNguyen%20Hue%20Walking%20Street!5e0!3m2!1sen!2s!4v1625647831087!5m2!1sen!2s" 
                  width="100%" 
                  height="300" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                  title="Google Maps"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="contact-form">
              <h3>Gửi tin nhắn cho chúng tôi</h3>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
              >
                <Form.Item
                  name="name"
                  label="Họ và tên"
                  rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                >
                  <Input placeholder="Nhập họ và tên của bạn" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
                >
                  <Input placeholder="Nhập email của bạn" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                >
                  <Input placeholder="Nhập số điện thoại của bạn" />
                </Form.Item>

                <Form.Item
                  name="subject"
                  label="Chủ đề"
                  rules={[{ required: true, message: 'Vui lòng chọn chủ đề!' }]}
                >
                  <Select placeholder="Chọn chủ đề">
                    <Option value="question">Câu hỏi chung</Option>
                    <Option value="order">Thông tin đơn hàng</Option>
                    <Option value="return">Đổi trả sản phẩm</Option>
                    <Option value="complaint">Khiếu nại</Option>
                    <Option value="other">Khác</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="message"
                  label="Nội dung"
                  rules={[{ required: true, message: 'Vui lòng nhập nội dung tin nhắn!' }]}
                >
                  <TextArea 
                    placeholder="Nhập nội dung tin nhắn của bạn" 
                    rows={5} 
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SendOutlined />}
                    size="large"
                  >
                    Gửi tin nhắn
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 
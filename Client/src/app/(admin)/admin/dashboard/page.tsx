'use client';

import { useEffect, useState } from 'react';
import { Layout, Typography, Card, Row, Col, Statistic, Spin } from 'antd';
import axios from 'axios';
import { UserOutlined, ShoppingOutlined, ShoppingCartOutlined, AppstoreOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title } = Typography;

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalCategories: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [usersResponse, productsResponse, ordersResponse, categoriesResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/users'),
          axios.get('http://localhost:5000/api/products'),
          axios.get('http://localhost:5000/api/orders'),
          axios.get('http://localhost:5000/api/categories')
        ]);

        // Process responses, handling both formats (with $values or direct array)
        const users = usersResponse.data.$values || usersResponse.data || [];
        const products = productsResponse.data.$values || productsResponse.data || [];
        const orders = ordersResponse.data.$values || ordersResponse.data || [];
        const categories = categoriesResponse.data.$values || categoriesResponse.data || [];

        // Ensure all data is treated as arrays
        setStats({
          totalUsers: Array.isArray(users) ? users.length : 0,
          totalProducts: Array.isArray(products) ? products.length : 0,
          totalOrders: Array.isArray(orders) ? orders.length : 0,
          totalCategories: Array.isArray(categories) ? categories.length : 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Content style={{ margin: '0 16px' }}>
      <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
        <Title level={3}>Dashboard Overview</Title>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={stats.totalUsers}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Products"
                  value={stats.totalProducts}
                  valueStyle={{ color: '#1677ff' }}
                  prefix={<ShoppingOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Orders"
                  value={stats.totalOrders}
                  valueStyle={{ color: '#faad14' }}
                  prefix={<ShoppingCartOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Categories"
                  value={stats.totalCategories}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<AppstoreOutlined />}
                />
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </Content>
  );
} 
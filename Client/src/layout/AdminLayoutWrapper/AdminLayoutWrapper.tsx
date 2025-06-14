'use client';

import { useState, useEffect } from 'react';
import { Layout, Menu, Button, Typography, Breadcrumb } from 'antd';
import { 
  DashboardOutlined, 
  UserOutlined, 
  ShoppingOutlined, 
  TagOutlined,
  LogoutOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/adminAuthActions';
import { RootState } from '@/redux/store';
import Link from 'next/link';
import type { MenuProps, BreadcrumbProps } from 'antd';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
  pageTitle?: string;
  breadcrumbItems?: BreadcrumbProps['items'];
}
 function AdminLayoutWrapper({ 
  children,
  pageTitle = 'Dashboard',
  breadcrumbItems = [{ title: 'Admin' }, { title: 'Dashboard' }]
}: AdminLayoutWrapperProps) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentAdmin } = useSelector((state: RootState) => state.adminAuth.login);

  useEffect(() => {
    // Kiểm tra nếu chưa đăng nhập thì chuyển hướng về trang login
    if (!currentAdmin) {
      router.push('/admin/auth/login');
    }
  }, [currentAdmin, router]);

  const handleLogout = async () => {
    try {
      // @ts-ignore
      await dispatch(logout());
      router.push('/admin/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!currentAdmin) {
    return null; // Không hiển thị gì nếu chưa đăng nhập
  }

  // Định nghĩa items cho Menu
  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: <Link href="/admin/product">Products</Link>,
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: <Link href="/admin/user">Users</Link>,
    },

        {
          key: 'orders',
          icon: <ShoppingCartOutlined />,
          label: <Link href="/admin/order">Orders</Link>,
        },
        {
          key: 'categories',
          icon: <TagOutlined />,
          label: <Link href="/admin/category">Categories</Link>,
        },
  ];

  // Lấy key hiện tại dựa trên đường dẫn
  const getSelectedKey = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('/admin/dashboard')) return 'dashboard';
      if (path.includes('/admin/users')) return 'users';
      if (path.includes('/admin/products')) return 'products';
      if (path.includes('/admin/orders')) return 'orders';
    }
    return 'dashboard';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.3)' }} >
          <div className="brand flex items-center justify-center pt-0 pb-7 px-14 bg-[#ffffff]">
            <Link href={"/admin/dashboard"} className="contents">
              <span style={{ color: '#fff', alignItems: 'center', marginLeft: '5px', fontWeight: 'bold',display: 'flex', justifyContent: 'center', paddingTop:"6px",fontSize:"16px"}}>
                Nike Dashboard
              </span>
            </Link>
          </div>
        </div>
        <Menu 
          theme="dark" 
          defaultSelectedKeys={[getSelectedKey()]} 
          mode="inline" 
          items={menuItems}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
            <Title level={4} style={{ margin: 0 }}>Admin {pageTitle}</Title>
            <div>
              <span style={{ marginRight: 12 }}>
                Welcome, {currentAdmin && 'User' in currentAdmin ? currentAdmin.User.Username : 'Admin'}
              </span>
              <Button 
                icon={<LogoutOutlined />} 
                onClick={handleLogout}
                danger
              >
                Logout
              </Button>
            </div>
          </div>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />
          <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
export default AdminLayoutWrapper;
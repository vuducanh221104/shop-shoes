'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ConfigProvider } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
import ProviderRedux from '@/redux/ProviderRedux';
import './globals.scss';
import AdminLayoutWrapper from '@/layout/AdminLayoutWrapper';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    if (typeof window !== 'undefined') {
      const adminAccessToken = localStorage.getItem('adminAccessToken');
      
      // Nếu chưa đăng nhập và không ở trang login, chuyển hướng đến trang login
      if (!adminAccessToken && !pathname.includes('/auth/login')) {
        router.push('/admin/auth/login');
      }
    }
  }, [pathname, router]);

  return (
    <html lang="en">
      <body>
        <ProviderRedux>
          <ConfigProvider
            locale={viVN}
            theme={{
              token: {
                colorPrimary: '#1677ff',
              },
            }}
            >
            <AdminLayoutWrapper>
            <main className="main-content">
              {children}
            </main>
        </AdminLayoutWrapper>
          </ConfigProvider>
        </ProviderRedux>
      </body>
    </html>
  );
} 
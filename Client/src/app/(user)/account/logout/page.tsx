'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/authActions';
import { Spin } from 'antd';

export default function LogoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // @ts-ignore
        await dispatch(logout());
        router.push('/');
      } catch (error) {
        console.error('Logout failed:', error);
        router.push('/');
      }
    };

    performLogout();
  }, [dispatch, router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '60vh'
    }}>
      <Spin size="large" tip="Logging out..." />
    </div>
  );
} 
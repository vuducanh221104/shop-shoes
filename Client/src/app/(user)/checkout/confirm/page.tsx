'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircleIcon, HomeIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/solid';
import { getOrderById, Order, OrderItem } from '@/services/api';
import styles from './page.module.scss';

export default function ConfirmPageOrder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const parseImageUrl = (imageUrl: string): string => {
    try {
      // If imageUrl is already a valid URL, return it directly
      if (imageUrl && imageUrl.startsWith('http')) {
        return imageUrl;
      }

      // Remove any brackets and quotes
      const cleanUrl = imageUrl.replace(/[\[\]"]/g, '');
      // Split by comma and get first URL if multiple
      const urls = cleanUrl.split(',');
      const firstUrl = urls[0]?.trim();
      
      // Return the URL if valid, otherwise return default
      return firstUrl && firstUrl.startsWith('http') 
        ? firstUrl 
        : '/placeholder-product.jpg';
    } catch (error) {
      console.error('Error parsing image URL:', error);
      return '/placeholder-product.jpg';
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getOrderById(orderId);
        setOrder(data);
        // Handle both array formats and process image URLs
        if ('$values' in data.items) {
          setOrderItems(data.items.$values.map(item => ({
            ...item,
            productImage: parseImageUrl(item.productImage)
          })));
        } else {
          setOrderItems(data.items.map(item => ({
            ...item,
            productImage: parseImageUrl(item.productImage)
          })));
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!order || !orderId) {
    return <div className={styles.error}>Order not found</div>;
  }

  return (
    <div className={styles.confirmPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <CheckCircleIcon className={styles.successIcon} />
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        <div className={styles.orderInfo}>
          <div className={styles.section}>
            <h2>Order Details</h2>
            <div className={styles.details}>
              <div className={styles.row}>
                <span>Order ID:</span>
                <span>#{order.id}</span>
              </div>
              <div className={styles.row}>
                <span>Order Date:</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className={styles.row}>
                <span>Status:</span>
                <span className={styles.status}>{order.status}</span>
              </div>
              <div className={styles.row}>
                <span>Payment Method:</span>
                <span>{order.paymentMethod}</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2>Shipping Information</h2>
            <div className={styles.details}>
              <div className={styles.row}>
                <span>Full Name:</span>
                <span>{order.fullName}</span>
              </div>
              <div className={styles.row}>
                <span>Email:</span>
                <span>{order.email}</span>
              </div>
              <div className={styles.row}>
                <span>Phone:</span>
                <span>{order.phone}</span>
              </div>
              <div className={styles.row}>
                <span>Address:</span>
                <span>{order.address}</span>
              </div>
              <div className={styles.row}>
                <span>City:</span>
                <span>{order.city}</span>
              </div>
              {order.note && (
                <div className={styles.row}>
                  <span>Note:</span>
                  <span>{order.note}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h2>Order Items</h2>
            <div className={styles.items}>
              {orderItems.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className={styles.item}>
                  <div className={styles.itemImage}>
                    <Image
                      src={item.productImage ? parseImageUrl(item.productImage) : '/placeholder-product.jpg'}
                      alt={item.productName}
                      width={80}
                      height={80}
                      unoptimized
                    />
                  </div>
                  <div className={styles.itemInfo}>
                    <h3>{item.productName}</h3>
                    <p>
                      Color: {item.color} | Size: EU {item.size}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <div className={styles.itemPrice}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.total}>
            <span>Total Amount:</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>

          <div className={styles.actions}>
            <button 
              className={`${styles.button} ${styles.secondary}`}
              onClick={() => router.push('/account/order')}
            >
              <ClipboardDocumentListIcon />
              View Orders
            </button>
            <button 
              className={`${styles.button} ${styles.primary}`}
              onClick={() => router.push('/')}
            >
              <HomeIcon />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { message, Modal } from 'antd';
import 'antd/dist/reset.css';
import styles from './page.module.scss';

interface OrderItem {
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
}

interface Order {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
  paymentMethod: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: {
    $values: OrderItem[];
  };
}

const ORDER_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  SHIPPING: 'Shipping',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: '#f5a623',     // Orange
  [ORDER_STATUS.CONFIRMED]: '#4a90e2',   // Blue
  [ORDER_STATUS.SHIPPING]: '#9013fe',    // Purple
  [ORDER_STATUS.DELIVERED]: '#7ed321',   // Green
  [ORDER_STATUS.CANCELLED]: '#d0021b'    // Red
};

export default function AccountOrderPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  
  // Hardcoded userId for now - in real app this would come from auth
  const userId = 1;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/user/${userId}`);
      if (response.data && response.data.$values) {
        setOrders(response.data.$values);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      const result = await Modal.confirm({
        title: 'Cancel Order',
        content: 'Are you sure you want to cancel this order? This action cannot be undone.',
        okText: 'Yes, cancel order',
        okButtonProps: { 
          danger: true,
          style: { backgroundColor: '#d0021b', borderColor: '#d0021b' }
        },
        cancelText: 'No, keep order',
      });

      if (result) {
        setCancellingOrderId(orderId);
        const response = await axios.patch(`http://localhost:5000/api/orders/${orderId}/cancel`);
        message.success('Order cancelled successfully');
        // Update the order status in the local state
        setOrders(orders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'Cancelled' }
            : order
        ));
      }
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      message.error(error.response?.data || 'Failed to cancel order');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getFilteredOrders = () => {
    if (activeTab === 'all') return orders;
    return orders.filter(order => order.status === activeTab);
  };

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

  return (
    <div className={styles.orderPage}>
      <div className={styles.container}>
        <h1>My Orders</h1>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Orders
          </button>
          {Object.values(ORDER_STATUS).map(status => (
            <button
              key={status}
              className={`${styles.tab} ${activeTab === status ? styles.active : ''}`}
              onClick={() => setActiveTab(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <div className={styles.orderList}>
          {getFilteredOrders().length === 0 ? (
            <div className={styles.noOrders}>
              No orders found
            </div>
          ) : (
            getFilteredOrders().map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <span className={styles.orderId}>Order #{order.id}</span>
                    <span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
                  </div>
                  <div className={styles.orderActions}>
                    {order.status === 'Pending' && (
                      <button
                        className={styles.cancelButton}
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingOrderId === order.id}
                      >
                        {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}
                  <div 
                    className={styles.orderStatus}
                    style={{ backgroundColor: ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS] }}
                  >
                    {order.status}
                    </div>
                  </div>
                </div>

                <div className={styles.orderItems}>
                  {order.items.$values.map((item, index) => (
                    <div key={`${order.id}-${index}`} className={styles.item}>
                      <div className={styles.itemImage}>
                        <Image
                          src={item.productImage || '/placeholder-product.jpg'}
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
                        <p className={styles.itemPrice}>
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.orderFooter}>
                  <div className={styles.shippingInfo}>
                    <h4>Shipping Information</h4>
                    <p>{order.fullName}</p>
                    <p>{order.phone}</p>
                    <p>{order.address}, {order.city}</p>
                    {order.note && <p>Note: {order.note}</p>}
                  </div>
                  <div className={styles.orderTotal}>
                    <span>Total Amount:</span>
                    <span className={styles.totalPrice}>
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { message } from 'antd';
import styles from './page.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  priceDiscount?: number;
  size: string;
  color: string;
}

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
  paymentMethod: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    note: '',
    paymentMethod: 'cod' // Default to Cash on Delivery
  });

  const parseProductImage = (imageString: string): string => {
    try {
      const cleanString = imageString.replace(/[\[\]"]/g, '');
      return cleanString;
    } catch (error) {
      console.error('Error parsing product image:', error);
      return '';
    }
  };

  const fetchCartItems = async () => {
    // If user is not authenticated, redirect to login
    if (!currentUser) {
      message.error('Please login to proceed to checkout');
      router.push('/account/login');
      return;
    }

    try {
      // Cast currentUser to get the correct ID field
      const user = currentUser as { Id?: number };
      const userId = user.Id || 1; // Fallback to ID 1 if not found

      const response = await axios.get(`http://localhost:5000/api/cart?userId=${userId}`);
      const items = response.data.$values || [];
      const parsedCartItems = items.map((item: CartItem) => ({
        ...item,
        productImage: parseProductImage(item.productImage)
      }));
      setCartItems(parsedCartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      message.error('Failed to load cart items');
      router.push('/cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateTotal = (): number => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.priceDiscount && item.priceDiscount !== 0 && item.priceDiscount !== item.price
        ? item.priceDiscount
        : item.price;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (submitting) return;

    // If user is not authenticated, redirect to login
    if (!currentUser) {
      message.error('Please login to proceed to checkout');
      router.push('/account/login');
      return;
    }

    // Cast currentUser to get the correct ID field
    const user = currentUser as { Id?: number };
    const userId = user.Id || 1; // Fallback to ID 1 if not found

    // Validate form
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
      message.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);

      // Create order
      const response = await axios.post('http://localhost:5000/api/orders', {
        ...shippingInfo,
        userId
      });

      message.success('Order placed successfully!');
      
      // Force navigation after a short delay to ensure the message is seen
      setTimeout(() => {
        router.push(`/checkout/confirm?id=${response.data.id}`);
      }, 500);
    } catch (error) {
      console.error('Error placing order:', error);
      message.error('Failed to place order');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (cartItems.length === 0) {
    router.push('/cart');
    return null;
  }

    return (
    <div className={styles.checkoutPage}>
      <div className={styles.container}>
            <h1>Checkout</h1>
        
        <div className={styles.content}>
          {/* Shipping Information Form */}
          <div className={styles.shippingForm}>
            <h2>Shipping Information</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="address">Shipping Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="paymentMethod">Payment Method *</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={shippingInfo.paymentMethod}
                  onChange={handleInputChange}
                  required
                  className={styles.select}
                >
                  <option value="cod">Cash on Delivery (COD)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="note">Order Notes (Optional)</label>
                <textarea
                  id="note"
                  name="note"
                  value={shippingInfo.note}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className={styles.orderSummary}>
            <h2>Order Summary</h2>
            <div className={styles.orderItems}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.orderItem}>
                  <div className={styles.itemImage}>
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      width={80}
                      height={80}
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
                    {item.priceDiscount && item.priceDiscount !== 0 && item.priceDiscount !== item.price ? (
                      <>
                        <span className={styles.originalPrice}>{formatPrice(item.price)}</span>
                        <span>{formatPrice(item.priceDiscount * item.quantity)}</span>
                      </>
                    ) : (
                      formatPrice(item.price * item.quantity)
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.summaryDetails}>
              <div className={styles.subtotal}>
                <span>Subtotal</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
              <div className={styles.shipping}>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className={styles.total}>
                <span>Total</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
            </div>

            <button 
              className={styles.placeOrderButton}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
        </div>
    );
}
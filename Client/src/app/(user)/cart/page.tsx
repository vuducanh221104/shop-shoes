'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { message } from 'antd';
import styles from './page.module.scss';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
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

interface CartResponse {
  $values: CartItem[];
}

export default function CartPage() {
  const router = useRouter();
  const { updateCartQuantity } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);
  const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);

  const parseProductImage = (imageString: string): string => {
    try {
      // Remove quotes and brackets from the string
      const cleanString = imageString.replace(/[\[\]"]/g, '');
      return cleanString;
    } catch (error) {
      console.error('Error parsing product image:', error);
      return ''; // Return empty string or a default image URL
    }
  };

  const fetchCartItems = async () => {
    // If user is not authenticated, redirect to login
    if (!currentUser) {
      router.push('/account/login');
      return;
    }

    try {
      // Cast currentUser to get the correct ID field
      const user = currentUser as { Id?: number };
      const userId = user.Id || 1; // Fallback to ID 1 if not found

      const response = await axios.get<CartResponse>(`http://localhost:5000/api/cart?userId=${userId}`);
      
      // Get the array from $values
      const items = response.data.$values || [];
      
      // Parse product images before setting to state
      const parsedCartItems = items.map(item => ({
        ...item,
        productImage: parseProductImage(item.productImage)
      }));
      
      setCartItems(parsedCartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError('Failed to load cart items');
      setCartItems([]); // Set empty array as fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    // If user is not authenticated, redirect to login
    if (!currentUser) {
      router.push('/account/login');
      return;
    }

    // Cast currentUser to get the correct ID field
    const user = currentUser as { Id?: number };
    const userId = user.Id || 1; // Fallback to ID 1 if not found

    try {
      await axios.put(`http://localhost:5000/api/cart/${itemId}/quantity?userId=${userId}`, {
        quantity: newQuantity
      });
      
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      await updateCartQuantity(); // Update cart quantity in header
    } catch (error) {
      console.error('Error updating quantity:', error);
      message.error('Failed to update quantity');
    }
  };

  const removeItem = async (itemId: number) => {
    // If user is not authenticated, redirect to login
    if (!currentUser) {
      router.push('/account/login');
      return;
    }

    // Cast currentUser to get the correct ID field
    const user = currentUser as { Id?: number };
    const userId = user.Id || 1; // Fallback to ID 1 if not found

    try {
      setRemovingItemId(itemId);
      await axios.delete(`http://localhost:5000/api/cart/${itemId}?userId=${userId}`);
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      await updateCartQuantity(); // Update cart quantity in header
      message.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      message.error('Failed to remove item');
    } finally {
      setRemovingItemId(null);
    }
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

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchCartItems} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return ( 
      <div className={styles.emptyCart}>
        <h2>Your cart is empty</h2>
        <Link href="/products" className={styles.continueShoppingLink}>
          Continue Shopping
        </Link>
        </div>
     );
}

  return (
    <div className={styles.cartPage}>
      <div className={styles.container}>
        <h1>Shopping Cart</h1>
        
        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <Link href={`/product/${item.productId}`} className={styles.productImage}>
                  {item.productImage && (
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      width={120}
                      height={120}
                      unoptimized
                    />
                  )}
                </Link>
                
                <div className={styles.productInfo}>
                  <Link href={`/product/${item.productId}`}>
                    <h3>{item.productName}</h3>
                  </Link>
                  <p className={styles.variant}>
                    Color: {item.color} | Size: EU {item.size}
                  </p>
                  <div className={styles.quantity}>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className={styles.priceActions}>
                  <span className={styles.price}>
                    {item.priceDiscount && item.priceDiscount !== 0 && item.priceDiscount !== item.price ? (
                      <>
                        <span className={styles.originalPrice}>{formatPrice(item.price)}</span>
                        <span>{formatPrice(item.priceDiscount)}</span>
                      </>
                    ) : (
                      formatPrice(item.price)
                    )}
                  </span>
                  <button 
                    className={styles.removeButton}
                    onClick={() => removeItem(item.id)}
                    disabled={removingItemId === item.id}
                  >
                    {removingItemId === item.id ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <h2>Summary</h2>
            <div className={styles.summaryDetails}>
              <div className={styles.subtotal}>
                <span>Subtotal</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
              <div className={styles.shipping}>
                <span>Estimated Delivery & Handling</span>
                <span>Free</span>
              </div>
              <div className={styles.total}>
                <span>Total</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
            </div>
            <button 
              className={styles.checkoutButton}
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              Checkout ({cartItems.length} items)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
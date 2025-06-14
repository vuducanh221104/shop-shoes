'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface CartContextType {
  cartQuantity: number;
  updateCartQuantity: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartQuantity, setCartQuantity] = useState(0);
  const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);

  const fetchCartQuantity = async () => {
    try {
      // If user is not authenticated, set cart quantity to 0
      if (!currentUser) {
        setCartQuantity(0);
        return;
      }

      // Cast currentUser to get the correct ID field
      const user = currentUser as { Id?: number };
      const userId = user.Id || 1; // Fallback to ID 1 if not found

      const response = await axios.get(`http://localhost:5000/api/cart?userId=${userId}`);
      if (response.data.$values) {
        setCartQuantity(response.data.$values.length);
      }
    } catch (error) {
      console.error('Error fetching cart quantity:', error);
    }
  };

  useEffect(() => {
    fetchCartQuantity();
  }, [currentUser]); // Re-fetch when user authentication changes

  const updateCartQuantity = async () => {
    await fetchCartQuantity();
  };

  return (
    <CartContext.Provider value={{ cartQuantity, updateCartQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MagnifyingGlassIcon, HeartIcon, ShoppingBagIcon, UserIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useCart } from '@/contexts/CartContext';
import SearchResults from '@/components/SearchResults';
import styles from './Header.module.scss';
import { useRouter } from 'next/navigation';

interface User {
  Id?: number;
  Username?: string;
  Email?: string;
  FullName?: string;
}

export default function Header() {
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.auth.login);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { cartQuantity } = useCart();

  // Close the user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSearchResults(value.length > 0);
  };

  const handleSearchFocus = () => {
    if (searchTerm.length > 0) {
      setShowSearchResults(true);
    }
  };

  const closeSearchResults = () => {
    setShowSearchResults(false);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowSearchResults(false);
    }
  };

  // Cast currentUser to User type
  const user = currentUser as User | null;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <Image 
            src="/image/icon/nike.png" 
            alt="Nike" 
            width={90} 
            height={64} 
            priority
          />
        </Link>

        {/* Main Navigation */}
        <nav className={styles.mainNav}>
          <Link href="/category/men">Men</Link>
          <Link href="/category/women">Women</Link>
          <Link href="/category/kids">Kids</Link>
          <Link href="/category/sale">All</Link>
        </nav>

        {/* Right Section */}
        <div className={styles.rightSection}>
          {/* Search Bar */}
          <div className={styles.searchBar} ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
              <button 
                type="submit" 
                className={styles.searchIconButton}
                aria-label="Search"
              >
            <MagnifyingGlassIcon className={styles.searchIcon} />
              </button>
            <input 
              type="text" 
              placeholder="Search" 
              className={styles.searchInput}
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
              />
            </form>
            {showSearchResults && (
              <SearchResults 
                searchTerm={searchTerm} 
                onClose={closeSearchResults} 
            />
            )}
          </div>

          {/* Icons */}
          <div className={styles.icons}>
            <button className={styles.iconButton}>
              <HeartIcon className={styles.icon} />
            </button>
            <Link href="/cart" className={styles.iconButton}>
              <div className={styles.cartIcon}>
              <ShoppingBagIcon className={styles.icon} />
                {cartQuantity > 0 && (
                  <span className={styles.cartBadge}>{cartQuantity}</span>
                )}
              </div>
            </Link>
            
            {/* User Icon - changes based on login status */}
            <div className={styles.userIconContainer} ref={userMenuRef}>
              <button 
                className={`${styles.iconButton} ${user ? styles.loggedInIcon : ''}`} 
                onClick={toggleUserMenu}
              >
                {user ? (
                  <UserCircleIcon className={styles.icon} />
                ) : (
                  <UserIcon className={styles.icon} />
                )}
              </button>
              
              {/* User dropdown menu */}
              {showUserMenu && (
                <div className={styles.userMenu}>
                  {user ? (
                    <>
                      <div className={styles.userInfo}>
                        <p className={styles.userName}>Hi, {user.Username || user.Email?.split('@')[0] || 'User'}</p>
                        <p className={styles.userEmail}>{user.Email || ''}</p>
                      </div>
                      <Link href="/account/profile" className={styles.menuItem}>My Profile</Link>
                      <Link href="/account/order" className={styles.menuItem}>My Orders</Link>
                      <Link href="/account/order" className={styles.menuItem}>Wishlist</Link>
                      <Link href="/account/logout" className={styles.menuItem}>Logout</Link>
                    </>
                  ) : (
                    <>
                      <Link href="/account/login" className={styles.menuItem}>Login</Link>
                      <Link href="/account/register" className={styles.menuItem}>Register</Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 
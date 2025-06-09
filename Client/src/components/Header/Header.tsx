'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MagnifyingGlassIcon, HeartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <Image 
            src="/nike-logo.svg" 
            alt="Nike" 
            width={60} 
            height={24} 
            priority
          />
        </Link>

        {/* Main Navigation */}
        <nav className={styles.mainNav}>
          <Link href="/new">New & Featured</Link>
          <Link href="/men">Men</Link>
          <Link href="/women">Women</Link>
          <Link href="/kids">Kids</Link>
          <Link href="/sale">Sale</Link>
        </nav>

        {/* Right Section */}
        <div className={styles.rightSection}>
          {/* Search Bar */}
          <div className={styles.searchBar}>
            <MagnifyingGlassIcon className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search" 
              className={styles.searchInput}
            />
          </div>

          {/* Icons */}
          <div className={styles.icons}>
            <button className={styles.iconButton}>
              <HeartIcon className={styles.icon} />
            </button>
            <button className={styles.iconButton}>
              <ShoppingBagIcon className={styles.icon} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 
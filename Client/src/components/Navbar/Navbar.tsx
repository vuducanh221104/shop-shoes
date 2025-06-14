import React from 'react';
import Link from 'next/link';
import styles from './Navbar.module.scss';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          ShoeStore
        </Link>
        
        <div className={styles.navLinks}>
          <Link href="/products" className={styles.navLink}>
            All Products
          </Link>
          <Link href="/products/men" className={styles.navLink}>
            Men
          </Link>
          <Link href="/products/women" className={styles.navLink}>
            Women
          </Link>
          <Link href="/products/children" className={styles.navLink}>
            Children
          </Link>
        </div>
        
        <div className={styles.navIcons}>
          <button className={styles.searchButton}>
            <span className={styles.iconSearch}>🔍</span>
          </button>
          <Link href="/cart" className={styles.cartButton}>
            <span className={styles.iconCart}>🛒</span>
            <span className={styles.cartCount}>0</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
import React from 'react';
import Link from 'next/link';
import ProductHomeList from '@/components/ProductHomeList/ProductHomeList';
import styles from './page.module.scss';

export default function Home() {
  return (
    <div className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.content}>
          <h1>Welcome to Shoe Store</h1>
          <p>Find the perfect footwear for every occasion</p>
          <div className={styles.buttons}>
            <Link href="/category/all" className={styles.primaryButton}>
              Shop All
            </Link>
            <div className={styles.categoryButtons}>
              <Link href="/category/men" className={styles.categoryButton}>Men</Link>
              <Link href="/category/women" className={styles.categoryButton}>Women</Link>
              <Link href="/category/children" className={styles.categoryButton}>Children</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <ProductHomeList
          title="Men's Collection"
          categorySlug="men"
          viewAllText="View All Men's Products"
        />

        <ProductHomeList
          title="Women's Collection"
          categorySlug="women"
          viewAllText="View All Women's Products"
        />

        <ProductHomeList
          title="Children's Collection"
          categorySlug="children"
          viewAllText="View All Children's Products"
        />
      </div>

      <section className={`${styles.categories} container`}>
        <h2 className="section-title">Shop by Category</h2>
        <div className={styles.categoryGrid}>
          <Link href="/category/men" className={styles.categoryCard}>
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff" alt="Men's Shoes" />
            <div className={styles.categoryContent}>
              <h3>Men</h3>
              <p>Shop Now</p>
            </div>
          </Link>
          
          <Link href="/category/women" className={styles.categoryCard}>
            <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2" alt="Women's Shoes" />
            <div className={styles.categoryContent}>
              <h3>Women</h3>
              <p>Shop Now</p>
            </div>
          </Link>
          
          <Link href="/category/children" className={styles.categoryCard}>
            <img src="https://images.unsplash.com/photo-1560769629-975ec94e6a86" alt="Children's Shoes" />
            <div className={styles.categoryContent}>
              <h3>Children</h3>
              <p>Shop Now</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

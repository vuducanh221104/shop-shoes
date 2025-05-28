"use client";
import { Suspense } from 'react';
import styles from './page.module.scss';
import ProductList from '../components/ProductList';
import HeroSection from '../components/HeroSection';

export default function Home() {
  return (
    <main className={styles.main}>
      <HeroSection />
      
      <section className={styles.featuredSection} id="featured">
        <div className="container">
          <h2 className={styles.sectionTitle}>Featured Products</h2>
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductList 
              slugCategory="men" 
              title="Men's Collection" 
              description="Explore our latest men's shoes for every occasion"
              linkViewAll="/category/men"
            />
          </Suspense>
        </div>
      </section>
      
      <section className={styles.newArrivalsSection} id="new-arrivals">
        <div className="container">
          <h2 className={styles.sectionTitle}>New Arrivals</h2>
          <p className={styles.sectionDescription}>
            Check out our latest shoe collections and stay ahead of the trend
          </p>
          <Suspense fallback={<div>Loading new arrivals...</div>}>
            <ProductList 
              slugCategory="women" 
              title="Women Collection" 
              description="Casual athletic shoes designed for comfort and style"
              linkViewAll="/category/sneaker"
            />
          </Suspense>
        </div>
      </section>
      
      <section className={styles.collectionsSection} id="collections">
        <div className="container">
          <h2 className={styles.sectionTitle}>Collections</h2>
          <div className={styles.collectionsGrid}>
            <div className={styles.collectionCard}>
              <div className={styles.collectionImage} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542291026-7eec264c27ff)' }}></div>
              <div className={styles.collectionInfo}>
                <h3>Running</h3>
                <p>Performance shoes for every runner</p>
              </div>
            </div>
            <div className={styles.collectionCard}>
              <div className={styles.collectionImage} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb)' }}></div>
              <div className={styles.collectionInfo}>
                <h3>Casual</h3>
                <p>Everyday comfort with style</p>
              </div>
            </div>
            <div className={styles.collectionCard}>
              <div className={styles.collectionImage} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a)' }}></div>
              <div className={styles.collectionInfo}>
                <h3>Sport</h3>
                <p>Designed for peak performance</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

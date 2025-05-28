import Link from 'next/link';
import styles from './HeroSection.module.scss';

const HeroSection = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroOverlay}></div>
      <div className="container">
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Step Into Style</h1>
          <p className={styles.heroSubtitle}>
            Discover the perfect pair for every occasion
          </p>
          <div className={styles.heroActions}>
            <Link href="/#featured" className={`btn btn-primary ${styles.heroBtn}`}>
              Shop Now
            </Link>
            <Link href="/#collections" className={`btn btn-outline ${styles.heroBtn}`}>
              View Collections
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 
import Link from 'next/link';
import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>ShoeShop</h3>
            <p className={styles.footerText}>
              The best place to find premium quality shoes for all occasions.
              We offer a wide range of styles, sizes, and brands.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className={styles.socialLink}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className={styles.socialLink}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
            </div>
          </div>
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>Shop</h3>
            <ul className={styles.footerLinks}>
              <li><Link href="/#new-arrivals" className={styles.footerLink}>New Arrivals</Link></li>
              <li><Link href="/#featured" className={styles.footerLink}>Featured</Link></li>
              <li><Link href="/#collections" className={styles.footerLink}>Collections</Link></li>
              <li><Link href="/#sale" className={styles.footerLink}>Sale</Link></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>Support</h3>
            <ul className={styles.footerLinks}>
              <li><Link href="/faq" className={styles.footerLink}>FAQ</Link></li>
              <li><Link href="/shipping" className={styles.footerLink}>Shipping</Link></li>
              <li><Link href="/returns" className={styles.footerLink}>Returns</Link></li>
              <li><Link href="/contact" className={styles.footerLink}>Contact Us</Link></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>Contact</h3>
            <address className={styles.contactInfo}>
              <p>123 Shoe Street</p>
              <p>Fashion District, City</p>
              <p>Country, 12345</p>
              <p className={styles.contactEmail}>info@shoeshop.com</p>
              <p className={styles.contactPhone}>+1 (123) 456-7890</p>
            </address>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} ShoeShop. All rights reserved.
          </p>
          <div className={styles.footerBottomLinks}>
            <Link href="/privacy" className={styles.footerBottomLink}>Privacy Policy</Link>
            <Link href="/terms" className={styles.footerBottomLink}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.columns}>
          {/* Resources Column */}
          <div className={styles.column}>
            <h3>RESOURCES</h3>
            <ul>
              <li><Link href="/store-locator">Find A Store</Link></li>
              <li><Link href="/membership">Become A Member</Link></li>
              <li><Link href="/shoe-finder">Running Shoe Finder</Link></li>
              <li><Link href="/feedback">Send Us Feedback</Link></li>
            </ul>
          </div>

          {/* Help Column */}
          <div className={styles.column}>
            <h3>HELP</h3>
            <ul>
              <li><Link href="/help">Get Help</Link></li>
              <li><Link href="/order-status">Order Status</Link></li>
              <li><Link href="/delivery">Delivery</Link></li>
              <li><Link href="/returns">Returns</Link></li>
              <li><Link href="/payment-options">Payment Options</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className={styles.column}>
            <h3>COMPANY</h3>
            <ul>
              <li><Link href="/about">About Nike</Link></li>
              <li><Link href="/news">News</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/investors">Investors</Link></li>
              <li><Link href="/sustainability">Sustainability</Link></li>
              <li><Link href="/impact">Impact</Link></li>
              <li><Link href="/report-concern">Report a Concern</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className={styles.bottom}>
        <div className={styles.container}>
          <div className={styles.bottomContent}>
            {/* Location */}
            <div className={styles.location}>
              <Link href="/location" className={styles.locationLink}>
                <span className={styles.globe}>🌍</span>
                Vietnam
              </Link>
            </div>

            {/* Copyright */}
            <div className={styles.copyright}>
              © 2025 Nike, Inc. All rights reserved
            </div>

            {/* Legal Links */}
            <div className={styles.legal}>
              <Link href="/guides">Guides</Link>
              <Link href="/terms-of-sale">Terms of Sale</Link>
              <Link href="/terms">Terms of Use</Link>
              <Link href="/privacy">Nike Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 
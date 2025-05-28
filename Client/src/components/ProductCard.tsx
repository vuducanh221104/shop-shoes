import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductCard.module.scss';

interface Price {
  original: number;
  discount: number;
  quantityDiscount: number;
}

interface Variant {
  color: string;
  sizes: number[];
  images: string[];
}

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: Price;
  variants: Variant[];
}

const ProductCard = ({ id, name, brand, price, variants }: ProductCardProps) => {
  // Get the first image from the first variant
  const image = variants[0]?.images[0] || '';
  
  // Calculate discount percentage
  const discountPercentage = price.original > 0 
    ? Math.round(((price.original - price.discount) / price.original) * 100) 
    : 0;
  
  // Format price to display as currency
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className={styles.productCard}>
      <Link href={`/product/${id}`} className={styles.productLink}>
        <div className={styles.imageContainer}>
          {discountPercentage > 0 && (
            <span className={styles.discountBadge}>-{discountPercentage}%</span>
          )}
          <Image 
            src={image} 
            alt={name}
            width={300}
            height={300}
            className={styles.productImage}
          />
          <div className={styles.overlay}>
            <button className={styles.quickView}>Quick View</button>
          </div>
        </div>
        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{name}</h3>
          <p className={styles.productBrand}>{brand}</p>
          <div className={styles.productPrice}>
            {price.original !== price.discount && (
              <span className={styles.originalPrice}>{formatPrice(price.original)}</span>
            )}
            <span className={styles.price}>{formatPrice(price.discount)}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard; 
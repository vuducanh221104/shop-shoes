import { getProductBySlug } from '@/services/api';
import ProductDetail from './ProductDetail';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug);
  
  return <ProductDetail product={product} />;
}
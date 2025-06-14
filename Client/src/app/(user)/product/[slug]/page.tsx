import { getProductBySlug } from '@/services/api';
import ProductDetail from './ProductDetail';




export default async function ProductPage({ params }: any) {
  const product = await getProductBySlug(params.slug);
  
  return <ProductDetail product={product} />;
}
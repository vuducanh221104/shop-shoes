import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Product types
export interface SizeInfo {
  size: string;
  stock: number;
}

export interface Variant {
  id: number;
  color: string;
  sizes: {
    $id: string;
    $values: SizeInfo[];
  };
  images: {
    $id: string;
    $values: string[];
  };
  sizesJson: string;
  imagesString: string;
  totalStock: number;
  productId: number;
}

export interface PriceDetails {
  original: number;
  discount: number;
  quantityDiscount: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  colors: number;
  isBestSeller?: boolean;
  isSustainable?: boolean;
}

export interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// API functions
export const getProducts = async (params: {
  category?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<ProductsResponse> => {
  const { data } = await api.get('/products', { params });
  return data;
};

export const getProductById = async (id: number | string): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getProductsByCategory = async (
  category: string,
  params: {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    minPrice?: number;
    maxPrice?: number;
  }
): Promise<ProductsResponse> => {
  const { data } = await api.get(`/products/category/${category}`, { params });
  return data;
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
  const response = await api.get(`/products/slug/${slug}`);
  return response.data;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/categories');
  return response.data;
};

export default api; 
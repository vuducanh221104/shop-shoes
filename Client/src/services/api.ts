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
  sizes: SizeInfo[];
  images: string[];
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
  description?: string;
  brand?: string;
  price: number;
  priceDiscount: number;
  stock: number;
  categoryId: number;
  category: Category;
  slug: string;
  variants?: {
    $id: string;
    $values: Variant[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: {
    $id: string;
    $values: Product[];
  };
  pagination: {
    currentPage: number;
  pageSize: number;
    totalItems: number;
  totalPages: number;
  };
}

// Order types
export interface OrderItem {
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
}

export interface Order {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
  paymentMethod: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: {
    $values: OrderItem[];
  } | OrderItem[];
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

export const getOrderById = async (id: number | string): Promise<Order> => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export default api; 
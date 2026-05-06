import { apiClient } from '../api/apiClient';

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  type: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  targetAmount: number;
  raisedAmount: number;
  unit: string;
  targetCount: number;
  raisedCount: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category: string;
  stockQuantity: number;
  donationCount?: number;
  unit?: string;
}

export const productService = {
  getCategories: async (): Promise<Category[]> => {
    return apiClient.get<Category[]>('/api/categories/active');
  },

  getCampaigns: async (): Promise<Campaign[]> => {
    return apiClient.get<Campaign[]>('/api/campaigns/active');
  },

  getProducts: async (): Promise<Product[]> => {
    return apiClient.get<Product[]>('/api/products');
  },

  getPopularProducts: async (limit: number = 6): Promise<Product[]> => {
    return apiClient.get<Product[]>(`/api/products/donation/popular?limit=${limit}`);
  },

  getProductsByCategory: async (categoryName: string): Promise<Product[]> => {
    return apiClient.get<Product[]>(`/api/products/category/${encodeURIComponent(categoryName)}`);
  },
};


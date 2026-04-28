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
    return [
      { id: '1', name: 'Gıda', type: 'people', imageUrl: '🍎' },
      { id: '2', name: 'Giyim', type: 'people', imageUrl: '👕' },
      { id: '3', name: 'Hijyen', type: 'people', imageUrl: '✨' },
      { id: '4', name: 'Çocuk', type: 'people', imageUrl: '🧸' },
      { id: '5', name: 'Hayvan', type: 'animal', imageUrl: '🐾' },
    ];
  },

  getCampaigns: async (): Promise<Campaign[]> => {
    return [
      {
        id: 'c1',
        title: 'Sokak Hayvanları İçin Mama',
        description: 'Kış aylarında sokaktaki dostlarımızı unutmayalım.',
        targetAmount: 5000,
        raisedAmount: 3200,
        unit: 'Paket',
        targetCount: 100,
        raisedCount: 64,
        isActive: true
      },
      {
        id: 'c2',
        title: 'Eğitime Destek Paketi',
        description: 'İhtiyaç sahibi öğrencilere kırtasiye desteği.',
        targetAmount: 10000,
        raisedAmount: 4500,
        unit: 'Set',
        targetCount: 200,
        raisedCount: 90,
        isActive: true
      }
    ];
  },

  getProducts: async (): Promise<Product[]> => {
    return [
      { id: 'p1', name: 'Kadın Şişme Mont', price: 899, category: 'Giyim', stockQuantity: 50, imageUrl: '🧥' },
      { id: 'p2', name: 'Çaykur Rize Turist Çay', price: 85, category: 'Gıda', stockQuantity: 200, imageUrl: '☕' },
      { id: 'p3', name: 'Köpek Maması 15kg', price: 450, category: 'Hayvan', stockQuantity: 30, imageUrl: '🐶' },
      { id: 'p4', name: 'Okul Sırt Çantası', price: 350, category: 'Çocuk', stockQuantity: 150, imageUrl: '🎒' },
      { id: 'p5', name: 'Sıvı Sabun 5L', price: 120, category: 'Hijyen', stockQuantity: 80, imageUrl: '🧼' },
    ];
  },

  getPopularProducts: async (limit: number = 6): Promise<Product[]> => {
    const products = await productService.getProducts();
    return products.slice(0, limit);
  },

  getProductsByCategory: async (categoryName: string): Promise<Product[]> => {
    const products = await productService.getProducts();
    return products.filter(p => p.category === categoryName);
  },
};

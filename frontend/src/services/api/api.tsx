import { apiClient } from './apiClient';
import {
  CampaignResponse,
  CampaignCreateRequest,
  CategoryResponse,
  CategoryCreateRequest,
  CategoryType,
  ProductResponse,
  ProductCreateRequest,
  ProductUpdateRequest,
  ProductFilterRequest,
  PageResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserResponse,
} from './types';

// Auth Endpoints
export const authApi = {
  login: (data: LoginRequest) => 
    apiClient.post<LoginResponse>('/auth/login', data),
    
  register: (data: RegisterRequest) => 
    apiClient.post<RegisterResponse>('/auth/register', data),
    
  getCurrentUser: () => 
    apiClient.get<UserResponse>('/api/users/me'),
    
  updateProfile: (data: Partial<UserResponse>) => 
    apiClient.put<UserResponse>('/api/users/me', data),
    
  logout: (refreshToken: string) => 
    apiClient.post('/auth/logout', { refreshToken }),
};

// Campaign Endpoints
export const campaignApi = {
  getAll: () => 
    apiClient.get<CampaignResponse[]>('/api/campaigns'),
    
  getActive: () => 
    apiClient.get<CampaignResponse[]>('/api/campaigns/active'),
    
  getOngoing: () => 
    apiClient.get<CampaignResponse[]>('/api/campaigns/ongoing'),
    
  getById: (id: string) => 
    apiClient.get<CampaignResponse>(`/api/campaigns/${id}`),
    
  create: (data: CampaignCreateRequest) => 
    apiClient.post<CampaignResponse>('/api/campaigns', data),
    
  update: (id: string, data: CampaignCreateRequest) => 
    apiClient.put<CampaignResponse>(`/api/campaigns/${id}`, data),
    
  delete: (id: string) => 
    apiClient.delete(`/api/campaigns/${id}`),
};

// Category Endpoints
export const categoryApi = {
  getAll: () => 
    apiClient.get<CategoryResponse[]>('/api/categories'),
    
  getActive: () => 
    apiClient.get<CategoryResponse[]>('/api/categories/active'),
    
  getByType: (type: CategoryType) => 
    apiClient.get<CategoryResponse[]>(`/api/categories/type/${type}`),
    
  getById: (id: string) => 
    apiClient.get<CategoryResponse>(`/api/categories/${id}`),
    
  getByName: (name: string) => 
    apiClient.get<CategoryResponse>(`/api/categories/name/${name}`),
    
  create: (data: CategoryCreateRequest) => 
    apiClient.post<CategoryResponse>('/api/categories', data),
    
  update: (id: string, data: CategoryCreateRequest) => 
    apiClient.put<CategoryResponse>(`/api/categories/${id}`, data),
    
  delete: (id: string) => 
    apiClient.delete(`/api/categories/${id}`),
};

// Product Endpoints
export const productApi = {
  getAll: () => 
    apiClient.get<ProductResponse[]>('/api/products'),
    
  getFiltered: (params: ProductFilterRequest) => 
    apiClient.get<PageResponse<ProductResponse>>('/api/products/filter', { params }),
    
  getDonationProducts: () => 
    apiClient.get<ProductResponse[]>('/api/products/donation'),
    
  getPopularDonationProducts: (limit: number = 6) => 
    apiClient.get<ProductResponse[]>('/api/products/donation/popular', { params: { limit } }),
    
  getFlashSales: () => 
    apiClient.get<ProductResponse[]>('/api/products/flash-sales'),
    
  getNearbyProducts: (lat: number, lng: number, radiusKm: number = 5.0) => 
    apiClient.get<ProductResponse[]>('/api/products/nearby', { params: { lat, lng, radiusKm } }),
    
  getByCategory: (category: string) => 
    apiClient.get<ProductResponse[]>(`/api/products/category/${category}`),
    
  getById: (id: string) => 
    apiClient.get<ProductResponse>(`/api/products/${id}`),
    
  create: (data: ProductCreateRequest) => 
    apiClient.post<ProductResponse>('/api/products', data),
    
  update: (id: string, data: ProductUpdateRequest) => 
    apiClient.put<ProductResponse>(`/api/products/${id}`, data),
    
  delete: (id: string) => 
    apiClient.delete(`/api/products/${id}`),
};

// Order Endpoints
export const orderApi = {
  create: (data: any) => 
    apiClient.post('/api/orders', data),
    
  getMyOrders: (status?: string) => 
    apiClient.get<any[]>('/api/orders/my-orders', { params: { status } }),
    
  getById: (id: string) => 
    apiClient.get<any>(`/api/orders/${id}`),
};

// User Endpoints
export const userApi = {
  me: () => 
    apiClient.get<UserResponse>('/api/users/me'),
    
  update: (data: Partial<UserResponse>) => 
    apiClient.put<UserResponse>('/api/users/me', data),
    
  getAddresses: () => 
    apiClient.get<any[]>('/api/users/me/addresses'),
    
  addAddress: (data: any) => 
    apiClient.post<any>('/api/users/me/addresses', data),
    
  updateAddress: (id: string, data: any) => 
    apiClient.put<any>(`/api/users/me/addresses/${id}`, data),
    
  deleteAddress: (id: string) => 
    apiClient.delete(`/api/users/me/addresses/${id}`),
    
  setDefaultAddress: (id: string) => 
    apiClient.patch<any>(`/api/users/me/addresses/${id}/default`, {}),

  getCards: () => 
    apiClient.get<any[]>('/api/users/me/cards'),
    
  addCard: (data: any) => 
    apiClient.post<any>('/api/users/me/cards', data),
    
  deleteCard: (id: string) => 
    apiClient.delete(`/api/users/me/cards/${id}`),
};

// Cart Endpoints
export const cartApi = {
  get: () => 
    apiClient.get<any[]>('/api/cart'),
    
  update: (data: { productId: string, quantity: number, type: string }) => 
    apiClient.post<any>('/api/cart', data),
    
  remove: (productId: string, type: string) => 
    apiClient.delete(`/api/cart/${productId}?type=${type}`),
    
  clear: () => 
    apiClient.delete('/api/cart/clear'),
};

// Favorite Endpoints
export const favoriteApi = {
  getProducts: () => 
    apiClient.get<any>('/api/favorites/products'),
    
  toggle: (productId: string) => 
    apiClient.post<any>(`/api/favorites/products/${productId}`),
};

// Default export containing all APIs
const api = {
  auth: authApi,
  campaigns: campaignApi,
  categories: categoryApi,
  products: productApi,
  orders: orderApi,
  user: userApi,
  cart: cartApi,
  favorites: favoriteApi,
};

export default api;

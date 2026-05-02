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
    apiClient.get<UserResponse>('/users/me'),
    
  updateProfile: (data: Partial<UserResponse>) => 
    apiClient.put<UserResponse>('/users/me', data),
    
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


// Default export containing all APIs
const api = {
  auth: authApi,
  campaigns: campaignApi,
  categories: categoryApi,
  products: productApi,
};

export default api;

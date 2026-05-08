import { apiClient } from '../api/apiClient';
import { 
  ProductResponse, 
  ProductCreateRequest, 
  ProductUpdateRequest, 
  ApiResponse, 
  PageResponse, 
  ProductFilterRequest,
  CategoryResponse,
  CampaignResponse
} from '../api/types';

export const productService = {
  getProducts: async (): Promise<ProductResponse[]> => {
    return apiClient.get<ProductResponse[]>('/api/products');
  },

  getProductsWithFilters: async (filters: ProductFilterRequest): Promise<PageResponse<ProductResponse>> => {
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.isDonationProduct !== undefined) queryParams.append('isDonationProduct', String(filters.isDonationProduct));
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.minPrice) queryParams.append('minPrice', String(filters.minPrice));
    if (filters.maxPrice) queryParams.append('maxPrice', String(filters.maxPrice));
    if (filters.page !== undefined) queryParams.append('page', String(filters.page));
    if (filters.size !== undefined) queryParams.append('size', String(filters.size));
    
    return apiClient.get<PageResponse<ProductResponse>>(`/api/products/filter?${queryParams.toString()}`);
  },

  getProductById: async (id: string): Promise<ProductResponse> => {
    return apiClient.get<ProductResponse>(`/api/products/${id}`);
  },

  getPopularProducts: async (limit: number = 6): Promise<ProductResponse[]> => {
    return apiClient.get<ProductResponse[]>(`/api/products/donation/popular?limit=${limit}`);
  },

  getProductsByCategory: async (categoryName: string): Promise<ProductResponse[]> => {
    return apiClient.get<ProductResponse[]>(`/api/products/category/${encodeURIComponent(categoryName)}`);
  },

  // Admin CRUD operations
  createProduct: async (product: ProductCreateRequest): Promise<ProductResponse> => {
    return apiClient.post<ProductResponse>('/api/products', product);
  },

  updateProduct: async (id: string, product: ProductUpdateRequest): Promise<ProductResponse> => {
    return apiClient.put<ProductResponse>(`/api/products/${id}`, product);
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete<void>(`/api/products/${id}`);
  },

  // Categories
  getCategories: async (): Promise<CategoryResponse[]> => {
    return apiClient.get<CategoryResponse[]>('/api/categories/active');
  },

  getAllCategories: async (): Promise<CategoryResponse[]> => {
    return apiClient.get<CategoryResponse[]>('/api/categories');
  },

  createCategory: async (category: any): Promise<CategoryResponse> => {
    return apiClient.post<CategoryResponse>('/api/categories', category);
  },

  updateCategory: async (id: string, category: any): Promise<CategoryResponse> => {
    return apiClient.put<CategoryResponse>(`/api/categories/${id}`, category);
  },

  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete<void>(`/api/categories/${id}`);
  },

  // Campaigns
  getCampaigns: async (): Promise<CampaignResponse[]> => {
    return apiClient.get<CampaignResponse[]>('/api/campaigns/active');
  },

  getAllCampaigns: async (): Promise<CampaignResponse[]> => {
    return apiClient.get<CampaignResponse[]>('/api/campaigns');
  }
};

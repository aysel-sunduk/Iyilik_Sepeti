// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
  timestamp: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  loginTime: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface RegisterResponse {
  userId: string;
  email: string;
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface LogoutResponse {
  message: string;
  logoutTime: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl?: string;
  birthDate?: string;
  gender?: string;
  phoneVerified: boolean;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface UserResponse extends User {}

// Error Types
export interface ApiError {
  message: string;
  errorCode: string;
  statusCode: number;
  timestamp: string;
}

// Campaign Types
export interface CampaignResponse {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetAmount: number;
  raisedAmount: number;
  unit: string;
  targetCount: number;
  raisedCount: number;
  isActive: boolean;
  progressPercentage: number;
  createdAt: string;
}

export interface CampaignCreateRequest {
  title: string;
  description: string;
  imageUrl?: string;
  targetAmount?: number;
  raisedAmount?: number;
  unit?: string;
  targetCount?: number;
  raisedCount?: number;
}

// Category Types
export type CategoryType = 'SHOPPING' | 'DONATION' | 'BOTH';

export interface CategoryResponse {
  id: string;
  name: string;
  nameSlug: string;
  description: string;
  imageUrl: string;
  type: CategoryType;
  createdAt: string;
  isActive: boolean;
}

export interface CategoryCreateRequest {
  name: string;
  nameSlug?: string;
  description?: string;
  imageUrl?: string;
  type: CategoryType;
}

// Product Types
export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  donationCount: number;
  campaign?: CampaignResponse;
  unit: string;
  isDonationProduct: boolean;
  createdAt: string;
  isActive: boolean;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string;
  stockQuantity?: number;
  donationCount?: number;
  campaignId?: string;
  unit?: string;
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {}

export interface ProductFilterRequest {
  category?: string;
  isDonationProduct?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minDonationCount?: number;
  inStock?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}
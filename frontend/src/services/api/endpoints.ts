import { apiClient } from './apiClient';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  LogoutResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UserResponse,
} from './types';

class AuthEndpoints {
  private readonly basePath = '/auth';

  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>(`${this.basePath}/login`, data);
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>(`${this.basePath}/register`, data);
  }

  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return apiClient.post<RefreshTokenResponse>(`${this.basePath}/refresh`, data);
  }

  async logout(data: LogoutRequest): Promise<LogoutResponse> {
    return apiClient.post<LogoutResponse>(`${this.basePath}/logout`, data);
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    return apiClient.post<void>(`${this.basePath}/change-password`, data);
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    return apiClient.post<void>(`${this.basePath}/forgot-password`, data);
  }

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    return apiClient.post<void>(`${this.basePath}/reset-password`, data);
  }

  async getCurrentUser(): Promise<UserResponse> {
    return apiClient.get<UserResponse>('/users/me');
  }

  async updateProfile(data: Partial<UserResponse>): Promise<UserResponse> {
    return apiClient.put<UserResponse>('/users/me', data);
  }
}

export const authEndpoints = new AuthEndpoints();
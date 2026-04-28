import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api/apiClient';
import { authEndpoints } from '../api/endpoints';
import {
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    LoginResponse,
    LogoutResponse,
    RefreshTokenResponse,
    RegisterRequest,
    RegisterResponse,
    ResetPasswordRequest,
    UserResponse,
} from '../api/types';

class AuthService {
  
  // ✅ GERÇEK LOGIN - Backend'e bağlanır
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await authEndpoints.login(credentials);
      
      // Token'ları kaydet
      await apiClient.saveTokens(response.accessToken, response.refreshToken);
      
      // Kullanıcı bilgilerini kaydet
      await AsyncStorage.setItem('user', JSON.stringify({
        id: response.userId,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role,
      }));
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // ✅ GERÇEK REGISTER - Backend'e bağlanır
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await authEndpoints.register(userData);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<LogoutResponse> {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        const response = await authEndpoints.logout({ refreshToken });
        await apiClient.logout();
        return response;
      }
      throw new Error('No refresh token found');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await authEndpoints.refreshToken({ refreshToken });
      await apiClient.saveTokens(response.accessToken, response.refreshToken);
      return response;
    } catch (error) {
      console.error('Token refresh error:', error);
      await this.forceLogout();
      throw error;
    }
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    try {
      await authEndpoints.changePassword(data);
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    try {
      await authEndpoints.forgotPassword(data);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    try {
      await authEndpoints.resetPassword(data);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<UserResponse | null> {
    try {
      const user = await authEndpoints.getCurrentUser();
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      return !!token;
    } catch (error) {
      return false;
    }
  }

  async getUserFromStorage(): Promise<any | null> {
    try {
      const userStr = await AsyncStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }

  private async forceLogout(): Promise<void> {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
  }
}

export const authService = new AuthService();
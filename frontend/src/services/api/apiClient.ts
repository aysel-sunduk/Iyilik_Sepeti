import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { ApiError, ApiResponse, RefreshTokenResponse } from './types';
import { Alert } from 'react-native';
import { store } from '../../redux/store';
import { logout as logoutAction } from '../../redux/slices/authSlice';

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;
  private isRefreshing: boolean = false;
  private refreshSubscribers: ((token: string) => void)[] = [];
  private isAlertShown: boolean = false;

  constructor() {
    this.baseURL = __DEV__
      ? 'http://10.0.2.2:8080'  // Android Emulator için
      : 'https://your-production-api.com';

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await this.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: any) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
          originalRequest._retry = true;
          return this.handleRefreshToken(originalRequest);
        }

        if (error.response?.status === 401) {
          await this.logout();
          this.triggerSessionExpired();
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  private triggerSessionExpired(): void {
    if (this.isAlertShown) return;
    this.isAlertShown = true;
    Alert.alert(
      'Oturum Süresi Doldu',
      'Oturum süreniz doldu, lütfen tekrar giriş yapın.',
      [
        { 
          text: 'Tamam', 
          onPress: () => {
            this.isAlertShown = false;
          } 
        }
      ]
    );
    store.dispatch(logoutAction());
  }

  private async handleRefreshToken(originalRequest: AxiosRequestConfig): Promise<any> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) {
        await this.logout();
        this.triggerSessionExpired();
        return Promise.reject(new Error('No refresh token available'));
      }

      if (!this.isRefreshing) {
        this.isRefreshing = true;

        const response = await this.client.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh', {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        await this.saveTokens(accessToken, newRefreshToken);
        this.onRefreshSuccess(accessToken);
        this.isRefreshing = false;
      }

      return new Promise((resolve, reject) => {
        this.refreshSubscribers.push((token: string) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          resolve(this.client(originalRequest));
        });
      });
    } catch (error) {
      this.isRefreshing = false;
      await this.logout();
      this.triggerSessionExpired();
      return Promise.reject(error);
    }
  }

  private onRefreshSuccess(token: string): void {
    this.refreshSubscribers.forEach(callback => callback(token));
    this.refreshSubscribers = [];
  }

  private async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('accessToken');
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  private async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('refreshToken');
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  public async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  }

  public async logout(): Promise<void> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (refreshToken) {
        try {
          await this.client.post('/auth/logout', { refreshToken });
        } catch (e) {
          console.log('Logout API failed, but will clean up local storage');
        }
      }
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    } catch (error) {
      // Sessizce geç
    }
  }

  private normalizeError(error: AxiosError): ApiError {
    if (error.response?.data) {
      const data = error.response.data as any;
      return {
        message: data.message || 'An error occurred',
        errorCode: data.errorCode || 'UNKNOWN_ERROR',
        statusCode: error.response.status,
        timestamp: data.timestamp || new Date().toISOString(),
      };
    }

    return {
      message: error.message || 'Network error',
      errorCode: 'NETWORK_ERROR',
      statusCode: 0,
      timestamp: new Date().toISOString(),
    };
  }

  public async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.client.request<any>(config);
    const data = response.data;
    
    // Eğer backend veriyi ApiResponse (success, message, data) içine sarmaladıysa
    if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
      return data.data;
    }
    
    // Eğer backend direkt DTO'yu döndüyse (raw object)
    return data;
  }

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  public put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  public patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }
}

export const apiClient = new ApiClient();
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth/authService';
import { LoginRequest, RegisterRequest, UserResponse } from '../services/api/types';
import { useDispatch } from 'react-redux';
import { fetchCart } from '../redux/slices/cartSlice';
import { AppDispatch } from '../redux/store';

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const authenticated = await authService.isAuthenticated();
      if (authenticated) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          dispatch(fetchCart());
        } else {
          await authService.logout();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
      // Hata durumunda (geçersiz token vb.) oturumu temizle
      await authService.logout().catch(() => {}); 
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      await authService.login(credentials);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      dispatch(fetchCart());
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    try {
      await authService.register(userData);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword({ email });
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true);
    try {
      await authService.resetPassword({ token, newPassword });
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        changePassword,
        forgotPassword,
        resetPassword,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
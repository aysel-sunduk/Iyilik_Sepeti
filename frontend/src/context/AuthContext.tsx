import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth/authService';
import { LoginRequest, RegisterRequest, UserResponse } from '../services/api/types';
import { useDispatch } from 'react-redux';
import { fetchCart } from '../redux/slices/cartSlice';
import { AppDispatch } from '../redux/store';
import { loginSuccess, updateUser, logout as logoutRedux } from '../redux/slices/authSlice';
import { Alert } from 'react-native';

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest | string, password?: string) => Promise<boolean>;
  register: (userData: RegisterRequest | string, lastName?: string, email?: string, password?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
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
        const storedUser = await authService.getUserFromStorage();
        const userData = await authService.getCurrentUser();
        if (userData) {
          const finalRole = userData.role || storedUser?.role || 'USER';
          const updatedUser = { ...userData, role: finalRole };
          setUser(updatedUser);
          setIsAuthenticated(true);
          dispatch(updateUser({
            id: updatedUser.id || '',
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            role: finalRole,
            iyilikBalance: updatedUser.iyilikBalance,
            walletBalance: updatedUser.walletBalance,
          }));
          dispatch(fetchCart());
        } else {
          await authService.logout();
          setUser(null);
          setIsAuthenticated(false);
          dispatch(logoutRedux());
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
      // Hata durumunda (geçersiz token vb.) oturumu temizle
      await authService.logout().catch(() => {}); 
      setUser(null);
      setIsAuthenticated(false);
      dispatch(logoutRedux());
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest | string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    let loginData: LoginRequest;
    if (typeof credentials === 'string') {
      loginData = { email: credentials, password: password || '' };
    } else {
      loginData = credentials;
    }

    try {
      const loginResponse = await authService.login(loginData);
      const userData = await authService.getCurrentUser();
      if (userData) {
        const finalRole = userData.role || loginResponse.role || 'USER';
        const updatedUser = { ...userData, role: finalRole };
        setUser(updatedUser);
        setIsAuthenticated(true);
        dispatch(loginSuccess({
          id: updatedUser.id || '',
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          role: finalRole,
          iyilikBalance: updatedUser.iyilikBalance,
          walletBalance: updatedUser.walletBalance,
        }));
        dispatch(fetchCart());
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    userData: RegisterRequest | string,
    lastName?: string,
    email?: string,
    password?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    let registerData: RegisterRequest;
    if (typeof userData === 'string') {
      registerData = {
        firstName: userData,
        lastName: lastName || '',
        email: email || '',
        password: password || '',
        phone: '',
      };
    } else {
      registerData = userData;
    }

    try {
      await authService.register(registerData);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      dispatch(logoutRedux());
      setIsLoading(false);
    }
    return true;
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
      const currentRole = user?.role || (await authService.getUserFromStorage())?.role;
      const userData = await authService.getCurrentUser();
      if (userData) {
        const finalRole = userData.role || currentRole || 'USER';
        const updatedUser = { ...userData, role: finalRole };
        setUser(updatedUser);
        dispatch(updateUser({
          id: updatedUser.id || '',
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          role: finalRole,
          iyilikBalance: updatedUser.iyilikBalance,
          walletBalance: updatedUser.walletBalance,
        }));
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      setUser(null);
      setIsAuthenticated(false);
      dispatch(logoutRedux());
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
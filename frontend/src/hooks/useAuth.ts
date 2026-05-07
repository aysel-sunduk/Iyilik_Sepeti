import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import {
  loginFailure,
  loginStart,
  loginSuccess,
  logout as logoutAction,
  registerFailure,
  registerStart,
  registerSuccess,
} from '../redux/slices/authSlice';
import { authService } from '../services/auth/authService';

export const useAuth = () => {
  const dispatch = useDispatch();

  // ✅ GERÇEK REGISTER - Backend'e kaydeder
  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    dispatch(registerStart());

    try {
      const response = await authService.register({
        firstName,
        lastName,
        email,
        password,
        phone: '', // Backend'iniz phone istiyor, boş veya dummy gönderebilirsiniz
      });
      
      dispatch(registerSuccess({ 
        id: response.userId, 
        email: response.email,
        firstName,
        lastName 
      }));
      
      Alert.alert('Başarılı', response.message || 'Kayıt başarılı! Giriş yapabilirsiniz.');
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Kayıt sırasında bir hata oluştu';
      dispatch(registerFailure(errorMessage));
      Alert.alert('Kayıt Hatası', errorMessage);
      return false;
    }
  };

  // ✅ GERÇEK LOGIN - Backend'e giriş yapar
  const login = async (email: string, password: string) => {
    dispatch(loginStart());

    try {
      const response = await authService.login({ email, password });
      
      dispatch(loginSuccess({ 
        id: response.userId,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        //role: response.role
      }));
      
      // Alert.alert('Başarılı', 'Hoş geldin kahraman 🦸'); // Removed intrusive alert
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'E-posta veya şifre hatalı';
      dispatch(loginFailure(errorMessage));
      Alert.alert('Giriş Hatası', errorMessage);
      return false;
    }
  };

  // ✅ GERÇEK LOGOUT
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error: any) {
      console.warn('Backend logout failed, but clearing local state:', error.message);
    } finally {
      dispatch(logoutAction());
    }
    return true;
  };

  // Biometric login (mock olarak kalabilir veya gerçek biometric ile değiştirilebilir)
  const biometricLogin = async () => {
    try {
      // Burada biometric doğrulama yapılacak
      Alert.alert('Biyometrik', 'Parmak izi / yüz tanıma başarılı (mock)');
      
      // Biometric başarılı olursa, refresh token ile oturum açılabilir
      const refreshToken = await authService.refreshToken();
      dispatch(loginSuccess({ 
        id: 'bio', 
        email: 'bio@heyva.com',
        firstName: 'Bio',
        lastName: 'User',
        //role: 'USER'
      }));
      return true;
    } catch (error) {
      Alert.alert('Hata', 'Biyometrik doğrulama başarısız');
      return false;
    }
  };

  return { 
    register, 
    login, 
    logout,
    biometricLogin,
  };
};
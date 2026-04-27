import { useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import {
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
} from '../redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    dispatch(registerStart());

    if (!firstName || !lastName || !email.includes('@') || password.length < 8) {
      const error = 'Geçersiz bilgiler';
      dispatch(registerFailure(error));
      Alert.alert('Hata', error);
      return false;
    }

    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1800));
    const user = { id: '123', firstName, lastName, email };
    dispatch(registerSuccess(user));
    Alert.alert('Başarılı', 'Topluluğa hoş geldin! 🌿');
    return true;
  };

  const login = async (email: string, password: string) => {
    dispatch(loginStart());

    if (!email.includes('@') || !password) {
      const error = 'E-posta veya şifre hatalı';
      dispatch(loginFailure(error));
      Alert.alert('Hata', error);
      return false;
    }

    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1600));
    const user = { id: '123', email };
    dispatch(loginSuccess(user));
    Alert.alert('Başarılı', 'Hoş geldin kahraman 🦸');
    return true;
  };

  const biometricLogin = () => {
    Alert.alert('Biyometrik', 'Parmak izi / yüz tanıma başarılı (mock)');
    dispatch(loginSuccess({ id: 'bio', email: 'bio@heyva.com' }));
  };

  return { register, login, biometricLogin };
};
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { loginStyles } from '../../styles';
import FloatingLabelInput from '../../components/form/FloatingLabelInput';
import PasswordInput from '../../components/form/PasswordInput';

export default function LoginScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { login, biometricLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const orbit1 = useRef(new Animated.Value(0)).current;
  const orbit2 = useRef(new Animated.Value(0)).current;
  const orbit3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(Animated.timing(orbit1, { toValue: 1, duration: 8000, useNativeDriver: true })).start();
    Animated.loop(Animated.timing(orbit2, { toValue: 1, duration: 11000, useNativeDriver: true })).start();
    Animated.loop(Animated.timing(orbit3, { toValue: 1, duration: 14000, useNativeDriver: true })).start();
  }, []);

  const spin1 = orbit1.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const spin2 = orbit2.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const spin3 = orbit3.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const clearFieldError = (fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Geçerli e-posta girin';
    if (!password) newErrors.password = 'Şifre gereklidir';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) navigation.replace('App');
  };

  const handleBiometric = () => {
    biometricLogin();
    setTimeout(() => navigation.replace('App'), 500);
  };

  return (
    <View style={[loginStyles.container, { backgroundColor: theme.bg }]}>
      <View style={[loginStyles.illo, { backgroundColor: theme.accentXl }]}>
        <Animated.View style={[loginStyles.orbit, { transform: [{ rotate: spin1 }], marginLeft: -90, marginTop: -20 }]}>
          <View style={[loginStyles.orbitPill, { backgroundColor: theme.surface }]}>
            <View style={[loginStyles.orbitDot, { backgroundColor: theme.accent }]} />
            <Text style={[loginStyles.orbitText, { color: theme.text2 }]}>3.8K bağış</Text>
          </View>
        </Animated.View>

        <Animated.View style={[loginStyles.orbit, { transform: [{ rotate: spin2 }], marginLeft: -115, marginTop: -20 }]}>
          <View style={[loginStyles.orbitPill, { backgroundColor: theme.surface }]}>
            <View style={[loginStyles.orbitDot, { backgroundColor: theme.indigo }]} />
            <Text style={[loginStyles.orbitText, { color: theme.text2 }]}>68 barınak</Text>
          </View>
        </Animated.View>

        <Animated.View style={[loginStyles.orbit, { transform: [{ rotate: spin3 }], marginLeft: -100, marginTop: -20 }]}>
          <View style={[loginStyles.orbitPill, { backgroundColor: theme.surface }]}>
            <View style={[loginStyles.orbitDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={[loginStyles.orbitText, { color: theme.text2 }]}>420 aile</Text>
          </View>
        </Animated.View>

        <View style={loginStyles.centerCircle}>
          <View style={[loginStyles.mainCircle, { backgroundColor: theme.accent }]}>
            <Text style={loginStyles.mainIcon}>🌿</Text>
          </View>
        </View>
      </View>

      <ScrollView style={[loginStyles.sheet, { backgroundColor: theme.surface }]} showsVerticalScrollIndicator={false}>
        <View style={[loginStyles.sheetHandle, { backgroundColor: theme.border }]} />

        <View style={loginStyles.greeting}>
          <Text style={[loginStyles.eye, { color: theme.accent }]}>✨ Seni tekrar görmek harika!</Text>
          <Text style={[loginStyles.title, { color: theme.text1 }]}>Hoş geldin{'\n'}kahraman 🦸</Text>
          <Text style={[loginStyles.sub, { color: theme.text3 }]}>
            Sepetindeki <Text style={{ color: theme.accent, fontWeight: '600' }}>iyilikler</Text> seni bekliyor.
          </Text>
        </View>

        <FloatingLabelInput
          label="E-posta"
          icon="✉️"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            clearFieldError('email');
          }}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <PasswordInput
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            clearFieldError('password');
          }}
          error={errors.password}
        />

        <TouchableOpacity style={loginStyles.forgotButton}>
          <Text style={[loginStyles.forgotText, { color: theme.accent }]}>Şifremi Unuttum</Text>
        </TouchableOpacity>

        <View style={loginStyles.actionRow}>
          <TouchableOpacity
            style={[loginStyles.loginButton, { backgroundColor: theme.accent }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={loginStyles.loginButtonText}>{loading ? 'Giriş yapılıyor...' : 'Giriş Yap →'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[loginStyles.bioButton, { borderColor: theme.border, backgroundColor: theme.surface }]}
            onPress={handleBiometric}
          >
            <Text style={loginStyles.bioIcon}>🫆</Text>
          </TouchableOpacity>
        </View>

        <View style={loginStyles.divider}>
          <View style={[loginStyles.dividerLine, { backgroundColor: theme.border }]} />
          <Text style={[loginStyles.dividerText, { color: theme.text4 }]}>veya şununla devam et</Text>
          <View style={[loginStyles.dividerLine, { backgroundColor: theme.border }]} />
        </View>

        <View style={loginStyles.socialRow}>
          <TouchableOpacity style={[loginStyles.socialButton, { borderColor: theme.border, backgroundColor: theme.surface }]}>
            <Text style={loginStyles.socialIcon}>G</Text>
            <Text style={[loginStyles.socialText, { color: theme.text2 }]}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[loginStyles.socialButton, { borderColor: theme.border, backgroundColor: theme.surface }]}>
            <Text style={loginStyles.socialIcon}>🍎</Text>
            <Text style={[loginStyles.socialText, { color: theme.text2 }]}>Apple</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={[loginStyles.signupLink, { color: theme.text3 }]}>
            Hesabın yok mu? <Text style={{ color: theme.accent, fontWeight: '600' }}>Kayıt Ol</Text>
          </Text>
        </TouchableOpacity>

        <View style={[loginStyles.proofBar, { backgroundColor: theme.accentXl }]}>
          <View style={loginStyles.avatars}>
            <View style={[loginStyles.avatar, { backgroundColor: theme.accentLight }]}><Text>😊</Text></View>
            <View style={[loginStyles.avatar, { backgroundColor: theme.accentLight }]}><Text>🙂</Text></View>
            <View style={[loginStyles.avatar, { backgroundColor: theme.accentLight }]}><Text>😄</Text></View>
            <View style={[loginStyles.avatar, { backgroundColor: theme.indigoLight }]}><Text>+</Text></View>
          </View>
          <Text style={[loginStyles.proofText, { color: theme.text2 }]}>
            Bugün <Text style={{ fontWeight: '700', color: theme.accentDark }}>1.240 kullanıcı</Text> bağış yaparak alışverişini tamamladı.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
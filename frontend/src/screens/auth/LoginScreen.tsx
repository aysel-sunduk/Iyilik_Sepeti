import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from 'react-native';
import FloatingLabelInput from '../../components/form/FloatingLabelInput';
import PasswordInput from '../../components/form/PasswordInput';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Animations
  const logoScale = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(60)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(cardSlide, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

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
    try {
      await login(email, password);
    } catch (error: any) {
      setErrors({ general: error.message || 'Giriş başarısız' });
    } finally {
      setLoading(false);
    }
  };

  const bgColor = theme.isDark ? '#0F172A' : '#10B981';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Background decoration */}
      <View style={styles.bgPattern}>
        <View style={[styles.decoCircle, { top: -40, right: -40, width: 200, height: 200, backgroundColor: 'rgba(255,255,255,0.07)' }]} />
        <View style={[styles.decoCircle, { top: 120, left: -60, width: 150, height: 150, backgroundColor: 'rgba(255,255,255,0.05)' }]} />
        <View style={[styles.decoCircle, { bottom: 100, right: -30, width: 100, height: 100, backgroundColor: 'rgba(255,255,255,0.04)' }]} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo & Brand */}
          <Animated.View style={[styles.brandSection, { transform: [{ scale: logoScale }] }]}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/app_logo.png')}
                style={styles.logo}
              />
            </View>
            <Text style={styles.brandName}>İyilik Sepeti</Text>
            <Text style={styles.brandTagline}>alışveriş yap • iyilik paylaş</Text>
          </Animated.View>

          {/* Form Card */}
          <Animated.View
            style={[
              styles.card,
              {
                backgroundColor: theme.surface,
                transform: [{ translateY: cardSlide }],
                opacity: cardOpacity,
              },
            ]}
          >
            <Text style={[styles.cardTitle, { color: theme.text1 }]}>Tekrar Hoş Geldiniz 👋</Text>

            <View style={styles.formFields}>
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
            </View>

            {errors.general && (
              <Text style={styles.errorText}>{errors.general}</Text>
            )}

            <TouchableOpacity style={styles.forgotButton}>
              <Text style={[styles.forgotText, { color: theme.accent }]}>Şifremi Unuttum</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.accent }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap →'}
              </Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              <Text style={[styles.dividerText, { color: theme.text4 }]}>veya</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            </View>

            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: theme.accent }]}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.7}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.accent }]}>
                Yeni Hesap Oluştur
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Social proof */}
          <View style={styles.proofSection}>
            <Text style={styles.proofText}>
              🛒 12.500+ kullanıcı güveniyor  •  💚 3.800+ bağış tamamlandı
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgPattern: {
    ...StyleSheet.absoluteFillObject,
  },
  decoCircle: {
    position: 'absolute',
    borderRadius: 999,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    overflow: 'hidden',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
    letterSpacing: 1,
    textTransform: 'lowercase',
  },
  card: {
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 26,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 18,
  },
  formFields: {
    gap: 2,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  forgotButton: {
    alignItems: 'flex-end',
    marginTop: 4,
    marginBottom: 16,
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '600',
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '500',
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontWeight: '700',
    fontSize: 15,
  },
  proofSection: {
    marginTop: 24,
    alignItems: 'center',
  },
  proofText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 18,
  },
});
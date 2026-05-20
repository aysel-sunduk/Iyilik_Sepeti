import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import FloatingLabelInput from '../../components/form/FloatingLabelInput';
import PasswordInput from '../../components/form/PasswordInput';

const { width } = Dimensions.get('window');

export default function RegisterScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Animations
  const logoScale = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(80)).current;
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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!firstName) newErrors.firstName = 'Ad gereklidir';
    if (!lastName) newErrors.lastName = 'Soyad gereklidir';
    if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Geçerli e-posta girin';
    if (!password || password.length < 8) newErrors.password = 'En az 8 karakter gerekli';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    const success = await register(firstName, lastName, email, password);
    setLoading(false);
  };

  const bgColor = theme.isDark ? '#0F172A' : '#059669';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Background decoration */}
      <View style={styles.bgPattern}>
        <View style={[styles.decoCircle, { top: -60, left: -60, width: 220, height: 220, backgroundColor: 'rgba(255,255,255,0.06)' }]} />
        <View style={[styles.decoCircle, { top: 80, right: -50, width: 160, height: 160, backgroundColor: 'rgba(255,255,255,0.05)' }]} />
        <View style={[styles.decoCircle, { bottom: 60, left: -20, width: 110, height: 110, backgroundColor: 'rgba(255,255,255,0.04)' }]} />
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
            <Text style={styles.brandTagline}>Aramıza hoş geldiniz!</Text>
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
            <Text style={[styles.cardTitle, { color: theme.text1 }]}>Hesap Oluştur ✨</Text>

            <View style={styles.nameRow}>
              <View style={{ flex: 1 }}>
                <FloatingLabelInput
                  label="Ad"
                  icon="👤"
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    clearFieldError('firstName');
                  }}
                  error={errors.firstName}
                />
              </View>
              <View style={{ flex: 1 }}>
                <FloatingLabelInput
                  label="Soyad"
                  icon="👤"
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    clearFieldError('lastName');
                  }}
                  error={errors.lastName}
                />
              </View>
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

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.accent }]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Kaydediliyor...' : 'Kayıt Ol →'}
              </Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              <Text style={[styles.dividerText, { color: theme.text4 }]}>veya</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            </View>

            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: theme.accent }]}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.accent }]}>
                Zaten Hesabım Var
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Feature highlights */}
          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🛒</Text>
              <Text style={styles.featureText}>Alışveriş</Text>
            </View>
            <View style={[styles.featureDot, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💚</Text>
              <Text style={styles.featureText}>Bağış</Text>
            </View>
            <View style={[styles.featureDot, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📦</Text>
              <Text style={styles.featureText}>Kargo Takibi</Text>
            </View>
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
    paddingTop: 50,
    paddingBottom: 30,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 22,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  brandName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  card: {
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 22,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
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
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 12,
  },
  featureItem: {
    alignItems: 'center',
    gap: 3,
  },
  featureIcon: {
    fontSize: 18,
  },
  featureText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '600',
  },
  featureDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
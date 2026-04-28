import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { setTreeProgress } from '../../redux/slices/authSlice';
import { registerStyles } from '../../styles';
import { RootState } from '../../redux/store';
import TreeProgress from '../../components/common/TreeProgress';
import ModeToggle from '../../components/common/ModeToggle';
import FloatingLabelInput from '../../components/form/FloatingLabelInput';
import PasswordInput from '../../components/form/PasswordInput';

export default function RegisterScreen({ navigation }: any) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { register } = useAuth();
  const treeProgress = useSelector((state: RootState) => state.auth.treeProgress);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateTree = () => {
    const filled = [firstName, lastName, email, password.length >= 8].filter(Boolean).length;
    dispatch(setTreeProgress((filled / 4) * 100));
  };

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
    if (success) {
      // navigation.replace('App'); // Redux state change handles this
    }
  };

  return (
    <View style={[registerStyles.container, { backgroundColor: theme.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={registerStyles.scrollContent}>
        <View style={registerStyles.heroSection}>
          <View style={[registerStyles.heroBadge, { backgroundColor: theme.accentLight }]}>
            <Text style={[registerStyles.heroBadgeText, { color: theme.accentDark }]}>
              🌍 İyilik topluluğuna katıl
            </Text>
          </View>
          <Text style={[registerStyles.heroTitle, { color: theme.text1 }]}>
            Küçük bir alışveriş,{' '}
            <Text style={[registerStyles.heroTitleAccent, { color: theme.accent }]}>büyük bir değişim.</Text>
          </Text>
          <Text style={[registerStyles.heroSub, { color: theme.text3 }]}>
            Heyva'da her ürün hem sana hem de ihtiyaç sahiplerine ulaşabilir.
          </Text>

          <TreeProgress progress={treeProgress} />
        </View>

        <ModeToggle />

        <View style={registerStyles.formContainer}>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <View style={{ flex: 1 }}>
              <FloatingLabelInput
                label="Ad"
                icon="👤"
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  clearFieldError('firstName');
                  updateTree();
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
                  updateTree();
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
              updateTree();
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
              updateTree();
            }}
            error={errors.password}
            onEndEditing={updateTree}
          />

          <View style={registerStyles.ctaWrapper}>
            <TouchableOpacity
              style={[registerStyles.ctaButton, { backgroundColor: theme.accent }]}
              onPress={handleRegister}
              disabled={loading}
            >
              <View style={registerStyles.ctaButtonInner}>
                <Text style={registerStyles.ctaButtonText}>
                  {loading ? 'Kaydediliyor...' : 'Topluluğa Katıl'}
                </Text>
                <Text style={registerStyles.ctaButtonText}>🌿</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={registerStyles.divider}>
            <View style={[registerStyles.dividerLine, { backgroundColor: theme.border }]} />
            <Text style={[registerStyles.dividerText, { color: theme.text4 }]}>veya sosyal hesapla</Text>
            <View style={[registerStyles.dividerLine, { backgroundColor: theme.border }]} />
          </View>

          <View style={registerStyles.socialRow}>
            <TouchableOpacity style={[registerStyles.socialButton, { borderColor: theme.border, backgroundColor: theme.surface }]}>
              <Text style={registerStyles.socialIcon}>G</Text>
              <Text style={[registerStyles.socialText, { color: theme.text2 }]}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[registerStyles.socialButton, { borderColor: theme.border, backgroundColor: theme.surface }]}>
              <Text style={registerStyles.socialIcon}>🍎</Text>
              <Text style={[registerStyles.socialText, { color: theme.text2 }]}>Apple</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[registerStyles.signinLink, { color: theme.text3 }]}>
              Zaten hesabın var mı?{' '}
              <Text style={[registerStyles.signinLinkText, { color: theme.accent }]}>Giriş Yap</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
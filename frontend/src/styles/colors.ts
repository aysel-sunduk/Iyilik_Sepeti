export const lightColors = {
  accent: '#10B981',
  accentDark: '#059669',
  accentLight: '#D1FAE5',
  accentXl: '#ECFDF5',
  bg: '#F9FAFB',
  surface: '#FFFFFF',
  text1: '#111827',
  text2: '#374151',
  text3: '#6B7280',
  text4: '#9CA3AF',
  border: 'rgba(0,0,0,0.08)',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  indigo: '#4F46E5',
  indigoDark: '#3730A3',
  indigoLight: '#EEF2FF',
};

export const darkColors = {
  accent: '#10B981',
  accentDark: '#059669',
  accentLight: '#064E3B',
  accentXl: '#064E3B',
  bg: '#0F172A', // Derin lacivert
  surface: '#1E293B',
  text1: '#F8FAFC',
  text2: '#E2E8F0',
  text3: '#94A3B8',
  text4: '#64748B',
  border: 'rgba(255,255,255,0.1)',
  error: '#F87171',
  success: '#34D399',
  warning: '#FBBF24',
  indigo: '#818CF8',
  indigoDark: '#4F46E5',
  indigoLight: '#312E81',
};

export const getTheme = (isDark: boolean = false) => {
  const colors = isDark ? darkColors : lightColors;
  return {
    ...colors,
    isDark,
  };
};
export const lightColors = {
  green: {
    accent: '#10B981',
    accentDark: '#059669',
    accentLight: '#D1FAE5',
    accentXl: '#ECFDF5',
    indigo: '#4F46E5',
    indigoDark: '#3730A3',
    indigoLight: '#EEF2FF',
  },
  trend: {
    accent: '#4F46E5',
    accentDark: '#3730A3',
    accentLight: '#EEF2FF',
    accentXl: '#F5F3FF',
    indigo: '#4F46E5',
    indigoDark: '#3730A3',
    indigoLight: '#EEF2FF',
  },
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
  indigo: '#4F46E5',      // ← EKLE
  indigoDark: '#3730A3',  // ← EKLE
  indigoLight: '#EEF2FF', // ← EKLE
};

export const getTheme = (mode: 'green' | 'trend' = 'green') => ({
  ...lightColors,
  accent: lightColors[mode]?.accent || lightColors.green.accent,
  accentDark: lightColors[mode]?.accentDark || lightColors.green.accentDark,
  accentLight: lightColors[mode]?.accentLight || lightColors.green.accentLight,
  accentXl: lightColors[mode]?.accentXl || lightColors.green.accentXl,
  indigo: lightColors[mode]?.indigo || lightColors.green.indigo,
  indigoDark: lightColors[mode]?.indigoDark || lightColors.green.indigoDark,
  indigoLight: lightColors[mode]?.indigoLight || lightColors.green.indigoLight,
});
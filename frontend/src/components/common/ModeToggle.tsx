import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { modeToggleStyles } from '../../styles';
import { setMode } from '../../redux/slices/authSlice';
import { RootState } from '../../redux/store';

export default function ModeToggle() {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const currentMode = useSelector((state: RootState) => state.auth.mode);

  return (
    <View style={modeToggleStyles.container}>
      <Text style={[modeToggleStyles.question, { color: theme.text3 }]}>Neye odaklanmak istersin?</Text>
      <View style={modeToggleStyles.row}>
        <TouchableOpacity
          style={[
            modeToggleStyles.card,
            {
              borderColor: currentMode === 'trend' ? theme.accent : theme.border,
              backgroundColor: theme.surface,
            },
          ]}
          onPress={() => dispatch(setMode('trend'))}
        >
          <Text style={modeToggleStyles.icon}>🔥</Text>
          <Text style={[modeToggleStyles.title, { color: theme.text1 }]}>Trendleri Yakala</Text>
          <Text style={[modeToggleStyles.sub, { color: theme.text4 }]}>Popüler ürünler</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            modeToggleStyles.card,
            {
              borderColor: currentMode === 'green' ? theme.accent : theme.border,
              backgroundColor: theme.surface,
            },
          ]}
          onPress={() => dispatch(setMode('green'))}
        >
          <Text style={modeToggleStyles.icon}>🌍</Text>
          <Text style={[modeToggleStyles.title, { color: theme.text1 }]}>Dünyayı İyileştir</Text>
          <Text style={[modeToggleStyles.sub, { color: theme.text4 }]}>Her alışverişte bağış</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
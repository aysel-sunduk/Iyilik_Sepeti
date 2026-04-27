import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { passwordInputStyles } from '../../styles';

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  onEndEditing?: () => void;
}

export default function PasswordInput({ value, onChangeText, error, onEndEditing }: PasswordInputProps) {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const showError = error && !focused;

  return (
    <View style={passwordInputStyles.container}>
      <Text
        style={[
          passwordInputStyles.label,
          { color: focused || value ? theme.accent : theme.text4 },
        ]}
      >
        Şifre
      </Text>
      <View
        style={[
          passwordInputStyles.inner,
          { borderBottomColor: showError ? theme.error : theme.border },
        ]}
      >
        <Text style={passwordInputStyles.icon}>🔑</Text>
        <TextInput
          style={[passwordInputStyles.input, { color: theme.text1 }]}
          secureTextEntry={!showPassword}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="En az 8 karakter"
          placeholderTextColor={theme.text4}
          onEndEditing={onEndEditing}
        />
        <View
          style={[
            passwordInputStyles.shield,
            {
              backgroundColor: theme.accentLight,
              opacity: focused ? 1 : 0,
              transform: [{ scale: focused ? 1 : 0.7 }],
            },
          ]}
        >
          <Text style={passwordInputStyles.shieldIcon}>🛡️</Text>
        </View>
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={passwordInputStyles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
        </TouchableOpacity>
      </View>
      {showError && <Text style={[passwordInputStyles.errorText, { color: theme.error }]}>{error}</Text>}
    </View>
  );
}
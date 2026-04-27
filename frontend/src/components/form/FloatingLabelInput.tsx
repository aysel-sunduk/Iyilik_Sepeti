import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { floatingInputStyles } from '../../styles';

interface FloatingLabelInputProps extends TextInputProps {
  label: string;
  icon: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export default function FloatingLabelInput({
  label,
  icon,
  value,
  onChangeText,
  error,
  keyboardType,
  autoCapitalize,
  secureTextEntry,
  onEndEditing,
  ...rest
}: FloatingLabelInputProps) {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);
  const showError = error && !focused;

  return (
    <View style={floatingInputStyles.container}>
      <Text
        style={[
          floatingInputStyles.label,
          { color: focused || value ? theme.accent : theme.text4 },
        ]}
      >
        {label}
      </Text>
      <View
        style={[
          floatingInputStyles.inner,
          { borderBottomColor: showError ? theme.error : theme.border },
        ]}
      >
        <Text style={floatingInputStyles.icon}>{icon}</Text>
        <TextInput
          style={[floatingInputStyles.input, { color: theme.text1 }]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          placeholderTextColor={theme.text4}
          onEndEditing={onEndEditing}
          {...rest}
        />
      </View>
      {showError && <Text style={[floatingInputStyles.errorText, { color: theme.error }]}>{error}</Text>}
    </View>
  );
}
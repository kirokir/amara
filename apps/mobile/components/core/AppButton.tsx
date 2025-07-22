import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { ColorTheme } from '../../constants/ColorTheme';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}

export default function AppButton({ title, onPress, loading = false, variant = 'primary', style }: AppButtonProps) {
  const buttonStyle: ViewStyle[] = [styles.button, style || {}];
  const textStyle: TextStyle[] = [styles.buttonText];

  if (variant === 'secondary') {
    buttonStyle.push(styles.secondaryButton);
    textStyle.push(styles.secondaryButtonText);
  }

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={loading}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? ColorTheme.white : ColorTheme.violet} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50,
    backgroundColor: ColorTheme.violet,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: ColorTheme.white,
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: ColorTheme.violet,
  },
  secondaryButtonText: {
    color: ColorTheme.violet,
  },
});
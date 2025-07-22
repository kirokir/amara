import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { ColorTheme } from '../../constants/ColorTheme';

export default function AppTextInput(props: TextInputProps) {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor={ColorTheme.mediumText}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    backgroundColor: ColorTheme.offGray,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: ColorTheme.lightText,
    marginBottom: 15,
  },
});
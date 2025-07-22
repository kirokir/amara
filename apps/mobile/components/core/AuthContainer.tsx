import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { ColorTheme } from '../../constants/ColorTheme';

interface AuthContainerProps {
  children: React.ReactNode;
}

export default function AuthContainer({ children }: AuthContainerProps) {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>amara</Text>
        <Text style={styles.subtitle}>Your space for relationship wellness</Text>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorTheme.indigo,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontFamily: 'Inter_700Bold',
    color: ColorTheme.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: ColorTheme.cerulean,
    marginBottom: 40,
  },
});
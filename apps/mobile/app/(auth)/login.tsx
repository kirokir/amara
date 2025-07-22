import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Link } from 'expo-router';
import AuthContainer from '../../components/core/AuthContainer';
import AppTextInput from '../../components/core/AppTextInput';
import AppButton from '../../components/core/AppButton';
import { ColorTheme } from '../../constants/ColorTheme';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Toast.show({ type: 'error', text1: 'Login Error', text2: error.message });
    }
    // The RootLayout will handle redirection on successful login
    setLoading(false);
  };

  return (
    <AuthContainer>
      <AppTextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <AppTextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <AppButton title="Sign In" onPress={handleLogin} loading={loading} />
       <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Link href="/(auth)/signup" asChild>
            <Text style={styles.link}>Sign Up</Text>
        </Link>
      </View>
    </AuthContainer>
  );
}
// Using the same styles as SignUpScreen
const styles = StyleSheet.create({
    footer: { flexDirection: 'row', marginTop: 20 },
    footerText: { color: ColorTheme.offGray, fontFamily: 'Inter_400Regular' },
    link: { color: ColorTheme.cerulean, fontFamily: 'Inter_600SemiBold' }
});
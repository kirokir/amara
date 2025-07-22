import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Link, useRouter } from 'expo-router';
import AuthContainer from '../../components/core/AuthContainer';
import AppTextInput from '../../components/core/AppTextInput';
import AppButton from '../../components/core/AppButton';
import { ColorTheme } from '../../constants/ColorTheme';
import Toast from 'react-native-toast-message';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    if (!username.trim() || !email.trim() || !password) {
        Toast.show({ type: 'error', text1: 'All fields are required.' });
        return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.trim().toLowerCase(), // Pass username to the trigger
        },
      },
    });

    if (error) {
      Toast.show({ type: 'error', text1: 'Sign Up Error', text2: error.message });
    } else {
      Toast.show({ type: 'success', text1: 'Success!', text2: 'Please check your email for a verification link.' });
      router.replace('/(auth)/login');
    }
    setLoading(false);
  };

  return (
    <AuthContainer>
      <AppTextInput
        placeholder="Your Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <AppTextInput
        placeholder="Unique Username (3-20 characters)"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <AppTextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <AppButton title="Create Account" onPress={handleSignUp} loading={loading} />
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Link href="/(auth)/login" asChild>
            <Text style={styles.link}>Sign In</Text>
        </Link>
      </View>
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    footerText: {
        color: ColorTheme.offGray,
        fontFamily: 'Inter_400Regular',
    },
    link: {
        color: ColorTheme.cerulean,
        fontFamily: 'Inter_600SemiBold',
    }
});
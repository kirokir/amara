import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ColorTheme } from '../../constants/ColorTheme';
import AppButton from '../core/AppButton';

export default function NoPartnerCTA() {
  const router = useRouter();

  const handlePress = () => {
    router.push('/(settings)/partner');
  };

  return (
    <View style={styles.container}>
      <Ionicons name="people-outline" size={80} color={ColorTheme.indigo} />
      <Text style={styles.title}>Welcome to Amara</Text>
      <Text style={styles.subtitle}>Your shared space for growth.</Text>
      <Text style={styles.info}>To begin, connect with your partner to create your shared chat.</Text>
      <AppButton title="Connect with Partner" onPress={handlePress} style={{width: '80%'}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: ColorTheme.white },
  title: { fontSize: 24, fontFamily: 'Inter_700Bold', color: ColorTheme.indigo, marginTop: 20 },
  subtitle: { fontSize: 16, fontFamily: 'Inter_400Regular', color: ColorTheme.mediumText, marginTop: 4, marginBottom: 20, textAlign: 'center' },
  info: { fontSize: 14, fontFamily: 'Inter_400Regular', color: ColorTheme.lightText, textAlign: 'center', marginBottom: 30 },
});
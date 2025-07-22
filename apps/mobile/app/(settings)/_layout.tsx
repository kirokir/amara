import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { ColorTheme } from '../../constants/ColorTheme';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: ColorTheme.white },
        headerTitleStyle: { fontFamily: 'Inter_600SemiBold', color: ColorTheme.indigo },
        headerTintColor: ColorTheme.indigo,
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
            <Ionicons name="arrow-back" size={24} color={ColorTheme.indigo} />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Settings',
          headerLeft: () => ( // No back button on the main settings page
            <TouchableOpacity onPress={() => router.replace('/(tabs)/couple_chat')} style={{ marginLeft: 10 }}>
              <Ionicons name="close" size={24} color={ColorTheme.indigo} />
            </TouchableOpacity>
          ),
        }} 
      />
      <Stack.Screen name="partner" options={{ title: 'Partner Connection' }} />
      <Stack.Screen name="profile" options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="account" options={{ title: 'Account Management' }} />
    </Stack>
  );
}
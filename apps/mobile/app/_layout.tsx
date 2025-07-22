// File: apps/mobile/app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ColorTheme } from '../../constants/ColorTheme';
import { TouchableOpacity } from 'react-native';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ColorTheme.violet,
        tabBarInactiveTintColor: ColorTheme.mediumText,
        tabBarStyle: { backgroundColor: ColorTheme.white },
        headerStyle: { backgroundColor: ColorTheme.white },
        headerTitleStyle: { fontFamily: 'Inter_600SemiBold', color: ColorTheme.indigo },
        headerShadowVisible: false,
        headerRight: () => (
          <TouchableOpacity onPress={() => router.push('/(settings)/partner')} style={{ marginRight: 15 }}>
            <Ionicons name="settings-outline" size={24} color={ColorTheme.indigo} />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="couple_chat"
        options={{
          title: 'Couple Chat',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="amara_chat"
        options={{
          title: 'Amara AI',
          tabBarIcon: ({ color, size }) => <Ionicons name="sparkles-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: 'Tools',
          tabBarIcon: ({ color, size }) => <Ionicons name="construct-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
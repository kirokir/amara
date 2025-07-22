import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useAuth } from '../hooks/useAuth';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return; // Don't do anything until the auth state is loaded
    }

    const inTabsGroup = segments[0] === '(tabs)';

    // If the user is signed in and not in the main app group, redirect them there
    if (isAuthenticated && !inTabsGroup) {
      router.replace('/(tabs)/couple_chat');
    } 
    // If the user is not signed in, send them to the login screen
    else if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isLoading, segments]);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null; // Render nothing while the auth state is loading, splash screen is up
  }

  // This is the critical part: The Stack navigator MUST declare the screen 
  // groups it manages. Without these, Expo Router doesn't know they exist.
  return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="index" options={{ headerShown: false }} /> 
      </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  if (!fontsLoaded || fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootLayoutNav />
      <Toast />
    </GestureHandlerRootView>
  );
}

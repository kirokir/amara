// File: apps/mobile/app/(auth)/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';

// This navigator groups all the authentication screens.
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
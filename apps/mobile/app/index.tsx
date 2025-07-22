// File: apps/mobile/app/index.tsx
import { Redirect } from 'expo-router';

// The sole purpose of this file is to redirect the user.
// The logic in _layout.tsx will then decide where they should land.
export default function StartPage() {
  return <Redirect href="/(tabs)/couple_chat" />;
}
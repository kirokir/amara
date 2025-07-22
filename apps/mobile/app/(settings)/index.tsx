import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ColorTheme } from '../../constants/ColorTheme';
import { useAuth } from '../../hooks/useAuth';

const SettingsItem = ({ icon, title, subtitle, onPress }: { icon: any; title: string; subtitle: string; onPress: () => void; }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <Ionicons name={icon} size={28} color={ColorTheme.violet} style={styles.icon} />
    <View style={styles.textContainer}>
      <Text style={styles.itemTitle}>{title}</Text>
      <Text style={styles.itemSubtitle}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward-outline" size={22} color={ColorTheme.mediumText} />
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const router = useRouter();
  const { profile } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your profile, partner, and account</Text>
      </View>

      <SettingsItem
        icon="person-circle-outline"
        title="Profile"
        subtitle={`Edit your username (${profile?.username || ''}) and avatar`}
        onPress={() => router.push('/(settings)/profile')}
      />
      <SettingsItem
        icon="people-outline"
        title="Partner Connection"
        subtitle="Invite or connect with your partner"
        onPress={() => router.push('/(settings)/partner')}
      />
      <SettingsItem
        icon="key-outline"
        title="Account"
        subtitle="Log out or delete your account"
        onPress={() => router.push('/(settings)/account')}
      />
      
      {/* Add more settings items here in the future, e.g., Notifications, Privacy Policy */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorTheme.offGray,
  },
  header: {
    backgroundColor: ColorTheme.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: ColorTheme.indigo,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: ColorTheme.mediumText,
    marginTop: 4,
  },
  itemContainer: {
    backgroundColor: ColorTheme.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: ColorTheme.offGray,
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    color: ColorTheme.lightText,
  },
  itemSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: ColorTheme.mediumText,
    marginTop: 2,
  },
});
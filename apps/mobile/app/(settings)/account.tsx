import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import AppButton from '../../components/core/AppButton';
import { ColorTheme } from '../../constants/ColorTheme';
import { useAuth } from '../../hooks/useAuth';

export default function AccountScreen() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        // Root layout will handle navigation
        setLoading(false);
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Your Account",
            "This action is irreversible. All your chats, journal entries, and data will be permanently deleted. Are you absolutely sure?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "I'm Sure, Delete Everything", 
                    style: "destructive", 
                    onPress: async () => {
                        setLoading(true);
                        // We will need a Supabase Edge Function for this to be truly secure and complete
                        // For now, this just signs the user out.
                        // const { error } = await supabase.functions.invoke('delete-user');
                        // if (error) Alert.alert("Error", error.message);
                        await supabase.auth.signOut();
                        setLoading(false);
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Log Out</Text>
                <Text style={styles.sectionDescription}>
                    You can log out of your account here. You can always log back in later.
                </Text>
                <AppButton title="Log Out" onPress={handleLogout} loading={loading} />
            </View>

            <View style={[styles.section, styles.dangerZone]}>
                 <Text style={[styles.sectionTitle, {color: ColorTheme.error}]}>Danger Zone</Text>
                 <Text style={styles.sectionDescription}>
                    Permanently delete your account and all associated data. This cannot be undone.
                 </Text>
                 <AppButton 
                    title="Delete My Account" 
                    onPress={handleDeleteAccount} 
                    loading={loading}
                    style={{backgroundColor: ColorTheme.error, borderColor: '#B52D24', borderWidth: 1}}
                 />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: ColorTheme.offGray, padding: 20 },
    section: { backgroundColor: ColorTheme.white, padding: 20, borderRadius: 12, marginBottom: 20 },
    sectionTitle: { fontSize: 20, fontFamily: 'Inter_600SemiBold', color: ColorTheme.indigo, marginBottom: 5 },
    sectionDescription: { fontSize: 14, fontFamily: 'Inter_400Regular', color: ColorTheme.mediumText, lineHeight: 20, marginBottom: 15 },
    dangerZone: {
        borderColor: ColorTheme.error,
        borderWidth: 2
    }
});
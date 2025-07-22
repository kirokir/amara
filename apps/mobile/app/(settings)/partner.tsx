import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import AppButton from '../../components/core/AppButton';
import { ColorTheme } from '../../constants/ColorTheme';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

export default function PartnerConnectionScreen() {
  const [invitationCode, setInvitationCode] = useState('');
  const [myCode, setMyCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerateCode = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('create_invitation_code');
    if (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.message });
    } else {
      setMyCode(data);
    }
    setLoading(false);
  };

  const handleAcceptCode = async () => {
    if (invitationCode.length !== 6) {
        Toast.show({ type: 'error', text1: 'Invalid Code', text2: 'Code must be 6 characters long.' });
        return;
    }
    setLoading(true);
    const { error } = await supabase.rpc('accept_invitation', {
      invitation_code: invitationCode.toUpperCase(),
    });
    
    if (error) {
      Toast.show({ type: 'error', text1: 'Connection Failed', text2: error.message });
    } else {
      Toast.show({ type: 'success', text1: 'Success!', text2: 'You are now connected with your partner.' });
      // On success, navigate back to the main chat screen which will now show the partner chat
      router.replace('/(tabs)/couple_chat');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Section to Accept an Invitation */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Connect with Partner</Text>
        <Text style={styles.cardSubtitle}>Enter the 6-character code your partner gave you.</Text>
        <TextInput
          style={styles.codeInput}
          placeholder="ABCDEF"
          value={invitationCode}
          onChangeText={setInvitationCode}
          maxLength={6}
          autoCapitalize="characters"
        />
        <AppButton title="Connect" onPress={handleAcceptCode} loading={loading && !!invitationCode} />
      </View>

      <Text style={styles.orText}>- OR -</Text>

      {/* Section to Generate and Share an Invitation */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Invite Your Partner</Text>
        {myCode ? (
            <View style={styles.myCodeContainer}>
                <Text style={styles.myCodeLabel}>Share this code with your partner:</Text>
                <Text style={styles.myCodeText}>{myCode}</Text>
                <Text style={styles.myCodeExpiry}>This code expires in 24 hours.</Text>
            </View>
        ) : (
            <>
                <Text style={styles.cardSubtitle}>Generate a code to share with your partner.</Text>
                <AppButton title="Generate My Code" variant="secondary" onPress={handleGenerateCode} loading={loading && !invitationCode} />
            </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: ColorTheme.offGray, padding: 20, justifyContent: 'center' },
    card: { backgroundColor: ColorTheme.white, borderRadius: 12, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
    cardTitle: { fontSize: 20, fontFamily: 'Inter_600SemiBold', color: ColorTheme.indigo, marginBottom: 5 },
    cardSubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', color: ColorTheme.mediumText, marginBottom: 15 },
    codeInput: { height: 55, backgroundColor: ColorTheme.offGray, borderRadius: 8, paddingHorizontal: 15, fontSize: 24, fontFamily: 'Inter_700Bold', textAlign: 'center', letterSpacing: 8, color: ColorTheme.indigo, marginBottom: 10 },
    orText: { textAlign: 'center', fontFamily: 'Inter_600SemiBold', color: ColorTheme.mediumText, fontSize: 16, marginVertical: 10 },
    myCodeContainer: { alignItems: 'center', paddingVertical: 10 },
    myCodeLabel: { fontSize: 14, fontFamily: 'Inter_400Regular', color: ColorTheme.mediumText },
    myCodeText: { fontSize: 40, fontFamily: 'Inter_700Bold', color: ColorTheme.violet, letterSpacing: 5, marginVertical: 10 },
    myCodeExpiry: { fontSize: 12, color: ColorTheme.mediumText },
});
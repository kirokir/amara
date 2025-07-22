import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useStore } from '../../lib/store';
import AppTextInput from '../../components/core/AppTextInput';
import AppButton from '../../components/core/AppButton';
import { ColorTheme } from '../../constants/ColorTheme';
import Toast from 'react-native-toast-message';
import { decode } from 'base64-arraybuffer';

export default function ProfileScreen() {
  const { user, profile } = useAuth();
  const fetchProfile = useStore((state) => state.fetchProfile);
  const [username, setUsername] = useState(profile?.username || '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // Explicitly type the state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || ''); // Handle case where username could be null
      
      // --- THIS IS THE CORRECTED LOGIC ---
      if (profile.avatar_url) {
        // Only get the public URL if avatar_url is not null/undefined
        const { data } = supabase.storage.from('avatars').getPublicUrl(profile.avatar_url);
        setAvatarUrl(data.publicUrl);
      } else {
        // Ensure avatarUrl is null if there's no profile avatar
        setAvatarUrl(null);
      }
      // --- END OF CORRECTION ---
    }
  }, [profile]);

  const handlePickImage = async () => {
    // Request permission first
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission required", "You need to allow access to your photos to upload an avatar.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64 && user) {
      setLoading(true);
      const asset = result.assets[0];
      const fileExt = asset.uri.split('.').pop()?.toLowerCase() ?? 'jpg';
      const filePath = `${user.id}/${new Date().getTime()}.${fileExt}`;
      
      try {
        const { error } = await supabase.storage
          .from('avatars')
          .upload(filePath, decode(asset.base64), {
            contentType: `image/${fileExt}`,
            upsert: true, // Overwrite existing file if any, useful for re-uploading
          });
          
        if (error) throw error;
        
        const { error: updateError } = await supabase.from('profiles').update({ avatar_url: filePath }).eq('id', user.id);
        if (updateError) throw updateError;
        
        await fetchProfile();
        Toast.show({ type: 'success', text1: 'Avatar updated!' });
      } catch (error: any) {
        Toast.show({ type: 'error', text1: 'Upload Failed', text2: error.message });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateProfile = async () => {
    if (!username.trim() || !user) {
        Toast.show({ type: 'error', text1: 'Username cannot be empty.' });
        return;
    }
    setLoading(true);
    try {
        const { error } = await supabase.from('profiles').update({ username: username.trim() }).eq('id', user.id);
        if (error) throw error;
        await fetchProfile();
        Toast.show({ type: 'success', text1: 'Profile updated successfully!' });
    } catch (error: any) {
        Toast.show({ type: 'error', text1: 'Update Failed', text2: error.message });
    } finally {
        setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image 
          source={avatarUrl ? { uri: avatarUrl } : require('../../assets/images/amara-logo.png')} 
          style={styles.avatar} 
        />
        <TouchableOpacity onPress={handlePickImage} disabled={loading}>
          <Text style={styles.changeAvatarText}>Change Avatar</Text>
        </TouchableOpacity>
      </View>

      <AppTextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <AppButton title="Save Profile" onPress={handleUpdateProfile} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: ColorTheme.offGray, padding: 20 },
    avatarContainer: { alignItems: 'center', marginVertical: 20 },
    avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: ColorTheme.offGray, borderWidth: 2, borderColor: ColorTheme.violet },
    changeAvatarText: { color: ColorTheme.violet, fontFamily: 'Inter_600SemiBold', marginTop: 10, fontSize: 16 }
});